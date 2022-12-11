<script lang="ts" setup>
interface HyphenResp<T> {
  data: T
}
interface HyphenNewShortURLResp {
  url: string
  shortUrl: string
}

const APIHost = 'https://api.ayaka.io/hyphen'
const newUrlEndpoint = APIHost + "/api/v1/url"
const queryUrlEndpoint = APIHost + "/api/v1/url/full"

async function findExistingLink(url: string): Promise<string> {
  const res = await fetch(`${queryUrlEndpoint}?url=${url}`)
  if (res.status !== 200) {
    if (res.status === 404) return ''
    console.error(await res.json())
    return ''
  }

  const resJson = await res.json()
  return resJson.data.shortUrl as string
}

async function createShareLink(url: string) {
  const res = await fetch(newUrlEndpoint, {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (res.status !== 200) {
    console.error(await res.json())
    return null
  }

  const resJson = (await res.json()) as HyphenResp<HyphenNewShortURLResp>
  return resJson.data
}

async function getShareLink() {
  if (!window.location.pathname || ['index.html', '/', ''].includes(window.location.pathname))
    return window.location.href

  const url = window.location.href

  let linkHash = ''
  const existingLink = await findExistingLink(url)
  if (existingLink !== '') {
    linkHash = existingLink
  }
  else {
    const newLink = await createShareLink(url)
    if (newLink === null)
      return window.location.href
    linkHash = newLink.shortUrl
  }

  return `${window.location.origin}/to/${linkHash}`
}

const { copy, copied: shareSuccess  } = useClipboard()
async function copyShareLink() {
  const shareLink = await getShareLink()
  copy(shareLink)
}
</script>

<template>
  <button
    h-full
    px3
    text-sm font-medium ws-nowrap
    hover="text-$vp-c-brand"
    :class="shareSuccess ? '!text-green-400' : ''"
    @click="copyShareLink()"
    :disabled="shareSuccess"
  >
  <Transition
    mode="out-in"
    enter-active-class="transition-all duration-250 ease-out"
    leave-active-class="transition-all duration-250 ease-out"
    enter-from-class="transform translate-y-30px opacity-0"
    leave-to-class="transform translate-y--30px opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
  >
    <span v-if="shareSuccess" flex items-center space-x-1>
      <span class="i-octicon:checkbox-16" />
      <span>复制成功</span>
    </span>
    <span v-else flex items-center space-x-1>
      <span class="i-octicon:share-16" />
      <span>分享此页</span>
    </span>
  </Transition>
  </button>
</template>
