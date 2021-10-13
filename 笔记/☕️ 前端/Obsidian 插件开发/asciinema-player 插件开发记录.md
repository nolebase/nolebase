# `asciinema-player` 插件开发记录

## 说明

[如何离线使用 asciinema](https://unix.stackexchange.com/questions/512450/how-to-use-asciinema-offline)
[asciinema-player 官方 API 指南 · asciinema/asciinema-player](https://github.com/asciinema/asciinema-player/blob/develop/README.md#use-the-player-in-your-html-page)

## 初始化

### 创建仓库

去 [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 获取样例插件，可以使用 GitHub 自带的 **Use this template**（使用这个模版）来快速创建副本到自己的 GitHub 账号

###  克隆仓库到本地

一般放置到插件的目录在  `<知识库路径>/.obsidian/plugins/<插件名>` ，如果你变更过 Obsidian 的配置文件路径，把 `.obsidian` 改成你想要的即可。

```shell
$ git clone github.com/<用户名>/<仓库名> <知识库路径>/.obsidian/plugins/<插件名>
```

以我的为例：

```shell
$ git clone nekomeowww.git:nekomeowww/obsidian-asciinema-player.git
```

### 安装依赖

```shell
$ pnpm i
```

### 变更插件信息

编辑 `manifest.json` 来调整插件的名称、作者、简介和版本等信息。

```javascript
{
	"id": "obsidian-asciinema-player", # 插件 ID，不可以与社区已经存在的插件重复
	"name": "asciinema Player", # 插件名称
	"version": "1.0.0", # 插件版本号
	"minAppVersion": "0.9.12", # 要求的 Obsidian 最小版本号
	"description": "", # 简介
	"author": "Ayaka Neko", # 作者
	"authorUrl": "https://github.com/nekomeowww", # 作者地址
	"isDesktopOnly": false # 是否只支持桌面端
}
```

编辑 `package.json` 文件来调整最终发布的 npm 包信息。

```javascript
{
  "name": "obsidian-asciinema-player", # npm 包名称
  "version": "1.0.0", # 版本号
  "description": "", # 简介
  "main": "main.js", # 程序主要入点，不要改这里
  "scripts": { # 脚本指令
    "dev": "rollup --config rollup.config.js -w", # 热加载插件
    "build": "rollup --config rollup.config.js --environment BUILD:production" # 构建发布版本
  },
  "keywords": [], # 关键字
  "author": "Ayaka Neko", # 作者
  "license": "MIT",
  "devDependencies": {
    "@rollup/plugin-commonjs": "^18.0.0",
    "@rollup/plugin-node-resolve": "^11.2.1",
    "@rollup/plugin-typescript": "^8.2.1",
    "@types/node": "^14.14.37",
    "obsidian": "^0.12.0",
    "rollup": "^2.32.1",
    "tslib": "^2.2.0",
    "typescript": "^4.2.4"
  }
}
```

### 编译并开启热加载

```shell
$ pnpm dev
```

现在对 `main.ts` 及其依赖的文件都会被自动编译到 `main.js` 文件中。

### 在 Obsidian 中激活我们的插件

