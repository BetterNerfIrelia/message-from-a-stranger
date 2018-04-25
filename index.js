const createServer = require('./server')

const main = async () => {
  const server = await createServer()
  await server.start()
  console.log(server.info.uri)
}

main()
