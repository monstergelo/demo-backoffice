import bcrypt from 'bcrypt'

async function routes (fastify, options) {
  //REGISTER====================================================================
  fastify.post('/register', async (request, reply) => {
    const password = bcrypt.hashSync(request.body['password'], Number(process.env.SALT_ROUNDS));

    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
        INSERT INTO "Admin" (
          name, password, email
        )
        VALUES($1, $2, $3)
        RETURNING id
        `, [
          request.body['name'],
          password,
          request.body['email'],
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
  //LOGIN====================================================================
  fastify.post('/login', async (request, reply) => {
    const client = await fastify.pg.connect()
    try {
      const value = await client.query(
        `
          SELECT * 
          FROM "Admin"
          WHERE name=$1;
        `, [
          request.body['name'],
        ]
      )

      if (!value) {
        throw new Error('username/password not found')
      }

      const hashPassword = value?.rows[0]?.password;
      const isMatched = bcrypt.compareSync(request.body['password'], hashPassword);

      if (isMatched) {
        const token = fastify.jwt.sign(value?.rows[0])
        reply.setCookie('jwt', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
        })

        reply.send({
          status: 'success',
          data: {
            ...value?.rows[0],
          }
        })
      }

      throw new Error('username/password not found')
    } finally {
      client.release()
    }
  })
  //LOGOUT====================================================================
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('jwt')

    return {
      status: 'success',
      msg: 'successfully logged out'
    }
  })
}

export default routes