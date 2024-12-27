---
tags:
  - 软件/Visual-Studio-Code
  - 软件/Visual-Studio-Code/vscode
  - 开发/语言/Golang
  - 命令行/go
---

# 在 Visual Studio Code 中使用 go.work 时根目录的 go.mod 会提示 no go.mod file found in

如果你在根目录配置了 `go.work` 作为 `monorepo` 的配置文件，然后通过

```shell
go mod init <module 路径>
```

或者直接在 `go env GOPATH` 目录下通过

```shell
go mod init
```

创建 `go.mod` 之后，可能可以在最新版本的 Visual Studio Code 和最新版本的 Golang（我这里 `v1.21.3`）看到这样的错误：

```
no go.mod file found in /Users/neko/Git/<路径>
```

你很可能遇到了这个[现在依然存在的 Visual Studio Code 的 Go 插件所引用的 `gopls` 库的 bug](https://github.com/golang/go/issues/56570)，你可以试图检查 Visual Studio Code 的 Go 插件所引用的 `gopls` 库在 Visual Studio Code 中对应的 [`build.allowModfileModifications`](https://github.com/golang/vscode-go/wiki/settings#buildallowmodfilemodifications) 配置选项是否开启，

通过命令面板打开 Visual Studio Code 的配置：

- 在 macOS 上按 <kbd data-macos-keyboard-key="command">command</kbd> + <kbd data-macos-keyboard-key="option">option</kbd> + <kbd>P</kbd> 可以激活命令面板
- 在 Windows 和 Linux 上按 <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>P</kbd>

然后输入选择下面的内容来配置**全局** Visual Studio Code 配置：

```
Open User Settings (JSON)
```

当然如果你只有部分项目出错，也可以配置**工作区** Visual Studio Code 配置：

```
Open Workspace Settings (JSON)
```

然后查看配置：

```json
{
  "gopls": {
    "build.allowImplicitNetworkAccess": true,
    "build.allowModfileModifications": true, // [!code focus]
    "build.buildFlags": [],
    "ui.completion.usePlaceholders": true,
  },
}
```

或者直接搜索

```
allowModfileModifications
```

然后将其配置为 `false` 或者注释掉来解决这个问题：

```json
{
  "gopls": {
    "build.allowImplicitNetworkAccess": true,
    "build.allowModfileModifications": true, // [!code --]
    "build.allowModfileModifications": false, // [!code ++]
    "build.buildFlags": [],
    "ui.completion.usePlaceholders": true,
  },
}
```
