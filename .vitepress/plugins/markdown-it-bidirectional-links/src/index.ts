import { basename, extname, join, relative } from 'node:path'
import fg from 'fast-glob'
import type { PluginSimple } from 'markdown-it'

const biDirectionalLinkPattern = /\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\]/

function findBiDirectionalLinks(alreadyMatchedBiDirectionalLinks: Record<string, string>, possibleBiDirectionalLinksInFilePaths: Record<string, string>, possibleBiDirectionalLinksInFullFilePaths: Record<string, string>, link: RegExpMatchArray) {
  if (link.length < 2 || (!link[0] || !link[1]))
    return null

  if (alreadyMatchedBiDirectionalLinks[link[1]])
    return alreadyMatchedBiDirectionalLinks[link[1]]

  if (link[1].includes('/'))
    return possibleBiDirectionalLinksInFullFilePaths[link[1]]

  return possibleBiDirectionalLinksInFilePaths[link[1]]
}

export const MarkdownItBiDirectionalLinks: (options: {
  dir: string
  baseDir?: string
  includesPatterns?: string[]
}) => PluginSimple = (options) => {
  const rootDir = options.dir
  const includes = options?.includesPatterns ?? []

  const possibleBiDirectionalLinksInFilePaths: Record<string, string> = {}
  const possibleBiDirectionalLinksInFullFilePaths: Record<string, string> = {}
  const alreadyMatchedBiDirectionalLinks: Record<string, string> = {}

  if (includes.length === 0)
    includes.push('**/*.md')

  for (const include of includes) {
    const files = fg.sync(include, {
      onlyFiles: true,
      absolute: true,
      cwd: rootDir,
      ignore: [
        '_*',
        'dist',
        'node_modules',
      ],
    })

    for (const file of files) {
      const cleanBaseName = basename(file).replace(extname(file), '')
      const existingFileName = possibleBiDirectionalLinksInFilePaths[cleanBaseName]

      // when conflict
      if (typeof existingFileName === 'string' && existingFileName !== '') {
        // remove key from clean base name map
        delete possibleBiDirectionalLinksInFilePaths[cleanBaseName]
        // remove key from full file path map
        delete possibleBiDirectionalLinksInFullFilePaths[existingFileName]

        // add key to full file path map
        possibleBiDirectionalLinksInFullFilePaths[file] = file
        // recover deleted and conflicted key to full file path map
        possibleBiDirectionalLinksInFullFilePaths[existingFileName] = existingFileName

        continue
      }

      // otherwise, add key to both maps
      possibleBiDirectionalLinksInFilePaths[cleanBaseName] = file
      possibleBiDirectionalLinksInFullFilePaths[file] = file
    }
  }

  return (md) => {
    md.inline.ruler.after('text', 'bi_directional_link_replace', (state) => {
      const src = state.src.slice(state.pos, state.posMax)
      const link = src.match(biDirectionalLinkPattern)
      if (!link)
        return false

      const newLink = findBiDirectionalLinks(alreadyMatchedBiDirectionalLinks, possibleBiDirectionalLinksInFilePaths, possibleBiDirectionalLinksInFullFilePaths, link)
      if (!newLink)
        return false

      const resolvedNewLink = join(options.baseDir ?? '/', relative(rootDir, newLink))

      // Create new link_open, text, and link_close tokens
      const openToken = state.push('link_open', 'a', 1)
      openToken.attrSet('href', resolvedNewLink)
      const textToken = state.push('text', '', 0)
      textToken.content = link[1].replace('[[', '').replace(']]', '')
      state.push('link_close', 'a', -1)

      // Update the position in the source string
      state.pos += link[0].length

      return true
    })
  }
}
