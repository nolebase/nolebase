import md5 from 'md5'
import Git from 'simple-git'
import { include } from '../.vitepress/meta'
import type { CommitInfo } from './types'
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

    log.author_avatar = md5(log.author_email)
  }

  const result = logs.filter(i => i.path?.length || i.version)
  cache = result
  return result
}
