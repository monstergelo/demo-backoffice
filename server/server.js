import helloRoute from './routes/hello.js'
import adminLogDecorator from './routes/admin-log.js'
import adminRoute from './routes/admin.js'
import roleRoute from './routes/role.js'
import permissionRoute from './routes/permission.js'
import merchantRoute from './routes/merchant.js'
import disbursementRoute from './routes/disbursement.js'
import bankAccountRoute from './routes/bank-account.js'
import fdsRoute from './routes/fds.js'
import userRoute from './routes/user.js'
import Fastify from 'fastify'

import cookie from '@fastify/cookie'
import auth from '@fastify/auth'
import jwt from '@fastify/jwt'
import postgres from '@fastify/postgres'
import cors from '@fastify/cors'

import dotenv from 'dotenv'

import { getConnectionString } from './utilities.js'

dotenv.config();
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"

const fastify = Fastify({ logger: true })

fastify.register(cookie)
fastify.register(jwt, {
  secret: process.env.JWT_SECRET
})
fastify.register(postgres, {
  connectionString: getConnectionString(),
  ssl: false
})
await fastify.register(cors, {
  origin: true, // reminder: set false on production
  credentials: 'true',
})

fastify.register(adminLogDecorator)
await fastify.after()

fastify.register(auth)
fastify.register(helloRoute);
fastify.register(adminRoute);
fastify.register(roleRoute);
fastify.register(userRoute);
fastify.register(permissionRoute);
fastify.register(merchantRoute);
fastify.register(disbursementRoute);
fastify.register(bankAccountRoute);
fastify.register(fdsRoute);


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port, host })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

