import { CommitInfo } from "../../../scripts/types/changelog"
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'

export function useCommits(allCommits: CommitInfo[], pagePath: string) {
  const isMounted = useMounted()
  return computed<CommitInfo[]>(() => {
    if (!isMounted.value) return []
    const commits = allCommits.filter(c => {
      return c.version || c.path?.find(p => {
        const action = p[0], path1 = p[1]?.toLowerCase(), path2 = p[2]?.toLowerCase()

        const res = pagePath === path1 || pagePath === path2
        if (res && action.startsWith('R')) pagePath = path1
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
