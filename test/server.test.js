const moxios = require('moxios')
const createServer = require('../server')

describe('server', () => {
  describe('send message endpoint', () => {
    beforeEach(() => {
      moxios.install()
    })

    afterEach(() => {
      moxios.uninstall()
    })

    it('responds with 400 if no message is specified', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: {},
      })
      expect(response.statusCode).toBe(400)
    })

    it('responds with 400 if message is of length 0', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: { message: '' },
      })
      expect(response.statusCode).toBe(400)
    })

    it('responds with 400 if message is too long (>140 characters)', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: { message: 'a'.repeat(141) },
      })
      expect(response.statusCode).toBe(400)
    })

    it('responds with 400 if unknown mood is specified', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: { message: 'test', mood: '👋' },
      })
      expect(response.statusCode).toBe(400)
    })

    it('responds with 400 if payload is invalid json', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: '',
      })
      expect(response.statusCode).toBe(400)
    })

    it('responds with 500 if the slack api responds with an error', async () => {
      moxios.stubOnce('POST', /.*/, { status: 500 })
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: { message: 'test' },
      })
      expect(response.statusCode).toBe(500)
    })

    it('responds with 200 otherwise', async () => {
      moxios.stubOnce('POST', /.*/, { status: 200 })
      const server = await createServer()
      const response = await server.inject({
        method: 'POST',
        url: '/send-message',
        payload: { message: 'test', mood: '🤓' },
      })
      expect(response.statusCode).toBe(200)
    })
  })
})
