---
tags:
  - 开发/前端
  - 开发/前端/Vue
  - 开发/前端/Vue/Vue3
  - 软件/Obsidian
  - 软件/Obsidian/插件
  - 开源/库/CodeMirror
---
# 让我们一起实现一个 Obsidian Vue 插件！

## 关于 [Nólëbase](https://nolebase.ayaka.io) 和 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/)

[Nólëbase](https://nolebase.ayaka.io) 是我和 @LittleSound 在 2021 年开始用 [[Obsidian]] + Git 管理的知识库，在 2022 年转换成了可以部署和分享的 [[VitePress]] 站点，并且更名为 [Nólëbase](https://nolebase.ayaka.io)。

接下来，我去年的时候发起了 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/) 这个项目，目的是为了抹平 [[Obsidian]] 到类似 Notion 这样的**可分享**知识库之间的界限（中间也写过一些小的想法，你可以在 [[Obsidian、VitePress 以及 Nólëbase 所处的困境]] 中阅读到一部分），给 Obsidian 和 VitePress 带来统一性，然后也许可以推广到 [Nuxt Content](https://content.nuxt.com/)，[Rspress](https://rspress.dev/)，[iles](https://iles.pages.dev/guide/introduction) 还有 [Logseq](https://logseq.com/) 上。

在 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/) 中，我把很多 [[Obsidian]] 特有的能力都用一种特别的方式集成到了 [[VitePress]] 里，并且直接从我们 2021 年就开始的 [Nólëbase | 记录回忆，知识和畅想的地方](https://nolebase.ayaka.io/) 抽离很多可复用的组件作为独立的插件供大家安装，在一年后 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/) 的不同的子插件已经被包括 Vue 社区项目之一 [vue-macros/vue-macros](https://github.com/vue-macros/vue-macros) 、Linux 社区、俄罗斯社区、Minecraft 社区等在内大大小小的 45 个不同的仓库使用。

自从 6 月份开始集成 Plausible.io 获取页面访问计数以来，[Nólëbase](https://nolebase.ayaka.io) 和 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/) 也各自迎来了创纪录的 3w 页面浏览量，每天都在带来更多的用户，真的非常感谢大家！

## 动机

我之前开发过一个 [Obsidina 的 UnoCSS 插件](https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/obsidian-plugin-unocss/)，是通过把 UnoCSS 的 Playground 中展示的 `codeGenerate` 的能力直接挪到 Obsidian 里面实现的，但是一直以来，即便是在集成了 UnoCSS 之后，很多复杂和漂亮的纯 CSS 动画的诸如 [[容器既没有 netstat 和 lsof 也不是 root 时如何排查网络？手动解析 procfs！]] 这样的交互式文档依然需要我大量的手动复制粘贴和重复描述 HTML 元素才能实现，很难组件化或者复用通用的能力。

自从我上周开始使用一些像是 <span class="text-sm px-1 py-0.5 border border-solid border-red-500/30 text-red-400 bg-red-500/20 rounded-lg">Bug</span>，<span class="text-sm px-1 py-0.5 border border-solid border-purple-500/30 text-purple-400 bg-purple-500/20 rounded-lg">Experiment</span> 还有 <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 这样的标签在正文中打标签开始，我就在想，为什么我不能把这些标签做成简单的可复用的组件呢？我也不想去单独写一个 `markdown-it` 或者 `remark` 的插件来单独为这样的标签定制一个语法，就是想要单纯的像往常写 Vue 那样复用组件，是否有可能呢？

在 Obsidian 官方的文档中自己就提出过如何在 Obsidian 中集成和实现 React 和 Svelte（虽然是应用在设置界面上的表单控制和表单校验的），那 Vue 应该也有可能在 Obsidian 的正文视图中直接用到才对。

所以就想做这么个插件来继续 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/) 的哲学：抹平界限。

## 明确需求

现在比较明确的是我们可以在 Obsidian 里面直接用 Vue 去 mount 到一个独立的 dom 上。

已经明确的设计是：

1. 对于 Obsidian 的 Live Editor（所见即所得编辑器）而言
	- [x] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 解析正文（也许是 `this.view.state.doc` 也许不是）（7 月 10 日）
	- [x] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 找到识别为 HTML 的部分（7 月 11 日）
	- [x] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 引入 Vue Compiler 的 template compiler，把模板渲染成 `render` 函数的实现（7 月 11 日）
	- [ ] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> mount `render` 函数到对应的 DOM 上。（7 月 12 日）
	- [ ] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 支持热重载，处理热重载事件
	- [ ] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 读取用户自定义的 Components 目录，遍历编译并支持渲染到 DOM 上
1. 对于 Obsidian 的 Reading Mode（阅读模式）而言
	- [ ] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 用 `@mdit-vue` 的实现，把目标的视图渲染成 Vue 的
	- [ ] <span class="text-sm px-1 py-0.5 border border-solid border-green-500/30 text-green-400 bg-green-500/20 rounded-lg">Feat</span> 支持热重载，处理热重载事件

## 实现之路

### 解析正文

在 Obsidian 暴露和代理的 CodeMirror 的 View 实例中我们可以访问到 `this.view.state` 这个类型为 [`EditorState`](https://codemirror.net/docs/ref/#state.EditorState) 的属性，里面包含的类型为 [`Text`](https://codemirror.net/docs/ref/#state.Text) 的 `.doc`（也就是 `this.view.state.doc`）会包含当前打开的文件的原始数据：

![[obsidian-vue-plugin-screenshot-1.png]]

对应起来是这样的：

![[obsidian-vue-plugin-screenshot-2.png]]

这些都是按行进行处理的，但尚不清楚 `children` 是如何被归类的。

既然是可以获取到纯文本的，我们可以用 `unified.js` 的生态来进行操作，并且保留 AST 结构和相对于原始文件的位置信息（类似于 Source Map 的工作方式）。
### 如何提取和找到 HTML 的部分

既然是 `unified.js` 生态，我们在我们前不久发布的基于大模型开发前端的工具 [Guii.app](https://guii.app) 和 [Nólëbase 集成](https://nolebase-integrations.ayaka.io/pages/zh-CN/) 中都已经大量使用过了，那么接下来安装我们觉得可能会需要的插件就好：

```shell
ni unified remark-parse remark-rehype rehype-raw unist-util-remove hast-util-to-html -D
```

- `remark-parse`：负责解析 `text` 到 `markdown` 为 `mdast`
- `remark-rehype`：负责把 `mdast` 转换到 `hast`
- `remark-raw`：因为 `mdast` 中 HTML 的元素都会被放到 `html` 元素里，而 `mdast` 转换到 `hast` 后未解析的嵌套 token 会被当作 `raw`，我们需要 `rehype-raw` 再次帮忙解析一下
- `unist-util-remove`：负责从 AST 中移除任意满足判断规则的节点，因为期间我们会遇到标题和纯文本，这些信息不重要，用这个工具函数可以解决好
- `hast-util-to-html`：负责把 `hast` 转换成符合 HTML 的 `text` 结果，在所有 AST 插件都处理好之后我们需要还原回纯文本给 Vue compiler 解析。

然后直接开整：

```typescript
import { unified } from 'unified'
import RemarkParse from 'remark-parse'
import RemarkRehype from 'remark-rehype'
import RehypeRaw from 'rehype-raw'
import { remove } from 'unist-util-remove'

// other code...
class VueViewPlugin implements PluginValue {
  // other code...
  async init() {
    await this.waitForViewDOM()
    
	// other code...
	
    const parsedMarkdownAst = await unified() // [!code hl]
      .use(RemarkParse) // [!code hl]
      .use(() => tree => remove(tree, 'heading')) // [!code hl]
      .parse(this.view.state.doc.toString()) // [!code hl]

    const transformedHast = await unified() // [!code hl]
      .use(RemarkRehype, { allowDangerousHtml: true }) // [!code hl]
      .use(() => tree => remove(tree, 'text')) // [!code hl]
      .use(RehypeRaw) // [!code hl]
      .use(() => tree => remove(tree, (node, _, parent) => parent?.type === 'root' && node.type === 'text')) // [!code hl]
      .run(parsedMarkdownAst) // [!code hl]
  }
}

// other code...
```

现在如果我们直接打印 `transformedHast` 的话就可以看到每个 HTML 了。

### 把 HTML 通过 `compileTemplate` 编译为 `render` 函数

> [!NOTE]
> 很感谢 [Vue 3 源代码架构](https://github.com/PsChina/Vue/blob/b157aeb2d7c2eeed4afe1f2ca6015815b38dfefb/Vue3/Readme.md) 的记录，我学到了 `@vue/compiler-sfc`，`@vue/compiler-core` 和 `@vue/compiler-dom` 的关系和工作流。

我之前在 Markdown 正文中塞了一个像模像样的 Vue 组件：

```html
<div :some-prop="'some-value'" :class="[ props.id === 'some' ? 'active' : '' ]">
  <span>ABCD</span>
</div>
```

接下来我们需要通过 `@vue/compiler-sfc` 编译包括上述组件的这些零零散散的 HTML。

方法很简单，我们可以抄一下 [vuejs/repl](https://github.com/vuejs/repl) 的代码：

```typescript
import { compileTemplate } from '@vue/compiler-sfc'
import { toHtml } from 'hast-util-to-html'

// other code...
class VueViewPlugin implements PluginValue {
  // other code...
  async init() {
    await this.waitForViewDOM()
    
	// other code...

    const transformedHast = await unified()
      // other code ...
      .run(parsedMarkdownAst)

	let index = 0 // [!code ++]
    // [!code ++]
    for (const node of transformedHast.children) { // [!code ++]
      index++ // [!code ++]
      // [!code ++]
      // 注意这里用之前说的 `hast-util-to-html` 转换回纯文本 // [!code ++]
      const componentTemplateStr = toHtml(node) // [!code ++]
      // [!code ++]
      const { code, errors } = compileTemplate({ // [!code ++]
        isProd: false, // [!code ++]
        source: componentTemplateStr, // [!code ++]
        filename: `some-${index}`, // [!code ++]
        id: index.toString(), // [!code ++]
      }) // [!code ++]
      if (errors.length) { // [!code ++]
        console.error(errors) // [!code ++]
        throw new Error('Failed to compile template') // [!code ++]
      } // [!code ++]
      // [!code ++]
      // eslint-disable-next-line no-console // [!code ++]
      console.log(code) // [!code ++]
    }
  }
}

// other code...
```

这个时候再次打印我们编译后的代码，就可以看到这样的输出了：

```javascript
import { createElementVNode as _createElementVNode, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("span", null, "ABCD", -1 /* HOISTED */)
const _hoisted_2 = [
  _hoisted_1
]

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", {
    "some-prop": 'some-value',
    class: _normalizeClass([ _ctx.props.id === 'some' ? 'active' : '' ])
  }, [..._hoisted_2], 2 /* CLASS */))
}
```

但是上面的文本都是纯文本的形式返回的，是存在字符串里的字面量，我应该如何正确地让浏览器解析并且跑起来呢？

### evaluate 编译好的 `render` 函数

> [!NOTE]
> 和 Perplexity.ai 相关的讨论： https://www.perplexity.ai/search/if-action-eval-try-if-scriptel-1vwZ54leRriOV_krbh80Ig

比较好玩的方法是：

1. 根据纯文本创建一个类型为 `application/javascript` 的 `Blob`
2. 针对这个 `Blob` 我们创建一个浏览器内可以访问的 ObjectURL
3. 调用 `import(...)` 来直接以 `fetch` 的形式调用代码

实现起来是这样的：

```typescript
// other code...
class VueViewPlugin implements PluginValue {
// other code...
  async init() {
	let firstCode = '' // [!code ++]

    for (const node of transformedHast.children) {
      // compile...

      if (index === 1) // [!code ++]
        firstCode = code // [!code ++]
      } // [!code ++]
    }
    
	// Create a Blob from the render function text // [!code ++]
    const blob = new Blob([firstCode], { type: 'application/javascript' }) // [!code ++]
    const url = URL.createObjectURL(blob) // [!code ++]
    // eslint-disable-next-line no-console // [!code ++]
    console.log(url) // [!code ++]

    const res = await import(url) // [!code ++]
    // eslint-disable-next-line no-console // [!code ++]
    console.log(res) // [!code ++]
  }
}
```

但是如果会发现这样的报错：

```
Uncaught TypeError: Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../".
```

为什么呢，因为浏览器不知道 `vue` 这个模块在哪里。翻了翻代码，想起来我们还有一个最新最热的概念叫 `importMap`，我们可以在正文 DOM 中插入一个 `<script type="importmap">` 元素：

```html
<script type="importmap">
{
	"imports": {
		"vue": "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js"
	}
}
</script>
```

实现起来是这样的：

```typescript
// other code...

class VueViewPlugin implements PluginValue {
  // other code...
  async init() {
    // other code...
  
    const existingImportMapScriptEl = this.view.dom.querySelector('#obsidian-plugin-vue-import-map') // [!code ++]
    if (existingImportMapScriptEl) // [!code ++]
      this.importMapScriptEl = existingImportMapScriptEl as HTMLScriptElement // [!code ++]
    // [!code ++]
    this.importMapScriptEl ||= this.view.dom.createEl('script') // [!code ++]
    this.importMapScriptEl.id = 'obsidian-plugin-vue-import-map' // [!code ++]
    this.importMapScriptEl.type = 'importmap' // [!code ++]
    this.importMapScriptEl.innerHTML = JSON.stringify({ // [!code ++]
      imports: { // [!code ++]
        vue: 'https://unpkg.com/vue@3.4.31/dist/vue.esm-browser.js', // [!code ++]
      }, // [!code ++]
    }, null, 2) // [!code ++]

	// other code...
  }
}
```

但是报错依旧：

```
Uncaught TypeError: Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../".
```

这个时候我想，是不是因为我们现在的实现和 [vue/repl](https://github.com/vuejs/repl) 的实现不同，组件的代码不是在 `<script type="module">` 中执行导致的，为了验证这个想法，我这么操作了一番：

```typescript
// other code...
class VueViewPlugin implements PluginValue {
// other code...
  async init() {
	let firstCode = ''

    for (const node of transformedHast.children) {
      // compile...

      if (index === 1)
        firstCode = code
      }
    }
    
	const someComponentScriptEl = this.view.dom.createEl('script') // [!code ++]
    someComponentScriptEl.type = 'module' // [!code ++]
    someComponentScriptEl.innerHTML = `const firstCode = \`${firstCode}\` // [!code ++]
    // Create a Blob from the render function text // [!code ++]
    const blob = new Blob([firstCode], { type: 'application/javascript' }) // [!code ++]
    const url = URL.createObjectURL(blob) // [!code ++]
    // eslint-disable-next-line no-console // [!code ++]
    console.log(url) // [!code ++]
    // [!code ++]
    const res = await import(url)  // [!code ++]
    // eslint-disable-next-line no-console // [!code ++]
    console.log(res)` // [!code ++]
  }
}
```

但是报错依旧：

```
Uncaught TypeError: Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../".
```

这个时候就很奇怪了，但是网络上还没有搜索到如何排查 `<script type="importmap">` 的解答，我也确实没有看到在 Obsidian 的开发者窗口的 Network Tab 下面有请求 Vue 模块，也许 Obsidian 当前使用的 Chromium 内核就是还没有支持 `importmap` 的版本。

与此同时我想起来了我之前制作过的 [Obsidian UnoCSS Plugin](https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/obsidian-plugin-unocss/)，里面也会用到 `import` 语句去导入 `unocss`：

在这段代码中会把模块通过 `Function` 构造器 evaluate 为有效的 ESM 模块：

```typescript
const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor
const nativeImport = new Function('a', 'return import(a);')

// other code...

const importUnocssRegex = /import\s(.*?)\sfrom\s*(['"])unocss\2/g
const importObjectRegex = /import\s*(\{[\s\S]*?\})\s*from\s*(['"])([\w@/-]+)\2/g
const importDefaultRegex = /import\s(.*?)\sfrom\s*(['"])([\w@/-]+)\2/g
const exportDefaultRegex = /export default /
const importRegex = /\bimport\s*\(/g

// other code...

export async function evaluateUserConfig<U = UserConfig>(configCode: string): Promise<U | undefined> {
  const transformedCode = configCode
    .replace(importUnocssRegex, 'const $1 = await __import("unocss");')
    .replace(importObjectRegex, 'const $1 = await __import("$3");')
    .replace(importDefaultRegex, 'const $1 = (await __import("$3")).default;')
    .replace(exportDefaultRegex, 'return ')
    .replace(importRegex, '__import(')

  const wrappedDynamicImport = new AsyncFunction('__import', transformedCode)
  return await wrappedDynamicImport(nativeImport)
}
```

> [完整源代码](https://github.com/nolebase/obsidian-plugin-unocss/blob/32e050cb73f7d5e1e8c989087d61e351667e4a67/src/config.ts)。

不过如果我们直接这样使用是不行的，因为编译的代码：

```typescript
import { createElementVNode as _createElementVNode, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"
```

中含有 `as` 标识符，如果我们转换成 `const` 赋值操作的话实际上是无效的，当然也好解决：

```typescript
const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor
const nativeImport = new Function('a', 'return import(a);')

// other code...

const importUnocssRegex = /import\s(.*?)\sfrom\s*(['"])unocss\2/g
const importObjectRegex = /import\s*(\{[\s\S]*?\})\s*from\s*(['"])([\w@/-]+)\2/g
const importDefaultRegex = /import\s(.*?)\sfrom\s*(['"])([\w@/-]+)\2/g
const exportDefaultRegex = /export default /
const importRegex = /\bimport\s*\(/g  
// [!code ++]
// New regex to handle `as` to `:` transformation // [!code ++]
const importAsRegex = /(\w+)\s+as\s+(\w+)/g // [!code ++]

// other code...

export async function evaluateUserConfig<U = UserConfig>(configCode: string): Promise<U | undefined> { // [!code --]
export async function evaluateAnyModule<T = any>(configCode: string): Promise<T | undefined> { // [!code ++]
  const transformedCode = configCode
    .replace(importUnocssRegex, 'const $1 = await __import("unocss");')
    .replace(importObjectRegex, (match, p1, p2, p3) => { // [!code ++]
      // Replace `as` with `:` within the destructuring assignment // [!code ++]
      const transformedP1 = p1.replace(importAsRegex, '$1: $2') // [!code ++]
      return `const {${transformedP1}} = await __import("${p3}");` // [!code ++]
    }) // [!code ++]
    .replace(importDefaultRegex, 'const $1 = (await __import("$3")).default;')
    .replace(exportDefaultRegex, 'return ')
    .replace(importRegex, '__import(')

  const wrappedDynamicImport = new AsyncFunction('__import', transformedCode)
  return await wrappedDynamicImport(nativeImport)
}
```

然后把我们之前的代码改成这样：

```typescript
import { evaluateAnyModule } from './import' // [!code ++]

// other code...
class VueViewPlugin implements PluginValue {
// other code...
  async init() {
	let firstCode = ''

    for (const node of transformedHast.children) {
      // compile...

      if (index === 1)
        firstCode = code
      }
    }
    
	const res = await evaluateAnyModule<() => void>(code) // [!code ++]
	console.log(res) // [!code ++]
  }
}
```

不过这样直接用的话还有点问题，会出现这个报错：

```
Uncaught (in promise) SyntaxError: Unexpected token 'export'
```

这是因为现在 evaluate 之后不可以用 `export` 语句，我们需要找 `compilerTemplate` 转换成 `function` 模式：

```typescript
// other code...
class VueViewPlugin implements PluginValue {
// other code...
  async init() {
    // other code...
    for (const node of transformedHast.children) {
      // other code...
      const { code, errors } = compileTemplate({
        isProd: false,
        source: componentTemplateStr,
        filename: `some-${index}`,
        id: index.toString(),
        compilerOptions: { // [!code ++]
          mode: 'function', // [!code ++]
        }, // [!code ++]
      })
      if (errors.length) {
        console.error(errors)
        throw new Error('Failed to compile template')
      }

      const res = await evaluateAnyModule<() => void>(code)
      if (!res)
        continue

      renderFunctions.push(res)
    }
  }
}
```

转换成 `function` 模式之后，获得的编译后结果是这样的：

```javascript
const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue

const _hoisted_1 = /*#__PURE__*/_createElementVNode("span", { class: "text-3xl i-svg-spinners:bouncing-ball" }, null, -1 /* HOISTED */)
const _hoisted_2 = /*#__PURE__*/_createElementVNode("span", { class: "text-3xl i-svg-spinners:blocks-shuffle-3" }, null, -1 /* HOISTED */)
const _hoisted_3 = [
  _hoisted_1,
  _hoisted_2
]

return function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", null, [..._hoisted_3]))
}
```

我们发现它不再使用 `"vue"` 作为外部模块进行导入，而是使用全局变量 `Vue`，这个时候我们还需要在 `globalThis` 上（不用 `window` 是因为不知道 Obsidian 会不会在 `window` 上加黑魔法或者破坏性更新）添加 `Vue`：

```typescript
import * as Vue from 'vue' // [!code ++]

// other code...
class VueViewPlugin implements PluginValue {
  // other code...
  async init() {
    await this.waitForViewDOM()
  
    const anyGlobalThis = globalThis as any // [!code ++]
    anyGlobalThis.Vue = Vue // [!code ++]
  }
}
```

然后就能在 Obsidian 的开发者工具的 Console 上看到返回的函数了！

```
ƒ render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [..._hoisted_3]))
}
```

这个时候我们只需要把每个 render 函数都放到 `h` 渲染函数中即可：

```typescript
// other code...
class VueViewPlugin implements PluginValue {
// other code...
  async init() {
	let index = 0
	let firstCode = '' // [!code --]
	const renderFunctions: Array<() => void> = [] // [!code ++]

    for (const node of transformedHast.children) {
      // compile...
      
	  if (index === 1) // [!code --]
        firstCode = code // [!code --]
      } // [!code --]

	  const res = await evaluateAnyModule<() => void>(code) // [!code ++]
      if (!res) // [!code ++]
        continue // [!code ++]

      renderFunctions.push(res) // [!code ++]
    }
    
	const res = await evaluateAnyModule<() => void>(code) // [!code --]
	console.log(res) // [!code --]

	this.vueInstance?.unmount()

    const comp = defineComponent({
      setup() {
        return () => [
          h('div', { class: 'obsidian-plugin-vue' }, renderFunctions.map(fn => fn())), // [!code ++]
        ]
      },
    })

    this.vueInstance = createApp(comp)
    this.vueInstance!.mount(vueDom)
  }
}
```

![[obsidian-vue-plugin-screenshot-3.png]]

当前的效果：

![[obsidian-vue-plugin.mov]]

### （在做）如何把每个独立的组件的 `render` 函数映射到 `this.view.dom` 中各自的行里面呢？

首先，如果我们直接把 Vue mount 到 Obsidian 的 CodeMirror 实例渲染的 `.cm-sizer` 的 Markdown 正文 DOM 里面会出很多问题。

在之前的实验中，如果我们直接 mount 进去到 `this.view.dom.querySelector('.cm-scroller .cm-sizer .cm-content').createDiv()` 之后会导致 CodeMirror 的编辑器实例觉得这个是一个文本内容，会反序列化回去当作文档的一部分直接存到 `this.view.state.doc` 里面。

也许考虑一下是否可以用 Vue 的 Teleport，把转换出来的 `render` 函数搭配 `defineComponent` 和 `Teleport` 传送到 HTML 文档内部对应的子 DOM 上，比如这样：

```typescript
// other code...

class VueViewPlugin implements Plugin {
  // // other code...
  async init() {
	await this.waitForViewDOM()
	// other code...
	
	this.vueInstance?.unmount()

	const parsedHtmlBlocks = this.parseHtmlBlocks(this.view)
	const renderers = this.compileTemplates(parsedHtmlBlocks)
	const calculatedChildDoms = this.calculateChildDom(parsedHtmlBlocks, renderers)
  
    const comp = defineComponent({
      setup() {
        return () => calculatedChildDoms.map((item) => h('Teleport', { to: `${item.class}` }, item.render))
      },
    })

	this.vueInstance = createApp(comp)
	this.vueInstance!.mount(vueDom)
  }
}

// other code...
```

然后我们在 `calculatedChildDoms` 把包含 AST 位置信息的 `parsedHtmlBlocks` 和包含了 Vue 渲染函数实现的 `renderers` 计算求解并映射到 `this.view.dom.querySelector('.cm-scroller .cm-sizer .cm-content')` 中的对应的 DOM 上，每次都会为映射之后的 DOM 创建一个内嵌的新的 div，然后用 `Teleport` 把渲染好的元素放进去。

### （在做）如何支持热重载？

> 热重载是一个比较棘手的话题，在制作这个插件的时候我其实对于热重载的了解和理解仅局限于直接通过 Vite 提供的 [`import.meta.hot.accept`](https://vitejs.dev/guide/api-hmr.html#hot-accept-cb) 和[服务端到客户端的通信 API](https://vitejs.dev/guide/api-plugin.html#server-to-client) 。
>
> 要了解 Vite 的热重载是如何实现的，我们可以在 [How Does Vite Work - A Comparison to webpack · Harlan Wilton](https://harlanzw.com/blog/how-the-heck-does-vite-work) 学习一波。

但是我们可以先用在 Nuxt DevTools 中已经集成好的 Anthony Fu 制作的 [Inspect](https://github.com/antfu-collective/vite-plugin-inspect) 插件的能力去观察一下热重载的客户端代码是如何注入的。随便找一个现成的 Nuxt 应用，启动它，我们会发现，对于一个 Nuxt 应用而言，作为入点的 `app.vue` 会被渲染成这样的结构：

```typescript
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "app",
  setup(__props, { expose: __expose }) {
    __expose();
    useHead({
      title: appName
    });
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});

import { resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "/_nuxt/node_modules/.cache/vite/client/deps/vue.js?v=460962bb";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  // other compiled vue render function implementations...
}

// other parts of the code...

_sfc_main.__hmrId = "938b83b0"; // [!code focus]
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main); // [!code focus]
import.meta.hot.accept((mod) => { // [!code focus]
  if (!mod) // [!code focus]
    return; // [!code focus]
  const { default: updated, _rerender_only } = mod; // [!code focus]
  if (_rerender_only) { // [!code focus]
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render); // [!code focus]
  } else { // [!code focus]
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated); // [!code focus]
  } // [!code focus]
}); // [!code focus]
```

如果直接观察 Inspector 左边的 Transforms 我们会发现，这部分 `__VUE_HMR_RUNTIME__` 的代码是在 `vite:vue` 的流水线中被变换和插入的，这个时候我们理解了，这些代码都是在现在在 Vite 的世界中广泛使用的 `unplugin-vue` 或者说 `vitejs/plugin-vue` 底层所依赖的插件中实现的。

如果我们直接去看 [unplugin-vue 的源代码](https://github.com/unplugin/unplugin-vue/blob/9eab0b6454a77c526b81977a03014753dc53aa0e/src/core/main.ts#L141-L168)中我们会看到：

```typescript
// HMR
if (
  devServer &&
  devServer.config.server.hmr !== false &&
  !ssr &&
  !isProduction
) {
  output.push(
    `_sfc_main.__hmrId = ${JSON.stringify(descriptor.id)}`,
    `typeof __VUE_HMR_RUNTIME__ !== 'undefined' && ` + // [!code focus]
    `__VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)`, // [!code focus]
  )
  // check if the template is the only thing that changed
  if (prevDescriptor && isOnlyTemplateChanged(prevDescriptor, descriptor)) {
    output.push(`export const _rerender_only = true`)
  }
  output.push(
    `import.meta.hot.accept(mod => {`,
    `  if (!mod) return`,
    `  const { default: updated, _rerender_only } = mod`,
    `  if (_rerender_only) {`,
    `    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)`,
    `  } else {`,
    `    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)`,
    `  }`,
    `})`,
  )
}
```

但这只是解答了我们部分的疑惑，因为 `__VUE_HMR_RUNTIME__` 是一个包含了函数方法的对象，这个对象不在 `unplugin-vue` 中实现，而是在别的地方实现的。

这里要感谢小音 @LittleSound，她带我直接去搜索了 Vue 的源代码，然后找到了这个代码片段：[Vue 的源代码里](https://github.com/vuejs/core/blob/0ac0f2e338f6f8f0bea7237db539c68bfafb88ae/packages/runtime-core/src/hmr.ts#L30-L36)，它长这样：

```typescript
// Expose the HMR runtime on the global object
// This makes it entirely tree-shakable without polluting the exports and makes
// it easier to be used in toolings like vue-loader
// Note: for a component to be eligible for HMR it also needs the __hmrId option
// to be set so that its instances can be registered / removed.
if (__DEV__) { // [!code hl]
  getGlobalThis().__VUE_HMR_RUNTIME__ = {
    createRecord: tryWrap(createRecord),
    rerender: tryWrap(rerender),
    reload: tryWrap(reload),
  } as HMRRuntime
}
```

所以我们只需要让我们的 `globalThis` 中包括一个可以被求解（evaluate）为真值的 `__DEV__` 就好了。因为我们的 Obsidian Vue 插件是用 `unbuild` 打包的，而 `unbuild` 底层是依赖的 `rollup` 和 `esbuild`，对于 transpile JavaScript 代码的 `esbuild` 我们可以在 `unbuild` 的 `build.config.ts` 中包括这样的配置即可：

```typescript
export default defineBuildConfig({
  // other configs...
  rollup: {
    esbuild: {
      format: 'cjs',
      define: {
        __DEV__: 'true', // [!code ++]
      },
    },
	// other configs...
  },
})
```

这个时候在 Obsidian 的插件中，我们直接打印 `globalThis.__VUE_HMR_RUNTIME__` 就能看到 Vue 帮忙注入的对象和函数方法了。