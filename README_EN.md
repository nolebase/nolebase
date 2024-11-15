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
  Thanks to all our Sponsors, this project has been made possible.<br>
  You can also visit the Sponsors page below to join them:
</p>
<p align="center">
<a href="https://github.com/sponsors/LittleSound"><img src="https://img.shields.io/static/v1?label=Sponsor&message=Rizumu&logo=GitHub&color=%23fe8e86&style=for-the-badge" /></a>
<a href="https://github.com/sponsors/nekomeowww"><img src="https://img.shields.io/static/v1?label=Sponsor&message=Neko&logo=GitHub&color=%23fe8e86&style=for-the-badge" /></a>
</p>


# Nólëbase

**A place to record memories, knowledge and ideas**

The name Nólëbase, pronounced as nole-base, comes from the Quenya word nólë, which means "knowledge", and the English word base, which means "foundation", i.e. "knowledge base".

## Features

- 🌈 Diverse Topics and Content:
  - This knowledge base and its pages are maintained by contributors, covering a wide range of knowledge and content from daily life, as well as out memories and thoughts.

- 📃 Everything is Markdown:
  - Notes are written in Markdown and its extended syntax, with each page being a Markdown file.

- 🚀 Powered by [VitePress](https://vitepress.dev):
  - A powerful static site generator based on Vite, which creates the pages of our knowledge base. It offers easy-to-use themes and tools.

- 🗃 Powered by [Obsidian](https://obsidian.md): 
  - A robust knowledge base management tool that support a wide range of extensions and plugin, making knowledge management much simpler.

## Want to Deploy Nólëbase Locally, or Have Your Own Copy?

We're thrilled that you're interested in [Nólëbase](https://nolebase.ayaka.io)!

### Background Information


First, [Nólëbase](https://nolebase.ayaka.io) is fully functional in offline environments without a network connection! You can follow the guide [How to Download to Your Computer](#how-to-download-to-your-computer) to download or clone this repository and open it using knowledge base tools like [Obsidian](https://obsidian.md) or [Logseq](https://logseq.com/) locally. Alternatively, you can also browse or edit the contents locally using Markdown editors like [Typora](https://typora.io/), which means that even if you have no programming skills, you can still use or draw inspiration from our methods of categorizing and organizing knowledge.

Before we proceed, allow me to give an introduction to the technologies and architecture used in this project.

Similar to other blogs and static website generators like [Hexo](https://hexo.io), [Nólëbase](https://nolebase.ayaka.io) is powered by a static site generator [VitePress](https://vitepress.dev). Tools like [VitePress](https://vitepress.dev) support embedding [Vue](https://vuejs.org/) components directly into Markdown files to enhance the reading experience. Both [VitePress](https://vitepress.dev) and [Vue](https://vuejs.org/) are part of the [Node.js](https://nodejs.org/en) ecosystem, which belongs to the broader category of "frontend technologies."

For hosting and deployment, we use the free service [Netlify](https://www.netlify.com/) to host the website. Meanwhile, [GitHub Actions](https://github.com/features/actions) (an automated workflow triggered whenever we update our notes and content in the GitHub repository) automatically builds and deploys our notes and knowledge base to [Netlify](https://www.netlify.com/).

### Wait, How is This Different from [Obsidian Publish](https://obsidian.md/publish)?

Good question! As an [Obsidian](https://obsidian.md) user, maybe you are aware that they provide a service called [Obsidian Publish](https://obsidian.md/publish), which is designed to help users publish their notes from [Obsidian](https://obsidian.md). If you are not familiar with it, it's fine to think of [Obsidian Publish](https://obsidian.md/publish) as a tool that allows you to share your notes online while also enabling search engine optimization (SEO).

#### Why Not Use [Obsidian Publish](https://obsidian.md/publish)?

1. **[Obsidian Publish](https://obsidian.md/publish) is a paid service.** However, for static websites, as previously mentioned, we can utilize free hosting services like [GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/) and [Cloudflare Pages](https://pages.cloudflare.com/), which provide free, ready-to-use infrastructure.

2. **[Obsidian Publish](https://obsidian.md/publish) does not support [Obsidian](https://obsidian.md)'s built-in plugins.** The static pages deployed through [Obsidian Publish](https://obsidian.md/publish) lack support for [Obsidian](https://obsidian.md)'s built-in plugin functionalities. This means that many documents written locally using plugin-supported syntax will render and preview correctly in [Obsidian](https://obsidian.md) but may become unusable once deployed via [Obsidian Publish](https://obsidian.md/publish). This is a critical issue because many users (myself included) heavily rely on [Obsidian](https://obsidian.md)'s plugin ecosystem. Unfortunately, this problem doesn’t have a perfect solution yet. However, we've created a project called [Nólëbase Integrations](https://github.com/nolebase/integrations) to provide alternatives for common and widely used [Obsidian](https://obsidian.md) plugins in the [VitePress](https://vitepress.dev) and [Vue](https://vuejs.org/) environment. While these alternatives can't fully replicate the functionality of [Obsidian](https://obsidian.md) plugins, they offer similar features to some extent. You might want to check it out!

#### When Should You Use [Obsidian Publish](https://obsidian.md/publish)

[Obsidian Publish](https://obsidian.md/publish) has its own advantages:

1. It can be challenging to find suitable Markdown plugins for [VitePress](https://vitepress.dev). [Obsidian Publish](https://obsidian.md/publish) supports all syntax and plugins that [Obsidian](https://obsidian.md) supports natively. This means you can deploy the documents you write in [Obsidian](https://obsidian.md) directly online without additional research or trial and error.

2. Deploying and Running a static website like [Nólëbase](https://nolebase.ayaka.io) can be much more difficult for authors without coding knowledge. However, [Obsidian Publish](https://obsidian.md/publish) requires no coding skills, and you don’t need to worry about technical details. Similar to sharing in Notion, deployment is as simple as a few clicks.

So if you don't have the necessary coding skills or don't want to invest time in learning them, [Obsidian Publish](https://obsidian.md/publish) might be a better choice for you.

### So, are there others using [VitePress](https://vitepress.dev) as a deployable knowledge base?

Absolutely!

Here are some projects we found on GitHub that use [VitePress](https://vitepress.dev) as a knowledge base:

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

### How to Download to Your Computer

Let's skip the chatter and dive into the steps for downloading.

If you are not familiar with using tools like the command line or [Git](https://git-scm.com/), we recommend using the [Download Source Code Archive](https://docs.github.com/zh/repositories/working-with-files/using-files/downloading-source-code-archives) feature provided by [GitHub](https://github.com). This allows you to directly download a packaged zip file from [GitHub](https://github.com) website, which you can extract locally for viewing and use

If you're comfortable with the command line and [Git](https://git-scm.com/), you can clone the project repository into a directory named `nolebase` using the following command: 

```shell
git clone https://github.com/nolebase/nolebase
```

#### For Windows User

> [!IMPORTANT]
> If you are using [Git for Windows](https://gitforwindows.org/), you may see an error like this when executing the command mentioned above: 
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
> This issue occurs due to the default configuration of [Git for Windows](https://gitforwindows.org/), as detailed in [this issue](https://github.com/git-for-windows/git/issues/2777).
>
> You can solve this by entering the following command in your terminal:
> ```PowerShell
> git config --global core.protectNTFS false
> ```

### How to Use, Run, or Deploy

Finished downloading? Great! Congratulations on completing one of the hardest steps!

As previously mentioned:

> [Nólëbase](https://nolebase.ayaka.io) is powered by a static site generator [VitePress](https://vitepress.dev).
>
> Both [VitePress](https://vitepress.dev) and [Vue](https://vuejs.org/) are part of the [Node.js](https://nodejs.org/en) ecosystem, which belongs to the broader category of "frontend technologies."

Therefore, you need to set up [Node.js](https://nodejs.org/en) and use a dependency management tool, [pnpm](https://pnpm.io/), to install and manage [VitePress](https://vitepress.dev) and [Vue](https://vuejs.org/) as the underlying dependencies.

#### Preparation

Before proceeding with the next steps, you need to complete the following two tasks:

1. Install and configure [Node.js](https://nodejs.org/en), To verify that Node.js is installed successfully, open a terminal and run `node --version` and `npm --version`. If no errors are shown, the installation is successful.
2. Install and configure [pnpm](https://pnpm.io/), To verify that pnpm is installed successfully, open a terminal and run `pnpm --version`.

##### For Windows User

> [!IMPORTANT]
> If you're using Windows, you can use [`scoop`](https://scoop.sh/) (a package manager designed for developers on Windows) to install the necessary tools. This can help you avoid some common issues when installing and configuring these tools on Windows.
>
> To quickly install Scoop, press <kbd data-windows-keyboard-key="windows">Win</kbd> + <kbd>Q</kbd> to open the search bar, type "Powershell", and click the blue icon in the search results. Then, enter the following commands:
>
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
>
> ```powershell
> Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
> ```

Press <kbd data-windows-keyboard-key="windows">Win</kbd> + <kbd>Q</kbd> to open the search bar, type "Powershell", and click the blue icon in the search results. Then, enter the following commands:

```shell
node --version
```

If you see a version number like vxx.xx.xx (e.g., v21.1.0), congratulations! You have successfully installed [Node.js](https://nodejs.org/en).

If not, you’ll need to install [Node.js](https://nodejs.org/en) first. If you’re using the `scoop` tool mentioned above, you can install [Node.js](https://nodejs.org/en) by running the following command:

```shell
scoop install nodejs
```

> [!IMPORTANT]
> Since we use the `sharp` dependency for image generation, which requires Python, you will also need to install Python.
>
> If you’re using the `scoop` tool mentioned above, you can install Python by running the following command: 
> ```shell
> scoop install python
> ```

Next, let's install [pnpm](https://pnpm.io/). Use the following command to install [pnpm](https://pnpm.io/): 

```shell
corepack enable
```

```shell
corepack prepare pnpm@latest --activate
```

After installing for the first time, you need to run:

```shell
pnpm setup
```

to set up the directories for [pnpm](https://pnpm.io/). Once completed, close the current PowerShell window and open a new one.

You're almost ready! Now, let's navigate to the directory where the Nólëbase knowledge base is located. Use the following command to move to the directory:

```shell
cd
```

Add an extra space, then open File Explorer and drag the extracted Nólëbase knowledge base folder into the terminal window. Finally, press the <kbd data-keyboard-key="enter">Enter</kbd> key to let PowerShell navigate to the directory of the Nólëbase knowledge base.

##### For macOS User

> [!IMPORTANT]
> If you are using macOS, you can choose to install these necessary tools via [`Homebrew`](https://brew.sh/) (a package manager available for developers on macOS). This can help you avoid some issues when installing and configuring these tools on macOS.
>
> To quickly install Homebrew, press <kbd data-macos-keyboard-key="command">command</kbd> + <kbd data-keyboard-key="space">space</kbd> to open the "Terminal" app, then enter the following command:
> ```shell
> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
> ```

Press <kbd data-macos-keyboard-key="command">command</kbd> + <kbd data-keyboard-key="space">space</kbd> to open the "Terminal" app, then enter the following command:

```shell
node --version
```

If you see a version number like vxx.xx.xx (e.g., v21.1.0), congratulations! You have successfully installed [Node.js](https://nodejs.org/en).

If you do not see this, you need to install [Node.js](https://nodejs.org/en) first. If you are using `Homebrew` as mentioned above, you can install [Node.js](https://nodejs.org/en) with the following command:

```shell
brew install node
```

Next, let’s install [pnpm](https://pnpm.io/)，Use the following commands to install [pnpm](https://pnpm.io/)：

```shell
corepack enable
```

```shell
corepack prepare pnpm@latest --activate
```

After installing for the first time, you need to run:

```shell
pnpm setup
```

to set up the directories for [pnpm](https://pnpm.io/). Once completed, close the current terminal window and open a new one.

Almost ready! Let’s navigate to the directory of the Nólëbase knowledge base. Use the following command to go to the directory of the Nólëbase knowledge base:

```shell
cd
```

Add an extra space, then open Finder. Drag the unzipped Nólëbase knowledge base folder into the terminal window, and then press <kbd data-keyboard-key="return">return</kbd> key to tell the terminal to go to the directory of the Nólëbase knowledge base.

##### For Linux User

Since you're already using Linux, you must know what to do, right?

#### Installing Dependencies and Running the Development Server

In the second-to-last step, we need to install the dependencies, so that [VitePress](https://vitepress.dev) and [Vue](https://vuejs.org/) are downloaded to the `node_modules` directory within the local [Nólëbase](https://nolebase.ayaka.io) directory.

```shell
pnpm install
```

Next, you can directly run the following command to start a locally hosted [Nólëbase](https://nolebase.ayaka.io) knowledge base frontend server. Typically, we refer to this as a "development server." With this server, you can use a browser to access the rendered pages locally:

```shell
pnpm docs:dev
```

Just like this: 

```shell
$ pnpm docs:dev

  vitepress v1.0.0-rc.20

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Once you see the message above, you can go to [http://localhost:5173](http://localhost:5173) locally to view the rendered page.

With the locally running Nólëbase knowledge base frontend server active, any changes you make to Markdown files, style files, or configuration files will be reflected in real time on the webpage.

If the refresh is delayed or there are any update issues, you can also try to press <kbd data-macos-keyboard-key="command">command</kbd> + <kbd>R</kbd> (For macOS) <kbd>Ctrl</kbd> + <kbd>R</kbd> （For Windows and Linux）to force a refresh.

#### Build and Render as Deployable Static Pages

To deploy the pages, first make sure you have already completed the steps for [Installing Dependencies and Running the Development Server](#installing-dependencies-and-running-the-development-server). Typically, any issues that might occur during the build and render process can be discovered when running the development server. After that, you can complete the build with a simple command:

```shell
pnpm docs:build
```

After the build is completed, the rendered HTML and various resources will be stored in the `.vitepress/dist` directory, You can deploy the Nólëbase knowledge base by uploading the `.vitepress/dist` directory.

#### Deploying Pages Using Static Website Hosting Services

Nólëbase knowledge base uses the VitePress static website generator to drive and generate static pages, making it possible for deployment to the following well-known **static website hosting services**: 

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
