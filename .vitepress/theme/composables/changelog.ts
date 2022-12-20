import { CommitInfo } from "../../../scripts/types/changelog"
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'

export function useCommits(allCommits: CommitInfo[], path: string) {
  const isMounted = useMounted()
  return computed<CommitInfo[]>(() => {
    if (!isMounted.value) return []
    const commits = allCommits.filter(c => {
      return c.version || c.path?.find(i => {
        const res = path === i[1] || path === i[2]
        if (res && i[0].startsWith('R')) path = i[1]
        return res
      })
    })

    return commits.filter((i, idx) => {
      if (i.version && (!commits[idx + 1] || commits[idx + 1]?.version))
        return false
      return true
    })
  })
}
