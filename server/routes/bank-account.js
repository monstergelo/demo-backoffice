async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])
  
  //GET-ALL====================================================================
  fastify.get('/bank-account', async (request, reply) => {
    const client = await fastify.pg.connect()

    try {
      const { rows } = await client.query(
        `
        select *,
          m.id as merchant_id, m.name as merchant_name,
          b.id as bank_id, b.name as bank_name 
        from "BankAccount" ba
        JOIN "Merchant" m
          ON ba.merchant_id = m.id
        JOIN "Bank" b
          ON ba.bank_id = b.id
        `
      )

      return rows
    } finally {
      client.release()
    }
  })
  //GET-AUTOCOMPLETE============================================================
  fastify.get('/bank-account/autocomplete', async (request, reply) => {
    const client = await fastify.pg.connect()

    try {
      const {rows} = await client.query(
        `
        select *,
          m.id as merchant_id, m.name as merchant_name,
          b.id as bank_id, b.name as bank_name,
          ('Bank ' || b.name || ': ' || account_number || ' (a/n ' || m.name ||')')::TEXT as "label"
        from "BankAccount" ba
        JOIN "Merchant" m
          ON ba.merchant_id = m.id
        JOIN "Bank" b
          ON ba.bank_id = b.id
        WHERE account_number ILIKE '%' || $1::TEXT || '%'
        OR m.name ILIKE '%' || $1::TEXT || '%'
        OR b.name ILIKE '%' || $1::TEXT || '%'
        LIMIT 10
        `, [request.query['q']]
      )

      return rows
    } finally {
      client.release()
    }
  })

  //GET-ONE from id============================================================
  fastify.get('/bank-account/:id', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
        select *,
          m.id as merchant_id, m.name as merchant_name,
          b.id as bank_id, b.name as bank_name 
        from "BankAccount" ba
        JOIN "Merchant" m
          ON ba.merchant_id = m.id
        JOIN "Bank" b
          ON ba.bank_id = b.id
        WHERE ba.id = $1
        `, [request.params.id]
      )

      const row = rows[0] || {}
      return row
    } finally {
      client.release()
    }
  })
}

export default routes