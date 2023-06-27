import { extname } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import matter from 'gray-matter'
import type { RequestHandler } from 'express'

export const handlePutTags: RequestHandler = async (req, res) => {
    try {
      if (!req.body || !req.body.path || typeof req.body.path !== 'string') {
        res.status(400).json({ error: 'Missing path' })
        return
      }

      let filePath = decodeURIComponent(req.body.path).replace(extname(decodeURIComponent(req.body.path)), '.md')
      if (filePath.startsWith('/')) filePath = filePath.slice(1)

      const content = readFileSync(filePath, 'utf-8')
      const parsedContent = matter(content)
      parsedContent.data.tags = req.body.tags

      const rendered = matter.stringify(parsedContent.content, parsedContent.data)
      writeFileSync(filePath, rendered, 'utf-8')

      res.json({
        saved: true,
      })
    } catch (err) {
      res.
        status(500).
        json({ error: err instanceof Error ? err.message : err })
    }
  }
