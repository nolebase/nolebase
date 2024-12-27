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

# 通过 apt 升级和更新 1.28.4 版本的 kubelet 和 kubectl

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
sudo apt search kubelet
sudo apt search kubectl
```

就像这样

```shell
$ sudo apt search kubelet
正在排序... 完成
全文搜索... 完成
kubelet/未知,now 1.28.4-1.1 amd64 [已安装] # [!code hl]
  Node agent for Kubernetes clusters
```

```shell
$ sudo apt search kubectl
正在排序... 完成
全文搜索... 完成
kubecolor/oldstable 0.0.9-2+b5 amd64
  colorizes kubectl output

kubectl/未知,now 1.28.4-1.1 amd64 [已安装] # [!code hl]
  Command-line utility for interacting with a Kubernetes cluster

kubernetes-client/oldstable 1.20.5+really1.20.2-1 amd64
  Kubernetes client binary (kubectl)

kubetail/oldstable 1.6.5-2 all
  Aggregate logs from multiple Kubernetes pods into one stream
```

接下来定向升级：

```shell
sudo apt update && sudo apt install -y kubelet='1.28.4-*' kubectl='1.28.4-*'
```

升级完成之后确保 `kubelet --version` 的输出符合预期

```shell
$ kubelet --version
Kubernetes v1.28.4
```

以及 `kubectl version` 的输出符合预期

```shell
$ kubectl version
Client Version: v1.28.4  # [!code hl]
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
     Loaded: loaded (/lib/systemd/system/kubelet.service; enabled; vendor preset: enabled)
    Drop-In: /usr/lib/systemd/system/kubelet.service.d
             └─10-kubeadm.conf
     Active: active (running) since Fri 2023-12-01 13:34:24 CST; 46s ago  # [!code hl]
       Docs: https://kubernetes.io/docs/
   Main PID: 21764 (kubelet)
      Tasks: 15 (limit: 9830)
     Memory: 35.6M
        CPU: 2.696s
     CGroup: /system.slice/kubelet.service
             └─21764 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --container-runtime-endpoint=unix:///run/containerd/containerd.sock --pod-infra-container-image=registry.k8s.io/pause:3.9

12月 01 13:34:25 node1 kubelet[21764]: I1201 13:34:25.938321   21764 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"cni-path\" (UniqueName: \"kubernetes.io/host-path/5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4-cni-path\") pod \"cilium-d4pdg\" (UID: \"5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4\") " pod="kube-system/cilium-d4p>
12月 01 13:34:25 node1 kubelet[21764]: I1201 13:34:25.938445   21764 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"lib-modules\" (UniqueName: \"kubernetes.io/host-path/5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4-lib-modules\") pod \"cilium-d4pdg\" (UID: \"5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4\") " pod="kube-system/cili>
12月 01 13:34:25 node1 kubelet[21764]: I1201 13:34:25.938575   21764 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"host-proc-sys-kernel\" (UniqueName: \"kubernetes.io/host-path/5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4-host-proc-sys-kernel\") pod \"cilium-d4pdg\" (UID: \"5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4\") " pod>
12月 01 13:34:25 node1 kubelet[21764]: I1201 13:34:25.938784   21764 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"bpf-maps\" (UniqueName: \"kubernetes.io/host-path/5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4-bpf-maps\") pod \"cilium-d4pdg\" (UID: \"5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4\") " pod="kube-system/cilium-d4p>
12月 01 13:34:25 node1 kubelet[21764]: I1201 13:34:25.938892   21764 reconciler_common.go:258] "operationExecutor.VerifyControllerAttachedVolume started for volume \"etc-cni-netd\" (UniqueName: \"kubernetes.io/host-path/5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4-etc-cni-netd\") pod \"cilium-d4pdg\" (UID: \"5a42ced5-9314-4d7b-b9fa-6184bb4ab5b4\") " pod="kube-system/ci>
12月 01 13:34:26 node1 kubelet[21764]: E1201 13:34:26.156467   21764 kubelet.go:1890] "Failed creating a mirror pod for" err="pods \"kube-controller-manager-node1\" already exists" pod="kube-system/kube-controller-manager-node1"
12月 01 13:34:26 node1 kubelet[21764]: E1201 13:34:26.156586   21764 kubelet.go:1890] "Failed creating a mirror pod for" err="pods \"kube-scheduler-node1\" already exists" pod="kube-system/kube-scheduler-node1"
12月 01 13:34:26 node1 kubelet[21764]: E1201 13:34:26.156487   21764 kubelet.go:1890] "Failed creating a mirror pod for" err="pods \"etcd-node1\" already exists" pod="kube-system/etcd-node1"
12月 01 13:34:26 node1 kubelet[21764]: E1201 13:34:26.157718   21764 kubelet.go:1890] "Failed creating a mirror pod for" err="pods \"kube-apiserver-node1\" already exists" pod="kube-system/kube-apiserver-node1"
12月 01 13:34:54 node1 kubelet[21764]: I1201 13:34:54.945083   21764 prober_manager.go:312] "Failed to trigger a manual run" probe="Readiness"
```

不慌，`kubelet` 能正常起来就行。

接下来返回 [[1.28.2 升级和更新的操作步骤]]继续操作吧。
