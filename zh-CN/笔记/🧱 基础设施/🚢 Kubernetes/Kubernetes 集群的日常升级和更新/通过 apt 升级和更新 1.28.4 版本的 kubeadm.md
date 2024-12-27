---
tags:
  - 计算机/操作系统/Linux
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 操作系统/Unix
  - 运维/云原生/Kubernetes/K8s
  - 运维/云原生/Kubernetes
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 软件/云原生/kubelet
  - 命令行/apt
  - 计算机/网络/Cilium
  - 运维/Cilium
  - 命令行/cilium
  - 软件/云原生/Cilium
---

# 通过 apt 升级和更新 1.28.4 版本的 kubeadm

## 解除 Debian `apt` 依赖锚定（hold）

可以先看看 `apt-mark` 里面是否记录了 `kubeadm` 的锚定（hold）：

```shell
sudo apt-mark showhold | more
```

或者

```shell
sudo dpkg --get-selections | grep 'hold$' | more
```

如果返回值像是这样：

```shell
$ sudo apt-mark showhold | more
kubeadm # [!code hl]
kubectl
kubelet
```

可以先解除锚定。通过下面的命令就可以解除锚定，我们一个一个来：

```shell
sudo apt-mark unhold kubeadm
```

## 明确目标版本并升级

```shell
sudo apt search kubeadm
```

就像这样

```shell
$ sudo apt search kubeadm
正在排序... 完成
全文搜索... 完成
kubeadm/未知 1.28.4-1.1 amd64 [可从该版本升级：1.28.2-1.1] # [!code hl]
  Command-line utility for administering a Kubernetes cluster
```

接下来定向升级：

```shell
sudo apt update && sudo apt install -y kubeadm='1.28.4-*'
```

升级完成之后确保 `kubeadm version` 的输出符合预期

```shell
sudo kubeadm version
```

比如

```shell
$ sudo kubeadm version
kubeadm version: &version.Info{Major:"1", Minor:"28", GitVersion:"v1.28.4", GitCommit:"bae2c62678db2b5053817bc97181fcc2e8388103", GitTreeState:"clean", BuildDate:"2023-11-15T16:56:18Z", GoVersion:"go1.20.11", Compiler:"gc", Platform:"linux/amd64"}
```

## 还原 Debian `apt` 依赖锚定（hold）

```shell
sudo apt-mark hold kubeadm
```

锚定之后检查一下：

```shell
sudo apt-mark showhold | more
```

接下来返回 [[1.28.2 升级和更新的操作步骤]]继续操作吧。
