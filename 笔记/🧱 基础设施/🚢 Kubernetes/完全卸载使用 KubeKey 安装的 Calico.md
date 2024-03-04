---
tags:
  - 计算机/网络/Calico
  - 运维/Calico
  - 软件/云原生/Calico
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 计算机/网络
---
# 完全卸载使用 KubeKey 安装的 Calico

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| Debian       | 11     |                                   |
| Kubernetes   | 1.22.12   | https://v1-22.docs.kubernetes.io/ |
| Docker       | 24.0.2 | https://docs.docker.com/          |
| containerd   | 1.7.6  |                                   |
| Linux kernel | 5.10.0 |                                   |
| Calico       |        |                                   |

## 删除相关资源

```shell
sudo kubectl -n kube-system delete ds calico-node
sudo kubectl -n kube-system delete deploy calico-kube-controllers
sudo kubectl -n kube-system delete sa calico-node
sudo kubectl -n kube-system delete sa calico-kube-controllers
sudo kubectl -n kube-system delete cm calico-config
sudo kubectl -n kube-system delete secret calico-config
```

## 移除 Calico 的 CNI 配置

```shell
sudo rm -rf /etc/cni/net.d/calico-kubeconfig
```

## 移除相关 CRD

```shell
sudo kubectl get crd | grep calico | awk '{print $1}' | xargs sudo kubectl delete crd
```

## 移除网卡

```shell
sudo ifconfig tunl0 down
```

## 检查是否还有遗漏资源

```shell
sudo kubectl get all --all-namespaces | egrep "calico|tigera"
sudo kubectl api-resources --verbs=list --namespaced -o name | egrep "calico|tigera"
sudo kubectl api-resources --verbs=list -o name  | egrep "calico|tigera"
```

## 重启节点

执行完之后请务必重启节点。
