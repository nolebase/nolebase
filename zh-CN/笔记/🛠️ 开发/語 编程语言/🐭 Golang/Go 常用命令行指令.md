---
tags:
  - 开发/代码/代码片段
  - 开发/语言/Golang
  - 命令行/go
---

# Go 常用命令行指令

基本上所有的代码添加 -v 参数都意味着「**显示更多的日志信息**」
-v 指的是英文的 verbose（啰嗦），比如你想要知道更多的**构建信息，下载信息**

## 获取当前 go 的环境配置（不添加任何参数时）

```shell
go env
```

在某些网站上可能会要求你用这个命令解决：依赖下载过慢，编译故障，引用问题等等

### 示例

#### 1. 开启 GO111MODULE

```shell
go env -w GO111MODULE=on
```

如果开启了这个选项，你就可以把你的项目和源码放到你喜欢的地方直接开发；
如果希望关掉这个选项，只需要把 on 改成 off 即可。

#### 2. 设置代理

```shell
go env -w GOPROXY=https://goproxy.io,direct
```

通常在国内下载 gopkg 都是极其缓慢甚至有出错风险的，国内的帖子都会建议使用上面的命令去设定 go 的代理

## 初始化项目

> 这个命令需要把上一章节讲的 go env -w GO111MODULE=on 运行一下

```shell
go mod init [项目名称]
```

然后你在代码中引用自己的包的时候就会这样：

```go
package main
import (
    "[项目名称]/[包名1]"
    [重命名的包名] "[项目名称]/[包名2]"
)
```

有时候可能遇到的依赖项校验码和依赖项不匹配的问题

```shell
go mod tidy
```

运行一下就好了

## 构建代码为可执行文件（二进制文件）

```shell
go build
```

### 示例

1. 把当前目录下的源代码编译并放到当前目录下，保存为名为「a」的可执行文件

```shell
go build -o ./a
```

2. 把额外的编译日志输出到命令行

```shell
go build -v
```

### 直接运行代码（一般运行 main 函数的那个文件）

```shell
go run [代码文件名]
```

## 获取依赖（比如你在网上找到的别的库或者包）

```shell
go get
```

### 示例

1. 下载名称注册为「github.com/gin-gonic/gin」的依赖包

```shell
go get gitHub.com/gin-gonic/gin
```

值得注意的是，这个名称中的 [github.com](http://github.com/) 并不是指从 GitHub 下载 ，而是从名为 gopkg 的网站进行下载，毕竟，依赖也是需要注册才能使用的

2. 更新并下载依赖包（尽可能地使用这个方法）

```shell
go get -u github.com/gin-gonic/gin
```

`-u` 参数表示的是「如果有更新，则一并更新到当前代码库，哪怕当前代码库曾经已经添加过该依赖包」

所以如果你需要更新依赖包的时候，直接用 `go get -u` 即可
