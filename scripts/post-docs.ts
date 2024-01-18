import { fileURLToPath } from 'node:url'
import { dirname, relative, resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { exit } from 'node:process'
import fs from 'fs-extra'
import fg from 'fast-glob'
import sharp from 'sharp'
import { sidebar } from '../.vitepress/docsMetadata.json'
import { plainTargetDomain } from '../metadata'
import type { ArticleTree } from './types/metadata'
import { removeEmoji } from './utils'

export const DIR_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const dist = '.vitepress/dist/'

const ogSvg = fs.readFileSync(resolve(DIR_ROOT, './scripts/og-template.svg'), 'utf-8')

let articles: ArticleTree[] = ([] as any).concat(...sidebar.map(series => [...series?.items.map(item => ({ ...item, category: series.text }))] || []))
for (let i = 0; i < articles.length; i++) {
  const items = articles[i].items
  if (items)

    articles.push(...items.map(item => ({ ...item, category: articles[i].category })))
}
articles = articles.filter(item => item.link)

async function generateSVG(article: ArticleTree, output: string) {
  const lines = removeEmoji(article.text).trim().replace(/(?![^\n]{1,17}$)([^\n]{1,17})\s/g, '$1\n')
    .split('\n')
  lines.forEach((val, i) => {
    if (val.length > 17) {
      lines[i] = val.slice(0, 17)
      lines[i + 1] = `${val.slice(17)}${lines[i + 1] || ''}`
    }
    lines[i] = lines[i].trim()
  })

  const category = article.category
    ? removeEmoji(article.category).trim()
    : ''

  const data = {
    name1: lines[0] || '',
    name2: lines[1] || '',
    name3: `${lines[2] || ''}${lines[3] ? '...' : ''}`,
    category,
  }

  const svg = ogSvg.replace(/\{\{([^}]+)}}/g, (_, name) => {
    if (!name)
      return ''
    if (typeof name !== 'string')
      return ''
    if (!(name in data))
      return ''

    const nameKeyOf = name as keyof typeof data
    return data[nameKeyOf]
  })

  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toFile(output)
}

async function buildOG() {
  const files = await fg(`${dist}/**/*.html`, {
    onlyFiles: true,
    cwd: DIR_ROOT,
  })

  await Promise.all(files.map(async (file) => {
    let html = await fs.readFile(file, 'utf-8')

    const relativePath = relative(dist, file)
    const link = `/${relativePath.slice(0, relativePath.lastIndexOf('.'))}`

    const article = articles.find(item => item.link === link)
    if (article) {
      const ogName = `${dirname(file)}/og-${article.index}.png`
      await generateSVG(article, ogName)

      const ogNameRegexp = new RegExp(`${plainTargetDomain}/og.png`, 'g')
      html = html.replace(ogNameRegexp, `${plainTargetDomain}/${relative(dist, ogName)}`.toLocaleLowerCase())
      html = html.replace(
        /<meta property="og:title" content="([^"]+)">/g,
        `<meta property="og:title" content="${article.text}">`,
      )
      html = html.replace(
        /<meta property="og:description" content="([^"]+)">/g,
        `<meta property="og:description" content="${article.category} - Nólëbase - 记录回忆，知识和畅想的地方">`,
      )
    }

    await fs.writeFile(file, html, 'utf-8')
  }))
}

;(async function () {
  buildOG()
}()).catch((err) => {
  console.error(err)
  exit(1)
})
