import md5 from 'md5'
import Git from 'simple-git'
import { include } from '../.vitepress/meta'
import type { CommitInfo, ContributorInfo } from './types'
import { uniq } from './utils'

const git = Git({
  maxConcurrentProcesses: 200,
})
let cache: CommitInfo[] | undefined

export async function getChangeLog(count = 200) {
  if (cache)
    return cache

  // 设置 git 正常展示中文路径
  await git.raw(['config', '--global', 'core.quotepath', 'false'])

  const logs = (await git.log({ maxCount: count })).all as CommitInfo[]

  for (const log of logs) {
    /** 发版日志 */
    if (log.message.includes('release: ')) {
      log.version = log.message.split(' ')[1].trim()
      continue
    }

    /** 文档日志 */
    // const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
    const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-status', '-r', '-M', log.hash])
    delete log.body
    const files = raw.replace(/\\/g, '/').trim().split('\n').map(str => str.split('\t'))

    log.path = uniq(
      files
        .filter(i => !!i[1]?.match(RegExp(`^(${include.join('|')})\\/.+\\.md$`))?.[0]),
    )

    log.authorAvatar = md5(log.author_email)
  }

  const result = logs.filter(i => i.path?.length || i.version)
  cache = result
  return result
}

export async function getContributorsAt(path: string) {
  try {
    const list = (await git.raw(['log', '--pretty=format:"%an|%ae"', '--', path]))
      .split('\n')
      .map(i => i.slice(1, -1).split('|') as [string, string])
    const map: Record<string, ContributorInfo> = {}

    list
      .filter(i => i[1])
      .forEach((i) => {
        if (!map[i[1]]) {
          map[i[1]] = {
            name: i[0],
            count: 0,
            hash: md5(i[1]),
          }
        }
        map[i[1]].count++
      })

    return Object.values(map).sort((a, b) => b.count - a.count)
  }
  catch (e) {
    console.error(e)
    return []
  }
}

// export async function getFunctionContributors() {
//   const result = await Promise.all(functions.map(async (i) => {
//     return [i.name, await getContributorsAt(`packages/${i.package}/${i.name}`)] as const
//   }))
//   return Object.fromEntries(result)
// }

// 测试
// ;(async function() {
//   const log = await getChangeLog(20)
//   console.log('changelog:', log)
// })()

// 测试 getContributorsAt
// ;(async function() {
//   const log = await getContributorsAt('笔记/☕️ 前端开发/用 TypeScript 写 sh 脚本.md')
//   console.log('contributors:', log)
// })()
