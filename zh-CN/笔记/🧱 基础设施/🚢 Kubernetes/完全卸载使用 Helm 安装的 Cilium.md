---
tags:
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 计算机/网络
  - 命令行/helm
  - 软件/云原生/helm
  - 命令行/ip
  - 计算机/操作系统/Linux
  - 操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 命令行/cilium
  - 软件/云原生/Cilium
  - 运维/Cilium
  - 计算机/网络/Cilium
---
# 完全卸载使用 Helm 安装的 Cilium

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| Debian       | 11     |                                   |
| Kubernetes   | 1.28   | https://v1-28.docs.kubernetes.io/ |
| Docker       | 24.0.2 | https://docs.docker.com/          |
| containerd   | 1.7.6  |                                   |
| Linux kernel | 5.10.0 |                                   |
| Cilium       | 1.14.2 | https://docs.cilium.io/en/v1.14/  |
| helm         | v3.9.0 | https://helm.sh/docs/             |

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
