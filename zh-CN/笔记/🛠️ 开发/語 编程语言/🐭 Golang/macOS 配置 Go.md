---
tags:
  - 开发/语言/Golang
  - 软件/macOS
  - 命令行/go
  - 软件/Visual-Studio-Code/vscode
  - 软件/Visual-Studio-Code
---

## 安装 Go

### 通过 Homebrew（macOS 的包管理器）安装

如果尚未安装 Homebrew，可以前往 Homebrew 的[官网](https://brew.sh/index_zh-cn)下载，安装需要使用系统自带的「终端」来运行命令进行安装，不支持图形界面安装
安装 Homebrew 后运行下面的命令即可安装 Go：

```sh
brew install go
```

### 采用安装包形式安装

前往 Golang 的[官网下载页面](https://golang.org/dl/)下载写有 Apple macOS 的安装包，文件下载结束后根据内容指引安装即可。

## 配置 Go

安装完毕后需要对 Go 进行设置，包含：

1. 打开 GO111MODULE 以支持在 GOPATH 外引用 go module 依赖
2. 由于特殊的原因，在国内访问 Golang 的依赖下载会十分缓慢，需要设定代理

运行下面的代码即可设定：

```sh
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.io,direct
```

> [!NOTE]
>
> 有关如何配置 Golang 的代理，可以阅读以下这个文档了解更多的详细情况：[Go 国内加速：Go 国内加速镜像 | Go 技术论坛](https://learnku.com/go/wikis/38122)
>
>
> 其他可以参考和推荐的 Go 代理：
> - [goproxy.cn](https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md)
> - [GOPROXY.IO - 一个全球代理 为 Go 模块而生](https://goproxy.io/zh/)

## 安装 Visual Studio Code

Visual Studio Code 可以作为 IDE 配合开发进行使用，[下载链接](https://code.visualstudio.com/#alt-downloads)
安装之后可以在扩展市场中搜索 Go，安装后即可

## 配置 Visual Studio Code

打开设定并配置以下内容：

1. 搜索 Files: Insert Final Newline 并开启，这会在文件的最后一行添加一个新的空行
2. 搜索 Cover On Single Test（Go 插件）并开启，可以支持显示单元测试运行后的覆盖区域
3. 搜索 Cover On Single Test File（Go 插件）并开启，可以支持显示单文件单元测试运行后的覆盖区域
4. 搜索 Generate Tests Flags（Go 插件），填入两个参数值：-i -count=1 （注意中间使用空格隔开）

Visual Studio Code 的配置文档可以参考：[User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings)
