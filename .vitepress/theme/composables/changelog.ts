import { CommitInfo } from "../../../scripts/types/changelog"
import { computed } from 'vue'
import { MaybeComputedRef, resolveUnref } from '@vueuse/core'

export function useCommits(allCommits: CommitInfo[], path: MaybeComputedRef<string>) {
  return computed<CommitInfo[]>(() => {
    let currentPath = resolveUnref(path)

    const commits = allCommits.filter(c => {
      return c.version || c.path?.find(p => {
        const action = p[0], path1 = p[1]?.toLowerCase(), path2 = p[2]?.toLowerCase()

        const res = currentPath === path1 || currentPath === path2
        if (res && action.startsWith('R')) currentPath = path1
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
