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
  - This knowledge base and its pages are maintained by contributors, covering a wide range of knowledge and content from daily life, as well as our memories and thoughts.
- 📃 Everything is Markdown:
  - Notes are written in Markdown and its extended syntax, with each page being a Markdown file.
- 🚀 Powered by [VitePress](https://vitepress.dev):
  - A powerful static site generator based on Vite, which creates the pages of our knowledge base. It offers easy-to-use themes and tools.
- 🗃 Powered by [Obsidian](https://obsidian.md): 
  - A robust knowledge base management tool that supports a wide range of extensions and plugins, making knowledge management much simpler.

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

2. Deploying and running a static website like [Nólëbase](https://nolebase.ayaka.io) can be much more difficult for authors without coding knowledge. However, [Obsidian Publish](https://obsidian.md/publish) requires no coding skills, and you don’t need to worry about technical details. Similar to sharing in Notion, deployment is as simple as a few clicks.

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

Next, let’s install [pnpm](https://pnpm.io/). Use the following commands to install [pnpm](https://pnpm.io/):

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

If the refresh is delayed or there are any update issues, you can also try to press <kbd data-macos-keyboard-key="command">command</kbd> + <kbd>R</kbd> (For macOS) <kbd>Ctrl</kbd> + <kbd>R</kbd> (For Windows and Linux)to force a refresh.

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
> Compared to setting up your own virtual machine and using something like Nginx, or object storage (OSS), using the static website hosting services mentioned above **can eliminates the need for manual deployment processes**, and **saves your time and effort of maintaining a separate web server.**
>
> Let's focus our energy on writing! ❤️

Please refer to the [Deploy Your VitePress Site](https://vitepress.dev/guide/deploy) page in the official VitePress documentation to learn how to deploy your own Nólëbase knowledge base using popular static website hosting services.

##### Deploy on Vercel

Deploying on Vercel is quite simple. After selecting your project in Vercel, change the build "Output directory" to `.vitepress/dist` (it is `./dist` by default)

If you choose to deploy on Vercel, you can disable the Netlify CI/CD builder workflow included in this repository:

1. Find "Actions" at the top of the GitHub repository page
2. Select the workflow corresponding to Netlify
3. In the GitHub Actions workflow details, click on the three dots in the top right corner and select "Disable workflow"

## Configuring Obsidian

### About Image Links

If the image links in your Markdown are not located within the same directory as the current file, they will not parse correctly, which will ultimately prevent them from being rendered properly in VitePress.

> [!WARNING]
> If you don't have this issue, you can ignore this section!

Solution: Use the recommended Obsidian settings below.

In Obsidian: 

- Go to Settings
- On the left, find "Files and Links" and select it
- In the "New Link Format" option, choose "Relative Path to File"

After completing the configuration, it should look like this:

![](/public/obsidian-screenshot-1-EN.png)

> [!TIP]
> By default, the [Bi-Directional Links (for markdown-it)](https://nolebase-integrations.ayaka.io/pages/en/integrations/markdown-it-bi-directional-links/) included with Nólëbase will automatically handle all [[link]] and ![[link]] bi-directional links supported by Obsidian.
> However, there are situations where you might want to avoid the appearance or usage of bi-directional links, such as:
>
> 1. Compatibility in Markdown: This allows the document to be properly rendered on GitHub (since GitHub cannot parse `[[wikilinks]]`).
>
> If you don’t like this, you can customize the configuration as follows:
>
> - Use `[[Wikilinks]]` => False
> - In the "Default location for new attachments" option, select "In subfolder under current folder."
> - In the "Subfolder name" field, set the value to `assets`.
>
> After completing the configuration, it should look like this:
>
> ![](/public/obsidian-screenshot-2-EN.png)
>
> This configuration has several advantages:
> - Easier file and image migration: You only need to copy the image folder along with the Markdown file (if they are all grouped in one folder, it can be troublesome to copy later).

> [!TIP]
> For existing notes and image links, you might consider using the Obsidian plugin [obsidian-link-converter](https://github.com/ozntel/obsidian-link-converter) to help automatically convert `[[wikilink]]` to relative path Markdown links.

## Integrate Giscus Comment Feature

Giscus utilizes [GitHub Discussions](https://docs.github.com/en/discussions) to provide a commenting system that allows visitors to leave comments on your website using their GitHub accounts!(Your GitHub repository must be public to use Giscus).

Configuration steps:

1. Visit the [Giscus website](https://giscus.app/)
2. Follow the instructions on the website step by step. In the end, you will get the configuration information for Giscus.
3. In the Nólëbase repository, execute:

```sh
pnpm add -D vitepress-plugin-comment-with-giscus
```

4. Create a new file named `Gitcus.ts` in `./.vitepress/theme/components` and fill it with the following content: 

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

5. Import the `gitcus.ts` file created in the previous step into `./vitepress/theme/index.ts` (be sure to change some of the information to the configuration details you got in step one). A demo is shown below, but please refer to the [plugin documentation](https://github.com/T-miracle/vitepress-plugin-comment-with-giscus) for more details:

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

// Other configurations......

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
  // Done! The above content is what you need to modify, leave the rest unchanged.
}

export default ExtendedTheme
```

> [!NOTE]
> Add the following attribute to a Markdown file to decide whether to enable comments on the current article:
>
> ```
> ---
> comment: true
> ---
> ```

## Knowledge Base Writing Guidelines

Since it's often necessary to repeatedly organize and adjust the structure and annotations of documents to accommodate the reading habits of users or meet the content requirements of the documentation, as well as to indicate the version numbers of the APIs used and disruptive update notices, there may be cases where these factors (and others) cause the document structure to become inconsistent or disorganized. This can make searching difficult and require a lot of time and effort to understand the structure and content during indexing or quick review of the document. To address these issues, the following proposal suggests a more refined (subject to further discussion) knowledge base structure and usage guidelines.

This proposal includes:

1. A description of the document structure
2. Version control and compatibility notes for the documents
3. Guidelines on how to correctly use footnotes and references to provide additional related information in the documentation

### Structure

In general, documents should have the following structure (in the order listed from top to bottom):

1. A **Title** using a level-1 heading (typically the same as the filename).
	1. The **Author**, in normal text format.
	2. *Optional* · Tags (if available, to facilitate search and indexing).
	4. *Optional* · **Document Compatibility** using a level-5 heading (only for guides and documentation involving different software or APIs).
	5. *Optional* · **Archive Information** using a level-5 heading (only for all documents under the **📃 Archives** directory)
2. *Optional* · **Overview** using a level-2 heading (for very large documents, providing an overview can help improve retrieval and quick reference efficiency)
3. **Table of Contents** using a level-2 heading
4. **Description** using a level-2 heading
5. The **Main Body** with proper hierarchical headings, annotations, and possibly footnotes.
6. *Optional* · **Further Reading** or **References** using a level-2 heading (only for cases where major parts of articles or websites have been cited; articles or websites worth referring to but not directly cited in the document; or additional relevant content encountered during research, even if not strongly related).
7. *Optional* · **Footnotes** without a heading (if there are any, created using the Footnote shortcut plugin (see [🔌 Knowledge Base Plugin List](%F0%9F%94%8C%20%E7%9F%A5%E8%AF%86%E5%BA%93%E6%8F%92%E4%BB%B6%E5%88%97%E8%A1%A8.md) ). This avoids cluttering the main text with too many references and links.)

Each item will be explained in detail in the sections below: 

### Explanation

#### Title

The title is generally the same as the filename, making it easy to locate and remember.

##### Markdown Writing Example

```markdown
# Title
```

#### Tags

Tags make the document easier to search and link together. They also make it more convenient to find related documents after reading one, enabling readers to continue exploring related topics more easily.

In the past, [Nólëbase](https://nolebase.ayaka.io) used [Obsidian](https://obsidian.md)'s [basic tag](https://help.obsidian.md/Editing+and+formatting/Tags) `#tag`(which I call "plain tags")to mark pages. However, plain tags embedded in the main text are not conducive to programmatic processing, and using [structured tags (or nested tags)](https://help.obsidian.md/Editing+and+formatting/Tags#Nested+tags)directly in the body of the text can cause confusion. To better integrate with [Nólëbase Integrations](https://nolebase-integrations.ayaka.io) for fully automated tag processing and to optimize the overall reading experience, now [Nólëbase](https://nolebase.ayaka.io) adds a `tags` field to the [frontmatter](https://github.com/jonschlinkert/gray-matter) of Markdown, which is compatible with [Obsidian](https://obsidian.md), for configuring page tags.

##### Markdown Writing Example

```
---
tags:
 - Root Level
 - Another Root Level/Specific Tag
---
```

#### Archive Information

##### Description

For files (including documents and static resources) stored in the **📃 Archives** directory, **Archive Information** should be added to prominently indicate details such as their origin, creation time, and original resource information. 
This will ensure that, when archiving documents or static resources, we retain information about the author and the source, which facilitates future verification and tracing of the information. 
It is also important to pay attention to the sharing licenses used by content creators during the archiving process. If redistribution is not allowed, then archiving cannot proceed.

##### Fields

###### Archive From

This field indicates the source of the document or static resource. The value must match the directory name under which the document or resource is stored in the **📃 Archives** directory and subcategories. For instance, documents or resources placed in the `📃 Archives/📖 Articles/Medium` directory should have `Medium` in this field. If possible, provide a link to the source, which can be helpful in cases of multiple sources with the same name.

Currently supported sources include:

| Archive From |
| ---- |
| WeChat Official Account Articles |
| CSDN |
| ADDitude |
| The Verge |
| Zhihu |

###### Archive Created On

This field indicates the collection date of the document or static resource.

###### Archive Category

This field specifies the category of the document or resource. The value must match the name of the directory under which the document or resource is stored in the **📃 Archives** directory. For instance, documents or resources placed in `📃 Archives/📖 Articles/Medium` should have `Articles` as the value.

###### Original Author

This field records the original author of the document or resource. If no author information is available on the webpage, such as on news or information sites, the collection source can be used as the value for this field.

###### Original URL

This field contains the original URL of the collected document or resource.

###### Original Resource Creation Date

This field records the original creation date of the collected document or static resource.

###### Original Resource Update Date

This field records the original update date of the collected document or resource. If no update time is provided on the webpage, the original creation date can be used as the value for this field.

##### Markdown Writing Example

```markdown
##### Archive Information

| Archive From | Archive Created On | Category | Original Author | Original URL | Original Resource Creation Date | Original Resource Update Date |
| ---------- | ------------ | ---- | ------- | ------- | ------------- | ------------- |
| Medium | 2022-10-29 16:30 | Articles | Author Alpha | [Link](https://example.com) | 2022-10-29 16:30 | 2022-10-29 16:30 |
```

#### Document Compatibility

##### Description

For tutorial and explanatory documents involving software and APIs, a **Document Compatibility** section should be provided to describe in detail which versions of the software or API are supported by the document. This makes it easier to troubleshoot issues where behavior in the software or API described in the document is inconsistent due to breaking changes or compatibility issues.

##### Fields

###### Subject

The name of the software or API. If it is an HTTP RESTful API, you can provide the full URI.

###### Version

The version number here does not need to follow the Semantic Versioning 2.0.0 specification mentioned in **Document Versioning**. Instead, it should simply state the version of the application or API.

###### Documentation URL (if available)

If there is corresponding documentation, the URL or reference address for that version should be included here for easy reference.

##### Markdown Writing Example

```markdown
### Document Compatibility

| Subject | Version | Documentation URL (if available) |
| -- | -- | -- |
| NebulaGraph | v2.6.1 | https://docs.nebula-graph.com.cn/2.6.1/ |
```

#### Overview

The overview is intended only for very large documents—those for which the reading time for the table of contents, description, and main body exceeds 30 minutes. This section should provide a summary similar to a TL;DR, and if possible, directly present conclusions.

#### Further Reading or References

All external materials and references used in the document should include detailed links for reference.
For links and resources worth further exploring that are related to the topics discussed in the document, these should be placed under the `## Further Reading` section.
For references used in writing the document, these links or resources should be placed under the `## References` section or in the footnotes section. It is also worth noting that if the link or resource might become outdated, is from an unreliable website, or is subject to heavy censorship, it is advisable to collect these links or resources beforehand and store them in the **📃 Archives** for easy reference.

## Declaration

The code in this repository is released under the [MIT License][mit]

The documents, images, and referenced resources in this repository, except those in the `笔记/📃 Archives` directory, are published under the [CC BY-SA 4.0][cc-by-sa] license.

[mit]: https://opensource.org/licenses/MIT
[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/

### Written with ♥
