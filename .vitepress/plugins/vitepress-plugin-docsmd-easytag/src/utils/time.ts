/**
 * 睡眠函数
 *
 * @param duration 睡眠时间，单位毫秒
 */
export async function sleep(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
