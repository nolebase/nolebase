import type { PluginSimple } from 'markdown-it'
import type Token from 'markdown-it/lib/token'

export const MarkdownItTokenTransform: (options: {
  transformToken: (token: Token, env: any) => void
}) => PluginSimple = (options) => {
  return (md) => {
    md.core.ruler.push(
      'token_transform',
      (state) => {
        const transformFunc = options.transformToken || function () { }

        state.tokens.forEach((token) => {
          if (token.children && token.children.length) {
            token.children.forEach((token) => {
              transformFunc(token, state.env)
            })
          }
          transformFunc(token, state.env)
        })

        return false
      },
    )
  }
}
