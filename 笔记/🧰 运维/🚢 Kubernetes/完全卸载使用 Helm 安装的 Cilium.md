---
tags:
  - 运维/Kubernetes
  - 运维/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 网络
  - 命令行/helm
  - 软件/云原生/helm
  - 命令行/ip
  - Linux
  - 操作系统/Linux
  - Linux/命令行
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 命令行/cilium
  - 软件/开源/Cilium
  - 软件/云原生/Cilium
  - 运维/Cilium
  - 网络/Cilium
---
# 完全卸载使用 Helm 安装的 Cilium

```shell
sudo cilium uninstall
```

```shell
sudo helm uninstall cilium -n kube-system
```

```shell
sudo kubectl get crd | grep cilium | awk '{print $1}' | xargs sudo kubectl delete crd
```

检查一下名字中含有 cilium 的资源：

```shell
sudo kubectl get all --all-namespaces | egrep "cilium"
```

接下来在每个节点上执行：

1. 清理 CNI 配置：

```shell
sudo rm -rf /etc/cni/net.d/
```

2. 完全清理网卡：

```shell
sudo ip link list | grep lxc | awk '{print $2}' | cut -c 1-15 | xargs -I {} sudo ip link delete {}
```

```shell
sudo ip link list | grep cilium_net@cilium_host | awk '{print $2}' | cut -c 1-10 | xargs -I {} sudo ip link delete {}
```

```shell
sudo ip link list | grep cilium_host@cilium_net | awk '{print $2}' | cut -c 1-11 | xargs -I {} sudo ip link delete {}
```

3. 更新路由：

```shell
sudo ip route flush proto bird
```

4. 重启节点