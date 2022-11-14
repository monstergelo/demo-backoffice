
import Fastify from 'fastify'
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"

const fastify = Fastify({ logger: true })
fastify.register(import("./app.js"))

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

