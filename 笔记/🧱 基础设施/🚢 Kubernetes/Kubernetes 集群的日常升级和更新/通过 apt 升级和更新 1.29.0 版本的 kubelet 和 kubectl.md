---
tags:
  - 计算机/操作系统/Linux
  - 操作系统/Debian
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
  - 操作系统/Debian/Debian-12
---

# 通过 apt 升级和更新 1.29.0 版本的 kubelet 和 kubectl

## 检查依赖状态

```shell
sudo apt info kubelet
```

```shell
sudo apt info kubectl
```

一般而言，1.28 的集群对应的 `apt` Repository 应该都是

```
https://pkgs.k8s.io/core:/stable:/v1.28/deb
```

如果确定 `apt` 的 Repository 是预期内的结果，比如下面这样：

```shell
$ sudo apt info kubectl
Package: kubectl
Version: 1.28.4-1.1
Priority: optional
Section: admin
Maintainer: Kubernetes Authors <dev@kubernetes.io>
Installed-Size: 49.9 MB
Homepage: https://kubernetes.io
Download-Size: 10.3 MB
APT-Sources: https://pkgs.k8s.io/core:/stable:/v1.28/deb  Packages # [!code hl]
Description: Command-line utility for interacting with a Kubernetes cluster
 Command-line utility for interacting with a Kubernetes cluster.

N: 有 4 条附加记录。请加上 ‘-a’ 参数来查看它们
```

那么我们再继续。

## 解除 Debian `apt` 依赖锚定（hold）

可以先看看 `apt-mark` 里面是否记录了 `kubelet` 的锚定（hold）：

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
kubeadm
kubectl
kubelet
```

可以先解除锚定。通过下面的命令就可以解除锚定，我们一个一个来：

```shell
sudo apt-mark unhold kubelet
sudo apt-mark unhold kubectl
```

## 明确目标版本并升级

```shell
$ sudo apt-cache madison kubelet
   kubelet | 1.29.0-1.1 | https://pkgs.k8s.io/core:/stable:/v1.29/deb  Packages
```

```shell
$ sudo apt-cache madison kubectl
   kubectl | 1.29.0-1.1 | https://pkgs.k8s.io/core:/stable:/v1.29/deb  Packages
```

接下来定向升级：

```shell
sudo apt update && sudo apt install -y kubelet='1.29.0-*' kubectl='1.29.0-*'
```

升级完成之后确保 `kubelet --version` 的输出符合预期

```shell
$ kubelet --version
Kubernetes v1.29.0
```

以及 `kubectl version` 的输出符合预期

```shell
$ kubectl version
Client Version: v1.29.0 # [!code hl]
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
```

## 还原 Debian `apt` 依赖锚定（hold）

```shell
sudo apt-mark hold kubelet
sudo apt-mark hold kubectl
```

锚定之后检查一下：

```shell
sudo apt-mark showhold | more
```

## 刷新 Systemd 并重启 `kubelet` 守护进程

```shell
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

检查一下 `kubelet` 服务

```shell
sudo systemctl status kubelet
```

```shell
$ sudo systemctl status kubelet
● kubelet.service - kubelet: The Kubernetes Node Agent
     Loaded: loaded (/lib/systemd/system/kubelet.service; enabled; preset: enabled)
    Drop-In: /usr/lib/systemd/system/kubelet.service.d
             └─10-kubeadm.conf
     Active: active (running) since Thu 2023-12-21 22:18:27 CST; 10min ago
       Docs: https://kubernetes.io/docs/
   Main PID: 20669 (kubelet)
      Tasks: 14 (limit: 9830)
     Memory: 43.1M
        CPU: 19.633s
     CGroup: /system.slice/kubelet.service
             └─20669 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --container->

12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.179906   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"cni-path\" (UniqueName: \">
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.180071   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"host-proc-sys-net\" (Uniqu>
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.180169   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"host-proc-sys-kernel\" (Un>
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.180432   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"cilium-run\" (UniqueName: >
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.180526   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"etc-cni-netd\" (UniqueName>
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.180979   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"lib-modules\" (UniqueName:>
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.181125   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"hostproc\" (UniqueName: \">
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.181219   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"xtables-lock\" (UniqueName>
12月 21 22:18:29 node3 kubelet[20669]: I1221 22:18:29.181452   20669 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"bpf-maps\" (UniqueName: \">
12月 21 22:18:58 node3 kubelet[20669]: I1221 22:18:58.403647   20669 prober_manager.go:312] "Failed to trigger a manual run" probe="Readiness"
```

不慌，`kubelet` 能正常起来就行。

接下来返回 [[1.28.4 升级和更新到 1.29.0 的操作步骤]] 继续操作吧。
