#!/usr/bin/env tsx
import fs from 'fs-extra'
import fg from 'fast-glob'
import { join, resolve } from 'path'
import Git from 'simple-git'
import matter from 'gray-matter'
import { createHash } from 'crypto'

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
  sidebar: any[]
}

const dir = './'
const target = '笔记/'

export const DIR_ROOT = resolve(__dirname, '..')
export const DIR_VITEPRESS = resolve(__dirname, '../.vitepress')

const git = Git(DIR_ROOT)

/**
 * 列出所有的页面
 * @param dir
 * @param options
 * @returns
 */
export async function listPages(dir: string, options: { target?: string, ignore?: string[] }) {
  const {
    target = '',
    ignore = []
  } = options

  const files = await fg(`${target}**/*.md`, {
    onlyFiles: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })

  files.sort()
  return files
}

/**
 * 添加和计算路由项
 * @param indexes
 * @param path
 * @param upgradeIndex
 * @returns
 */
async function addRouteItem(indexes: any[], path: string, upgradeIndex = false) {
  const suffixIndex = path.lastIndexOf('.')
  const nameStartsAt = path.lastIndexOf('/') + 1
  const title = path.slice(nameStartsAt, suffixIndex)
  const item = {
    index: title,
    text: title,
    link: `/${path.slice(0, suffixIndex)}`,
    lastUpdated: +await git.raw(['log', '-1', '--format=%at', path]) * 1000
  }
  const linkItems = item.link.split('/')
  linkItems.shift()

  target.split('/').forEach((item) => {
    if (item)
      linkItems.shift()
  })

  if (linkItems.length === 1) {
    return
  }

  indexes = addRouteItemRecursion(indexes, item, linkItems, upgradeIndex)
}

/**
 * 递归式添加和计算路由项
 * @param indexes
 * @param item
 * @param path
 * @param upgradeIndex
 * @returns
 */
function addRouteItemRecursion(indexes: any[], item: any, path: string[], upgradeIndex: boolean) {
  if (path.length === 1) {
    indexes.push(item)
    return indexes
  }
  else {
    const onePath = path.shift()
    let obj = indexes.find(obj => obj.index === onePath)

    if (!obj) {
      // 如果没有找到，就创建一个
      obj = { index: onePath, text: onePath, collapsible: true, collapsed: true, items: [] }
      indexes.push(obj)
    } else if (!obj.items) {
      // 如果找到了，但是没有 items，就创建对应的 items 和标记为可折叠
      obj.collapsible = true
      obj.collapsed = true
      obj.items = []
    }

    if (path.length === 1 && path[0] === 'index') {
      // 如果只有一个元素，并且是 index.md，直接写入 link 和 lastUpdated
      obj.link = item.link
      obj.lastUpdated = item.lastUpdated
    } else {
      // 否则，递归遍历
      obj.items = addRouteItemRecursion(obj.items, item, path, upgradeIndex)
    }

    return indexes
  }
}

/**
 * 处理 docsMetadata.sidebar，拼接 sidebar 路由树
 * @param docs 符合 glob 的文件列表
 * @param docsMetadata docsMetadata.json 的内容
 */
async function processSidebar(docs: string[], docsMetadata: DocsMetadata) {
  await Promise.all(docs.map(async (docPath: string) => {
    await addRouteItem(docsMetadata.sidebar, docPath)
  }))
}

/**
 * 处理 docsMetadata.docs，计算和统计 sha256 hash 等信息
 * @param docs 符合 glob 的文件列表
 * @param docsMetadata docsMetadata.json 的内容
 */
async function processDocs(docs: string[], docsMetadata: DocsMetadata) {
  if (!docsMetadata.docs) docsMetadata.docs = []

  docsMetadata.docs = docs.map((docPath) => {
    // 尝试在 docsMetadata.docs 中找到当前文件的历史 hash 记录
    let found = docsMetadata.docs.find((item) => {
      if (item.relativePath === docPath) return item
    })

    // 读取源文件
    const content = fs.readFileSync(docPath, 'utf-8')
    // 解析 Markdown 文件的 frontmatter
    const parsedPageContent = matter(content)

    const hash = createHash('sha256')
    const tempSha256Hash = hash.update(parsedPageContent.content).digest('hex') // 对 Markdown 正文进行 sha256 hash

    // 如果没有找到，就初始化
    if (!found) {
      return {
        relativePath: docPath,
        hashes: { sha256: { content: tempSha256Hash } },
      }
    } else {
      // 如果 found.hashes 不存在，就初始化
      if (!found.hashes) found.hashes = { sha256: { content: tempSha256Hash } }
      // 如果 found.hashes.sha256 不存在，就初始化
      if (!found.hashes.sha256) found.hashes.sha256 = { content: tempSha256Hash }
      // 如果历史记录的 sha256 hash 与当前的相同，就不标记 contentDiff，并且直接返回
      if (found.hashes.sha256.content === tempSha256Hash && !found.hashes.sha256.contentDiff) return found

      // 否则，标记 contentDiff
      found.hashes.sha256.contentDiff = tempSha256Hash
      return found
    }
  })
}

async function run() {
  const docs = await listPages(dir, { target })
  console.log('matched', docs.length, 'files')

  const docsMetadata: DocsMetadata = { docs: [], sidebar: [] }

  await processDocs(docs, docsMetadata)
  await processSidebar(docs, docsMetadata)
  await fs.writeJSON(join(DIR_VITEPRESS, 'docsMetadata.json'), docsMetadata, { spaces: 2 })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
