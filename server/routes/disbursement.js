async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])
  
  //GET-ALL====================================================================
  fastify.get('/disbursement', async (request, reply) => {
    const client = await fastify.pg.connect()

    try {
      const { rows } = await client.query(
        `
        select 
          d.*,
          m.id as merchant_id, m.name as merchant_name,
          b.id as account_id, b.account_number as account_number 
        from "Disbursement" d
        JOIN "Merchant" m
          ON d.merchant_id = m.id
        JOIN "BankAccount" b
          ON d.bank_account_id = b.id
        WHERE d.deleted_at IS NULL
        `
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/disbursement/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
        select 
          d.*,
          m.id as merchant_id, m.name as merchant_name,
          b.id as account_id, b.account_number as account_number 
        from "Disbursement" d
        JOIN "Merchant" m
          ON d.merchant_id = m.id
        JOIN "BankAccount" b
          ON d.bank_account_id = b.id
        WHERE d.id = $1
        `, [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })

  //GET-Tabledata====================================================================
  fastify.get('/disbursement/tabledata', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { q, pageLimit, page, filters, sort, sortDirection } = request.query;
    const offset = page * pageLimit;

    try {
      const { rows } = await client.query(
        `
        with row_view as (
          select 
               d.*,
               m.id as merchant_id, m.name as merchant_name,
               b.id as account_id, b.account_number as account_number 
             from "Disbursement" d
             JOIN "Merchant" m
               ON d.merchant_id = m.id
             JOIN "BankAccount" b
               ON d.bank_account_id = b.id
             WHERE d.deleted_at IS NULL
         ), filtered_view as (
           select *
           from row_view
           where status::text ILIKE '%' || $5 || '%'
           AND amount::TEXT ILIKE '%' || $6 || '%'
           AND notes ILIKE '%' || $7 || '%'
           AND merchant_name ILIKE '%' || $8 || '%'
           AND account_number ILIKE '%' || $9 || '%'
         ), tabledata as (
           SELECT * 
             FROM filtered_view
             ORDER by case WHEN UPPER($2) = 'ASC' then  
               CASE 
                 WHEN $1 = 'status' THEN "status"::text
                 WHEN $1 = 'amount' THEN amount::text
                 WHEN $1 = 'notes' THEN "notes"
                 WHEN $1 = 'merchant_name' THEN "merchant_name"
                 WHEN $1 = 'account_number' THEN "account_number"
                 else "merchant_name"
               end
             end asc,
             case WHEN UPPER($2) = 'DESC' then
               CASE 
                 WHEN $1 = 'status' THEN "status"::text
                 WHEN $1 = 'amount' THEN amount::text
                 WHEN $1 = 'notes' THEN "notes"
                 WHEN $1 = 'merchant_name' THEN "merchant_name"
                 WHEN $1 = 'account_number' THEN "account_number"
                 else "merchant_name"
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
          filters[4] || '',
        ]
      )

      return rows[0] || {}
    } finally {
      client.release()
    }
  })

  //CREATE====================================================================
  fastify.post('/disbursement', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          INSERT INTO "Disbursement"(
            status, amount, notes, merchant_id, bank_account_id
          )
          VALUES($1, $2, $3, $4, $5)
          RETURNING *;
        `, [
          request.body['status'],
          request.body['amount'],
          request.body['notes'],
          request.body['merchant_id'],
          request.body['bank_account_id'],
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
  fastify.put('/disbursement/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          UPDATE "Disbursement" 
          SET
            status=COALESCE($2, status),
            amount=COALESCE($3, amount),
            notes=COALESCE($4, notes),
            merchant_id=COALESCE($5, merchant_id),
            bank_account_id=COALESCE($6, bank_account_id),
          WHERE id=$1
          RETURNING *;
        `, [
          request.params['id'],
          request.body['status'],
          request.body['amount'],
          request.body['notes'],
          request.body['merchant_id'],
          request.body['bank_account_id'],
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
  fastify.delete('/disbursement/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          UPDATE "Disbursement"
          SET deleted_at = now()
          WHERE id=$1
          RETURNING *;
        `, [request.params.id]
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