async function plugin(fastify, options, done) {
  //Prehandler====================================================================
  fastify.decorate('log-admin-activity', async (request, reply) => {
    if(request.method !== 'GET') {
      const token = request.cookies.jwt
      const verified = fastify.jwt.verify(token);
      request.user = verified;

      const log = {
        ip: request?.ip,
        method: request?.method,
        url: request?.url,
        hostname: request?.hostname,
        params: request?.params,
        body: request?.body,
        "user-agent": request?.headers['user-agent'],
        user: {
          name: verified?.name,
          id: verified?.id,
        },
      };

      const client = await fastify.pg.connect()
  
      try {
        const { rows } = await client.query(
          `
          insert into "AdminLog"(log, admin_id)
          VALUES($1, $2)
          `,
          [
            JSON.stringify(log),
            verified?.id
          ]
        )
  
        return rows
      } finally {
        client.release()
      }
    }

    done()
  })

  //GET-Tabledata====================================================================
  fastify.get('/admin-log/tabledata', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { q, pageLimit, page, filters, sort, sortDirection } = request.query;
    const offset = page * pageLimit;

    const token = request.cookies.jwt
    const verified = fastify.jwt.verify(token);
    const user = verified;

    try {
      const { rows } = await client.query(
        `
        with row_view as (
          select id, log, created_at, admin_id
          FROM "AdminLog"
          WHERE admin_id = $7
         ), filtered_view as (
           select *
           from row_view
           where log::text ILIKE '%' || $5 || '%'
           AND created_at::TEXT ILIKE '%' || $6 || '%'
         ), tabledata as (
           SELECT * 
             FROM filtered_view
             ORDER by case WHEN UPPER($2) = 'ASC' then  
               CASE 
                 WHEN $1 = 'log' THEN "log"::text
                 WHEN $1 = 'created_at' THEN created_at::text
                 else "created_at"::text
               end
             end asc,
             case WHEN UPPER($2) = 'DESC' then
               CASE 
                WHEN $1 = 'log' THEN "log"::text
                WHEN $1 = 'created_at' THEN created_at::text
                else "created_at"::text
               end
             end desc
             LIMIT $3
             OFFSET $4
         ), tablecount as (
           SELECT COUNT(*)
             FROM filtered_view
         )
         select coalesce(jsonb_agg(tabledata), '[]') as rows, (select * from tablecount)
         from tabledata
        `,
        [
          sort || 'name',
          sortDirection || 'DESC' ,
          pageLimit || 10,
          offset || 0,
          filters[0] || '',
          filters[1] || '',
          user?.id
        ]
      )

      return rows[0] || {}
    } finally {
      client.release()
    }
  })
}

plugin[Symbol.for('skip-override')] = true
export default plugin