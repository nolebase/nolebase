import { ContributorInfo } from "./changelog"

export interface ArticleTree {
  index: string
  text: string
  link?: string
  lastUpdated?: number
  collapsible?: true
  collapsed?: true
  items?: ArticleTree[]
  category?: string
  contributors?: ContributorInfo[]
}
