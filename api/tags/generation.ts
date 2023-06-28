import { extname } from 'path'
import DocsMetadata from '../../.vitepress/docsMetadata.json'
import type { Doc } from '../../scripts/types/metadata'
import { isVerboseOn } from '../../scripts/utils/verbose'
import { readFileSync } from 'fs'
import matter from 'gray-matter'
import type { RequestHandler } from 'express'
import { generateTagsForOnePage } from '../../scripts/genTagsFromGPT'

function checkTagsForPageCanBeGenerated(filePath: string): {
  reason?: string;
  canBeGenerated: boolean;
  content?: matter.GrayMatterFile<string>
} {
  try {
    const found = DocsMetadata.docs.find((item) => {
      if (item.relativePath === filePath) return item
    }) as Doc | undefined

    if (!found) {
      console.warn(`未找到 docsMetadata.json 中的「${filePath}」，跳过本次标签生成...`)
      return {
        reason: `未找到 docsMetadata.json 中的「${filePath}」，跳过本次标签生成...`,
        canBeGenerated: false
      }
    }

    const content = readFileSync(filePath, 'utf-8')
    const parsedContent = matter(content)

    if (parsedContent.data.ignoreWhenGenerateTagsFromGPT) {
      if (isVerboseOn()) console.log(`由于文档内 frontmatter 中已标记「${filePath}」的 ignoreWhenGenerateTagsFromGPT，跳过本次标签生成...`)
      return {
        reason: `由于文档内 frontmatter 中已标记「${filePath}」的 ignoreWhenGenerateTagsFromGPT，跳过本次标签生成...`,
        canBeGenerated: false
      }
    }
    if (!found.hashes.sha256.contentDiff && (Array.isArray(parsedContent.data.tags) && parsedContent.data.tags.length > 0)) {
      if (isVerboseOn()) console.log(`由于 docsMetadata.json 中已标记「${filePath}」的 hashes.sha256.contentDiff 为空且文档内 frontmatter 中已有标签，跳过本次标签生成...`)
      return {
        reason: `由于 docsMetadata.json 中已标记「${filePath}」的 hashes.sha256.contentDiff 为空且文档内 frontmatter 中已有标签，跳过本次标签生成...`,
        canBeGenerated: false
      }
    }
    if (found.ignoreWhenGenerateTagsFromGPT) {
      if (isVerboseOn()) console.log(`由于 docsMetadata.json 中已标记「${filePath}」的 ignoreWhenGenerateTagsFromGPT，跳过本次标签生成...`)
      return {
        reason: `由于 docsMetadata.json 中已标记「${filePath}」的 ignoreWhenGenerateTagsFromGPT，跳过本次标签生成...`,
        canBeGenerated: false
      }
    }

    return {
      canBeGenerated: true,
      content: parsedContent
    }
  } catch (err) {
    console.error(err)
    return {
      reason: err instanceof Error ? err.message : err,
      canBeGenerated: false
    }
  }
}

export const handleGetTagsGeneration: RequestHandler = async (req, res) => {
  try {
    if (!req.query || !req.query.path || !req.query.path.toString()) {
      res.
        status(400).
        json({ error: 'Missing path' })

      return
    }

    let filePath = decodeURIComponent(req.query.path.toString()).replace(extname(decodeURIComponent(req.query.path.toString())), '.md')
    if (filePath.startsWith('/')) filePath = filePath.slice(1)

    const canBeGenerated = checkTagsForPageCanBeGenerated(filePath)
    res.json(canBeGenerated)
  } catch (err) {
    console.error(err)
    res.
      status(500).
      json({ error: err instanceof Error ? err.message : err })
  }
}

export const handlePostTagsGeneration: RequestHandler = async (req, res) => {
  try {
    if (!req.body || !req.body.path || typeof req.body.path !== 'string') {
      res.
        status(400).
        json({ error: 'Missing path' })

      return
    }

    let filePath = decodeURIComponent(req.body.path).replace(extname(decodeURIComponent(req.body.path)), '.md')
    if (filePath.startsWith('/')) filePath = filePath.slice(1)

    const canBeGenerated = checkTagsForPageCanBeGenerated(filePath)
    if (!canBeGenerated.canBeGenerated) {
      res.
        status(400).
        json({ error: canBeGenerated.reason })

      return
    }
    if (!canBeGenerated.content) {
      res.
        status(400).
        json({ error: 'Missing content' })

      return
    }

    const category = filePath.split('/').length >= 2 ? filePath.split('/')[1] : 'unknown'
    let potentialTagsNum = Math.ceil(canBeGenerated.content.content.length / 500)
    if (potentialTagsNum <= 5) {
      potentialTagsNum = 5
    }
    if (potentialTagsNum >= 50) {
      potentialTagsNum = 50
    }

    const tags = await generateTagsForOnePage(canBeGenerated.content.content, category, req.body.tags, potentialTagsNum)

    res.json({
      tags,
    })
  } catch (err) {
    console.error(err)
    res.
      status(500).
      json({ error: err instanceof Error ? err.message : err })
  }
}
