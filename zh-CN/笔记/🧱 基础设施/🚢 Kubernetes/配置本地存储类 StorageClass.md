---
tags:
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes/存储类
  - 开发/云原生/Kubernetes/存储类/StorageClass
  - 开发/云原生/Kubernetes/存储
  - 开发/云原生/容器存储接口
  - 开发/云原生/容器存储接口/CSI
  - 开发/云原生/Kubernetes/持久卷
  - 开发/云原生/Kubernetes/持久卷/PresistentVolume
  - 开发/云原生/Kubernetes/持久卷申领/PresistentVolumeClaim
  - 开发/云原生/Kubernetes/持久卷申领
---
# 配置本地存储类 StorageClass

对于没有安装其他的 CSI（容器存储接口）驱动和第三方存储插件（诸如 Ceph，或者直接使用的 EBS，AWS Elastic Kubernetes Service 这样的服务）的情况下，在使用持久卷（PersistentVolume）和持久卷申领（PersistentVolumeClaim）之前你需要配置一下基于没有提供商的存储类 StorageClass：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

在 StackOverflow 上和其他若干众多的 Kubernetes 知识点网站上也会使用 `local-path`，`local` 以及 `manual` 作为 `metadata.name` 的值：

::: code-group

```yaml [命名为 local-path]
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

```yaml [命名为 local]
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

```yaml [命名为 manual]
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

:::

在这之后你就可以继续进行持久卷（PresistentVolume）和持久卷申领（PresistentVolumeClaim）的配置了。
