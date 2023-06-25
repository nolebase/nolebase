import { resolve, basename } from 'path'
import matter from 'gray-matter'
import DocsMetadata from '../.vitepress/docsMetadata.json'
import type { Doc } from './update'
import { readFileSync, writeFileSync } from 'fs-extra'
import { toRetriable } from './utils/reliability'
import uniq from 'lodash/uniq'
import { listPages } from './update'
import { OpenAI, generateTagsFromPageSystemMessage, pageSplitterForTagsGeneration } from './openai'
import confirm from '@inquirer/confirm'
import select from '@inquirer/select'
import { isVerboseOn } from './utils/verbose'

const ROOT = resolve(__dirname, '../')

type Strategy = {
  base: number
  multiplier: 3 | 2 | 1
}

/**
 * 生成标签
 * @param content
 * @param existingTags
 * @param category
 * @param strategy
 * @returns
 */
async function tryTagAndClassifyTextualContent(content: string, existingTags: string[] = [], category: string, strategy: Strategy): Promise<string[]> {
  const genTags = toRetriable(1000, 1000, async (content: string) => {
    const res = await OpenAI.call([
      await generateTagsFromPageSystemMessage.format({
        amount: strategy.base * strategy.multiplier,
        tags: JSON.stringify(existingTags),
        category,
        content
      })
    ])

    const tags = JSON.parse(res.text)
    if (!Array.isArray(tags)) {
      throw new Error('Tags must be an array.')
    }

    return tags
  })

  return await genTags(content)
}

/**
 * 生成一个页面的标签
 * @param content
 * @param category
 * @param strategy
 * @returns
 */
async function generateTagsForOnePage(content: string, category: string, strategy: Strategy) {
  const chunks = await pageSplitterForTagsGeneration.createDocuments([content])

  let totalTags: string[] = []

  for (const chunk of chunks) {
    const tags: { lessRun: string[]; mediumRun: string[]; fullyRun: string[] } = { lessRun: [], mediumRun: [], fullyRun: [] }

    if (strategy.multiplier === 1) tags.lessRun = await tryTagAndClassifyTextualContent(chunk.pageContent, totalTags, category, strategy)
    if (strategy.multiplier === 2) tags.mediumRun = await tryTagAndClassifyTextualContent(chunk.pageContent, uniq([...totalTags, ...tags.lessRun]), category, strategy)
    if (strategy.multiplier === 3) tags.fullyRun = await tryTagAndClassifyTextualContent(chunk.pageContent, uniq([...totalTags, ...tags.lessRun, ...tags.mediumRun]), category, strategy)

    totalTags = uniq([...totalTags, ...tags.lessRun, ...tags.mediumRun, ...tags.fullyRun])
  }

  // slice tags to base * multiplier
  return totalTags.slice(0, strategy.base * strategy.multiplier)
}

/**
 * 通过 cli 交互式控制一个页面的生成标签流程
 * @param filePath
 * @param content
 * @param category
 * @param strategy
 * @returns
 */
async function processTagsForOnePage(filePath: string, content: string, category: string, strategy: Strategy): Promise<{ writeTags: boolean, tags?: string[] }> {
  let totalTags = await generateTagsForOnePage(content, category, strategy)

  const tagsChoice = await select({
    message: `为「${basename(filePath)}」通过目标标签数 ${strategy.base * strategy.multiplier} 生成了标签 ${JSON.stringify(totalTags)}，是否需要将这些标签写入到 frontmatter 中？`,
    choices: [
      { name: '是', value: 'true' },
      { name: '否', value: 'false' },
      { name: '重新生成', value: 'regenerate' }
    ]
  })
  if (!tagsChoice || tagsChoice == 'false' || !Boolean(tagsChoice)) {
    return {
      writeTags: false
    }
  }
  if (tagsChoice == 'regenerate') {
    const s = await select({
      message: `需要修改生成策略吗？`,
      choices: [
        { name: '多些', value: 1 },
        { name: '不变', value: 0 },
        { name: '少些', value: -1 }
      ]
    }) as -1 | 1

    return await processTagsForOnePage(filePath, content, category, {
      base: strategy.base + s,
      multiplier: strategy.multiplier,
    })
  }

  return {
    writeTags: true,
    tags: totalTags
  }
}

/**
 * Only generate tags for the markdown file when the page either has no tags defined in the frontmatter and the tags are empty,
 * or the DocsMetadata.docs[index].hashes.sha256.contentDiff is not empty.
 */
export async function generateTagsForPages() {
  const filePaths = await listPages(ROOT, { target: '笔记/' })

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i]
    if (!filePath.endsWith('.md')) continue

    const category = filePath.split('/').length >= 2 ? filePath.split('/')[1] : 'unknown'
    const found = DocsMetadata.docs.find((item) => {
      if (item.relativePath === filePath) return item
    }) as Doc | undefined

    if (!found) {
      console.warn(`未找到 docsMetadata.json 中的「${basename(filePath)}」，跳过本次标签生成...`)
      continue
    }

    const content = readFileSync(filePath, 'utf-8')
    const parsedContent = matter(content)

    if (parsedContent.data.ignoreWhenGenerateTagsFromGPT) {
      if (isVerboseOn()) console.log(`由于文档内 frontmatter 中已标记「${basename(filePath)}」的 ignoreWhenGenerateTagsFromGPT，跳过本次标签生成...`)
      continue
    }
    if (!found.hashes.sha256.contentDiff && (Array.isArray(parsedContent.data.tags) && parsedContent.data.tags.length > 0)) {
      if (isVerboseOn()) console.log(`由于 docsMetadata.json 中已标记「${basename(filePath)}」的 hashes.sha256.contentDiff 为空且文档内 frontmatter 中已有标签，跳过本次标签生成...`)
      continue
    }
    if (found.ignoreWhenGenerateTagsFromGPT) {
      if (isVerboseOn()) console.log(`由于 docsMetadata.json 中已标记「${basename(filePath)}」的 ignoreWhenGenerateTagsFromGPT，跳过本次标签生成...`)
      continue
    }

    const answer = await confirm({ message: `${basename(filePath)} 的 hash 与之前不同或从未有过 tags，需要为这份文档生成标签吗？` })
    if (!answer) {
      continue
    }

    const strategy = await select({
      message: `请选择生成标签的策略：`,
      choices: [
        { name: '尽可能多', value: 3 },
        { name: '一般', value: 2 },
        { name: '较少', value: 1 }
      ]
    }) as 3 | 2 | 1

    const res = await processTagsForOnePage(filePath, parsedContent.content, category, {
      base: 5,
      multiplier: strategy,
    })
    if (!res.writeTags) {
      continue
    }

    parsedContent.data.tags = res.tags
    const rendered = matter.stringify(parsedContent.content, parsedContent.data)

    writeFileSync(filePath, rendered, 'utf-8')
  }
}

generateTagsForPages().catch((err) => console.error(err))
