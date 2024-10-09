<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png" alt="Nólëbase|nolebase">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
  <a href="http://creativecommons.org/licenses/by-sa/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg" /></a>
</p>

<p align="center">
  <a href="https://discord.gg/XuNFDcDZGj"><img src="https://img.shields.io/discord/1229292283657195520?style=flat&logo=discord&logoColor=white&label=Discord&color=%23404eed" /></a>
  <a href="https://t.me/+6WKTUzWijf1kMzFl"><img src="https://img.shields.io/badge/Group-%235AA9E6?logo=telegram&label=Telegram" /></a>
</p>

<p align="center">
  <a href="https://github.com/nolebase/sponsors">
    <img src="https://cdn.jsdelivr.net/gh/nolebase/sponsors/sponsors.svg"/>
  </a>
</p>

<p align="center">
  这个项目得以实现，要感谢所有支持我们的 Sponsors<br>
  你也可以访问我们的 Sponsors 页面来加入其中：
</p>
<p align="center">
<a href="https://github.com/sponsors/LittleSound"><img src="https://img.shields.io/static/v1?label=Sponsor&message=Rizumu&logo=GitHub&color=%23fe8e86&style=for-the-badge" /></a>
<a href="https://github.com/sponsors/nekomeowww"><img src="https://img.shields.io/static/v1?label=Sponsor&message=Neko&logo=GitHub&color=%23fe8e86&style=for-the-badge" /></a>
</p>


# Nólëbase

**记录回忆，知识和畅想的地方**

以 Nólëbase 为名，读作 nole-base，取自意为「知识」的昆雅语 nólë 和意为「基础」的英文 base，即「知识库」

## 特点

- 🌈 多样的主题和内容：
  - 本知识库和所生成的页面均由创作者们维护，涉及到生活中各方面知识和内容，也不乏我们的回忆和畅想。
- 📃 皆为 Markdown：
  - 使用 Markdown 和 Markdown 拓展语法编写和记录笔记，每一个页面都是 Markdown 文件。
- 🚀 由 [VitePress](https://vitepress.dev) 驱动：
  - 基于 Vite 的强大静态文档页面生成器，它生成了我们知识库的页面，提供了简单易用的主题和工具。
- 🗃 由 [Obsidian](https://obsidian.md) 驱动：
  - 强大的知识库管理工具，支持花样繁多的插件和拓展，让知识管理变得更加简单。

## 想要自己部署和在本地启动强大的 Nólëbase 知识库，或者自己拥有一份？

很高兴你对 [Nólëbase](https://nolebase.ayaka.io) 感兴趣！

### 背景介绍

首先 [Nólëbase](https://nolebase.ayaka.io) 是完全可以在本地无网络环境的情况下使用的！你可以在跟随[如何下载到本地](#如何下载到本地)的指引下载或者克隆之后使用 [Obsidian](https://obsidian.md) 和 [Logseq](https://logseq.com/) 这样的知识库软件打开，也可以用 [Typora](https://typora.io/) 这样的 Markdown 编辑器打开进行浏览和编辑，这意味着即便你不具备任何的编程技能，也可以使用或者借鉴我们的知识库分类和组织方法。

在继续之前，也请容许我介绍一下对项目所使用的技术和架构。

和其他的由 [Hexo](https://hexo.io) 驱动和生成的博客和静态网站类似，[Nólëbase](https://nolebase.ayaka.io) 其实使用了名为 [VitePress](https://vitepress.dev) 的静态生成器来驱动和生成网站，像 [VitePress](https://vitepress.dev) 这样的静态生成器支持在 Markdown 文件中使用 [Vue](https://vuejs.org/) 组件来嵌入并增强文档的阅读和使用体验。而 [VitePress](https://vitepress.dev) 和 [Vue](https://vuejs.org/) 是 [Node.js](https://nodejs.org/en) 生态的一部分，他们都属于「前端技术」的一部分。

在运行和部署上，我们使用免费的 [Netlify](https://www.netlify.com/) 来提供网站的托管，使用 [GitHub Actions](https://github.com/features/actions)（你可以理解一个将会在每次我们将笔记和知识库内容更新到 GitHub 仓库之后会自动触发的一个自动化工作）把我们的笔记和知识库内容自动构建和部署到 [Netlify](https://www.netlify.com/) 上。

### 等等，这和 [Obsidian Publish](https://obsidian.md/publish) 有什么不同

好问题，作为 [Obsidian](https://obsidian.md) 的用户，你可能会知道他们开发团队提供了一套专门用于发布 [Obsidian](https://obsidian.md) 中的笔记的服务「[Obsidian Publish](https://obsidian.md/publish)」，如果你不知道也不要紧，可以把 [Obsidian Publish](https://obsidian.md/publish) 理解为一个可以帮助你将 [Obsidian](https://obsidian.md) 中的笔记发布到互联网上帮助你分享和提供搜索引擎优化（SEO）的服务。

#### 为什么不用 [Obsidian Publish](https://obsidian.md/publish)

1. [Obsidian Publish](https://obsidian.md/publish) 需要付费才能使用，但是实际上对于静态网站而言，就像先前介绍的那样，我们可以白嫖一些像是 [GitHub Pages](https://pages.github.com/)，[Netlify](https://www.netlify.com/)，[Vercel](https://vercel.com/) 和 [Cloudflare Pages](https://pages.cloudflare.com/) 这样现成的基础设施帮忙托管；
2. [Obsidian Publish](https://obsidian.md/publish) 部署后的静态页面是没有 [Obsidian](https://obsidian.md) 自带的插件功能的支持的，这意味着很多作者（或者你）在本地撰写好的使用了插件支持的语法的文档在本地使用 [Obsidian](https://obsidian.md) 渲染和预览的时候是能正常工作的，然而将会在 [Obsidian Publish](https://obsidian.md/publish) 部署和托管后变得不可用。这是非常关键的一个问题，很多用户（包括我在内）都非常依赖于 [Obsidian](https://obsidian.md) 的插件生态，这样的问题现在还没有足够好的解决方案，但我们创建了名为 [Nólëbase 集成](https://github.com/nolebase/integrations) 这样的项目来尝试提供一些常见的和常用的 [Obsidian](https://obsidian.md) 插件在 [VitePress](https://vitepress.dev) 和 [Vue](https://vuejs.org/) 的环境下的替代方案，这样的替代方案虽然不能完全替代 [Obsidian](https://obsidian.md) 插件的功能，但是可以在一定程度上提供类似的功能，你也可以关注一下；

#### 在什么情况下你应该使用 [Obsidian Publish](https://obsidian.md/publish)

[Obsidian Publish](https://obsidian.md/publish) 也有它自己的优点：

1. 寻找适合 [VitePress](https://vitepress.dev) 的 Markdown 插件是困难和复杂的，[Obsidian Publish](https://obsidian.md/publish) 天然支持所有 [Obsidian](https://obsidian.md) 原生支持的语法和插件，这意味着你不需要额外的调研和试错工作就可以将你在本地使用 [Obsidian](https://obsidian.md) 撰写的文档直接部署到互联网上；
2. 运行和部署像是 [Nólëbase](https://nolebase.ayaka.io) 这样的静态网站对于不具备任何的代码和编程知识的作者难度大得多，但是 [Obsidian Publish](https://obsidian.md/publish) 不需要任何的代码和编程知识，也无需关心任何的技术细节，和 Notion 的分享一样，你只需要点击几下就可以完成部署；

所以如果你没有掌握必备的编程技能，或者你不想花时间和精力去学习和掌握这些技能，那么 [Obsidian Publish](https://obsidian.md/publish) 可能是一个更好的选择。

### 所以，也有别人在这样使用 [VitePress](https://vitepress.dev) 作为可部署的知识库吗？

哦，当然！

这里有一些我们在 GitHub 上发现的使用 [VitePress](https://vitepress.dev) 作为知识库的项目：

- [Charles7c/charles7c.github.io：基于 VitePress 构建的个人知识库/博客。](https://github.com/Charles7c/charles7c.github.io)
- [Lercel/Vision](https://github.com/Lercel/Vision)
- [maomao1996/mm-notes: 茂茂物语: 各种笔记记录（想到啥写啥系列）](https://github.com/maomao1996/mm-notes)
- [ATQQ/sugar-blog: ✍️📚我写博客的地方🤪🤪🤪记录随笔与学习笔记](https://github.com/ATQQ/sugar-blog)
- [chodocs/chodocs: 一站式前端内容网站，包括学习路线、知识体系。](https://github.com/chodocs/chodocs)
- [cangzihan/knolls-think-tank: 基于Nólëbase的个人知识库](https://github.com/cangzihan/knolls-think-tank)
- [CHENJIAMIAN/Blog: Obsidian笔记库 | 我的笔记分bei享fen | 根据GitHub工作流自动构建vitepress博客 | http://chenjiamian.me/Blog/](https://github.com/CHENJIAMIAN/Blog)
- [realzhengyiming/YiMingBlog: a... new blog again, hhhh](https://github.com/realzhengyiming/YiMingBlog)
- [nikitavoloboev/knowledge: Everything I know](https://github.com/nikitavoloboev/knowledge?tab=readme-ov-file)
- [senup/wiki: wiki](https://github.com/senup/wiki?tab=readme-ov-file)
- [kkoscielniak/digital-garden: 🥦 Things I know](https://github.com/kkoscielniak/digital-garden)
- [Merlin-Chest/Blog: 个人学习及知识记录整理](https://github.com/Merlin-Chest/Blog)
- [selwynpolit/d9book: Drupal at your Fingertips: A developers quick reference for Drupal 9 and 10](https://github.com/selwynpolit/d9book)
- [vlad196/ALTRegularGnomeWiki: открытое сообщество пользователей операционной системы ALT Regular Gnome](https://github.com/vlad196/ALTRegularGnomeWiki)
- [shalotts/shalodoc](https://github.com/shalotts/shalodoc)
- [vdriasworld/manual: Vdrias World! 游玩指南](https://github.com/vdriasworld/manual)
- [LittleSkinCommspt/manual-ng: under dev](https://github.com/LittleSkinCommspt/manual-ng)
- [LemonNekoGH/zhishiku: 也许会有知识](https://github.com/LemonNekoGH/zhishiku)

### 如何下载到本地

废话不多说，我们开始下载的步骤吧。

如果你没有熟练掌握诸如命令行和 [Git](https://git-scm.com/) 的使用，我们在这里建议你使用 [GitHub](https://github.com) 本身提供的 [下载源代码存档](https://docs.github.com/zh/repositories/working-with-files/using-files/downloading-source-code-archives) 功能直接从 [GitHub](https://github.com) 站点上下载打包好的压缩文件包，然后到本地解压后查看和使用。

如果你掌握了命令行和 [Git](https://git-scm.com/) 的使用，可以通过下面的命令克隆项目仓库到名为 `nolebase` 的目录中：

```shell
git clone https://github.com/nolebase/nolebase
```

#### 使用的是 Windows 吗

> [!IMPORTANT]
> 如果你使用的是 [Git for Windows](https://gitforwindows.org/) ，那么可能会在执行上述命令时，遇到类似这样的报错：
>
> ```PowerShell
> PS D:\> git clone https://github.com/nolebase/nolebase
> ...
> error: invalid path 'x: xxx.md'
> fatal: unable to checkout working tree
> warning: Clone succeeded, but checkout failed.
> You can inspect what was checked out with 'git status'
> and retry with 'git restore --source=HEAD :/'
> ```
>
> 这是 [Git for Windows](https://gitforwindows.org/) 的默认配置导致的[问题](https://github.com/git-for-windows/git/issues/2777)。
>
> 你可以在命令行窗口中输入下面的命令来解决这个问题：
> ```PowerShell
> git config --global core.protectNTFS false
> ```

### 如何使用、运行或者部署

完成了下载了吗？很好，恭喜你已经完成了很艰难的一步！

正如先前介绍过

> [Nólëbase](https://nolebase.ayaka.io) 其实使用了名为 [VitePress](https://vitepress.dev) 的静态生成器来驱动和生成网站。
>
> 而 [VitePress](https://vitepress.dev) 和 [Vue](https://vuejs.org/) 是 [Node.js](https://nodejs.org/en) 生态的一部分，他们都属于「前端技术」的一部分。

因此你需要先配置一下 [Node.js](https://nodejs.org/en) 和添加和管理 [VitePress](https://vitepress.dev) 和 [Vue](https://vuejs.org/) 作为底层管理依赖的工具 [pnpm](https://pnpm.io/) 。

#### 准备工作

所以你在继续下面的步骤之前，需要完成另外的两件事情：

1. 安装和配置 [Node.js](https://nodejs.org/en)，要校验 Node.js 是否安装成功，可以通过打开命令行窗口然后运行 `node --version` 和 `npm --version` 来查看是否会报错；
2. 安装和配置 [pnpm](https://pnpm.io/)，要校验 pnpm 是否安装成功，可以通过打开命令行窗口然后运行 `pnpm --version`。

##### 使用的是 Windows 吗

> [!IMPORTANT]
> 如果你使用的是 Windows，可以选择通过 [`scoop`](https://scoop.sh/)（一款在 Windows 上面向开发者可用的包管理器）来安装这些必要的工具，这样可以避免在 Windows 上面安装和配置这些工具的时候遇到的一些问题。
>
> 想要快速安装 Scoop，使用 <kbd data-windows-keyboard-key="windows">Win</kbd> + <kbd>Q</kbd> 打开搜索，键入「Powershell」之后点击搜索结果中的蓝色方块，然后输入下面的命令：
>
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
>
> ```powershell
> Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
> ```

使用 <kbd data-windows-keyboard-key="windows">Win</kbd> + <kbd>Q</kbd> 打开搜索，键入「Powershell」之后点击搜索结果中的蓝色方块，然后输入下面的命令：

```shell
node --version
```

如果你看到了类似于 `vxx.xx.xx` 的版本号（比如 `v21.1.0`），那么恭喜你，你已经成功安装了 [Node.js](https://nodejs.org/en)。

如果没有看到，那么你需要先安装 [Node.js](https://nodejs.org/en)。如果采用了上面提到的 `scoop`，可以使用下面的命令来安装 [Node.js](https://nodejs.org/en)：

```shell
scoop install nodejs
```

> [!IMPORTANT]
> 由于我们使用到了 `sharp` 这个依赖来生成图片，而 `sharp` 依赖需要使用到 Python，因此你也需要安装 Python。
>
> 如果采用了上面提到的 `scoop`，可以使用下面的命令来安装 Python：
> ```shell
> scoop install python
> ```

接下来让我们来安装 [pnpm](https://pnpm.io/)，使用下面的命令来安装 [pnpm](https://pnpm.io/)：

```shell
corepack enable
```

```shell
corepack prepare pnpm@latest --activate
```

首次安装完成之后需要运行一下

```shell
pnpm setup
```

来配置 [pnpm](https://pnpm.io/) 所需要的目录，完成之后需要关掉当前的 Powershell 窗口，然后重新打开一个新的 Powershell 窗口。

差不多准备好啦，让我们前往 Nólëbase 知识库所在的目录吧，使用下面的命令来前往 Nólëbase 知识库所在的目录：

```shell
cd
```

先多输入一个空格，然后接下来打开文件管理器，把你解压缩完成的 Nólëbase 知识库文件夹拖拽到运行窗口中，最后按下 <kbd data-keyboard-key="enter">回车</kbd> 键，就可以告诉 Powershell 前往 Nólëbase 知识库所在的目录了。

##### 使用的是 macOS 吗

> [!IMPORTANT]
> 如果你使用的是 macOS，可以选择通过 [`Homebrew`](https://brew.sh/)（一款在 macOS 上面向开发者可用的包管理器）来安装这些必要的工具，这样可以避免在 macOS 上面安装和配置这些工具的时候遇到的一些问题。
>
> 想要快速安装 Homebrew，使用 <kbd data-macos-keyboard-key="command">command</kbd> + <kbd data-keyboard-key="space">空格</kbd> 打开「终端」应用，然后输入下面的命令：
> ```shell
> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
> ```

使用 <kbd data-macos-keyboard-key="command">command</kbd> + <kbd data-keyboard-key="space">空格</kbd> 打开「终端」应用，然后输入下面的命令：

```shell
node --version
```

如果你看到了类似于 `vxx.xx.xx` 的版本号（比如 `v21.1.0`），那么恭喜你，你已经成功安装了 [Node.js](https://nodejs.org/en)。

如果没有看到，那么你需要先安装 [Node.js](https://nodejs.org/en)。如果采用了上面提到的 `Homebrew`，可以使用下面的命令来安装 [Node.js](https://nodejs.org/en)：

```shell
brew install node
```

接下来让我们来安装 [pnpm](https://pnpm.io/)，使用下面的命令来安装 [pnpm](https://pnpm.io/)：

```shell
corepack enable
```

```shell
corepack prepare pnpm@latest --activate
```

首次安装完成之后需要运行一下

```shell
pnpm setup
```

来配置 [pnpm](https://pnpm.io/) 所需要的目录，完成之后需要关掉当前的终端窗口，然后重新打开一个新的终端窗口。

差不多准备好啦，让我们前往 Nólëbase 知识库所在的目录吧，使用下面的命令来前往 Nólëbase 知识库所在的目录：

```shell
cd
```

先多输入一个空格，然后接下来打开访达，把你解压缩完成的 Nólëbase 知识库文件夹拖拽到终端窗口中，最后按下 <kbd data-keyboard-key="return">return</kbd> 键，就可以告诉终端前往 Nólëbase 知识库所在的目录了。

##### 使用的是 Linux 吗

你既然已经在使用 Linux 了，应该知道怎么做了吧？

#### 安装依赖和运行开发服务器

在倒数第二步中，我们需要安装依赖，这样 [VitePress](https://vitepress.dev) 和 [Vue](https://vuejs.org/) 就会被下载到本地的 [Nólëbase](https://nolebase.ayaka.io) 目录/文件夹下的 `node_modules` 目录/文件夹下了：

```shell
pnpm install
```

接下来你可以直接运行下面的命令开启一个本地运行的 [Nólëbase](https://nolebase.ayaka.io) 知识库前端服务器，通常而言我们称之为「开发服务器」，用这个服务器，可以通过浏览器在本地直接访问渲染完成的页面：

```shell
pnpm docs:dev
```

就像这样

```shell
$ pnpm docs:dev

  vitepress v1.0.0-rc.20

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

当你看到上面的字样的时候，就可以前往本地的 [http://localhost:5173](http://localhost:5173) 查看渲染完成的页面了：

在这个本地运行的 Nólëbase 知识库前端服务器启动的情况下，你针对所有 Markdown 文件、样式文件、配置文件的变更，都会实时响应到网页中。

如果刷新不及时或者更新有异常，也可以试试看使用 <kbd data-macos-keyboard-key="command">command</kbd> + <kbd>R</kbd> （macOS 系统） <kbd>Ctrl</kbd> + <kbd>R</kbd> （Windows 和 Linux 系统）快捷键强制刷新。

#### 构建并渲染为可部署的静态页面

想要部署页面，首先先确保你已经执行过了[安装依赖和运行开发服务器](#安装依赖和运行开发服务器) 的步骤，一般而言构建和渲染的时候可能遇到的问题都可以在运行开发服务器的时候发现，接下来你只需要一个简单的命令就能完成构建了：

```shell
pnpm docs:build
```

构建完成后，渲染出来的 HTML 和各种资源将会被存储在 `.vitepress/dist` 目录下面，你可以通过上传 `.vitepress/dist` 目录来完成 Nólëbase 知识库的部署。

#### 使用静态网站托管服务部署页面

Nólëbase 知识库使用 VitePress 静态生成器来驱动和生成静态页面，因此可以部署到下列已知的优质**静态网站托管服务**：

- [Netlify](https://netlify.com/)
- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [AWS Amplify](https://aws.amazon.com/cn/amplify/)
- [Render](https://render.com/)
- [GitHub Pages](https://pages.github.com/)
- [Azure Static Web](https://azure.microsoft.com/en-us/products/app-service/static)

> [!NOTE]
> 与自建单独的虚拟机并使用类似于 Nginx，或者对象存储（OSS）相比，使用上述提及的静态网站托管服务时，**可以省略手动部署流程**，也**无需花费时间与精力维护单独的网站服务器**。
>
> 让我们把精力放在写作上吧！❤️

请参照 VitePress 官方文档的[部署 VitePress 站点](https://vitepress.dev/zh/guide/deploy)页面文档所介绍的内容，通过主流的静态网站托管服务来部署自己的 Nólëbase 知识库。

##### 使用 Vercel 部署

通过 Vercel 的部署很简单, 在 Vercel 中选择项目后, 修改构建的「Output directory」为 `.vitepress/dist` 就行了（默认是 `./dist`）

如果你选择了用 Vercel 部署，可以关闭本仓库自带的 Netlify 自带的 CI/CD builder workflow：

1. 在 GitHub 仓库页面顶部找到「Actions」
2. 点选 Netlify 对应的 workflow
3. 在 GitHub Actions workflow 详情右上角找到 3 个点，点选 Disable workflow

## 配置 Obsidian

### 关于图片链接

如果你的 Markdown 中的图片链接没有在当前文件所在目录下，会解析出错，最终无法在 VitePress 中正确渲染。

> [!WARNING]
> 如果没有这个问题，请忽略本章节！

解决方法：采用推荐的 Obsidian 设置。

在 Obsidian 中：

- 前往设置（Setting）
- 在左侧找到「文件与链接（Files and links）」，点选
- 在其中的「内部链接类型（New link format）」选项中，选择「基于当前笔记的相对路径（Relative path to file）」

配置完成后将会是这样的效果：

![](/public/obsidian-screenshot-1.png)

> [!TIP]
> 默认情况下，Nólëbase 自带的「[双向链接插件](https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/markdown-it-bi-directional-links/)」将会自动处理所有 Obsidian 支持的 `[[link]]` 和 `![[link]]` 双向链接。
> 但有的情况下，你可能会想要避免出现和使用双向链接，比如：
>
> 1. 保持兼容性的 Markdown : 可以让文档也能在 Github 中被正确渲染（ Github 无法解析`[[双链]]`）
>
> 如果你不喜欢，可以通过下面的配置进行自定义配置：
>
> - Use `[[Wikilinks]]` => False
> - 在其中的「附件默认存放路径（Default location for new attachments）」选项中，选择「在当前文件所在文件夹下指定的子文件夹中（In subfolder under current folder）」
> - 在「子文件夹名称（Subfolder name）」一栏中，配置值为 `assets`
>
> 配置完成后将会是这样的效果：
>
> ![](/public/obsidian-screenshot-2.png)
>
> 这样配置也会有以下几个好处：
> - 方便迁移文件和图片，你只需要把图片文件夹和 Markdown 文件一起复制就行（如果是全部汇总在某个文件夹下，以后复制比较麻烦）

> [!TIP]
> 对于已有的笔记和图片链接，你可以考虑使用 Obsidian 插件[obsidian-link-converter](https://github.com/ozntel/obsidian-link-converter) 来帮你做自动的转换 `[[wikilink]]` 为 relative_path 的 Markdown link

## 集成 Giscus 评论功能

Giscus 利用了 [GitHub Discussions](https://docs.github.com/en/discussions) 实现的评论系统，让访客借助 GitHub 在你的网站上留下评论！（你的GitHub 仓库必须是公开的才能使用 Giscus）。

具体配置方法：

1. 访问 [Giscus 网站](https://giscus.app/zh-CN)
2. 参考网站上的说明，一步步操作，最终你会得到 Giscus 的配置信息
3. 在 Nólëbase 仓库下执行，

```sh
pnpm add -D vitepress-plugin-comment-with-giscus
```

4. 在 `./.vitepress/theme/components` 下新建一个 `Gitcus.ts` 的文件，并填充为下面的内容：

```ts
import { defineComponent, toRefs } from 'vue'
import giscusTalk from 'vitepress-plugin-comment-with-giscus/lib/giscus'
import { useData, useRoute } from 'vitepress'

export default defineComponent({
  setup() {
    // Get frontmatter and route
    const { frontmatter } = toRefs(useData())
    const route = useRoute()

    // Obtain configuration from: https://giscus.app/
    giscusTalk({
      repo: 'your github repository',
      repoId: 'your repo Id',
      category: 'your category', // default: `General`
      categoryId: 'your category id',
      mapping: 'pathname', // default: `pathname`
      inputPosition: 'top', // default: `top`
      lang: 'zh-CN', // default: `zh-CN`
      // i18n setting (Note: This configuration will override the default language set by lang)
      // Configured as an object with key-value pairs inside:
      // [your i18n configuration name]: [corresponds to the language pack name in Giscus]
      locales: {
        'zh-Hans': 'zh-CN',
        'en-US': 'en',
      },
      homePageShowComment: false, // Whether to display the comment area on the homepage, the default is false
      lightTheme: 'light', // default: `light`
      darkTheme: 'transparent_dark', // default: `transparent_dark`
      // ...
    }, {
      frontmatter,
      route,
    },
    // Whether to activate the comment area on all pages.
    // The default is true, which means enabled, this parameter can be ignored;
    // If it is false, it means it is not enabled.
    // You can use `comment: true` preface to enable it separately on the page.
    true)
  },
})
```

5. 在 `./vitepress/theme/index.ts` 中将我们上一步创建的 `gitcus.ts` 引入（注意更改部分内容为你第一步得到的配置信息哦），演示如下，具体请参考[插件文档](https://github.com/T-miracle/vitepress-plugin-comment-with-giscus)

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

// 其他配置.......

import Gitcus from './components/gitcus' // [!code ++]

const ExtendedTheme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-top': () => [
        h(NolebaseHighlightTargetedHeading),
        h(Gitcus),  // [!code ++]
      ],
      'doc-footer-before': () => [
        h(DocFooter),
      ],
      'nav-bar-content-after': () => [
        h(NolebaseEnhancedReadabilitiesMenu),
        h(Share),
      ],
      'nav-screen-content-after': () => [
        h(NolebaseEnhancedReadabilitiesScreenMenu),
      ],
    })
  },
  // 结束！好了，上面的内容就是你需要修改的部分，其他维持原样就好啦
}

export default ExtendedTheme
```

> [!NOTE]
> 在 Markdown 文件上添加下面的属性，可以决定是否在当前文章中开启评论
>
> ```
> ---
> comment: true
> ---
> ```

## 知识库编写须知

由于很多时候需要重复编排和调整文档的结构和注解以适应和满足使用者的阅读习惯或是文档叙述的内容需求，以及说明使用的 API 的版本号和破坏性更新说明，可能会导致在以上或是更多外部因素的影响下导致文档结构混乱不一，查询造成困难，或是索引和快速查阅文档的时候需要花费大量的时间和精力去了解文章结构和内容，以下提出了一个较为完善（任需商议）的知识库结构、使用规范的提案。
该提案包含：

1. 对文档结构的说明
2. 对文档的版本控制和兼容性注释
3. 关于如何正确使用脚注和参考资料给文档提供更多相关联信息的指南

### 结构

一般，文档需要有以下结构（按照从上到下排列）：

1. 使用一级标题的**标题**（一般为文件名本身）
	1. 使用正文格式的**作者**
	2. *非强制* · 标签（如果有的话，方便搜索和索引）
	4. *非强制* · 使用五级标题的 **文档兼容性** （仅针对涉及了不同软件或是 API 的指南和操作文档）
	5. *非强制* · 使用五级标题的 **Archive 信息** （仅针对 **📃 Archives** 目录下的所有文档）
2. *非强制* · 使用二级标题的**概述**（仅针对超大型文档，提供概述可以提高检索和快速查阅的效率）
3. 使用二级标题的**目录**
4. 使用二级标题的**说明**
5. 有完善标题分级和注解、甚至是脚注的**正文**
6. *非强制* · 使用二级标题的**延伸阅读**或是**参考资料**（仅针对如果引用了文章、网页的绝大多数内容；没有实际引用到文档内但是值得参考和阅读的文章、网页的内容；查阅资料时遇到的（非强关联，但是也有关系的）相关内容时需要添加）
7. *非强制* · 不使用标题的**脚注**（如果有的话，通过使用脚注插件 Footnote shortcut（参考[🔌 知识库插件列表](%F0%9F%94%8C%20%E7%9F%A5%E8%AF%86%E5%BA%93%E6%8F%92%E4%BB%B6%E5%88%97%E8%A1%A8.md) ）创建，可以避免过多的引用和链接出现在正文里）

每一项的内容和说明都会在下方的文档中一一说明

### 解释

#### 标题

标题一般为文件名本身，方便查询和记忆。

##### Markdown 撰写示例

```markdown
# 标题
```

#### 标签

标签可以使得文档易于检索和串联在一起，也可以使得在阅读一篇文档之后再去阅读相关标签的其他文档时变得方便检索和寻找。

过去 [Nólëbase](https://nolebase.ayaka.io) 使用 [Obsidian](https://obsidian.md) 的[基本标签](https://help.obsidian.md/Editing+and+formatting/Tags) `#标签内容`（我叫它「裸标签」）来对页面进行标记，但是存在于正文的裸标签并不利于程序化的处理，而且在实践[结构化标签（或者嵌套标签）](https://help.obsidian.md/Editing+and+formatting/Tags#Nested+tags)的时候存在于正文中的结构化标签将会在一定程度上混淆视听，为了能够更好的集成到 [Nólëbase 集成](https://nolebase-integrations.ayaka.io) 来全自动处理标签，优化整体阅读体验，现在 [Nólëbase](https://nolebase.ayaka.io) 在 [Obsidian](https://obsidian.md) 所兼容的 Markdown 的 [frontmatter](https://github.com/jonschlinkert/gray-matter) 添加使用 `tags` 字段来配置页面的标签。

##### Markdown 撰写示例

```
---
tags:
 - 根层级
 - 另一个根层级/某个标签
---
```

#### Archive 信息

##### 说明

对于存放在 **📃 Archives** 目录中的文件（包括文档、静态资源），都应添加 **Archive 信息** 显著的标记其来源，创建时间、以及原始资源的信息等内容。
这将确保我们在 Archive 文档或静态资源时可以保留其作者的信息和采集信息，方便未来的资料查证、资料溯源等变成可能。
另外需要注意的是，我们在进行 Archive 采集时都应该注意创作者所使用的共享协议，如果不允许转载，则不能进行 Archive 采集。

##### 字段

###### Archive 自

该字段填写该文档或者静态资源的采集来源，该字段的值需要匹配该文档或者静态资源于 **📃 Archives** 目录和分类目录下的目录名称。
比如放置在 `📃 Archives/📖 文章/Medium` 目录下的文档或者静态资源都应该在该字段中填写 `Medium`，如果可能，可以使用链接来撰写来源，这在多种同名来源的情况下将会变得非常有用。

当前支持的来源有：

| Archive 自 |
| ---- |
| 微信公众号文章 |
| CSDN |
| ADDitude |
| The Verge |
| 知乎 |

###### Archive 创建于

该字段填写该文档或者静态资源的采集时间。

###### Archive 分类

该字段填写该文档或者静态资源的分类该字段的值需要匹配该文档或者静态资源于 **📃 Archives** 目录下的目录名称。
比如放置在 `📃 Archives/📖 文章/Medium` 目录下的文档或者静态资源都应该在该字段中填写 `文章`。

###### 原始作者

该字段填写该文档或者静态资源的原始作者，如果网页没有提供原始作者的信息，比如新闻类、资讯类网站，我们则可以填写采集来源作为该字段的值。

###### 原始地址

该字段填写被采集的文档或是静态资源的原始地址。

###### 原始资源创建时间

该字段填写被采集的文档或是静态资源的原始创建时间。

###### 原始资源更新时间

该字段填写被采集的文档或是静态资源的原始更新时间。如果网页没有提供更新时间，我们则可以填写原始资源创建时间作为该字段的值。

##### Markdown 撰写示例

```markdown
##### Archive 信息

| Archive 自 | Archive 创建于 | 分类 | 原始作者 | 原始地址 | 原始资源创建时间 | 原始资源更新时间 |
| ---------- | ------------ | ---- | ------- | ------- | ------------- | ------------- |
| Medium | 2022-10-29 16:30 | 文章 | 作者 Alpha | [链接](https://example.com) | 2022-10-29 16:30 | 2022-10-29 16:30 |
```

#### 文档兼容性

##### 说明

对于涉及到软件和 API 的讲解和教程文档，应该提供**文档兼容性**部分以详细描述该文档所适配的软件或 API 版本，如此一来就可以方便我们排查破坏性更新或是兼容性导致的软件或 API 与文档中叙述的行为不一致导致的问题。

##### 字段

###### 主体

软件名称，或是 API 名称，如果是 HTTP Restful API，可以填写完整的 URI 地址。

###### 版本号

此处的版本号不需要遵循**文档版本**中提到的语义化版本 2.0.0 规范，应该直接填写应用程序或是 API 的版本。

###### 文档地址（如果有）

如果有对应的文档，则应该把对应版本的文档地址或者是参考文件地址粘贴到该字段中方便查阅。

##### Markdown 撰写示例

```markdown
### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| NebulaGraph | v2.6.1 | https://docs.nebula-graph.com.cn/2.6.1/ |
```

#### 概述

概述仅针对超大型文档，即目录、说明、正文的文本阅读时间超过了 30 分钟的文档。在该部分中需要提供类似于 TL;DR 的精简化说明，可能的情况下可以直接给出结论。

#### 延伸阅读或参考资料

文档所引入的外部资料、外部说明都应该有详细的来源链接可供参考。
对于值得继续阅读以探究文档所讨论的、描述的主题所相关的链接和外部资源，这些链接或是外部资源应当放置到 `## 延伸阅读` 部分。
对于撰写文档所参考的资料，这些链接或是外部资源应当放置到 `## 参考资料` 部分，或是脚注的部分。值得补充的是，对于可能年久失修、来源网站不稳定、审查过强的链接和外部资源，我们可以预先把这些链接和外部资源采集并放置到 **📃 Archives** 中方便引用。

## 声明

本仓库代码以 [MIT License][mit] 协议发布

本仓库除 `笔记/📃 Archives` 目录以外的文档、图片和其引用的资源均以 [CC BY-SA 4.0][cc-by-sa] 协议发布

[mit]: https://opensource.org/licenses/MIT
[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/

### 用 ♥ 撰写
