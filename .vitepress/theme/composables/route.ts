import { useMounted } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { computed } from 'vue'

export function useRawPath() {
  const route = useRoute()
  const isMounted = useMounted()
  return computed(() => (isMounted
    ? decodeURIComponent(route.path).replace(/^\/(.+)\.html$/, '$1.md').toLowerCase()
    : ''
  ))
}
