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

### 短时应用

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

```go
go tool pprof ./main "localhost:8080/debug/pprof/profile?seconds=60"
```

这个命令会进行 CPU profiling 分析，等待一段时间（默认是 30s，如果在 url 最后加上 ?seconds=60 参数可以调整采集数据的时间为 60s）之后，我们就进入了一个交互式命令行，可以对解析的结果进行查看和导出。

## 查看火焰图

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
