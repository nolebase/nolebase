---
tags:
  - 开发/云原生/Kubernetes
  - 运维/云原生/Kubernetes
  - 开源/社区/Kubernetes/发布日志
  - 开发/云原生/Kubernetes/1-30
  - 运维/云原生/Kubernetes/1-30
---
# 最可爱的版本 UwU ❤️ Kubernetes v1.30 发布！

太平洋时间 2024 年 4 月 17 日，主题为 Uwubernetes ❤️ 的 Kubernetes v1.30 正式发布啦。

此版本距离上版本发布时隔 4 个月，是 2024 年的第一个版本。

与之前的版本类似，Kubernetes v1.30 版本引入了多项新的稳定、Beta 和 Alpha 版本的功能。一贯交付高质量版本的承诺凸显了 Kubernetes 社区的开发周期实力和社区的活跃支持。

此版本包含 45 项改进。在这些改进功能中，有 17 项已晋升为稳定版，另外有 18 项正在进入 Beta 阶段，以及最后的 10 项已晋升为 Alpha 阶段。

## 发布主题和 Logo

Kubernetes v1.30：Uwubernetes ❤️

![](./assets/k8s-1.30.png)

> Kubernetes 1.30 Uwubernetes 标志

> 这是迄今为止最可爱的版本。Kubernetes v1.30 让集群更可爱！

「Uwubernetes」是由「UwU」（U 是闭合的双眸；w 是嘴巴）和「Kubernetes」组合出来的名称，在社区里，大家会用这个表情抒发幸福或者可爱的情感。

> 发布标志由来自社区的 [Kate Efimova (@Kefimochi)](https://twitter.com/kefimochi) 根据发布团队经理 Kat Cosgrove 的猫而设计的，感谢 Kate 为我们绘制的 UwU 集群象征标志。

发布团队用这样的名称来感谢来自世界各地、各行各业的数千人一起构建出了 Kubernetes 社区及其生态，并祝愿每一位构建 Kubernetes、发布 Kubernetes、保持 Kubernetes 集群健壮在线的所有人，希望大家能像主题标志里的「furries（毛茸茸）」和她家里的猫一样生活幸福，永远可爱。

让我们庆祝本次 v1.30 的发布，感谢社区伙伴在过去的里程碑中所作出的努力和贡献。和发布团队一样，我们也祝愿大家能在社区里找到属于自己的位置，寻找到属于自己的幸福，让自己和集群变得可爱 UwU ♥️

## GA 和稳定的功能

GA 全称 General Availability，即正式发布。Kubernetes 的进阶路线通常是 Alpha、Beta、Stable、GA 这四个阶段。


- [基于容器资源的 Pod 自动伸缩](https://kep.k8s.io/1610)
- [删除云控制器管理器（KCCM）中的临时节点谓词](https://kep.k8s.io/3458)
- [k/k 采用 Go 的 workspace 架构](https://kep.k8s.io/4402)
- [减少基于 Secret 的 ServiceAccount 令牌](https://kep.k8s.io/2799)
- [用于准入控制的 CEL](https://kep.k8s.io/3488)
- [基于 CEL 的准入控制的匹配条件](https://kep.k8s.io/3716)
- [Pod 调度准备就绪](https://kep.k8s.io/3521)
- [PodTopologySpread 中的最小域](https://kep.k8s.io/3022)
- [阻止在卷恢复期间发生未授权的卷模式转换](https://kep.k8s.io/3141)
- [API Server 链路追踪](https://kep.k8s.io/647)
- [云上双栈 - --node-ip 的处理](https://kep.k8s.io/3705)
- [AppArmor 支持](https://kep.k8s.io/24)
- [`kubelet` 重启后稳定重建 VolumeManager](https://kep.k8s.io/3756)
- [kubectl 交互式删除](https://kep.k8s.io/3895)
- [指标基准配置](https://kep.k8s.io/2305)
- [为 Pod 添加 `status.hostIPs` 字段](https://kep.k8s.io/2681)
- [聚合资源 API 发现](https://kep.k8s.io/3352)

这是有关 GA 和 Stable 的更新总览，下文择取了部分特性详述。如果对其他特性感兴趣，请移步至具体的 KEP 页面了解进展和详情。

### 存储 - `kubelet` 重启后稳定重建 VolumeManager 现已正式发布

在 [KEP-3756 Robust VolumeManager reconstruction after kubelet restart](https://github.com/kubernetes/enhancements/issues/3756) 中，jsafrane 和社区成员提出了对 Kubernetes 的 VolumeManager 的改进提案。该提案和实现允许在 kubelet 启动的时候提供并填充有关现有的卷是如何挂载的信息。换句话说，可以让节点重启或者 kubelet 重启后能够更好、更准确地回收并恢复那些在重启前已经挂载的卷。

> 最早在 v1.25 引入，v1.27 进入 Beta 阶段，在 v1.28 默认启用，现在该提案已正式发布。

### 存储 - 阻止在卷恢复期间发生未授权的卷模式转换现已正式发布（仅对 CSI 生效）

在 [KEP3141 Prevent unauthorised volume mode conversion during volume restore](https://github.com/kubernetes/enhancements/issues/3141) 中，RaunakShah 和社区成员提出的一种用来**减轻用户在从现有 PVC 创建 VolumeSnapshot 时对卷模式的更改带来的漏洞**的机制。

对于 Kubernetes v1.30，在将快照恢复到 PersistentVolume 时，控制平面将始终会阻止对卷模式进行未经授权的更改。作为集群管理员和运维人员，如果需要在还原和恢复时允许此类更改，则需要通过 RBAC（例如：代表 CSI 的 ServiceAccounts）授予相关的权限。

有关这个功能的更多信息，请参阅[转换快照的卷模式](https://kubernetes.io//docs/concepts/storage/volume-snapshots/#convert-volume-mode)。

### 网络 - 为 Pod 添加 `status.hostIPs` 字段现已正式发布

在 [KEP-2681 # Field `status.hostIPs` added for Pod](https://github.com/kubernetes/enhancements/issues/2681) 中，来自 DaoCloud 的 wzshiming 与社区成员一同提出为 Pod 资源添加 `status.hostIPs` 字段以获取节点在 IPv4 和 IPv6 双栈的情况下的地址。主要目的是为在双栈过渡阶段迁移到 IPv6 时的应用提供更好的平滑迁移体验，毕竟 IP 相关的属性应该同时支持 IPv4 和 IPv6，而非过去 `status.hostIP` 这样只有一个 IP 的状态。

> 最早在 v1.28 引入，在 v1.29 进入 Beta 阶段，现在该提案已正式发布。

### 调度 - Pod 调度准备就绪正式发布

在 [KEP-3521 Pod Scheduling Readiness](https://github.com/kubernetes/enhancements/issues/3521) 中由 Huang-Wei 和社区成员提出的，通过增加一个 Pod 是否准备好被调度的机制来实现「如果前置依赖不满足，那么 Pod 就无需被调度，也就不会消耗资源，有且仅有在诸如存储，关联资源创建并准备就绪这样的条件满足的时候，才会由 kubelet 和 kube-scheduler 进行处理」的能力。

这样的机制是通过指定（或删除）Pod 定义中的 `.spec.schedulingGates` 配置来实现的。因此，自 Kubernetes v1.26 (1.26 Alpha, 1.27 Beta, 1.30 GA) 开始，通过指定（或删除）Pod 定义中的 `.spec.schedulingGates` ，就可以实现对 Pod 何时准备好进行调度的控制。当期望对 Pod 进行调度时，对于管理和编排 CRD 的 Operator 和 Controller 而言，只需要在满足条件并准备就绪后移除 `.spec.schedulingGates` 配置即可。

换句话说，这样的能力允许集群组件在不需要侵入式修改调度器或增加额外的控制器逻辑等情况下，对 Pod 的生命周期中的「调度」有了更强的掌控力，也允许在 Pod 本身之外，能够通过其他外部的触发条件进行调度了。

对于现如今热门的 AI 和机器学习相关的负载而言，也可以允许外部 Operator 和 Controller 在启动工作负载的时候得以更好的进行权重预下载，资源预分配，数据集预加载等操作，宏观视角上甚至能与 DRA 联动实现更多灵活的部署方案和架构设计。

> 最早在 v1.26 引入，v1.27 中进入 Beta 阶段，现在该提案已正式发布。

### CLI - kubectl 交互式删除正式发布

很多人都使用 `kubectl` 对集群进行更改，其中的 `kubectl delete` 子命令是破坏性且不可逆的命令，然而，在各种情况下，如果用户输入的命令不准确、内容和参数错误、仓促操作时都会导致集群资源误删，甚至无法还原到先前的状态的问题。

因此在 [KEP-3895 kubectl delete: Add interactive(-i) flag](https://github.com/kubernetes/enhancements/issues/3895) 中，ardaguclu 和社区成员提出了对 `kubectl` 的修改建议，提案指出，当用户将 `--interactive` / `-i` 标志传递给 `kubectl delete` 命令时，所有计划删除的资源将以预览的形式显示给用户。这个时候：

- 如果用户通过键入 `y` 确认，那么命令将继续删除过程；
- 如果用户输入 `n` 或 `y` 以外的任何其他值，删除的过程将会被取消。

这样的功能比较类似于命令行中的 `[Y/n]` 提示，在 `apt`，`yum`，还有 `rm` 的时候都会有出现，虽然不能完全避免误操作，但是可以通过预览的方式让用户二次确认受影响的资源。

> 最早在 v1.27 引入，v1.29 进入 Beta 阶段，现在在 v1.30 的 kubectl 命令中已经默认支持了。

### 自动伸缩 - 基于容器资源的 Pod 自动伸缩正式发布

在 [KEP-1610 Container Resource based Autoscaling](https://github.com/kubernetes/enhancements/issues/1610) 中，arjunrn 和社区成员提出了一种基于容器资源使用的水平自动扩缩容（HPA）机制，以更精细地控制资源的自动扩缩容，核心主要是针对那些容器使用情况不一致或并非总是同步变化的工作负载。

比如作者介绍的 sidecar 模式下的多个服务容器，或者性能敏感型的应用，在这些用例下，如果要为不同容器提供资源配额支持，各个容器可能需要独立配置资源使用，并不能依赖 HPA 控制器的默认行为进行自动伸缩。

> 最早在 v1.19 引入在 v1.27 进入 Beta 阶段，现在该提案已正式发布。

### 安全 - 用于准入控制的 CEL

在过去，自定义策略的执行方式是通过 Admission Webhook 进行的。Admission Webhooks 非常灵活，但与进程内策略执行相比有一些缺点：

- 需要构建基础设施来托管 Admission Webhook
- 可能导致网络延迟
- 由于额外的基础设施依赖性，Webhook 本质上不如进程内的通信和 Webhook 可靠。这迫使集群操作员不得不在降低整个集群的可用性和限制 Webhooks 执行策略的效率之间进行选择
- 对于集群管理员来说，Webhooks 的管理操作繁重。他们必须对 Webhook 的可观察性、安全性和发布/推出/回滚计划负责

因此在 [KEP-3488 用于准入控制的 CEL](https://github.com/kubernetes/enhancements/issues/3488)中，jpbetz 和社区成员提出，随着 CRD 变得流行，应当提供类似于 PSP 或 PSA 的策略原语和工具，让准入控制变得简单。于是在 v1.26 有了 `ValidatingAdmissionPolicy` 这样的表达式资源。

CEL 的引入使集群管理员能够制定复杂的规则，这些规则可以根据集群的所需状态和策略评估 API 请求的内容，而无需求助于基于 Webhook 的 Controller。简单来说，现在我们可以在授权层中动态检查 RBAC 权限和请求的资源相关的上下文，并通过表达式进行程序化判断和拓展流程控制而无需生成复杂的 RBAC 策略或者部署单独的 Webhook 服务。

> 最早在 v1.26 引入，v1.28 进入 Beta 阶段，现在已正式发布。

## 进入 Beta 阶段的功能

### 节点 - NodeLogQuery 节点的日志查询

`kubectl logs` 是用来查询应用运行期间的日志的命令，虽然在过去我们可以通过指定资源类型和选择器标识符来过滤和聚合日志，但是对于节点的日志而言，并没有这样的能力，反而是需要集群管理员通过 SSH 连接到节点进行调试，虽然某些问题需要在节点上通过系统 API 或者 CLI 工具解决，但与 kube-proxy 或 kubelet 有关的问题应该可以由 kubectl 提供相关的节点日志 API 来实现。

因此在 [KEP-2258 Node log query](https://github.com/kubernetes/enhancements/issues/2258) 中由 aravindhp 和社区成员提出了使用 kubelet API 为集群管理员提供无需登录节点调试查看的流式的日志视图。

如果想要使用该功能，需要为该节点启用 `NodeLogQuery` 特性门控，并且为 kubelet 配置 `enableSystemLogHandler` 和 `enableSystemLogQuery` 两个选项，并均设置为 `true`。

在不同系统上，NodeLogQuery 有着不一样的行为：

- 如果系统是 Linux，那么会通过 `journald` 进行查询；
- 如果系统是 Windows，那么会通过 Event Log 进行查询。

> 最早在 v1.27 引入，在本次 v1.30 发布时进入 Beta 阶段。

### API Machinery - CRD 验证棘轮

在 [KEP-4008 CRD Validation Ratcheting](https://github.com/kubernetes/enhancements/issues/4008) 中，alexzielenski 与社区成员提出了一种针对 CRD 的新功能。新功能将会允许特殊的 CRD 校验失败，如果出现了在未经修改的字段上发生的校验失败，即便是校验不通过，也允许对 CRD 资源的更新，并会将修改应用到资源上。

需要通过启用 `CRDValidationRatcheting` 特性门控来激活此功能，并将此功能应用到集群范围内安装的所有 CRD 资源。
### Instrumentation - 带有上下文语境的日志

上下文日志记录在本次的 v1.30 版本中升级为测试版，允许开发人员和集群操作人员通过 `WithValues` 和 `WithName` 将可定制的、可关联的上下文详细信息（例如服务名称，追踪 ID 和事务 ID）注入到日志中。

此增强功能简化了分布式系统之间日志数据的关联和分析，显着提高了故障排除工作的效率。

### 网络 - 允许 Kubernetes 感知 LoadBalancer 的行为

`LoadBalancerIPMode` 特性门控现在还处于测试阶段，不过已经默认启用了。这样的功能仅在 `.status.loadBalancer.ingress.ip` 字段已经配置的情况下，允许为 `type` 为 `LoadBalancer` 的服务配置 `.status.loadBalancer.ingress.ipMode` 字段，配置后将会指定和配置 LoadBalancer IP 的行为方式。

## 进入 Alpha 阶段的功能

- [KEP-1710 存储 - 提升递归修改 SELinux 标签的速度](https://github.com/kubernetes/enhancements/issues/1710)
- [KEP-3857 节点 - 递归的只读挂载](https://github.com/kubernetes/enhancements/issues/3857)
- [KEP-3998 应用负载 - 评判 Job 成功和完成的策略](https://github.com/kubernetes/enhancements/issues/3998)
- [KEP-4444 通过 `trafficDistribution` 配置的 Service 的流量分配配置选项](https://github.com/kubernetes/enhancements/issues/4444)
- [KEP-4368 允许 Job 的协调过程被委派给外部控制器的 `manage-by` 工作机制](https://github.com/kubernetes/enhancements/issues/4368)

## 删除和废弃

### 安全/鉴权/测试 - SecurityContextDeny 已被移除

在 v1.27 时已经被标记为废弃，现在 `SecurityContextDeny` 已经被正式移除，建议迁移到并使用自 v1.25 开始支持的 Pod Security 准入插件。

## DaoCloud 社区贡献

在 v1.30 的发布周期中，DaoCloud 的多名研发工程师取得了不少成就。其中：

- [范宝发（carlory）](https://github.com/carlory)成为 SIG-Storage 和 CSI Reviewer；
- [殷纳（kerthcet）](https://github.com/kerthcet)成为了 Kubernetes 子项目 [LeaderWorkerSet](https://github.com/kubernetes-sigs/lws) 的项目 Approver。

> [LeaderWorkerSet](https://github.com/kubernetes-sigs/lws) 项目是关于通过引入新的 LeaderWorkerSet 资源允许管理和水平伸缩跨节点的 Stateful（有状态工作负载）的项目。在 AI 热门的当下，使用 LeaderWorkerSet 可以方便地管理和调度诸如 LLM 和大型 AI 模型时所需的模型并行和数据并行的工作负载。

## 发行说明

上述内容就是最可爱的 Kubernetes v1.30 发布版本 Uwubernetes ❤️ 的更新和内容啦，更多的发布说明可以查看 Kubernetes v1.30 版本的完整详细信息：`https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md`。

祝愿大家能在社区里找到属于自己的位置，寻找到属于自己的幸福，让自己和集群变得可爱 UwU ♥️

我们下次版本发布时再见！

## 其他以本人署名的发布位置

发布在了公司的微信公众号上哦：https://mp.weixin.qq.com/s/G3LuoGqCqQ1vv4vZqWYBxw

也发布在了 DaoCloud 的开源团队自己的文档 Repo：https://github.com/DaoCloud-OpenSource/docs/blob/main/kubernetes/sig-release/v1.30/release.md

## 参考

1. Kubernetes 增强特性 <https://kep.k8s.io/>
2. Kubernetes 1.30 发布团队 <https://github.com/kubernetes/sig-release/blob/master/releases/release-1.30>
3. Kubernetes 1.30 变更日志 <https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md>
4. Kubernetes 1.30 主题讨论 <https://github.com/kubernetes/sig-release/discussions/2424>
