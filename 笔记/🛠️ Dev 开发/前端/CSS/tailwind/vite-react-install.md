---
title: 在 Vite - React.js 中安装 Tailwind CSS
author: 刘俊 Ucely; https://tailwindcss.com/docs/guides/vite
---

## 1. 新建 Vite - React.js

如果你还没有建立 Vite 项目，就从创建一个新的项目开始叭。 最常见的方法是使用 [新建 Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

```bash
npm create vite@latest vite-react -- --template react
cd vite-react
```

## 2. 安装 Tailwind CSS

通过 npm 安装 tailwindcss 及其相关的依赖，然后运行 `init` 命令，生成 `tailwind.config.cjs` 和 `postcss.config.cjs`。

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 3. 配置你的模板路径

在 `tailwind.config.cjs` 文件中添加所有模板文件的路径。

```js{3-6}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 4. 在你的CSS中加入Tailwind指令

在你的 `./src/index.css` 文件中为 Tailwind 的每个层添加 `@tailwind` 指令。
Add the @tailwind directives for each of Tailwind’s layers to your ./src/index.css file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 5. 开始你的构建过程

用 `npm run dev` 运行你的构建过程。

```bash
npm run dev
```

## 6. 开始在你的项目中使用Tailwind

开始使用 Tailwind 的工具🔧 `class` （类）来设计你的内容。

```js
import './App.css'

export default function App() {
  return (
    <div className="contents relative h-screen justify-center">
      <div className="text-blue-600 dark:text-sky-400 font-big text-3xl text-center">
        Hello, this is React.js + Tailwind CSS, build by Vite!
      </div>
    </div>
  );
}
```

效果如下：

![image](https://user-images.githubusercontent.com/92929085/216745604-02ab0646-8563-4018-a9c0-0c7a8b052c03.png)

安装完成后的模板项目，我放在 [Ucely/Vite-React.js-TailwindCSS-Template](https://github.com/Ucely/Vite-React.js-TailwindCSS-Template)，欢迎 folk.

后续打算在 Stackblitz、CodeSandBox、Codepen 等上传在线版，敬请期待.
