---
tags:
  - 开发/语言/TypeScript
  - 开发/前端/Vite
  - 开发/前端/Vue
  - 开发/前端/Vue/Vue3
  - 开发/Monorepo
  - 开发/Nodejs/TypeScript
  - 开发/Nodejs/Vite
---

# TypeScript 遭遇 `Cannot write file ... because it would overwrite input file.`

## 背景

搭建 [[Nolebase|Nólëbase]] 插件的 Monorepo 的过程中，在配置好 `vue-tsc --declaration --emitDeclarationOnly` 命令来输出类型定义的时候遇到了一个奇怪的问题：

```shell
❯ nr
✔ script to run › build

> @nolebase/vitepress-plugin-highlight-targeted-heading@1.3.0 build ~/Git/nolebase/integrations/packages/vitepress-plugin-highlight-targeted-heading
> vite build && vue-tsc --declaration --emitDeclarationOnly

vite v5.0.2 building for production...
✓ 7 modules transformed.
dist/style.css  0.80 kB │ gzip: 0.28 kB
dist/index.js   2.34 kB │ gzip: 1.04 kB
dist/style.css      0.80 kB │ gzip: 0.28 kB
dist/index.umd.cjs  2.08 kB │ gzip: 1.04 kB
✓ built in 216ms
error TS5055: Cannot write file '~/Git/nolebase/integrations/packages/vitepress-plugin-highlight-targeted-heading/src/components/HighlightTargetedHeading.vue.d.ts' because it would overwrite input file.

Found 1 error.

 ELIFECYCLE  Command failed with exit code 1.
```

## 原因

### `tsconfig.json` 中缺失了必要的 `outDir` 配置

在默认情况下，`outDir` 将会指向 `.`，从而导致第一次运行 `vue-tsc --declaration --emitDeclarationOnly` 的时候在每个我们的源代码文件的旁边都输出一个 `.d.ts`（类型声明文件），我们可以通过下面的命令来验证这样的问题：

```shell
❯ cat tsconfig.json

{
  "extends": "../../tsconfig.json",
  "exclude": [
    "**/dist/**",
    "./uno.config.ts",
    "./vite.config.ts"
  ],
  "include": [
    "**/*.ts",
    "**/*.d.ts",
    "**/*.vue",
    "**/*.tsx"
  ],
  "compilerOptions": {
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "noImplicitAny": false,
    "declaration": false,
    "composite": false
  },
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

可以发现我们的 `tsconfig.json` 中缺失了 `outDir` 相关字段的配置，接下来我们看看是不是当前目录下确实出现了一些其他的不该出现的 `.d.ts` 文件：

```shell
❯ tree
.
├── README.md
├── dist
│   ├── index.js
│   ├── index.umd.cjs
│   └── style.css
├── node_modules
│   ├── @vueuse
│   └── vue -> ../../../node_modules/.pnpm/vue@3.3.8_typescript@5.3.2/node_modules/vue
├── package.json
├── src
│   ├── components
│   │   ├── HighlightTargetedHeading.vue
│   │   └── HighlightTargetedHeading.vue.d.ts # [!code focus]
│   ├── index.d.ts # [!code focus]
│   └── index.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

第一次构建成功之后输出了 `index.d.ts`，是成功且不报错的，但是第二次执行构建和类型输出的时候就会报错，是因为 `tsc` 再次读取了 `.d.ts` 文件然后尝试再次递归输出新的 `.d.ts` 文件，于是就出现了上面说的

```shell
error TS5055: Cannot write file '~/Git/nolebase/integrations/packages/vitepress-plugin-highlight-targeted-heading/src/components/HighlightTargetedHeading.vue.d.ts' because it would overwrite input file.
```

的报错。

## 解决方案

我们根据自己的构建需求，在 `tsconfig.json` 中添加类型输出目录即可：

```json
{
  "extends": "../../tsconfig.json",
  "exclude": [
    "**/dist/**",
    "./uno.config.ts",
    "./vite.config.ts"
  ],
  "include": [
    "**/*.ts",
    "**/*.d.ts",
    "**/*.vue",
    "**/*.tsx"
  ],
  "compilerOptions": {
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "noImplicitAny": false,
    "declaration": false,
    "composite": false,
    "outDir": "./dist" // [!code ++]
  },
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

`"outDir": "./dist"` 的值需要根据 `package.json` 的 `types` 字段的注解和 `exports` 下属的各个导出的模块的 `types` 注解来确定，比如我的 `package.json` 是这样书写的：

```json
{
  // 其他部分省略
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts", // [!code focus]
      "import": "./dist/index.js",
      "require": "./dist/index.umd.cjs"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "main": "./dist/index.umd.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts", // [!code focus]
  "files": [
    "dist",
    "package.json",
    "README.md"
  ]
  // 其他部分省略
}
```

这个时候再次运行 `vue-tsc --declaration --emitDeclarationOnly` 就不会再报错了，再次观察 `dist` 目录的时候也能发现类型正确地输出了。

## 参考资料

- [TypeScript error: Cannot write file 'index.d.ts' because it would overwrite input file - Stack Overflow](https://stackoverflow.com/questions/37013665/typescript-error-cannot-write-file-index-d-ts-because-it-would-overwrite-inpu)
- [visual studio - Typescript error "Cannot write file ... because it would overwrite input file." - Stack Overflow](https://stackoverflow.com/questions/42609768/typescript-error-cannot-write-file-because-it-would-overwrite-input-file)
- [anu/packages/anu-vue/tsconfig.json at main · jd-solanki/anu](https://github.com/jd-solanki/anu/blob/main/packages/anu-vue/tsconfig.json)
- [element-plus/internal/build/build.config.ts at dev · element-plus/element-plus](https://github.com/element-plus/element-plus/blob/dev/internal/build/build.config.ts)
