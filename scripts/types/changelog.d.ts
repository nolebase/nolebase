export interface ContributorInfo {
  name: string
  count: number
  avatarUrl?: string
  url?: string
}

export interface CommitInfo {
  path: string[][]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
  author_avatar: string
}
