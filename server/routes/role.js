async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])
  
  //GET-ALL====================================================================
  fastify.get('/role', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          SELECT r.id, r.name, jsonb_agg(p.id) as permission_ids, jsonb_agg(p.label) as permissions
          FROM "Role" r
          FULL JOIN "RolePermission" rp
          ON r.id = rp.role_id
          FULL JOIN "Permission" p
          ON p.id = rp.permission_id
          WHERE r.deleted_at IS NULL
          group by r.id
        `
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from token==========================================================
  fastify.get('/role/self', async (request, reply) => {
    const client = await fastify.pg.connect()
    
    const token = request.cookies.jwt
    const verified = fastify.jwt.verify(token);
    const user = verified;

    try {
      const { rows } = await client.query(
        `
          SELECT r.id, r.name, jsonb_agg(p.id) as permission_ids, jsonb_agg(p.label) as permissions
          FROM "Role" r
          FULL JOIN "RolePermission" rp
          ON r.id = rp.role_id
          FULL JOIN "Permission" p
          ON p.id = rp.permission_id
          WHERE r.id=$1
          AND r.deleted_at IS NULL
          Group by r.id
        `, [user.role_id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })


  //GET-ONE from id============================================================
  fastify.get('/role/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          SELECT r.id, r.name, jsonb_agg(p.id) as permission_ids, jsonb_agg(p.label) as permissions
          FROM "Role" r
          FULL JOIN "RolePermission" rp
          ON r.id = rp.role_id
          FULL JOIN "Permission" p
          ON p.id = rp.permission_id
          WHERE r.id=$1
          Group by r.id 
        `, [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //GET-Tabledata====================================================================
  fastify.get('/role/tabledata', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { q, pageLimit, page, filters, sort, sortDirection } = request.query;
    const [nameFilter, permissionFilter] = filters || [];
    const offset = page * pageLimit;

    try {
      const { rows } = await client.query(
        `
        with role_view as (
          SELECT r.id, r.name, jsonb_agg(p.id) as permission_ids , jsonb_agg(p.label) as permissions
          FROM "Role" r
          FULL JOIN "RolePermission" rp
          ON r.id = rp.role_id
          FULL JOIN "Permission" p
          ON p.id = rp.permission_id
          WHERE r.deleted_at IS NULL
          Group by r.id         
        ),
        filtered_view as (
          select *
          from role_view
          where name ILIKE '%' || $5 || '%'
          and permissions::text ILIKE '%' || $6 || '%'
        ),
        tabledata as (
          SELECT * 
            FROM filtered_view
            ORDER by case WHEN UPPER($2) = 'ASC' then  
              CASE 
                WHEN $1 = 'name' THEN name
                else name
              end
            end asc,
            case WHEN UPPER($2) = 'DESC' then
              CASE 
                WHEN $1 = 'name' THEN name
                else name
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
          nameFilter || '',
          permissionFilter || '',
        ]
      )

      return rows[0] || {}
    } finally {
      client.release()
    }
  })

  //CREATE====================================================================
  fastify.post('/role', async (request, reply) => {
    const permissions = JSON.parse(request.body['permissions'])

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
        with new_role as (
          insert into "Role"(name)
          values ($1)
          returning id, name
        )
        insert into "RolePermission"(role_id, permission_id)
        select r.id as role_id, p.id as permission_id
        from new_role r
        cross join (
          select unnest($2::NUMERIC[]) as id
        ) p
        RETURNING *
        `, [
          request.body['name'],
          permissions,
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
  fastify.put('/role/:id', async (request, reply) => {
    const permissions = JSON.parse(request.body['permissions'])

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
        with all_permission as (
          SELECT r.id, r.name, (p.id) permission_id , (p.label) permission_label
          FROM "Role" r
          FULL JOIN "RolePermission" rp
          ON r.id = rp.role_id
          FULL JOIN "Permission" p
          ON p.id = rp.permission_id
          WHERE r.id=$1
        ), deleted_permission as (
          delete from "RolePermission"
          where role_id = $1
          and permission_id not in (select id from unnest($2::NUMERIC[]) id )
          returning role_id, permission_id
        ), new_permission as (
          insert into "RolePermission"(role_id, permission_id)
          select $1, new_id
          from UNNEST($2::NUMERIC[]) new_id
          where new_id not in (select permission_id from all_permission)
          returning role_id, permission_id
        ), updated_role as (
          UPDATE "Role" 
          SET
            name=COALESCE($3, name)
          WHERE id=$1
          returning id, name
        ), updated_permission as (
          select ap.permission_id
          from all_permission ap
          except 
          SELECT dp.permission_id
          from deleted_permission dp
          union
          SELECT np.permission_id
          from new_permission np
        )
        select ur.id, ur.name, jsonb_agg(permission_id), jsonb_agg(p.label)
        from updated_role ur
        join updated_permission
        on true
        join "Permission" p
        on permission_id = p.id
        group by ur.id, ur.name
        `, [
          request.params['id'],
          permissions,
          request.body['name'],
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
  fastify.delete('/role/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          UPDATE "Role"
          SET deleted_at = now()
          WHERE id=$1
          RETURNING *;
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