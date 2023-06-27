/**
  这是 .env 文件的 typescript 类型定义
 */
interface ImportMetaEnv {
  VITE_OPENAI_API_SECRET: string
  VITE_OPENAI_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
