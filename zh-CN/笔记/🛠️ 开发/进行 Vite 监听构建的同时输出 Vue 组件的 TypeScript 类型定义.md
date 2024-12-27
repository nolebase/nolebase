---
tags:
  - 开发/前端/Vue
  - 开发/前端/Vue/Vue3
  - 开发/前端/Vite
  - 开发/Nodejs/Vite
  - 开发/Nodejs/TypeScript
  - 开发/Nodejs/npm
---
# 进行 Vite 监听构建的同时输出 Vue 组件的 TypeScript 类型定义

核心是，只需要寻找到一个方式来同时执行 `vite build --watch` 和 `vue-tsx --declaration --emitDeclarationOnly` 这两条命令就好了。

比如使用 [`concurrently`](https://www.npmjs.com/package/concurrently)：

```json
"scripts": {
  "dev": "concurrently \"nr build:watch\" \"nr emit-types\"",
  "emit-types": "vue-tsc --declaration --emitDeclarationOnly",
  "build": "vite build && vue-tsc --declaration --emitDeclarationOnly",
  "build:watch": "vite build --mode development --watch"
},
"dependencies": {
  "concurrently": "^8.2.1" // [!code ++]
}
```

当然，除去 [`concurrently`](https://www.npmjs.com/package/concurrently) 还有很多种方式，在 [`slimeform`](https://github.com/LittleSound/slimeform) 中使用的 [`run-p`](https://www.npmjs.com/package/run-p)，你可以使用 `run-p`，它工作的很好，但 `run-p` 其实有一些古早了，而且好久没有再发布过更新了，上一次发布已经是 7 年前，所以根据喜好和需求来选择就好了。
