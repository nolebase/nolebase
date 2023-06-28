import { toRetriable } from './utils/reliability'
import uniq from 'lodash/uniq'
import { OpenAI, generateTagsFromPageSystemMessage, pageSplitterForTagsGeneration } from './openai'

/**
 * 生成标签
 * @param content
 * @param existingTags
 * @param category
 * @param strategy
 * @returns
 */
export async function tryTagAndClassifyTextualContent(content: string, existingTags: string[] = [], category: string, tagsNum: number): Promise<string[]> {
  const genTags = toRetriable(1000, 1000, async (content: string) => {
    const res = await OpenAI.call([
      await generateTagsFromPageSystemMessage.format({
        amount: tagsNum,
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
export async function generateTagsForOnePage(content: string, category: string, existingTags: string[], tagsNum: number) {
  if (!process.env.OPENAI_API_SECRET) {
    throw new Error('OPENAI_API_SECRET is not set.')
  }

  const chunks = await pageSplitterForTagsGeneration.createDocuments([content])

  let totalTags: string[] = [...existingTags]

  for (const chunk of chunks) {
    const tags: { lessRun: string[]; mediumRun: string[]; fullyRun: string[] } = { lessRun: [], mediumRun: [], fullyRun: [] }

    tags.lessRun = await tryTagAndClassifyTextualContent(chunk.pageContent, totalTags, category, tagsNum)
    console.log(`generated the tags from less run with targeting ${tagsNum} tags`, `[ ${tags.lessRun.join(', ')} ]`)
    if (tagsNum >= 15) {
      tags.mediumRun = await tryTagAndClassifyTextualContent(chunk.pageContent, uniq([...totalTags, ...tags.lessRun]), category, tagsNum)
      console.log(`generated the tags from medium run with targeting ${tagsNum} tags`, `[ ${tags.mediumRun.join(', ')} ]`)
    }
    if (tagsNum >= 30) {
      tags.fullyRun = await tryTagAndClassifyTextualContent(chunk.pageContent, uniq([...totalTags, ...tags.lessRun, ...tags.mediumRun]), category, tagsNum)
      console.log(`generated the tags from large run with targeting ${tagsNum} tags`, `[ ${tags.fullyRun.join(', ')} ]`)
    }

    totalTags = uniq([...totalTags, ...tags.lessRun, ...tags.mediumRun, ...tags.fullyRun])
  }

  // slice tags to base * multiplier
  return totalTags.slice(0, tagsNum)
}
