---
tags:
  - 分类/收集箱
  - 分类/收集箱/ideas
  - AI
  - AI/大语言模型/LLM
  - 软件/开源/ollama
  - AI/AIGC
  - 开发/云原生
  - 开源/社区/Kubernetes
  - 开发/云原生/Kubernetes
  - 开发/容器化/containerd
---
1. Ollama Edge Computing Platform。允许用户在集群上部署 Ollama Farm（羊驼圈）来在自己的边缘节点上部署大语言模型，管理模型构建，管理工具，管理插件，提供 P2P 资源。对于云端版本，可以帮忙提供接入不同大语言模型的能力，和 openrouter 一样，但我们也提供 Agent Meshing 的能力，Semantic Cache 的能力，云端租用设备部署的能力，可观测能力，接入其他人的公开或者私享网络进行联邦推理的能力。

2. Ollama P2P Computing，能不能让 Ollama 在边缘节点上计算的能力变成一种互惠互通的形式，以类似于区块链的奖励机制来让大家去加入到相通的网络进行联合推理。

3. Ollama cluster inferencing，能不能让 Ollama 能分片处理，分发给若干个子 StatefulSet Pod（或者直接用 LWS）来模型并行？Ollama 可以支持模型并行吗？能单拆出来 llama.cpp 的模型并行能力出来单独用吗？

4. Ollama Modelfile CICD 构建器。现在这个 Modelfile 构建的时候太累了，能不能想个办法联动 hugging face 的模型仓库，支持从 hugging face 上拉 gguf 模型下来构筑 Modelfile，相当于是要拓展语法，或者引入更多上下文，甚至是模板能力。（基于模型层的 PVC 复用）

5. Ollama Operator 支持提交并构筑 Modelfile。

6. Ollama 支持多 backend，比如 vllm 或者 triton 这样的超快推理后端。

7. Ollama 现在只有 PROMPT 语法，能不能把 Ollama 这种 Model 封装当作是一个容器，过去用编译好的代码做容器，我们能不能也复用这个概念，把 Model 本身自带的模型当作是一个容器来看待为容器（Model 本身提供外部工具的 Meshing 和 Discovery 的能力）。LangChain 提供了代码原语上的工具注入能力，那我们可以把模型当作是一个一个的缸中之脑来部署，并且告诉它它有多少的工具可以用吗？这样我们只需要写适配器通过 HTTP 或者 RPC 接口让模型与工具进行交互，就可以复用现有的很多 LangChain 生态的工具

8. 现在大家自己部署模型的时候都是自己让大模型推理的，能不能构筑一个 P2P 网络来让大模型有一个类似于 CDN（语义化缓存，Semantic Cache）的能力，在 Edge Inferencing 的时候能处理集群网络中的相似 query 而不是每次都推理一遍，这样可以让全局推理网络的能效上升好几倍，换句话说，我们需要一个单独的中间件帮忙做 embedding 缓存和 query 缓存，相当于是要自己部署一个 embedding 服务器。

9. Modelfile 现在没有 metadata 的能力，OCI 能允许 添加额外的 annotation 吗？如果可以的话，可以在启动和渲染模型之前了解到模型需要的内存、显存、GPU only 或者 CPU compatible，这样我就可以知道在 Edge 调度的时候哪些节点我是可以调度的，哪些节点我是不能调度的。（思考：如果能让 Ollama Operator 支持 Modelfile 的 CRD，是不是可以直接引用 Modelfile CRD，然后要求用户在 Modelfile 里面填写额外的资源信息来辅助了解模型的要求）。能让 containerd 和 OCI 支持一下 platform 字段为多个数值吗？有的运行时容器需要既指定 CPU 架构也要能感知 GPU 配置... 也是调度和拓扑相关的事情。

10. Ollama 联邦推理网络记分规则，如果你在这个大平台上 serve 了自己的大模型，这个时候，别人可以根据 prompt 的效果，对 prompt 进行主观评价（权重较低），还有额外开钱购入的 GPT4 credit 的能力对 prompt 进行的评估（权重稍大），是不是可以更进一步方便大家开发大模型，而无需关心 serving 的 infra。

11. GitHub 上的 Commit 消息，Issue 的讨论，实际的代码，Pull Request 评论和评论还有 Discussion 的问答，以及 Wiki，还有 Commit Comment，Release，Changelog，README 里面蕴含的消息真的数不胜数的数据资源，我们为什么不在这个顶上做一个 RAG 专门提供对 GitHub 内的开源社区的问答 Bot 和搜索引擎呢？