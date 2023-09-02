import { computed } from 'vue'
import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import type { CommitInfo } from '../../../scripts/types/changelog'

export function useCommits(
  allCommits: CommitInfo[],
  path: MaybeRefOrGetter<string>,
) {
  return computed<CommitInfo[]>(() => {
    let currentPath = toValue(path)

    const commits = allCommits.filter((c) => {
      return (
        c.version
        || c.path?.find((p) => {
          const action = p[0]
          const path1 = p[1]?.toLowerCase()
          const path2 = p[2]?.toLowerCase()

          const res = currentPath === path1 || currentPath === path2
          if (res && action.startsWith('R'))
            currentPath = path1
          return res
        })
      )
    })

    return commits.filter((i, idx) => {
      if (i.version && (!commits[idx + 1] || commits[idx + 1]?.version))
        return false
      return true
    })
  })
}
