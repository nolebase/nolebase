
export function useRawPath() {
  return (() => {
    if (typeof window === 'undefined')
      return ''
    return decodeURIComponent(window.location.pathname).replace(/^\/(.+)\.html$/, '$1.md').toLowerCase()
  })()
}
