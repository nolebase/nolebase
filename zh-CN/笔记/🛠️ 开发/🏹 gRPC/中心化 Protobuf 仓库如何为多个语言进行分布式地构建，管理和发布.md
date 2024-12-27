---
tags:
  - 开发/API/Protobuf
  - 网站/GitHub
  - 开发/CICD/GitHub-Actions
  - 开发/API/gRPC
  - 开发/语言/Golang
  - 开发/语言/TypeScript
  - 开发/Monorepo
  - 开发/代码/代码生成
  - 命令行/protoc
  - 命令行/buf
status: 尚未完成
---

# 中心化 Protobuf 仓库如何为多个语言进行分布式地构建，管理和发布

> [!WARNING]
> ⚠️ 该文档尚未完成，仍在编写中...

## 说明

最近使用到了 gRPC 和 Protobuf，为了方便从 Protobuf 构建多个语言的代码生成（codegen）文件并且能进行妥善的管理，我在寻得多方大佬的意见和建议、阅读了不少公开的文献之后采用了：中心化仓库放置 Protobuf 定义文件和分布式构建、管理和发布代码生成（codegen）文件的方案。

## 为何是中心化，为何是分布式？

之所以采用了中心化的方案，是因为考虑到 Protobuf 是最上游的依赖，且 Protobuf 中定义的内容一般而言都是其他调用方会需要使用到的（如果我们将 Protobuf 按照微服务拆开的话，微服务间同步和共享 Protobuf 的定义文件和进行代码生成（codegen）又会变得麻烦了）。

我不采用 Monorepo 来放置各语言代码生成（codegen）的文件，或者直接将这些代码生成（codegen）产物放到 Protobuf 中心化仓库的原因，主要是因为我觉得各个语言和各个生态所使用的构建策略和相关的工具链是各不相同的，而往往使用称手的工具才能事半功倍。
比如 TypeScript 项目可能会希望将 Protobuf 构建并生成的类型定义文件发布为一个单独的 npm 包（如果是期望私有发布的，也可以是发布到自建的 registry 中），Java 也是如此，而 Golang 又会希望直接使用 Git 和 Git Tag 功能进行管理和版本控制，这些不同的需求如果我们都放在一个超大的仓库里或者是 Protobuf 的仓库中时，未免会导致 CI 和各仓库权限分配的困难、配置文件、CI/CD 文件的混乱、构建工具和构建时环境要求的不同等各种问题。

## 如何组织文件呢？

我们假设我们有一个中心化仓库叫做：`<命名空间>-protobuf` （比如我自己的项目中会用到的 Protobuf 所存放的仓库就可以叫做 `nekomeowww-protobuf`），以及我们有如下的文件结构：

```shell
$ tree
.
├── README.md
└── helloworld
    └── v1
        └── helloworldpb
            └── helloworld.proto
```

以及一个需要构建的目标仓库 `<命名空间>-protobuf-<语言/SDK/环境>`（比如给 Golang 进行构建的话就是 `nekomeowww-protobuf-go`）：

```shell
$ tree
.
├── README.md
├── go.mod
└── go.sum
```

## 如何构建呢？

首先我们得引入一个 Protobuf 构建工具，[buf](https://buf.build/)。buf 构建工具支持通过本地配置的 `protoc` 插件来进行多种语言，多种配置，多种输出目录的构建配置，buf 也提供了 lint，破坏性更新检查等等繁多的功能，不过本文中我们暂时不展开介绍和讨论，详细的可以到 [buf 文档](https://docs.buf.build/introduction) 中详细学习和阅读。

在中心化仓库中的根目录创建一个 buf 工具的配置文件 `buf.yaml`，并在其中写入如下内容：

```yaml
version: v1 # [!code ++]
```

为了能够为我们的目标语言 Go 进行代码生成（codegen），我们还需要在其根目录中创建一个 buf 工具用来完成代码生成的配置文件 `buf.gen.yaml`，并在其中写下如下内容：

```yaml
version: v1 # [!code ++]

plugins: # [!code ++]
- name: go # [!code ++]
  out: "gen/go/proto" # [!code ++]
  opt: paths=source_relative # [!code ++]

- name: go-grpc # [!code ++]
  out: "gen/go/proto" # [!code ++]
  opt: paths=source_relative # [!code ++]
```

**TO BE CONTINUE...**
