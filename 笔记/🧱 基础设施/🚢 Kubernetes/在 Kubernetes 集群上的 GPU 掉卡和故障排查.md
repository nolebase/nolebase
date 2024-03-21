---
tags:
  - AI/硬件/GPU
  - AI/硬件/GPU/NVIDIA
  - AI/硬件/GPU/NVIDIA/GPU
  - 运维/云原生/Kubernetes
  - 开发/云原生/Kubernetes
  - 命令行/kubectl
  - 命令行/lshw
  - 命令行/lspci
  - 命令行/dmesg
  - 命令行/dcgmi
  - 命令行/nvidia-smi
  - AI
  - 基础设施/GPU
  - 基础设施/GPU/DCGM
  - 软件/开源/DCGM
  - 开发/云原生/Kubernetes/GPU-Operator
---
# 在 Kubernetes 集群上的 GPU 掉卡和故障排查

NVIDIA 有个 GPU 排查指南：[NVIDIA GPU Debug Guidelines - GPU Deployment and Management Documentation](https://docs.nvidia.com/deploy/gpu-debug-guidelines/index.html)

## 通过 Linux 原生的命令进行基础排查
### 检查显示设备列表

首先检查显示类型的硬件设备列表，查看是否有 NVIDIA 相关的显示控制器。

运行下面的命令就可以打印相关的设备列表：

```shell
sudo lshw -C display
```

::: details 可供参考的返回结果

```shell
  *-display
       description: 3D controller
       product: NVIDIA Corporation
       vendor: NVIDIA Corporation
       physical id: 0
       bus info: pci@0000:18:00.0
       version: a1
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix bus_master cap_list
       configuration: driver=nvidia latency=0
       resources: iomemory:5e00-5dff iomemory:5a00-59ff iomemory:5e00-5dff irq:16 memory:5e042000000-5e042ffffff memory:5a000000000-5bfffffffff memory:5e040000000-5e041ffffff memory:9ed00000-9f4fffff memory:5c000000000-5dfffffffff memory:5e000000000-5e03fffffff
  *-display
       description: 3D controller
       product: NVIDIA Corporation
       vendor: NVIDIA Corporation
       physical id: 0
       bus info: pci@0000:2a:00.0
       version: a1
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix bus_master cap_list
       configuration: driver=nvidia latency=0
       resources: iomemory:6e00-6dff iomemory:6a00-69ff iomemory:6e00-6dff irq:17 memory:6e042000000-6e042ffffff memory:6a000000000-6bfffffffff memory:6e040000000-6e041ffffff memory:a8900000-a90fffff memory:6c000000000-6dfffffffff memory:6e000000000-6e03fffffff
  *-display
       description: 3D controller
       product: NVIDIA Corporation
       vendor: NVIDIA Corporation
       physical id: 0
       bus info: pci@0000:3a:00.0
       version: a1
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix bus_master cap_list
       configuration: driver=nvidia latency=0
       resources: iomemory:7e00-7dff iomemory:7a00-79ff iomemory:7e00-7dff irq:16 memory:7e042000000-7e042ffffff memory:7a000000000-7bfffffffff memory:7e040000000-7e041ffffff memory:b2500000-b2cfffff memory:7c000000000-7dfffffffff memory:7e000000000-7e03fffffff
```

:::

### 检查 PCIe 设备列表

```shell
sudo lspci | grep NVIDIA
```

::: details 可供参考的返回结果

```shell
05:00.0 Bridge: NVIDIA Corporation Device 22a3 (rev a1)
06:00.0 Bridge: NVIDIA Corporation Device 22a3 (rev a1)
07:00.0 Bridge: NVIDIA Corporation Device 22a3 (rev a1)
08:00.0 Bridge: NVIDIA Corporation Device 22a3 (rev a1)
18:00.0 3D controller: NVIDIA Corporation Device 2330 (rev a1)
2a:00.0 3D controller: NVIDIA Corporation Device 2330 (rev a1)
3a:00.0 3D controller: NVIDIA Corporation Device 2330 (rev a1)
5d:00.0 3D controller: NVIDIA Corporation Device 2330 (rev a1)
```

:::

### 检查系统日志

```shell
sudo cat /var/log/syslog
```

比较标志性的是这样的错误：

```shell
Jan  3 07:39:44 ubuntu kernel: [17256.647980] nvidia-nvswitch: Probing device 0000:08:00.0, Vendor Id = 0x10de, Device Id = 0x22a3, Class = 0x68000
Jan  3 07:39:44 ubuntu kernel: [17257.307535] nvidia-nvswitch3: using MSI
Jan  3 07:39:45 ubuntu kernel: [17257.355375] NVRM: The NVIDIA GPU 0000:5d:00.0
Jan  3 07:39:45 ubuntu kernel: [17257.355375] NVRM: (PCI ID: 10de:2330) installed in this system has
Jan  3 07:39:45 ubuntu kernel: [17257.355375] NVRM: fallen off the bus and is not responding to commands.
Jan  3 07:39:45 ubuntu kernel: [17257.355551] nvidia: probe of 0000:5d:00.0 failed with error -1
Jan  3 07:39:45 ubuntu kernel: [17257.418931] NVRM: The NVIDIA probe routine failed for 1 device(s).
Jan  3 07:39:45 ubuntu kernel: [17257.418954] NVRM: loading NVIDIA UNIX x86_64 Kernel Module  525.125.06  Tue May 30 05:11:37 UTC 2023
Jan  3 07:39:45 ubuntu kernel: [17257.657927] nvidia_uvm: module uses symbols from proprietary module nvidia, inheriting taint.
Jan  3 07:39:45 ubuntu kernel: [17257.701298] nvidia-uvm: Loaded the UVM driver, major device number 502.
Jan  3 07:39:45 ubuntu kernel: [17257.727257] nvidia-modeset: Loading NVIDIA Kernel Mode Setting Driver for UNIX platforms  525.125.06  Tue May 30 04:58:48 UTC 2023
Jan  3 07:39:45 ubuntu kernel: [17257.737241] nvidia 0000:18:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
Jan  3 07:39:49 ubuntu kernel: [17261.605632] nvidia 0000:2a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
```

### 检查 `dmesg`

可以通过 `dmesg` 查阅系统日志，看到的日志和 `/var/log/syslog` 其实是差不多的。

其中我发现的与 GPU 设备异常的日志有这些：
#### `gsp_tu10x.bin failed with error -2` 错误

```shell
[  198.424621] NVRM: loading NVIDIA UNIX x86_64 Kernel Module  525.125.06  Tue May 30 05:11:37 UTC 2023
[  198.661922] nvidia_uvm: module uses symbols from proprietary module nvidia, inheriting taint.
[  198.675466] nvidia-uvm: Loaded the UVM driver, major device number 502.
[  198.706214] nvidia-modeset: Loading NVIDIA Kernel Mode Setting Driver for UNIX platforms  525.125.06  Tue May 30 04:58:48 UTC 2023
[  198.720826] nvidia 0000:18:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  201.873383] nvidia 0000:2a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  205.250596] nvidia 0000:3a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  207.914792] nvidia 0000:5d:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  210.474933] nvidia 0000:9a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  213.527228] nvidia 0000:ab:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  216.375317] nvidia 0000:ba:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[  219.944650] nvidia 0000:db:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
```

#### `GPU has fallen off the bus.` 掉卡错误

```shell
[ 4254.197816] NVRM: GPU at PCI:0000:5d:00: GPU-f1906b9b-557a-e961-045c-9fe4be3ce012
[ 4254.197854] NVRM: GPU Board Serial Number: 1653923026510
[ 4254.197860] NVRM: Xid (PCI:0000:5d:00): 79, pid='<unknown>', name=<unknown>, GPU has fallen off the bus.
[ 4254.197871] NVRM: GPU 0000:5d:00.0: GPU has fallen off the bus.
[ 4254.197878] NVRM: GPU 0000:5d:00.0: GPU serial number is 1653923026510.
[ 4254.197913] NVRM: A GPU crash dump has been created. If possible, please run
               NVRM: nvidia-bug-report.sh as root to collect this data before
               NVRM: the NVIDIA kernel module is unloaded.
```

#### `fallen off the bus and is not responding to commands.` 掉卡错误

```shell
[14387.209961] NVRM: The NVIDIA GPU 0000:5d:00.0
               NVRM: (PCI ID: 10de:2330) installed in this system has
               NVRM: fallen off the bus and is not responding to commands.
[14387.210134] nvidia: probe of 0000:5d:00.0 failed with error -1
[14387.274303] NVRM: The NVIDIA probe routine failed for 1 device(s).
[14387.274366] NVRM: loading NVIDIA UNIX x86_64 Kernel Module  525.125.06  Tue May 30 05:11:37 UTC 2023
[14387.511008] nvidia_uvm: module uses symbols from proprietary module nvidia, inheriting taint.
[14387.548839] nvidia-uvm: Loaded the UVM driver, major device number 502.
[14387.573380] nvidia-modeset: Loading NVIDIA Kernel Mode Setting Driver for UNIX platforms  525.125.06  Tue May 30 04:58:48 UTC 2023
[14387.588055] nvidia 0000:18:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[14391.500465] nvidia 0000:2a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[14394.112769] nvidia 0000:3a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[14396.627715] nvidia 0000:9a:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[14399.481332] nvidia 0000:ab:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[14402.500487] nvidia 0000:ba:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
[14405.257198] nvidia 0000:db:00.0: Direct firmware load for nvidia/525.125.06/gsp_tu10x.bin failed with error -2
```

## 通过 NVIDIA 的基础设施进行排查

### 通过 NVIDIA 官方脚本收集系统信息并创建报告

在 NVIDIA 支持社区有一个建议先阅读的发帖 [If you have a problem, PLEASE read this first](https://forums.developer.nvidia.com/t/if-you-have-a-problem-please-read-this-first/27131) 中，以及在 NVIDIA 工程师于 [DCGM initialization error · Issue #222 · NVIDIA/gpu-operator](https://github.com/NVIDIA/gpu-operator/issues/222) 中都建议到的，**在 GPU Operator 安装了的 Kubernetes 集群的场景下，建议运维工程师和 Kubernetes 开发者在任意的安装有 NVIDIA 驱动的节点上运行 `/run/nvidia/driver/usr/bin/nvidia-bug-report.sh` 来实现和执行 `nvidia-bug-report.sh` 脚本来收集系统报告。**

因此，可以通过执行下面的命令来执行通常情况下在 NVIDIA 官方文档 [NVIDIA GPU Debug Guidelines](https://docs.nvidia.com/deploy/gpu-debug-guidelines/index.html) 和社区的建议中提及的 `nvidia-bug-report.sh`

```shell
/run/nvidia/driver/usr/bin/nvidia-bug-report.sh
```

::: info

如果你实在找不到，可以在 [Packages/hardware/graphics/nvidia-xconfig/files/nvidia-bug-report.sh](https://github.com/Pardus-Linux/Packages/blob/594b76c80a1ec2c82359602c6318bc1fde867b76/hardware/graphics/nvidia-xconfig/files/nvidia-bug-report.sh) 下载和查阅到这个脚本的具体内容和执行的逻辑信息。

:::

```shell
sudo /run/nvidia/driver/usr/bin/nvidia-bug-report.sh

nvidia-bug-report.sh will now collect information about your
system and create the file 'nvidia-bug-report.log.gz' in the current
directory.  It may take several seconds to run.  In some
cases, it may hang trying to capture data generated dynamically
by the Linux kernel and/or the NVIDIA kernel module.  While
the bug report log file will be incomplete if this happens, it
may still contain enough data to diagnose your problem.

If nvidia-bug-report.sh hangs, consider running with the --safe-mode
and --extra-system-data command line arguments.

Please include the 'nvidia-bug-report.log.gz' log file when reporting
your bug via the NVIDIA Linux forum (see forums.developer.nvidia.com)
or by sending email to 'linux-bugs@nvidia.com'.

By delivering 'nvidia-bug-report.log.gz' to NVIDIA, you acknowledge
and agree that personal information may inadvertently be included in
the output.  Notwithstanding the foregoing, NVIDIA will use the
output only for the purpose of investigating your reported issue.

Running nvidia-bug-report.sh... complete.
```

创建之后的系统报告会放在运行的时候的目录下面，可以通过 `scp` 和 `rsync` 将系统日志 dump 到可以提交信息的设备上：

```shell
$ ls -la
# ...
-rw-r--r-- 1 root   root   1333398 Jan 12 07:40 nvidia-bug-report.log.gz
-rw-r--r-- 1 root   root    400236 Jan 12 10:01 nvidia-bug-report.log.old.gz
```

### 检查 GPU Operator 相关的 Pod 是否正常

```shell
❯ kubectl get pods
NAME                                                          READY   STATUS      RESTARTS   AGE
nvidia-container-toolkit-daemonset-qv5mk                      1/1     Running     0          90m
nvidia-cuda-validator-d84n9                                   0/1     Completed   0          88m
nvidia-dcgm-exporter-5fr8d                                    1/1     Running     0          90m
nvidia-device-plugin-daemonset-dzw2d                          1/1     Running     0          90m
nvidia-driver-daemonset-5.15.0-78-generic-ubuntu22.04-hjffw   1/1     Running     0          90m
nvidia-operator-validator-ctx5l                               1/1     Running     0          90m
```

### 使用 `nvidia-smi` 检查是否能读取到设备列表

对于已经安装了 GPU Operator 的集群，可以通过 GPU Operator 下属的 `dcgm-exporter` Pod 资源内置的 `nvidia-smi` 来尝试列出所有的 GPU 信息。

::: tip 如何进入 DCGM Pod？

运行下面的命令就可以进入到正在运行的 Pod 了：

```shell
kubectl exec <DCGM Pod 的 ID> -it --container nvidia-dcgm-exporter -- bash
```

以上面 `kubectl get pods` 的返回结果为例，可以这样运行

```shell
kubectl exec nvidia-dcgm-exporter-5fr8d -it --container nvidia-dcgm-exporter -- bash
```

如果你不熟悉 `kubectl` 和 `docker` CLI 的用法，可以通过这篇 [Get a Shell to a Running Container | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/)文档学习和了解相关的用法。

:::

```shell
root@nvidia-dcgm-exporter-4f599:/# nvidia-smi
Thu Jan  4 02:14:12 2024
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 530.30.02              Driver Version: 530.30.02    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                  Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf            Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA GeForce RTX 3090         On | 00000000:1B:00.0 Off |                  N/A |
| 33%   29C    P8               22W / 350W|      1MiB / 24576MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  NVIDIA GeForce RTX 3090         On | 00000000:1C:00.0 Off |                  N/A |
| 33%   27C    P8               23W / 350W|      1MiB / 24576MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   2  NVIDIA GeForce RTX 3090         On | 00000000:1D:00.0 Off |                  N/A |
| 33%   28C    P8               21W / 350W|      1MiB / 24576MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   3  NVIDIA GeForce RTX 3090         On | 00000000:1E:00.0 Off |                  N/A |
| 33%   29C    P8               25W / 350W|      1MiB / 24576MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
+---------------------------------------------------------------------------------------+
```

### 通过直接访问 `dcgm-exporter` 的 Prometheus 指标接口获取 GPU 指标

对于已经安装了 GPU Operator 的集群，可以通过 GPU Operator 下属的 `dcgm-exporter` Pod 资源内置的 `nvidia-smi` 来尝试列出所有的 GPU 信息。

在容器内部可以执行 `curl localhost:9400/metrics` 获得 GPU的 metrics 数据。

::: tip 如何进入 DCGM Pod？

运行下面的命令就可以进入到正在运行的 Pod 了：

```shell
kubectl exec <DCGM Pod 的 ID> -it --container nvidia-dcgm-exporter -- bash
```

以上面 `kubectl get pods` 的返回结果为例，可以这样运行

```shell
kubectl exec nvidia-dcgm-exporter-5fr8d -it --container nvidia-dcgm-exporter -- bash
```

如果你不熟悉 `kubectl` 和 `docker` CLI 的用法，可以通过这篇 [Get a Shell to a Running Container | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/)文档学习和了解相关的用法。

:::

### 通过 `dcgmi discovery` 检查是否能探测到 GPU 设备

对于已经安装了 GPU Operator 的集群，可以通过 GPU Operator 下属的 `dcgm-exporter` Pod 资源内置的 `dcgmi`（对 DCGM API 的本地封装的 CLI 版本）的命令对 GPU 进行故障排查。

::: tip 如何进入 DCGM Pod？

运行下面的命令就可以进入到正在运行的 Pod 了：

```shell
kubectl exec <DCGM Pod 的 ID> -it --container nvidia-dcgm-exporter -- bash
```

以上面 `kubectl get pods` 的返回结果为例，可以这样运行

```shell
kubectl exec nvidia-dcgm-exporter-5fr8d -it --container nvidia-dcgm-exporter -- bash
```

如果你不熟悉 `kubectl` 和 `docker` CLI 的用法，可以通过这篇 [Get a Shell to a Running Container | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/)文档学习和了解相关的用法。

:::

想要运行 `dcgmi discovery`，你必须确保自己开启了 `nv-hostengine` 或者为 DCGM 配置了 embedding engine（参考 [Error starting embedded DCGM engine · Issue #16 · triton-inference-server/model_analyzer](https://github.com/triton-inference-server/model_analyzer/issues/16) 给出的说明），想要了解 `nv-hostengine`，请参考这篇文档：[[nv-hostengine 的启动和补充知识]]

启动和配置完成之后，就可以通过

```shell
dcgmi discovery -l
```

尝试通过 DCGM 嗅探和列出 GPU 设备信息列表了。

::: info 运行的时候遭遇了 `unable to establish a connection to the specified host: localhost` 和 `Unable to connect to host engine. Host engine connection invalid/disconnected.` 错误？

```shell
root@nvidia-dcgm-exporter-pkcrb:/$ dcgmi discovery -l
Error: unable to establish a connection to the specified host: localhost
Error: Unable to connect to host engine. Host engine connection invalid/disconnected.
```

请参考 [[nv-hostengine 的启动和补充知识]] 的指南启动或者配置 DCGM 的 embedding engine 激活 nv-hostengine 之后再次尝试。

:::

### 通过 `dcgmi health` 查看 GPU 设备健康状况

对于已经安装了 GPU Operator 的集群，可以通过 GPU Operator 下属的 `dcgm-exporter` Pod 资源内置的 `dcgmi`（对 DCGM API 的本地封装的 CLI 版本）的命令对 GPU 进行故障排查。

::: tip 如何进入 DCGM Pod？

运行下面的命令就可以进入到正在运行的 Pod 了：

```shell
kubectl exec <DCGM Pod 的 ID> -it --container nvidia-dcgm-exporter -- bash
```

以上面 `kubectl get pods` 的返回结果为例，可以这样运行

```shell
kubectl exec nvidia-dcgm-exporter-5fr8d -it --container nvidia-dcgm-exporter -- bash
```

如果你不熟悉 `kubectl` 和 `docker` CLI 的用法，可以通过这篇 [Get a Shell to a Running Container | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/)文档学习和了解相关的用法。

:::

除去 `diag` 子命令，如果开启了 `nv-hostengine`，也可以通过下面的命令检查健康状况：

```shell
dcgmi health -c
```

### 通过 `dcgmi diag` 来检查 Kubernetes 中的 GPU

对于已经安装了 GPU Operator 的集群，可以通过 GPU Operator 下属的 `dcgm-exporter` Pod 资源内置的 `dcgmi`（对 DCGM API 的本地封装的 CLI 版本）的命令对 GPU 进行故障排查。

::: tip 如何进入 DCGM Pod？

运行下面的命令就可以进入到正在运行的 Pod 了：

```shell
kubectl exec <DCGM Pod 的 ID> -it --container nvidia-dcgm-exporter -- bash
```

以上面 `kubectl get pods` 的返回结果为例，可以这样运行

```shell
kubectl exec nvidia-dcgm-exporter-5fr8d -it --container nvidia-dcgm-exporter -- bash
```

如果你不熟悉 `kubectl` 和 `docker` CLI 的用法，可以通过这篇 [Get a Shell to a Running Container | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/)文档学习和了解相关的用法。

:::

其中一个在文档中提及的比较多的是 `diag` 子命令：

```shell
dcgmi diag -r 2
```

`-r` 参数是用于指定诊断时候的「等级」用的，

::: info `dcgmi diag` 的 `-r` 参数有什么用

根据 [DCGMI Workload Profiles | Virtual Client Platform](https://microsoft.github.io/VirtualClient/docs/workloads/dcgmi/dcgmi-profiles/) 文档叙述：

> The runtime is dependent on the value of "Level" parameter.

|Level value|Runtime|
|---|---|
|4|1-2 hour|
|3|30 min|
|2|2 min|
|1|few seconds|

不同的 `-r` 参数的数值代表了不同的 Level，Level 就是所谓的「等级」，这样的等级会在背后运行不同的设备测试以方便工程师定位问题，对于不同的 Level 所附加的不同测试，可以参见 [DCGM Diagnostics — NVIDIA DCGM Documentation latest documentation](https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html#run-levels-and-tests) 文档中给出的下表：

|Plugin|Test name|r1 (Short)<br><br>Seconds|r2 (Medium)<br><br>< 2 mins|r3 (Long)<br><br>< 30 mins|r4 (Extra Long)<br><br>1-2 hours|
|---|---|---|---|---|---|
|Software|`software`|Yes|Yes|Yes|Yes|
|PCIe + NVLink|`pcie`||Yes|Yes|Yes|
|GPU Memory|`memory`||Yes|Yes|Yes|
|Memory Bandwidth|`memory_bandwidth`||Yes|Yes|Yes|
|Diagnostics|`diagnostic`|||Yes|Yes|
|Targeted Stress|`targeted_stress`|||Yes|Yes|
|Targeted Power|`targeted_power`|||Yes|Yes|
|Memory Stress|`memtest`||||Yes|
|Input EDPp|`pulse`||||Yes|

:::

使用的时候效果是这样的：

```shell
root@nvidia-dcgm-exporter-4f599:/$ dcgmi diag -r 2
Successfully ran diagnostic for group.
+---------------------------+------------------------------------------------+
| Diagnostic                | Result                                         |
+===========================+================================================+
|-----  Metadata  ----------+------------------------------------------------|
| DCGM Version              | 3.3.0                                          |
| Driver Version Detected   | 530.30.02                                      |
| GPU Device IDs Detected   | 2204,2204,2204,2204,2204,2204,2204,2204        |
|-----  Deployment  --------+------------------------------------------------|
| Denylist                  | Pass                                           |
| NVML Library              | Pass                                           |
| CUDA Main Library         | Pass                                           |
| Permissions and OS Blocks | Pass                                           |
| Persistence Mode          | Pass                                           |
| Environment Variables     | Pass                                           |
| Page Retirement/Row Remap | Pass                                           |
| Graphics Processes        | Pass                                           |
| Inforom                   | Pass                                           |
+-----  Integration  -------+------------------------------------------------+
| PCIe                      | Fail - All                                     |
| Warning                   | GPU 0 Error using CUDA API cudaDeviceGetByPCI  |
|                           | BusId Check DCGM and system logs for errors.   |
|                           | Reset GPU. Restart DCGM. Rerun diagnostics. '  |
|                           | system has unsupported display driver / cuda   |
|                           | driver combination' for GPU 0, bus ID = 00000  |
|                           | 000:1B:00.0                                    |
+-----  Hardware  ----------+------------------------------------------------+
| GPU Memory                | Skip - All                                     |
+-----  Stress  ------------+------------------------------------------------+
+---------------------------+------------------------------------------------+
```

可以通过观察表格的不同部分来了解 GPU 的状况，上文的 Fail 就是其中的一个例子。


### 通过 `dcgmproftester12` 对 GPU 进行压力和 Profiling 测试

对于已经安装了 GPU Operator 的集群，可以通过 GPU Operator 下属的 `dcgm-exporter` Pod 资源内置的 `dcgmproftester12`（如果驱动安装的是 CUDA 11，那请使用 `dcgmproftester11` 命令）命令对 GPU 进行压力测试和 Profiling 测试来观察效果

::: tip 如何进入 DCGM Pod？

运行下面的命令就可以进入到正在运行的 Pod 了：

```shell
kubectl exec <DCGM Pod 的 ID> -it --container nvidia-dcgm-exporter -- bash
```

以上面 `kubectl get pods` 的返回结果为例，可以这样运行

```shell
kubectl exec nvidia-dcgm-exporter-5fr8d -it --container nvidia-dcgm-exporter -- bash
```

如果你不熟悉 `kubectl` 和 `docker` CLI 的用法，可以通过这篇 [Get a Shell to a Running Container | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/)文档学习和了解相关的用法。

:::

命令是这样的：

```shell
dcgmproftester12
```

::: info 使用了不兼容的版本？报错提示 `Wrong version of dcgmproftester is used.` ？

在 `dcgmproftester12` 之外，还会有 `dcgmproftester11` 命令可以使用，而尾缀中的 `11` 和 `12` 代表的是 CUDA 的版本号，如果在调用 `dcgmproftester` 的时候使用了错误的版本，将会提示错误 `Wrong version of dcgmproftester is used.`：

```shell
root@nvidia-dcgm-exporter-4f599:/$ dcgmproftester11 --no-dcgm-validation -t 1004 -d 30
Wrong version of dcgmproftester is used. Expected Cuda version is 11. Installed Cuda version is 12.
```

这个时候可以根据 [system has unsupported display driver / cuda driver combination · Issue #1256 · NVIDIA/nvidia-docker](https://github.com/NVIDIA/nvidia-docker/issues/1256) 给出的指南，在 Kubernetes 正在运行的节点上检查安装的 NVIDIA 驱动包和 container 必要组件对应的版本号来确认是否正确配置 CUDA 和相关的库：

```shell
$ dpkg -l '*nvidia*'
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                                                  Version                         Architecture                    Description
+++-=====================================================-===============================-===============================-================================================================================================================
un  libgldispatch0-nvidia                                 <none>                          <none>                          (no description available)
un  libnvidia-container-tools                             <none>                          <none>                          (no description available)
un  nvidia-304                                            <none>                          <none>                          (no description available)
un  nvidia-340                                            <none>                          <none>                          (no description available)
un  nvidia-384                                            <none>                          <none>                          (no description available)
un  nvidia-container-runtime                              <none>                          <none>                          (no description available)
un  nvidia-container-runtime-hook                         <none>                          <none>                          (no description available)
rc  nvidia-container-toolkit                              1.13.2-1                        amd64                           NVIDIA Container toolkit
rc  nvidia-container-toolkit-base                         1.13.2-1                        amd64                           NVIDIA Container Toolkit Base
```

作为参考的话，撰写这篇文档的时候，使用的 `dcgm-exporter` 的镜像版本是这个：

```shell
nvcr.io/nvidia/k8s/dcgm-exporter:3.3.0-3.2.0-ubuntu22.04
```

使用的 `gpu-operator-validator` 的版本是这个：

```shell
nvcr.io/nvidia/cloud-native/gpu-operator-validator:v23.9.1
```

:::

## 参考资料

- [nvidia-smi GPU异常消失 程序中断 - Jisongxie - 博客园](https://www.cnblogs.com/jisongxie/p/10405302.html)
- [PyTorch | NVIDIA NGC](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch)
- [NVIDIA HGX A100 Software User Guide - NVIDIA Tesla Documentation](https://docs.nvidia.com/datacenter/tesla/hgx-software-guide/index.html)
- [DCGMI Workload Profiles | Virtual Client Platform](https://microsoft.github.io/VirtualClient/docs/workloads/dcgmi/dcgmi-profiles/)
- [PyTorch的CUDA错误：Error 804: forward compatibility was attempted on non supported HW - 知乎](https://zhuanlan.zhihu.com/p/361545761)
- [DCGM 的 嵌入模式 Getting Started — NVIDIA DCGM Documentation latest documentation](https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/getting-started.html#embedded-mode)
- [NVML API Reference Guide - GPU Deployment and Management Documentation](https://docs.nvidia.com/deploy/nvml-api/nvml-api-reference.html#nvml-api-reference)
- [DCGM exporter connection to server pod times out · Issue #294 · NVIDIA/gpu-operator](https://github.com/NVIDIA/gpu-operator/issues/294)
- [AI模型运维——GPU性能监控NVML和DCGM - 沄持的学习记录 - 博客园](https://www.cnblogs.com/maxgongzuo/p/12582286.html)
- [Setting Up GPU Telemetry with NVIDIA Data Center GPU Manager | NVIDIA Technical Blog](https://developer.nvidia.com/blog/gpu-telemetry-nvidia-dcgm/)
- [在Kuternetes集成GPU可观测能力 — Cloud Atlas beta 文档](https://cloud-atlas.readthedocs.io/zh-cn/latest/kubernetes/gpu/intergrate_gpu_telemetry_into_k8s.html)
- [DCGM - 在Kuternetes集成GPU可观测能力 — Cloud Atlas beta 文档 (cloud-atlas.readthedocs.io)](https://cloud-atlas.readthedocs.io/zh-cn/latest/kubernetes/gpu/intergrate_gpu_telemetry_into_k8s.html#dcgm)
- [【系统监控】GPU 监控 | Houmin](https://houmin.cc/posts/b4058e1b/)
- [Nvidia A100 MIGs GPU Monitoring using Datadog | by Aditya Bibave | Searce](https://blog.searce.com/nvidia-a100-migs-gpu-monitoring-using-datadog-7c3d2378184f)
- [dcgm-exporter源码分析 - 简书](https://www.jianshu.com/p/f38e58864496)
- [NVIDIA 数据中心 GPU 管理器 (DCGM)  |  操作套件  |  Google Cloud](https://cloud.google.com/stackdriver/docs/managed-prometheus/exporters/nvidia-dcgm?hl=zh-cn)
- [GPU常见故障及排查方法_51CTO博客_GPU常见故障](https://blog.51cto.com/zaa47/2560477)
- [NVIDIA GPU Debug Guidelines - GPU Deployment and Management Documentation](https://docs.nvidia.com/deploy/gpu-debug-guidelines/index.html)
- [A Practical Guide to Running NVIDIA GPUs on Kubernetes | jimangel.io](https://www.jimangel.io/posts/nvidia-rtx-gpu-kubernetes-setup/)

学习 `dcgmi` 在 Kubernetes 使用的时候发现了一个有意思的 AI 算力平台 [openi.pcl.ac.cn/OpenI/Apulis-AI-Platform/commit/da673ab384cb6ea8a5276fad1ffc8695fe1d1d6d.diff](https://openi.pcl.ac.cn/OpenI/Apulis-AI-Platform/commit/da673ab384cb6ea8a5276fad1ffc8695fe1d1d6d.diff)

