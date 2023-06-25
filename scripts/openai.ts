import { ChatOpenAI } from 'langchain/chat_models/openai'
import { CallbackManager } from 'langchain/callbacks'
import type { LLMResult } from 'langchain/schema'
import { SystemMessagePromptTemplate, PromptTemplate } from 'langchain/prompts'
import { TokenTextSplitter } from 'langchain/text_splitter'
import { isVerboseOn } from './utils/verbose'

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

const verbose = isVerboseOn()

export const OpenAI = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_SECRET,
  modelName: 'gpt-3.5-turbo-16k',
  temperature: 0.6,
  configuration: {
    basePath: `${process.env.OPENAI_API_HOST}/v1`,
  },
  verbose: verbose,
  callbacks: verbose ? callbackManager : undefined,
})

export const pageSplitterForTagsGeneration = new TokenTextSplitter({
  encodingName: 'cl100k_base',
  chunkSize: 10000,
  chunkOverlap: 100
})

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
