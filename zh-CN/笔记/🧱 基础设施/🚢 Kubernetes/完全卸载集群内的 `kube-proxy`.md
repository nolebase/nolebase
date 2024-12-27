---
tags:
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 软件/云原生/kubelet
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 命令行/ip
  - 命令行/ipvsadm
  - 软件/云原生/ipvsadm
  - 计算机/网络/Calico
  - 运维/Calico
  - 软件/云原生/Calico
  - 运维/Cilium
  - 计算机/网络/Cilium
  - 命令行/cilium
  - 软件/云原生/Cilium
---
# 完全卸载集群内的 `kube-proxy`

### 文档兼容性

| 主体    | 版本号 | 文档地址（如果有）                |
| ------- | ------ | --------------------------------- |
| kubeadm | 1.28   | https://v1-28.docs.kubernetes.io/ |

根据 [k8s系列15-calico有损迁移至cilium](https://tinychen.com/20230201-k8s-15-migrate-cni-from-calico-to-cilium/) 技术文档所分享的，我们可以在安装前配置和备份一下 `kube-proxy` 相关资源和配置文件：

## 备份 `kube-proxy` 相关的配置

```shell
sudo kubectl get ds -n kube-system kube-proxy -o yaml > kube-proxy-daemonset.yaml
sudo kubectl get cm -n kube-system kube-proxy -o yaml > kube-proxy-configmap.yaml
```

## 删除相关的 `DaemonSet`

```shell
$ sudo kubectl -n kube-system delete ds kube-proxy
daemonset.apps "kube-proxy" deleted
```

## 删除相关的 `ConfigMap`

目的是为了**防止以后使用 `kubeadm` 升级 K8s 的时候重新安装了 `kube-proxy`（1.19 版本之后的 K8S ）**。

```shell
$ sudo kubectl -n kube-system delete cm kube-proxy
configmap "kube-proxy" deleted
```

## 清除掉 `iptables` 规则和 `ipvs` 规则以及 `ipvs0` 网卡

在每个节点机器上面使用 `root` 权限执行：

```shell
sudo iptables-save | grep -v KUBE | sudo iptables-restore
sudo ipvsadm -C
sudo ip link del kube-ipvs0
```

## 重启节点

执行完之后请务必重启节点。
