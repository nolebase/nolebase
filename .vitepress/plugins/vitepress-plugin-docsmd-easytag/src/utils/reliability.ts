import { sleep } from './time'

/**
 * 通过配置的 retryLimit 和 delayInterval 来返回一个可重试的匿名函数调用
 *
 * @param retryLimit 重试次数
 * @param delayInterval 重试间隔
 * @param func 调用函数
 * @returns 返回一个闭包后的函数，该函数的签名与 func 一致
 */
export function toRetriable<A extends any, R extends any>(retryLimit: number, delayInterval: number, func: (...args: A[]) => Promise<R>): (...args: A[]) => Promise<R> {
  let retryCount = 0
  return async function (args: A): Promise<R> {
    try {
      return await func(args)
    } catch (err) {
      if (retryCount < retryLimit) {
        retryCount++
        await sleep(delayInterval)
        return await toRetriable(retryLimit, delayInterval, func)(args)
      } else {
        throw err
      }
    }
  }
}
