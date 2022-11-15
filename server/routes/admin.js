import bcrypt from 'bcrypt'

async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])

  //GET-ALL====================================================================
  fastify.get('/admin', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
        SELECT a.id, a.name, a.email, r.name as role_name, role_id
        FROM "Admin" a
        LEFT JOIN "Role" r
        ON a.role_id = r.id
        WHERE a.deleted_at IS NULL
        `
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/admin/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
        SELECT a.id, a.name, a.email, r.name as role_name, role_id
        FROM "Admin" a
        LEFT JOIN "Role" r
        ON a.role_id = r.id
        WHERE a.id=$1
        `, [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //GET-Tabledata====================================================================
  fastify.get('/admin/tabledata', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { q, pageLimit, page, filters, sort, sortDirection } = request.query;
    const [nameFilter, emailFilter, passwordFilter] = filters || [];
    const offset = page * pageLimit;

    try {
      const { rows } = await client.query(
        `
        with tabledata as (
          SELECT * 
            FROM "Admin"
            where name ILIKE '%' || $1 || '%' AND
              email ILIKE '%' || $2 || '%' AND
              password ILIKE '%' || $3 || '%' AND
              deleted_at IS NULL
            ORDER by case WHEN UPPER($5) = 'ASC' then  
              CASE 
                WHEN $4 = 'name' THEN name
                WHEN $4 = 'email' THEN email
                WHEN $4 = 'password' THEN password
                else name
              end
            end asc,
            case WHEN UPPER($5) = 'DESC' then
              CASE 
                WHEN $4 = 'name' THEN name
                WHEN $4 = 'email' THEN email
                WHEN $4 = 'password' THEN password
                else name
              end
            end desc
            LIMIT $6
            OFFSET $7
        ), tablecount as (
          SELECT COUNT(*) 
            FROM "Admin"
            where name ILIKE '%' || $1 || '%' AND
              email ILIKE '%' || $2 || '%' AND
              password ILIKE '%' || $3 || '%' AND
              deleted_at IS NULL
        )
        select coalesce(jsonb_agg(tabledata), '[]') as rows, (select * from tablecount)
        from tabledata
        `,
        [
          nameFilter || '',
          emailFilter || '',
          passwordFilter || '',
          sort || 'name',
          sortDirection || 'ASC' ,
          pageLimit || 10,
          offset || 0,
        ]
      )

      return rows[0] || {}
    } finally {
      client.release()
    }
  })
  //CREATE====================================================================
  fastify.post('/admin', async (request, reply) => {
    if(request.body['password'] && request.body['password'].length < 8) {
      throw new Error('password need to be at least 8 characters')
    }
    const password = bcrypt.hashSync(request.body['password'], Number(process.env.SALT_ROUNDS));

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          INSERT INTO "Admin"(
            name, email, password, role_id
          )
          VALUES($1, $2, $3, $4)
          RETURNING name, email, password;
        `, [
          request.body['name'],
          request.body['email'],
          password,
          request.body['role_id'],
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

  //UPDATE=================================================================
  fastify.put('/admin/:id', async (request, reply) => {
    if(request.body['password'] && request.body['password'].length < 8) {
      throw new Error('password need to be at least 8 characters')
    }
    const password = request.body['password'] == '' || !request.body['password'] 
      ? null 
      : bcrypt.hashSync(request.body['password'], Number(process.env.SALT_ROUNDS));

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          UPDATE "Admin" 
          SET
            name=COALESCE($2, name),
            email=COALESCE($3, email),
            password=COALESCE($4, password),
            role_id=COALESCE($5, role_id)
          WHERE id=$1
          AND deleted_at IS NULL
          RETURNING name, email, password;
        `, [
          request.params['id'],
          request.body['name'],
          request.body['email'],
          password,
          request.body['role_id'],
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

  //DELETE===================================================================
  fastify.delete('/admin/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          UPDATE "Admin"
          SET deleted_at = now()
          WHERE id=$1
          RETURNING name, email, password;
        `, [request.params.id]
      )

      return {
        status: 'success',
        data: rows[0]
      }
    } finally {
      client.release()
    }
  })
}

export default routes