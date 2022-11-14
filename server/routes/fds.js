async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])
  
  //GET-ALL====================================================================
  fastify.get('/fds', async (request, reply) => {
    const client = await fastify.pg.connect()

    try {
      const { rows } = await client.query(
        `
        SELECT 
          TRUNC(max_daily) as max_daily,
          TRUNC(max_monthly) as max_monthly,
          TRUNC(velocity_direct_debit_seconds) as velocity_direct_debit_seconds
        FROM "FDSLimitControl"
        WHERE id = 1
        `
      )

      return rows[0] || {} || {}
    } finally {
      client.release()
    }
  })
  //UPDATE=================================================================
  fastify.put('/fds', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          INSERT INTO "FDSLimitControl" (id, max_daily, max_monthly, velocity_direct_debit_seconds)
          VALUES(1, $1, $2, $3) 
          ON CONFLICT (id) 
          DO 
          UPDATE
          SET
            max_daily=$1,
            max_monthly=$2,
            velocity_direct_debit_seconds=$3
          RETURNING *
        `, [
          request.body['max_daily'],
          request.body['max_monthly'],
          request.body['velocity_direct_debit_seconds'],
        ]
      )

      return {
        status: 'success',
        data: value.rows[0]
      }
    } finally {
      client.release()
    }
  })
  //GET-Tabledata-CardTracking===============================================
  fastify.get('/fds-card/tabledata', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { q, pageLimit, page, filters, sort, sortDirection } = request.query;
    const offset = page * pageLimit;

    try {
      const { rows } = await client.query(
        `
        with row_view as (
          select 
          	id,
          	card_number,
          	blacklist,
          	number_of_transaction,
          	last_transaction_time
      	  from "FDSCardTracking"
         ), filtered_view as (
           select *
           from row_view
           where card_number::text ILIKE '%' || $5 || '%'
           AND blacklist::TEXT ILIKE '%' || $6 || '%'
           AND number_of_transaction::TEXT ILIKE '%' || $7 || '%'
           AND last_transaction_time::TEXT ILIKE '%' || $8 || '%'
         ), tabledata as (
           SELECT * 
             FROM filtered_view
             ORDER by case WHEN UPPER($2) = 'ASC' then  
               CASE 
                 WHEN $1 = 'card_number' THEN "card_number"::text
                 WHEN $1 = 'blacklist' THEN blacklist::text
                 WHEN $1 = 'number_of_transaction' THEN "number_of_transaction"::TEXT
                 WHEN $1 = 'last_transaction_time' THEN "last_transaction_time"::TEXT
                 else "card_number"
               end
             end asc,
             case WHEN UPPER($2) = 'DESC' then
               CASE 
                 WHEN $1 = 'card_number' THEN "card_number"::text
                 WHEN $1 = 'blacklist' THEN blacklist::text
                 WHEN $1 = 'number_of_transaction' THEN "number_of_transaction"::TEXT
                 WHEN $1 = 'last_transaction_time' THEN "last_transaction_time"::TEXT
                 else "card_number"
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
          sortDirection || 'ASC' ,
          pageLimit || 10,
          offset || 0,
          filters[0] || '',
          filters[1] || '',
          filters[2] || '',
          filters[3] || '',
        ]
      )

      return rows[0] || {}
    } finally {
      client.release()
    }
  })

  //UPDATE-Blacklist===================================================
  fastify.put('/fds-card/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          UPDATE "FDSCardTracking" 
          SET
            blacklist=COALESCE($2, blacklist)
          WHERE id=$1
          RETURNING *;
        `, [
          request.params['id'],
          request.body['blacklist'],
        ]
      )

      return {
        status: 'success',
        data: value.rows[0]
      }
    } finally {
      client.release()
    }
  })
}

export default routes