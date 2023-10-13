import regexCreator from 'emoji-regex'

const emojiRegex = regexCreator()

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}

export function removeEmoji(str: string) {
  return str.replace(emojiRegex, '')
}
