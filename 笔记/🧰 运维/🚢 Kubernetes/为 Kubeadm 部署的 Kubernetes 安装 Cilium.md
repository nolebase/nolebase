---
tags:
  - 运维/Kubernetes
  - 运维/Kubernetes/K8s
  - 开发/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 运维/Cilium
  - 命令行/cilium
  - 软件/开源/Cilium
  - 软件/云原生/Cilium
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 软件/云原生/kube-proxy
  - 网络/Cilium
---
# 为 Kubeadm 部署的 Kubernetes 安装 Cilium

官方文档 [Installation using kubeadm — Cilium 1.14.2 documentation](https://docs.cilium.io/en/stable/installation/k8s-install-kubeadm/) 说我们在使用 `kubeadm` 部署 Kubernetes 的时候需要给 `kubeadm` 添加 `--skip-phases=addon/kube-proxy` 参数。

```shell
hubble:
  relay:
    enabled: true
  ui:
    enabled: true

ipam:
  mode: 'kubernetes'
  operator:
    clusterPoolIPv4PodCIDRList: '10.244.0.0/16'

ipv4NativeRoutingCIDR: '10.244.0.0/16'
enableIPv4Masquerade: true
enableIPv6Masquerade: true
```