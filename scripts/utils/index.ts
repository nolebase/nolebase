

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}
