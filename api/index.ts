import { Plugin } from 'vite'
import express from 'express'
import bodyParser from 'body-parser'
import { handleGetTagsGeneration, handlePostTagsGeneration } from './tags/generation'
import { handlePutTags } from './tags'

export const app = express()

app.get('/api/v1/tags/generation', handleGetTagsGeneration)
app.post('/api/v1/tags/generation', bodyParser.json(), handlePostTagsGeneration)
app.put('/api/v1/tags', bodyParser.json(), handlePutTags)

export function ExpressMiddleware(): Plugin {
  return {
    name: 'express-middleware',
    configureServer: (server) => {
      server.middlewares.use(app)
    }
  }
}
