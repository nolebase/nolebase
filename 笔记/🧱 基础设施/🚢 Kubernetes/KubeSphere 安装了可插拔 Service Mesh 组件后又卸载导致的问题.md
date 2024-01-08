---
tags:
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 命令行/kubectl
  - 运维/云原生/Kubernetes/KubeSphere
  - 开源/软件/KubeSphere
  - 开发/云原生/网络/服务网格/Service-Mesh
  - 开发/云原生/网络/服务网格
---
# KubeSphere 安装了可插拔 Service Mesh 组件后又卸载导致的问题

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| KubeSphere | v3.3.0 | [https://kubesphere.io/zh/docs/v3.3/](https://kubesphere.io/zh/docs/v3.3/) |
| Kubernetes | v1.22.0 | [https://v1-22.docs.kubernetes.io/](https://v1-22.docs.kubernetes.io/) |

## 说明

我在尝试手动通过 `kubectl` 命令为 k8s 集群上的 deployment 更新其部署的镜像，以方便集成到 Circle CI 并打通整个 CI/CD 流程来替换我们先前的 Docker Swarm 相关的命令操作。
但令人惊奇的是，我使用 `kubectl rollout restart` 和 `kubectl set image` 这两个命令都无法为先前创建的 deployment 进行更新，甚至是 `kubectl apply` 也失效了。

由于这些命令能够正确返回，并没有报错，所以起初我没有扩大范围去排查和 debug，我以为只是我没有好好阅读对于 `kubectl rollout restart` 这个命令的描述文档而导致的，这致使我一直在尝试查找资料和阅读 Issue、文档等内容来加深理解和学习具体的工作方式和需要注意的内容，但直到我发现 KubeSphere 提供的 WebUI，以及 `kubectl set image` 和 `kubectl apply` 这两个更强制的命令都失效之后才恍然大悟：也许是集群上出现了什么问题。

## 排查过程

我看了看每一个 KubeSphere 核心组件的状态，它们都是正常的。
也或许日志里会有什么线索？于是我看了看提供用于集群管理的 API 接口服务 `ks-apiserver`，发现有这么几行错误：

```
E1101 23:23:34.180786 1 utils.go:76] /workspace/pkg/kapis/resources/v1alpha3/handler.go:289 GET https://hub.example.com/v2/namespace/repo/manifests/latest: unexpected status code 401 Unauthorized: <html>
<head><title>401 Authorization Required</title></head>
<body>
<center><h1>401 Authorization Required</h1></center>
<hr><center>nginx/1.18.0</center>
</body>
</html>
```

这看起来是在访问私有 Docker Registry 的时候出现的问题，于是我去 KubeSphere 的 WebUI 上尝试编辑 deployment 的容器镜像来尝试让 KubeSphere 拉取到镜像的信息，发现在 WebUI 上编辑容器镜像的时候是能够正常拉取镜像和镜像 manifest 信息的，那说明应该不是这个问题，至少不会报 `401 Authorization Required` 的错误。
那会是哪里出了问题呢？也许是 Kubernetes 的核心服务出了问题？我去检查了 `kube-controller-manager-svc` （用于内嵌随 Kubernetes 一起发布的核心控制回路）的容器日志，然后发现了这么些错误和信息：

```
I1101 23:26:30.165776 1 event.go:291] "Event occurred" object="namespace/service-v1-688965cd66" kind="ReplicaSet" apiVersion="apps/v1" type="Warning" reason="FailedCreate" message="Error creating: Internal error occurred: failed calling webhook \"rev.object.sidecar-injector.istio.io\": failed to call webhook: Post \"https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s\": service \"istiod-1-11-2\" not found"

E1101 23:26:30.329218 1 replica_set.go:536] sync "namespace/service-v1-688965cd66" failed with Internal error occurred: failed calling webhook "rev.object.sidecar-injector.istio.io": failed to call webhook: Post "https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s": service "istiod-1-11-2" not found

I1101 23:26:30.329252 1 event.go:291] "Event occurred" object="namespace/service-v1-688965cd66" kind="ReplicaSet" apiVersion="apps/v1" type="Warning" reason="FailedCreate" message="Error creating: Internal error occurred: failed calling webhook \"rev.object.sidecar-injector.istio.io\": failed to call webhook: Post \"https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s\": service \"istiod-1-11-2\" not found"

E1101 23:26:30.651984 1 replica_set.go:536] sync "namespace/service-v1-688965cd66" failed with Internal error occurred: failed calling webhook "rev.object.sidecar-injector.istio.io": failed to call webhook: Post "https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s": service "istiod-1-11-2" not found

I1101 23:26:30.652267 1 event.go:291] "Event occurred" object="namespace/service-v1-688965cd66" kind="ReplicaSet" apiVersion="apps/v1" type="Warning" reason="FailedCreate" message="Error creating: Internal error occurred: failed calling webhook \"rev.object.sidecar-injector.istio.io\": failed to call webhook: Post \"https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s\": service \"istiod-1-11-2\" not found"

E1101 23:26:31.296499 1 replica_set.go:536] sync "namespace/service-v1-688965cd66" failed with Internal error occurred: failed calling webhook "rev.object.sidecar-injector.istio.io": failed to call webhook: Post "https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s": service "istiod-1-11-2" not found

I1101 23:26:31.296517 1 event.go:291] "Event occurred" object="namespace/service-v1-688965cd66" kind="ReplicaSet" apiVersion="apps/v1" type="Warning" reason="FailedCreate" message="Error creating: Internal error occurred: failed calling webhook \"rev.object.sidecar-injector.istio.io\": failed to call webhook: Post \"https://istiod-1-11-2.istio-system.svc:443/inject?timeout=10s\": service \"istiod-1-11-2\" not found"
```

看起来大概是找到了问题了，与我们需要配置的 deployment 名字相关，也确实是在执行 `ReplicaSet` 操作，但是这个 `failed calling webhook "rev.object.sidecar-injector.istio.io"` 是什么错误呢？我想起来我之前在尝试配置 KubeSphere 的可插拔组件 Service Mesh 的时候有提到 Service Mesh 是由 Istio 提供的，也许是在我后来卸载 Service Mesh 可插拔组件的时候没有完全清理完资源导致的？
我尝试搜索了一下这个错误，发现挺多人遇到的。但解决起来也非常简单就是了。

## 解决问题

我们需要检查两个资源，分别是 `ValidatingWebhookConfiguration` 和 `MutatingWebhookConfiguration`，使用下列命令就能看到：

```shell
$ kubectl get ValidatingWebhookConfiguration

NAME                                          WEBHOOKS   AGE
istio-validator-1-11-2-istio-system           2          8d
```

```shell
$ kubectl get MutatingWebhookConfiguration

NAME                            WEBHOOKS   AGE
istio-sidecar-injector-1-11-2   2          8d
```

接下来只需要运行下面的两个命令就能清理掉错误的资源了：

```shell
kubectl delete ValidatingWebhookConfiguration istio-validator-1-11-2-istio-system
```

```shell
kubectl delete MutatingWebhookConfiguration istio-sidecar-injector-1-11-2
```


## 参考资料

[卸载istio组件之后出现问题 - KubeSphere 开发者社区](https://kubesphere.com.cn/forum/d/7378-istio)

[记录k8s中安装kubeSphere的一些问题_xiaoxiaosu1996的博客-CSDN博客](https://blog.csdn.net/xiaoxiaosu1996/article/details/122873848)

[kubesphere 卸载 istio后 部署服务一直处理队列中_山巅的博客-CSDN博客_kubesphere 队列中](https://blog.csdn.net/shandian534/article/details/125987789)
