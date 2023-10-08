---
tags:
  - 网络/Calico
  - 运维/Calico
  - 软件/开源/Calico
  - 软件/云原生/Calico
  - 运维/Kubernetes
  - 运维/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - Linux
  - Linux/命令行
  - 操作系统/Linux
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 网络
---
## 删除相关资源

::: warning ⚠️ 注意
这一步执行完之后需要重启一下集群节点以应用配置。
:::

```shell
sudo kubectl -n kube-system delete ds calico-node
sudo kubectl -n kube-system delete deploy calico-kube-controllers
sudo kubectl -n kube-system delete sa calico-node
sudo kubectl -n kube-system delete sa calico-kube-controllers
sudo kubectl -n kube-system delete cm calico-config
sudo kubectl -n kube-system delete secret calico-config
```

## 移除 Calico 的 CNI 配置

::: warning ⚠️ 注意
这一步执行完之后需要重启一下集群节点以应用配置。
:::

```shell
sudo rm -rf /etc/cni/net.d/calico-kubeconfig
```

## 移除相关 CRD

::: warning ⚠️ 注意
这一步执行完之后需要重启一下集群节点以应用配置。
:::

```shell
sudo kubectl get crd | grep calico | awk '{print $1}' | xargs sudo kubectl delete crd
```

## 移除网卡

::: warning ⚠️ 注意
这一步执行完之后需要重启一下集群节点以应用配置。
:::

```shell
sudo ifconfig tunl0 down
```

## 检查是否还有遗漏资源

```shell
sudo kubectl get all --all-namespaces | egrep "calico|tigera"
sudo kubectl api-resources --verbs=list --namespaced -o name | egrep "calico|tigera"
sudo kubectl api-resources --verbs=list -o name  | egrep "calico|tigera"
```