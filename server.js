const axios = require('axios').default
const debug = require('debug')('slack')
const hapi = require('hapi')
const joi = require('joi')
const pkg = require('./package.json')

// the slack incoming webhook url
const HOOK_URL = process.env.SLACK_HOOK

if (!HOOK_URL) {
  console.log('environment variable SLACK_HOOK is required')
  process.exit(1)
}

// these are the allowed moods with their configuration for slack
const moodMap = {
  '🤓': { slackEmoji: ':nerd_face:', slackUsername: 'Nerd' },
  '😐': { slackEmoji: ':neutral_face:', slackUsername: 'Neutral' },
  '😤': { slackEmoji: ':triumph:', slackUsername: 'Grumpy' },
}
const moodicons = Object.keys(moodMap)
const defaultMoodicon = moodicons[0]

async function createServer() {
  const server = new hapi.Server({ port: 9034 })

  server.route({
    method: 'POST',
    path: '/send-message',
    options: {
      validate: {
        payload: joi.object({
          message: joi
            .string()
            .required()
            .max(140),
          mood: joi
            .string()
            .only(...moodicons)
            .default(defaultMoodicon),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { message, mood } = request.payload
        const emoji = moodMap[mood].slackEmoji
        const username = moodMap[mood].slackUsername
        await axios.post(HOOK_URL, {
          text: message,
          icon_emoji: emoji,
          username: username,
        })
      } catch (e) {
        debug(e)
        return h.response({ ok: false }).code(500)
      }
      return h.response({ ok: true }).code(200)
    },
  })

  // -- STATIC ROUTES ------------------------------------------------------------

  await server.register(require('inert'))

  server.route({
    method: 'GET',
    path: '/{params*}',
    handler: {
      directory: {
        path: require('path').resolve(__dirname, 'client'),
        redirectToSlash: true,
      },
    },
  })

  return server
}

module.exports = createServer
