import type { Plugin } from 'vite'
import { include } from '../meta'
import { resolve, relative } from 'path'

const ROOT = resolve(__dirname, '../../')

export function MarkdownTransform(): Plugin {

  return {
    name: 'docs-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md'))
        return null

        // 将 ID 转换为相对路径，便于进行正则匹配
        id = relative(ROOT, id)

      if (id.match(RegExp(`^(${include.join('|')})\\/`))) {

        const { footer } = await getFunctionMarkdown()
        code = `${code}\n\n${footer}`
      }

      return code
    },
  }
}


export async function getFunctionMarkdown() {
  const changelogSection = `
## Changelog

<Changelog />
`
  const footer = `${changelogSection}\n`

  return {
    footer,
  }
}
