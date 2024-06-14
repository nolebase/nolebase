import type { Handler, HandlerEvent } from '@netlify/functions'
import fetch from 'node-fetch'
import { plainTargetDomain } from '../../metadata'

const TargetDomain = plainTargetDomain
const FunctionEndpoint = '/.netlify/functions/to'
const HyphenQueryShortURLEndpoint = 'https://api.ayaka.io/hyphen/api/v1/url/short'

interface HyphenResponse<T> {
  data: T
}

interface HyphenQueryShortURLResponse {
  url: string
}

const handler: Handler = async (event: HandlerEvent) => {
  try {
    // 获取短链接
    const shortUrl = event.path
      .replace(FunctionEndpoint, '') // 去除函数路径
      .replace(/^\//, '') // 去除开头的斜杠

    // 获取短链接对应的长链接
    const requestUri = `${HyphenQueryShortURLEndpoint}?url=${shortUrl}`
    const res = await fetch(requestUri)
    // 如果返回了 404 则跳转到 404 页面
    if (res.status === 404) {
      console.warn(`404: ${shortUrl}`)
      return {
        statusCode: 301,
        headers: {
          location: `${TargetDomain}/404`,
        },
      }
    }

    // 获取 JSON
    const resJson
      = (await res.json()) as HyphenResponse<HyphenQueryShortURLResponse>
    // 如果 data.url 为空则跳转到 404 页面
    if (resJson.data.url === '') {
      console.warn(`url is empty: ${resJson.data.url}`)
      return {
        statusCode: 301,
        headers: {
          location: `${TargetDomain}/404`,
        },
      }
    }

    // 转换为 URL 对象
    const url = new URL(resJson.data.url)
    // 如果 host 不是目标域名则跳转到 404 页面
    if (url.host !== TargetDomain) {
      console.warn('target domain mismatch, expect: ', TargetDomain, 'got: ', url.host)
      return {
        statusCode: 301,
        headers: {
          location: `${TargetDomain}/404`,
        },
      }
    }

    // 跳转到目标链接
    return {
      statusCode: 301,
      headers: {
        location: resJson.data.url,
      },
    }
  }
  catch (err) {
    console.error(err)
    // 如果出现错误则返回 502
    return {
      statusCode: 502,
      body: JSON.stringify({
        code: 502,
        message: 'message' in (err as any) ? (err as any).message : String(err),
      }),
    }
  }
}

export { handler }
