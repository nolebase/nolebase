#!/usr/bin/env tsx
import fs from 'fs-extra'
import fg from 'fast-glob'
import { join, resolve } from 'path'

const dir = './'
const target = ''

export const DIR_ROOT = resolve(__dirname, '..')
export const DIR_VITEPRESS = resolve(__dirname, '../.vitepress')

export async function listFunctions(dir: string, options: { target?: string, ignore?: string[] }) {
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

function addRouteItem(indexes: any[], path: string, upgradeIndex = false) {
  const suffixIndex = path.lastIndexOf('.')
  const nameStartsAt = path.lastIndexOf('/') + 1
  const title = path.slice(nameStartsAt, suffixIndex)
  const item = {
    index: title,
    text: title,
    link: `/${path.slice(0, suffixIndex)}`,
  }
  const linkItems = item.link.split('/')
  linkItems.shift()

  if (linkItems.length === 1) {
    return
  }

  indexes = addRouteItemRecursion(indexes, item, linkItems, upgradeIndex)
}

function addRouteItemRecursion(indexes: any[], item: any, path: string[], upgradeIndex: boolean) {
  if (path.length === 1) {
    indexes.push(item)
    return indexes
  }
  else {
    const onePath = path.shift()
    let obj = indexes.find(obj => obj.index === onePath)
    if (!obj) {
      obj = {
        index: onePath,
        text: onePath,
        collapsible: true,
        collapsed: true,
        items: []
      }
      indexes.push(obj)
    }
    else if (!obj.items) {
      obj.collapsible = true
      obj.collapsed = true
      obj.items = []
    }

    if (path.length === 1 && path[0] === 'index') {
      obj.link = item.link
    }
    else {
      obj.items = addRouteItemRecursion(obj.items, item, path, upgradeIndex)
    }
    return indexes
  }
}

async function run() {
  const docs = await listFunctions(dir, { target })
  console.log(docs)

  const indexes: any[] = []

  await Promise.all(docs.map(async (docPath: string) => {
    addRouteItem(indexes, docPath)
  }))

  await fs.writeJSON(join(DIR_VITEPRESS, 'metainfo.json'), {
    sidebar: indexes,
  }, { spaces: 2 })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
