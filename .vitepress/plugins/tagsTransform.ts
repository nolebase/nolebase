import type { Plugin } from 'vite'
import { include } from '../meta'
import { resolve, relative } from 'path'
import MarkdownIt from 'markdown-it/index'

const ROOT = resolve(__dirname, '../../')

export function TagsTransform(): Plugin {
  return {
    name: 'nolebase-docs-md-tgs-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md'))
        return null

        // 将 ID 转换为相对路径，便于进行正则匹配
        id = relative(ROOT, id)

      if (id.match(RegExp(`^(${include.join('|')})\\/`))) { // markdown files that under include
        const targetComponent = process.env.NODE_ENV === 'development' ? 'TagEditor' : 'Tag'
        // const targetComponent = 'Tags'

        const mkit = new MarkdownIt()
        const tokens = mkit.parse(code, {})

        // search for the first heading open and close token with level 1
        const openIndex = tokens.findIndex((token) => token.type === 'heading_open' && token.markup === '#')
        const closeIndex = tokens.findIndex((token) => token.type === 'heading_close' && token.markup === '#')

        // if not found, return the original code
        if (openIndex === -1 || closeIndex === -1)
          return `<${targetComponent} />\n\n${code}`

        // concat the heading open and close token with level 1 along with the inner content of the heading
        const heading = tokens.slice(openIndex, closeIndex + 1).map((token) => {
          if (token.type === 'heading_open') {
            return '# '
          }
          if (token.type === 'heading_close') {
            return ''
          }

          return token.content
        }).join('')

        // find the exact first index of heading in raw content `code`
        const headingIndex = code.indexOf(heading)

        // if not found, return the original code
        if (headingIndex === -1)
          return `<${targetComponent} />\n\n${code}`

        // insert the <Tags /> component after the heading
        code = code.slice(0, headingIndex + heading.length) + `\n\n<${targetComponent} />\n\n` + code.slice(headingIndex + heading.length)
      }

      return code
    },
  }
}
