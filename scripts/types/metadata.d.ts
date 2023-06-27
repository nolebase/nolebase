export interface ArticleTree {
  index: string
  text: string
  link?: string
  lastUpdated?: number
  collapsible?: true
  collapsed?: true
  items?: ArticleTree[]
  category?: string
}

export type Doc = {
  relativePath: string,
  hashes: {
    sha256: {
      content: string
      contentDiff?: string
    },
  },
  ignoreWhenGenerateTagsFromGPT?: boolean,
}

export type DocsMetadata = {
  docs: Doc[],
  sidebar: ArticleTree[]
}
