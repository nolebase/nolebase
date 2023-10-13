import { env } from 'node:process'

export function isVerboseOn(): boolean {
  return env.VERBOSE === 'true' || env.VERBOSE === '1' || env.VERBOSE === 'on'
}
