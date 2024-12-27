---
tags:
  - 开发/语言/Golang
  - 开发/语言/Golang/性能优化
  - 开发/语言/Golang/Profiling
  - 开发/语言/Golang/工具/pprof
  - 命令行/go
---

# 通过 pprof 工具为 Golang 程序进行性能分析

## 准备工作

我们需要从我们的服务程序中提取程序的运行情况。Golang 提供了 `runtime/pprof` 和 `net/http/pprof` 两个库，分别应用在适合的场景中。

### 一次性应用

如果你的应用是一次性的，运行一段时间就结束。那么最好的办法，就是在应用退出的时候把性能分析的报告保存到文件中，进行分析。对于这种情况，可以使用 `runtime/pprof` 库。

去除错误处理只需要三行内容，一般把部分内容写在 `main.go` 文件中，应用程序启动之后就开始执行：

```go
    f, err := os.Create(*cpuprofile)

    // 其他代码
    pprof.StartCPUProfile(f)
    defer pprof.StopCPUProfile()
```

应用执行结束后，就会生成一个文件，保存了我们的 CPU profiling 数据。

想要获得内存的数据，直接使用 WriteHeapProfile 就行，不用 start 和 stop 这两个步骤了：

```go
    f, err := os.Create(*memprofile)
    pprof.WriteHeapProfile(f)
    f.Close()
```

### 服务型应用

如果你的应用是一直运行的，比如 web 应用，那么可以使用 `net/http/pprof` 库，它能够在提供 HTTP 服务进行分析。

#### 使用 `http.DefaultServeMux`

在 import 块中导入 `net/http/pprof` 即可：

```go
import _ "net/http/pprof"
```

#### 使用 Gin 框架或者是其他 HTTP 封装库

```go
    r := gin.Default()

    r.Handle(http.MethodGet, "/debug/pprof/", gin.WrapF(pprof.Index))
    r.Handle(http.MethodGet, "/debug/pprof/cmdline", gin.WrapF(pprof.Cmdline))
    r.Handle(http.MethodGet, "/debug/pprof/profile", gin.WrapF(pprof.Profile))
    r.Handle(http.MethodGet, "/debug/pprof/symbol", gin.WrapF(pprof.Symbol))
    r.Handle(http.MethodGet, "/debug/pprof/trace", gin.WrapF(pprof.Trace))
```

## 进行分析

### 直接使用 `pprof`

有两种方式可以方便我们进行分析，第一种就是直接使用 `go` 自带的 `pprof` 命令行工具请求 `pprof` 的接口：

```shell
go tool pprof "localhost:8080/debug/pprof/profile"
```

来进行 CPU Profiling。

请求之后将会进入一个交互式的命令行，这个时候可以通过在这个交互式命令行窗口中输入 `top` 来查看排名最前的数据结果。

比如，如果想要分析 `heap` `profile` 数据，查看现在 `heap` 上的内存开销：

```shell
❯ go tool pprof ~/Downloads/heap # [!code hl]
File: insights-bot
Type: inuse_space
Time: Dec 11, 2023 at 12:01am (CST)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) top # [!code hl]
Showing nodes accounting for 12127.38kB, 92.21% of 13151.42kB total
Showing top 10 nodes out of 82
      flat  flat%   sum%        cum   cum%
 5768.23kB 43.86% 43.86%  7925.17kB 60.26%  github.com/pkoukk/tiktoken-go.loadTiktokenBpe
 1644.93kB 12.51% 56.37%  1644.93kB 12.51%  strings.genSplit
  809.97kB  6.16% 62.53%   809.97kB  6.16%  bufio.NewWriterSize
  768.26kB  5.84% 68.37%   768.26kB  5.84%  go.uber.org/zap/zapcore.newCounters
  561.50kB  4.27% 72.64%   561.50kB  4.27%  golang.org/x/net/html.map.init.1
  517.33kB  3.93% 76.57%   517.33kB  3.93%  github.com/gookit/color.init256ToHexMap
  517.33kB  3.93% 80.51%   517.33kB  3.93%  regexp/syntax.(*compiler).inst
  515.38kB  3.92% 84.42%   515.38kB  3.92%  ariga.io/atlas/schemahcl.WithTypes
  512.31kB  3.90% 88.32%   512.31kB  3.90%  regexp.onePassCopy
  512.14kB  3.89% 92.21%   512.14kB  3.89%  text/template/parse.New
(pprof)
```

让我们先回到命令行的使用上，默认情况下，这样的流程会进行 30s，这是因为 `pprof` 暴露的接口的处理器正在对程序的 CPU 和相关计算资源的用量进行快照采集，静静等待结束之后 `pprof` 就会进入交互式界面让我们交互式浏览 `pprof` 的结果。
当然你完全可以修改这样的默认行为，你可以要求 `pprof` 的快照时长延长为 60s。

```shell
go tool pprof "localhost:8080/debug/pprof/profile?seconds=60"
```

> [!NOTE] 快照？`pprof` 的底层原理
>
> 简而言之，快照在这里的含义其实并不是简单地将 Profiling 的过程中这段时间的函数调用和调用耗时快照下来，更复杂的是，`pprof` 其实是在默认配置情况下的 30s 的时间窗口内，将这段时间范围内的高耗时函数调用，以及计算流程像是「拍个照片」一样记录下来。
>
> 复杂一点说，`pprof` 命令行将会在被执行的时候自动找参数提供的 Profiling 接口（在上面的例子中则为 `localhost:8080/debug/pprof/profile`）发起 `GET` 请求，在 `debug/pprof/profile` 接收到请求之后，将会高耗时函数调用，内存分配，符号申请，栈内栈外的信息做提取和快照操作，然后打包返回一个 `pprof` 可以读取和分析的二进制数据包，最终到交互式的 `pprof` 操作和方便用户和开发者观测这些关键的、足够显眼的调用栈和消耗。
>
> 因此，如果你想要通过 `pprof` 去细致入微地测量每个函数的调用的话，是行不通的，因为他们对于 `pprof` 而言不够显眼，换句话说，是占用的计算资源不如别的函数，这个时候 `pprof` 接口所返回的 Profiling 数据中是不会包含这些信息的。
>
> 对于精确测量函数调用的需求，请使用 Jeager 或者我撰写的 [nekomeowww/elapsing](https://github.com/nekomeowww/elapsing) 库来对逐个函数和调用栈进行可观测分析。

如果有二进制文件，或者想看 `pprof` 的源代码映射的话，也可以在第二个参数中指定正在 `pprof` 的二进制文件：

```shell
go tool pprof ./main "localhost:8080/debug/pprof/profile?seconds=60"
```

### 先缓存下来再 `pprof`

在上面的例子中介绍的 `pprof` 的使用方法都是非常快捷临时的用法，很多时候我们不能每次都去环境里面安装 `go` 或者是在不保存结果的情况下对 `pprof` 接口返回的结果进行分析，这个时候需要我们通过别的方式实现这样的功能。

正如在 `pprof` 的底层原理中讲述的

> `pprof` 命令行将会在被执行的时候自动找参数提供的 Profiling 接口（在上面的例子中则为 `localhost:8080/debug/pprof/profile`）发起 `GET` 请求，在 `debug/pprof/profile` 接收到请求之后，将会高耗时函数调用，内存分配，符号申请，栈内栈外的信息做提取和快照操作，然后打包返回一个 `pprof` 可以读取和分析的二进制数据包

所以你完全可以通过诸如 `wget` 和 `curl` 这样别的 HTTP 客户端对接口进行 `GET` 请求并将 `pprof` 可读取和分析的二进制存储到本地，然后在有 `pprof` 的环境中分析和执行进一步的 debug 和挖掘操作，或者是方便之后的二次复盘和数据对比：

```shell
wget localhost:8080/debug/pprof/profile
```

```shell
curl localhost:8080/debug/pprof/profile -O
```

如果是从 Docker 容器中获取的 `pprof` `profile` 资料文件，可以通过下面的命令复制到宿主机：

```shell
sudo docker cp <container hash>:<path to pprof profile file> ~/
```

然后再执行

```shell
go tool pprof <path to pprof profile file>
```

## 可视化分析

使用 pprof 工具可以直接输出一个可运行的网页，在网页中可以选择查看调用统计、调用次序、火焰图等。

### 安装额外的依赖

要渲染这些图片，我们还需要在 macOS 上安装 graphviz：

```bash
brew install graphviz
```

### 输入 profile 文件并打开一个网页服务器

```bash
go tool pprof -http=":8080" ./main ~/pprof/pprof.main.samples.cpu.001.pb.gz
```

这个时候在浏览器中打开 `http://localhost:8080`，就可以看到性能分析的数据了。

## 延伸阅读

[使用 pprof 和火焰图调试 golang 应用 | Cizixs Write Here](https://cizixs.com/2017/09/11/profiling-golang-program/)

[Golang 大杀器之性能剖析 PProf - SegmentFault 思否](https://segmentfault.com/a/1190000016412013)

[Golang remote profiling and flamegraphs · matoski.com](https://www.matoski.com/article/golang-profiling-flamegraphs/)

## 相关资源

[Download | Graphviz](https://graphviz.org/download/)
