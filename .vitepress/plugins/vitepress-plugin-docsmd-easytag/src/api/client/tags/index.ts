export async function tagsCanBeGenerated(path: string) {
  const res = await fetch(`/api/v1/tags/generation?${new URLSearchParams({ path })}`)
  if (!res.ok)
    throw new Error(`request failed: ${res.status}`)

  return await res.json()
}

export async function generateNewTagsFromGPT(path: string, existingTags: { content: string }[]) {
  const res = await fetch('/api/v1/tags/generation', {
    method: 'POST',
    body: JSON.stringify({
      path,
      tags: existingTags.map(tag => tag.content),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  try {
    const resJSON = await res.json() as {
      tags: string[]
      error?: string
    }
    if (!res.ok) {
      if (resJSON.error) {
        // eslint-disable-next-line no-console
        console.log(resJSON)
        if (resJSON.error === 'OPENAI_API_SECRET is not set.')
          throw new Error('没有找到 OPENAI_API_SECRET 环境变量，暂时无法自动生成，请在配置 .env 或者主动注入环境变量后再试！')

        throw new Error(resJSON.error)
      }
    }

    return resJSON.tags.map(tag => ({ content: tag }))
  }
  catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export async function saveTags(path: string, tags: { content: string }[]) {
  const res = await fetch('/api/v1/tags', {
    method: 'PUT',
    body: JSON.stringify({
      path,
      tags: tags.map(tag => tag.content),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  try {
    const resJSON = await res.json()
    if (!res.ok) {
      if (resJSON.error)
        throw new Error(resJSON.error)
    }
  }
  catch (err) {
    console.error(err)
    throw new Error(err)
  }
}
