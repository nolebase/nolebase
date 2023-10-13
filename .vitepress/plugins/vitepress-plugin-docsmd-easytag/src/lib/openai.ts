import { env } from 'node:process'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { CallbackManager } from 'langchain/callbacks'
import type { LLMResult } from 'langchain/schema'
import { PromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { TokenTextSplitter } from 'langchain/text_splitter'
import uniq from 'lodash/uniq'
import { isVerboseOn } from '../utils/verbose'
import { toRetriable } from '../utils/reliability'

const verbose = isVerboseOn()

const generateTagsFromPagePromptTemplate = new PromptTemplate({
  template: `Existing Tags: {tags}
Category: {category}
Content: {content}

As a professional knowledge base organizer, expert writer, and skilled in tagging and classifying textual content, your objective is to optimize searchability and organization by bi-directional link within knowledge base systems. To achieve this, please identify at least {amount} relevant keywords and tags, excluding the existing tags, from the article based on the following criteria:
- Technical terms
- Special terms
- Names of geographical locations
- Names of people
- Names of tools, software, or hardware
- Names of companies

Please submit your tags in the following JSON format, using only Simplified Chinese and English characters:
["tag1", "tag2", ...]`,
  inputVariables: ['amount', 'tags', 'category', 'content'],
})

export const generateTagsFromPageSystemMessage = new SystemMessagePromptTemplate(generateTagsFromPagePromptTemplate)

const callbackManager = CallbackManager.fromHandlers({
  handleLLMStart: async (llm: object, prompts: string[]) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(llm, null, 2))
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(prompts, null, 2))
  },
  handleLLMEnd: async (output: LLMResult) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(output, null, 2))
  },
  handleLLMError: async (err: Error) => {
    console.error(err)
    console.error('type:', typeof (err as any)?.response, (err as any)?.response?.data)
  },
})

interface TagOpenAI {
  tryTagAndClassifyTextualContent(content: string, existingTags: string[], category: string, tagsNum: number): Promise<string[]>
  generateTagsForOnePage(content: string, category: string, existingTags: string[], tagsNum: number): Promise<string[]>
}

let taggingOpenAI: TagOpenAI

export function getTaggingOpenAIClient(): TagOpenAI {
  return taggingOpenAI
}

export function initOpenAI(config: {
  chunkSize?: number
  chunkOverlap?: number
  openAIAPISecret?: string
  openAIAPIHost?: string
  modelName?: string
}) {
  const chatOpenAI = new ChatOpenAI({
    openAIApiKey: config.openAIAPISecret || 'sk-testkey',
    modelName: config.modelName || 'gpt-3.5-turbo-16k',
    temperature: 0.6,
    configuration: {
      basePath: config.openAIAPIHost ? `${config.openAIAPIHost}/v1` : undefined,
    },
    verbose,
    callbacks: verbose ? callbackManager : undefined,
  })

  const pageSplitterForTagsGeneration = new TokenTextSplitter({
    encodingName: 'cl100k_base',
    chunkSize: config.chunkSize || 10000,
    chunkOverlap: config.chunkOverlap || 100,
  })

  taggingOpenAI = {
    /**
     * 生成标签
     * @param content 文章内容
     * @param existingTags 已有标签
     * @param category 分类
     * @param tagsNum 目标标签数量
     * @returns 生成的标签
     */
    async tryTagAndClassifyTextualContent(content: string, existingTags: string[] = [], category: string, tagsNum: number): Promise<string[]> {
      const genTags = toRetriable(1000, 1000, async (content: string) => {
        const res = await chatOpenAI.call([
          await generateTagsFromPageSystemMessage.format({
            amount: tagsNum,
            tags: JSON.stringify(existingTags),
            category,
            content,
          }),
        ])

        const tags = JSON.parse(res.text)
        if (!Array.isArray(tags))
          throw new Error('Tags must be an array.')

        return tags
      })

      return await genTags(content)
    },

    /**
     * 生成一个页面的标签
     * @param content 文章内容
     * @param category 分类
     * @param existingTags 已有标签
     * @param tagsNum 目标标签数量
     * @returns 生成的标签
     */
    async generateTagsForOnePage(content: string, category: string, existingTags: string[], tagsNum: number) {
      if (!env.OPENAI_API_SECRET)
        throw new Error('OPENAI_API_SECRET is not set.')

      const chunks = await pageSplitterForTagsGeneration.createDocuments([content])

      let totalTags: string[] = [...existingTags]

      for (const chunk of chunks) {
        const tags: { lessRun: string[]; mediumRun: string[]; fullyRun: string[] } = { lessRun: [], mediumRun: [], fullyRun: [] }

        tags.lessRun = await this.tryTagAndClassifyTextualContent(chunk.pageContent, totalTags, category, tagsNum)
        // eslint-disable-next-line no-console
        console.log(`generated the tags from less run with targeting ${tagsNum} tags`, `[ ${tags.lessRun.join(', ')} ]`)
        if (tagsNum >= 15) {
          tags.mediumRun = await this.tryTagAndClassifyTextualContent(chunk.pageContent, uniq([...totalTags, ...tags.lessRun]), category, tagsNum)
          // eslint-disable-next-line no-console
          console.log(`generated the tags from medium run with targeting ${tagsNum} tags`, `[ ${tags.mediumRun.join(', ')} ]`)
        }
        if (tagsNum >= 30) {
          tags.fullyRun = await this.tryTagAndClassifyTextualContent(chunk.pageContent, uniq([...totalTags, ...tags.lessRun, ...tags.mediumRun]), category, tagsNum)
          // eslint-disable-next-line no-console
          console.log(`generated the tags from large run with targeting ${tagsNum} tags`, `[ ${tags.fullyRun.join(', ')} ]`)
        }

        totalTags = uniq([...totalTags, ...tags.lessRun, ...tags.mediumRun, ...tags.fullyRun])
      }

      // slice tags to base * multiplier
      return totalTags.slice(0, tagsNum)
    },
  }
}
