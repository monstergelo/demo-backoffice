async function routes (fastify, options) {
  //HOOK=======================================================================
  fastify.addHook('onResponse', fastify['log-admin-activity'])
  
  //GET-ALL====================================================================
  fastify.get('/permission', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        `
          SELECT *
          FROM "Permission"
        `
      )

      return rows
    } finally {
      client.release()
    }
  })
}
export default routes