import bcrypt from 'bcrypt'

async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])
  
  //GET-ALL====================================================================
  fastify.get('/merchant', async (request, reply) => {
    const client = await fastify.pg.connect()

    try {
      const { rows } = await client.query(
        `
        select * 
        from "Merchant" m
        where case 
          when UPPER($1) = 'SANDBOX' then "type" = 'SANDBOX'
          when UPPER($1) = 'PRODUCTION' then "type" = 'PRODUCTION'
          else TRUE
        end
        AND deleted_at IS NULL
        `, [request.params['type']]
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-AUTOCOMPLETE============================================================
  fastify.get('/merchant/autocomplete', async (request, reply) => {
    const client = await fastify.pg.connect()

    try {
      const {rows} = await client.query(
        `
        select *, m.name as "label"
        from "Merchant" m
        where name ILIKE '%' || $1::TEXT || '%'
        AND deleted_at IS NULL
        LIMIT 10
        `, [request.query['q']]
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/merchant/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
        select 
          name,
          m."type",
          verified,
          logo,
          email,
          md.id as detail_id,
          md.akta_pendirian,
          md.nib_perusahaan,
          md.identitas_pribadi_komisaris_direksi,
          md.identitas_pribadi_pemegang_saham,
          md.bagan_kepemilikan_saham,
          md.akta_perubahan,
          md.npwp_pemegang_saham,
          md.surat_kuasa,
          md.website,
          md.pic_phone_number,
          company_type.label as entity_detail,
          line_of_business.label as business_line,
          number_of_employee.label as number_of_employee,
          transaction_size."label"  as transaction_size_monthly,
          pic_role."label" as pic_role,
          md.merchant_detail_type
        from "Merchant" m
        left join "MerchantDetail" md ON m.id = md.merchant_id
        left join "GeneralConstant" company_type on md.entity_detail_id = company_type.id
        left join "GeneralConstant" line_of_business on md.business_line_id  = line_of_business.id 
        left join "GeneralConstant" number_of_employee on md.number_of_employees_id  = number_of_employee.id 
        left join "GeneralConstant" transaction_size on md.transaction_size_monthly_id  = transaction_size.id 
        left join "GeneralConstant" pic_role on md.pic_role_id  = pic_role.id 
        where case 
          when UPPER($2) = 'SANDBOX' then m."type" = 'SANDBOX'
          when UPPER($2) = 'PRODUCTION' then m."type" = 'PRODUCTION'
          else TRUE
        end
        AND m.id = $1
        `, [request.params.id, request.params['type']]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //GET-Tabledata====================================================================
  fastify.get('/merchant/tabledata', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { q, pageLimit, page, filters, sort, sortDirection } = request.query;
    const offset = page * pageLimit;

    try {
      const { rows } = await client.query(
        `
        with filtered_view as (
          select *
          from "Merchant" m
          where name ILIKE '%' || $5 || '%'
          AND
            case 
            when UPPER($6) = 'SANDBOX' then "type" = ('SANDBOX')::"Merchant_type_enum"
            when UPPER($6) = 'PRODUCTION' then "type" = ('PRODUCTION')::"Merchant_type_enum"
            else TRUE
          end
          AND (verified = $7 or $7 is NULL) 
          AND logo ILIKE '%' || $8 || '%'
          AND email ILIKE '%' || $9 || '%'
          AND client_key ILIKE '%' || $10 || '%'
          AND secret_key ILIKE '%' || $11 || '%'
          AND deleted_at IS NULL
        ), tabledata as (
          SELECT * 
            FROM filtered_view
            ORDER by case WHEN UPPER($2) = 'ASC' then  
              CASE 
                WHEN $1 = 'name' THEN "name"
                WHEN $1 = 'verified' THEN verified::text
                WHEN $1 = 'type' THEN "type"::text 
                WHEN $1 = 'email' THEN "email"::text 
                WHEN $1 = 'logo' THEN "logo"
                WHEN $1 = 'client_key' THEN "client_key"
                WHEN $1 = 'secret_key' THEN "secret_key"
                else name
              end
            end asc,
            case WHEN UPPER($2) = 'DESC' then
              CASE 
                WHEN $1 = 'name' THEN name
                WHEN $1 = 'verified' THEN verified::text 
                WHEN $1 = 'type' THEN "type"::text 
                WHEN $1 = 'email' THEN "email"::text 
                WHEN $1 = 'logo' THEN logo
                WHEN $1 = 'client_key' THEN client_key
                WHEN $1 = 'secret_key' THEN secret_key
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
          filters[0] || '',
          filters[1] || '',
          filters[2] || null,
          filters[3] || '',
          filters[4] || '',
          filters[5] || '',
          filters[6] || '',
        ]
      )

      return rows[0] || {}
    } finally {
      client.release()
    }
  })

  //CREATE====================================================================
  fastify.post('/merchant', async (request, reply) => {
    const password = bcrypt.hashSync(request.body['password'], Number(process.env.SALT_ROUNDS));
    const client = await fastify.pg.connect();

    try {
      const value = await client.query(
        `
        INSERT INTO "Merchant"(
          type, verified, name, logo, client_key, secret_key,
          email, password
        )
        VALUES(
          $1, $2, $3, $4, 'CK'||md5(random()::TEXT), 'SK'||md5(random()::TEXT),
          $5, $6
        )
        RETURNING *;
        `, [
          request.body['type'],
          request.body['verified'],
          request.body['name'],
          request.body['logo'],
          request.body['email'],
          password,
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
  fastify.put('/merchant/:id', async (request, reply) => {
    const password = request.body['password'] == '' || !request.body['password'] 
      ? null 
      : bcrypt.hashSync(request.body['password'], Number(process.env.SALT_ROUNDS));
    const client = await fastify.pg.connect()

    try {
      const value = await client.query(
        `
          UPDATE "Merchant" 
          SET
            type=COALESCE($2, type),
            verified=COALESCE($3, verified),
            name=COALESCE($4, name),
            logo=COALESCE($5, logo),
            email=COALESCE($6, email),
            password=COALESCE($7, password)
          WHERE id=$1
          RETURNING *;
        `, [
          request.params['id'],
          request.body['type'],
          request.body['verified'],
          request.body['name'],
          request.body['logo'],
          request.body['email'],
          password,
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
  fastify.delete('/merchant/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          UPDATE "Merchant"
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