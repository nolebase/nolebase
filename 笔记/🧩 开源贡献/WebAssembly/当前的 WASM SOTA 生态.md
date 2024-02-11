---
tags:
  - 开发/WebAssembly
  - 开发/WebAssembly/WASM
  - 开发/WebAssembly/WASI
  - 开发/WebAssembly/WIT
  - AI
  - 物联网/IoT
  - 开发/后端/边缘计算/Serverless
  - 开发/后端/边缘计算
  - 开发/后端/Cloudflare-Workers
  - 开发/后端/边缘计算/Cloudflare-Workers
  - 开发/语言/Rust
  - 开发/语言/凹语言
  - 开发/语言/moonbit
  - 软件/云原生/containerd
  - 开发/云原生
---
# 当前的 WASM SOTA 生态

做 Runtime / WASI 的话，spin 会比较适合，因为他们的社区和开发会更活跃和开放一些：

fermyon/spin: Spin is the open source developer tool for building and running serverless applications powered by WebAssembly.
https://github.com/fermyon/spin

在另一个 serverless 实现中，主导的 wasmCloud 与 NATS 有关：

NATS.io – Cloud Native, Open Source, High-performance Messaging
https://nats.io/

而 NATS 是 Synadia 做的

Synadia
https://www.synadia.com/

与 NATS 有关的概念是 NGS

Globally Distributed WebAssembly Applications with wasmCloud and NATS | wasmCloud
https://wasmcloud.com/blog/globally_distributed_webassembly_applications_with_wasmcloud_and_nats

然后在 containerd 的生态下，runwasi 是比较热门的实现

containerd/runwasi: Facilitates running Wasm / WASI workloads managed by containerd
https://github.com/containerd/runwasi

会比

bytecodealliance/wasmtime: A fast and secure runtime for WebAssembly
https://github.com/bytecodealliance/wasmtime

好一些，另外也值得看看 bytecodealliance 相关的项目，WASM 主要是字节码联盟（Bytecode Alliance）做的

除去上述的这些生态之外，比较魔法和推进 WASI 实现的还有一个生态，是

WASIX - The Superset of WASI
https://wasix.org/

是

Wasmer: The Universal WebAssembly Runtime
https://wasmer.io/

主导的实现

## 特殊实现

凹语言

wa-lang/wa: The Wa Programming Language: Simple, maintainable, compiled language for developing WebAssembly software
https://github.com/wa-lang/wa

Moonbit

MoonBit
https://www.moonbitlang.com/

编程语言Moonbit开放内测：极快编译速度，极小Wasm体积 - IDEA
https://www.idea.edu.cn/news/5997.html

## WASI

有关 WASI，可以在这里阅读：

WebAssembly/WASI: WebAssembly System Interface
https://github.com/WebAssembly/WASI

在 WASI 之外，你可能也需要知道 WIT，可以在这里阅读：

component-model/design/mvp/WIT.md at main · WebAssembly/component-model
https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md

WebAssembly 组件模型与 WIT 格式详解 - Rust语言中文社区
https://rustcc.cn/article?id=2c59f99d-f769-4ca6-b8f5-3fcd71c1c374

bytecodealliance/wit-bindgen: A language binding generator for WebAssembly interface types
https://github.com/bytecodealliance/wit-bindgen

WIT - The WebAssembly Component Model
https://component-model.bytecodealliance.org/design/wit.html