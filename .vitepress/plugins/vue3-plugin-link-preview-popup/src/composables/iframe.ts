import { computed } from 'vue'

export function useInIframe() {
  return {
    livesInIframe: computed<boolean>(() => {
      try {
        return window.self !== window.top && 'location' in window.top
      }
      catch (e) {
        return false
      }
    }),
  }
}
