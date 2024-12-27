---
tags:
  - AI
  - 命令行/dcgmi
  - AI/硬件/GPU/NVIDIA
  - AI/硬件/GPU/NVIDIA/GPU
  - 开发/云原生/Kubernetes
  - 运维/云原生/Kubernetes
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 命令行/nv-hostengine
  - 软件/nv-hostengine
  - 软件/开源/DCGM
  - 基础设施/GPU/DCGM
---
# `nv-hostengine` 的启动和补充知识

## TL;DR

如果是想要解决在使用 `dcgmi` 和 `dcgmi discovery -l` 相关的命令的时候遭遇的 `unable to establish a connection to the specified host: localhost` 和 `Unable to connect to host engine. Host engine connection invalid/disconnected.` 错误，可以通过在 `dcgm-exporter` Pod 中直接调用 `nv-hostengine` 二进制命令启动 `nv-hostengine` 来启动 `nv-hostengine`

## 启动一个 `nv-hostengine` 实例

在接下来的例子中我都会直接使用 GPU Operator 自带和附属的 `dcgm-exporter` Pod 资源内置的工具和命令行，这样节点设备上就无需再安装和折腾 [NVIDIA DCGM (Data Center GPU Manager)](https://cloud-atlas.readthedocs.io/zh-cn/latest/machine_learning/hardware/nvidia_gpu/nvidia_dcgm/index.html#nvidia-dcgm) 了。

找到 `dcgm-exporter` 的 Pod ID 并进入 Pod 之后可以通过

```shell
ps -A
```

查看当前 `dcgm-exporter` 容器内所有的进程来确认是否开启了 `nv-hostengine`：

```shell
root@nvidia-dcgm-exporter-pkcrb:/$ ps -A
    PID TTY          TIME CMD
      1 ?        00:00:02 dcgm-exporter
     40 pts/0    00:00:00 bash
     48 pts/0    00:00:00 ps
```

在启动前，也需要检查是否在 `PATH` 指定的路径中能搜索到 `nv-hostengine` 的二进制文件：

```shell
root@nvidia-dcgm-exporter-pkcrb:/$ which nv-hostengine
/usr/bin/nv-hostengine
```

然后直接调用二进制启动就好了，接下来 `nv-hostengine` 就会开始在 `localhost:5555` 监听并处理未来的请求：

```shell
root@nvidia-dcgm-exporter-pkcrb:/$ nv-hostengine
Started host engine version 3.3.0 using port number: 5555
```

## 拓展知识

### 配合 `dcgmi` 模拟 DCGM 的错误指标和数据

DCGM 的文档中有对错误模拟和注入的文档：[Error Injection — NVIDIA DCGM Documentation latest documentation](https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-error-injection.html#overview)

它的步骤和逻辑是这样的：

- 启动 `nv-hostengine` 守护进程
- 通过 DCGM 启动监控
- 确定要注入的 GPU 错误
- 通过 `dcgmi test --inject` 注入错误
- DCGM 应该会提示出对应的错误

### `nv-hostengine` 的奇怪僵尸进程行为

启动 `nv-hostengine` 之后通过

```shell
ps -A
```

再次检查进行中的进程的时候会发现有一个 `<defunct>` 的 `nv-hostengine` 进程：

```shell
root@nvidia-dcgm-exporter-pkcrb:/$ ps -A
    PID TTY          TIME CMD
      1 ?        00:00:04 dcgm-exporter
     61 pts/0    00:00:00 bash
     71 ?        00:00:00 nv-hostengine <defunct>
     72 ?        00:00:00 nv-hostengine
     79 pts/0    00:00:00 ps
```

虽然按照文档介绍的来说的话，不需要的时候可以通过

```shell
nv-hostengine -t
```

去关闭 `nv-hostengine`，但是实际上跑完之后会报错说无法关闭

```shell
nv-hostengine -t
Host engine already running with pid 72
Unable to terminate host engine.
```

就像这样：

```shell
root@nvidia-dcgm-exporter-4f599:/$ nv-hostengine
Host engine already running with pid 357
root@nvidia-dcgm-exporter-4f599:/$ ps -A
    PID TTY          TIME CMD
      1 ?        00:41:59 dcgm-exporter
    320 ?        00:00:00 dcgmproftester1 <defunct>
    321 ?        00:00:00 dcgmproftester1 <defunct>
    322 ?        00:00:00 dcgmproftester1 <defunct>
    323 ?        00:00:00 dcgmproftester1 <defunct>
    324 ?        00:00:00 dcgmproftester1 <defunct>
    325 ?        00:00:00 dcgmproftester1 <defunct>
    326 ?        00:00:00 dcgmproftester1 <defunct>
    327 ?        00:00:00 dcgmproftester1 <defunct>
    356 ?        00:00:00 nv-hostengine <defunct>
    357 ?        00:00:00 nv-hostengine <defunct>
    404 pts/0    00:00:00 bash
    415 pts/0    00:00:00 ps
```

这个时候我找到的唯一的解决办法是通过 `kubectl` 把 `dcgm-exporter` 的 Pod 删掉来解决的。

```shell
root@nvidia-dcgm-exporter-cq8bw:/$ dcgmi discovery -l
8 GPUs found.
+--------+----------------------------------------------------------------------+
| GPU ID | Device Information                                                   |
+--------+----------------------------------------------------------------------+
| 0      | Name: NVIDIA GeForce RTX 3090                                        |
|        | PCI Bus ID: 00000000:1B:00.0                                         |
|        | Device UUID: GPU-69cd4dac-cefb-45e8-9bff-429dfd4bc8c3                |
+--------+----------------------------------------------------------------------+
| 1      | Name: NVIDIA GeForce RTX 3090                                        |
|        | PCI Bus ID: 00000000:1C:00.0                                         |
|        | Device UUID: GPU-ac2d4b59-b78e-42c7-8db6-ef28b01540e1                |
+--------+----------------------------------------------------------------------+
| 2      | Name: NVIDIA GeForce RTX 3090                                        |
|        | PCI Bus ID: 00000000:1D:00.0                                         |
|        | Device UUID: GPU-d8f40ec7-2c07-4d2e-ae9b-a51e7377e052                |
+--------+----------------------------------------------------------------------+
| 3      | Name: NVIDIA GeForce RTX 3090                                        |
|        | PCI Bus ID: 00000000:1E:00.0                                         |
|        | Device UUID: GPU-5f969c85-ffc4-44ac-aa13-10824844087e                |
+--------+----------------------------------------------------------------------+
0 NvSwitches found.
+-----------+
| Switch ID |
+-----------+
+-----------+
2 CPUs found.
+--------+----------------------------------------------------------------------+
| CPU ID | Device Information                                                   |
+--------+----------------------------------------------------------------------+
| 0      | Name: Grace TH500                                                    |
|        | Cores: 0-19,40-59                                                    |
+--------+----------------------------------------------------------------------+
| 1      | Name: Grace TH500                                                    |
|        | Cores: 20-39,60-79                                                   |
+--------+----------------------------------------------------------------------+
```

### 使用 GPU Operator 自带的内置 DCGM 运行嵌入 DCGM Engine

如果你在尝试研究使用嵌入 DCGM Engine，可以参考一下这个 [Error starting embedded DCGM engine · Issue #16 · triton-inference-server/model_analyzer](https://github.com/triton-inference-server/model_analyzer/issues/16) Issue 来配合解决问题。

一般情况下安装 GPU Operator 都不会启动所谓的「嵌入 DCGM Engine」，可以通过 GPU Operator 的源代码来看：[https://github.com/NVIDIA/gpu-operator/blob/4113883838a514cf528ae67f3cf599f79b52fc02/deployments/gpu-operator/values.yaml#L283-L294](https://github.com/NVIDIA/gpu-operator/blob/4113883838a514cf528ae67f3cf599f79b52fc02/deployments/gpu-operator/values.yaml#L283-L294)

这段 Helm 配置会被渲染为 https://github.com/NVIDIA/gpu-operator/blob/4113883838a514cf528ae67f3cf599f79b52fc02/deployments/gpu-operator/templates/clusterpolicy.yaml#L455-L483

而渲染的目标资源类型是 `ClusterPolicy`，资源名称是 `cluster-policy`，这个时候可以通过

```shell
sudo kubectl get ClusterPolicy cluster-policy -o yaml
```

命令查看到当前该资源的配置详细信息：

```yaml
  dcgm:
    enabled: false
    hostPort: 5555
    image: dcgmçç
    imagePullPolicy: IfNotPresent
    repository: nvcr.io/nvidia/cloud-native
    version: 3.3.0-1-ubuntu22.04
```

可以发现，由于 `enabled` 的值最终是 `false`，所以这里面确实没有打开 `dcgm` 模块。

只需要通过

```shell
sudo kubectl edit ClusterPolicy cluster-policy
```

对 `ClusterPolicy` 资源进行编辑并修改 `dcgm.enabled` 为 `true` 即可，然后等待 Pod 启动完成就可以继续用了。

## 延伸阅读

- [Data Center GPU Manager User Guide - Data Center GPU Manager Documentation (nvidia.com)](https://docs.nvidia.com/datacenter/dcgm/2.3/dcgm-user-guide/getting-started.html)

## 参考资料

- [Kubernetes概览 — Cloud Atlas beta 文档](https://cloud-atlas.readthedocs.io/zh-cn/latest/kubernetes/kubernetes_overview.html#vanilla-k8s) 和 [cloud-atlas/source/kubernetes/gpu/dcgm-exporter.rst at a168158169f5aad0f7683d698cc740f1846374fe · huataihuang/cloud-atlas (github.com)](https://github.com/huataihuang/cloud-atlas/blob/a168158169f5aad0f7683d698cc740f1846374fe/source/kubernetes/gpu/dcgm-exporter.rst#%E8%BF%90%E8%A1%8C-dcgm-exporter) 和 [cloud-atlas/source/kubernetes/gpu/dcgm-exporter.rst at a168158169f5aad0f7683d698cc740f1846374fe · huataihuang/cloud-atlas (github.com)](https://github.com/huataihuang/cloud-atlas/blob/a168158169f5aad0f7683d698cc740f1846374fe/source/kubernetes/gpu/dcgm-exporter.rst#%E8%BF%90%E8%A1%8C-dcgm-exporter) 的代码实现中引用到了 `nv-hostengine`
- [Getting Started — gpu-operator 23.6.0 documentation](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/23.6.0/getting-started.html)
- Azure 的 Moneo 有引用和调用到 `nv-hostengine`：[Moneo/src/worker/shutdown.sh at 70c0a2d75355d82909784c886ed0fc169a49a033 · Azure/Moneo (github.com)](https://github.com/Azure/Moneo/blob/70c0a2d75355d82909784c886ed0fc169a49a033/src/worker/shutdown.sh#L38)
- DataDog 的 GPU 集成也有用到 `nv-hostengine`：[integrations-core/dcgm/README.md at 764d52840cf6cf694d0eaec5929fc7d799b7fc29 · DataDog/integrations-core (github.com)](https://github.com/DataDog/integrations-core/blob/764d52840cf6cf694d0eaec5929fc7d799b7fc29/dcgm/README.md#dcgm-field-is-enabled-but-not-being-submitted)
- llm-action 项目也有引用到：[github.com/liguodongiot/llm-action/blob/c9d8a3570b9e156ef6af035cf1b21294cb3eedbf/docs/llm-base/monitor.md?plain=1#L13-L16](https://github.com/liguodongiot/llm-action/blob/c9d8a3570b9e156ef6af035cf1b21294cb3eedbf/docs/llm-base/monitor.md?plain=1#L13-L16)
- 在 NVIDIA 官方的 DCGM 的 Dockerfile 中有直接对 `nv-hostengine` 的使用，也可以在这里看到： [DCGM/docker/Dockerfile.ubi8 at a33560c9c138c617f3ee6cb50df11561302e5743 · NVIDIA/DCGM (github.com)](https://github.com/NVIDIA/DCGM/blob/a33560c9c138c617f3ee6cb50df11561302e5743/docker/Dockerfile.ubi8#L39)
- [Monitor Your Computing System with Prometheus, Grafana, Alertmanager, and Nvidia DCGM](https://ajaesteves.medium.com/monitor-your-computing-system-with-prometheus-grafana-alertmanager-and-nvidia-dcgm-ea9f142d2e21)
- [Error: unable to establish a connection to the specified host: localhost · Issue #43 · NVIDIA/DCGM](https://github.com/NVIDIA/DCGM/issues/43)