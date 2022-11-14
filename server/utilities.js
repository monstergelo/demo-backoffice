export const getConnectionString = () => {
  const host = process.env.POSTGRE_HOST
  const port = process.env.POSTGRE_PORT
  const username = process.env.POSTGRE_USERNAME
  const password = process.env.POSTGRE_PASSWORD
  const database = process.env.POSTGRE_DATABASE

  return `postgres://${username}:${password}@${host}:${port}/${database}`
}