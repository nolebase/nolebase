import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import fetch from "node-fetch";

const TargetDomain = 'https://nolebase.ayaka.io';
const FunctionEndpoint = "/.netlify/functions/to";
const HyphenQueryShortURLEndpoint = 'https://api.ayaka.io/hyphen/api/v1/url/short';

interface HyphenResponse<T> {
  data: T;
}

interface HyphenQueryShortURLResponse {
  url: string;
}

const handler: Handler = async (event: HandlerEvent) => {
  try {
    // 获取短链接
    const shortUrl = event.path
      .replace(FunctionEndpoint, "") // 去除函数路径
      .replace(/^\//, ""); // 去除开头的斜杠

    // 获取短链接对应的长链接
    const res = await fetch(
      `${HyphenQueryShortURLEndpoint}?url=${shortUrl}`
    );
    // 如果返回了 404 则跳转到 404 页面
    if (res.status === 404) {
      return {
        statusCode: 301,
        headers: {
          location: `${TargetDomain}/404`,
        },
      };
    }

    // 获取 JSON
    const resJson =
      (await res.json()) as HyphenResponse<HyphenQueryShortURLResponse>;
    // 如果 data.url 为空则跳转到 404 页面
    if (resJson.data.url === "") {
      return {
        statusCode: 301,
        headers: {
          location: `${TargetDomain}/404`,
        },
      };
    }

    // 转换为 URL 对象
    const url = new URL(TargetDomain)
    // 如果 host 不是目标域名则跳转到 404 页面
    if (url.host !== TargetDomain) {
      return {
        statusCode: 301,
        headers: {
          location: `${TargetDomain}/404`,
        },
      };
    }

    // 跳转到目标链接
    return {
      statusCode: 301,
      headers: {
        location: resJson.data.url,
      }
    };
  } catch (err) {
    // 如果出现错误则返回 502
    return {
      statusCode: 502,
      body: JSON.stringify({
        code: 502,
        message: err.message,
      })
    }
  }
};

export { handler };
