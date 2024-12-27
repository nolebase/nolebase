---
tags:
  - 开发/云原生/Kubernetes/K8s
  - 运维/云原生/Kubernetes/K8s
  - 软件/TrueNAS
  - 软件/TrueNAS-SCALE
  - 命令行/apt
  - 命令行/kubectl
  - 开发/云原生/容器存储接口/CSI
  - 计算机/文件系统/FileSystem/fs/NFS
---
# 将 TrueNAS 共享存储连接到 K8s 集群

参考的：[Connecting to the NFS Share with a Linux/Unix OS - NFS Share Creation | TrueNAS Documentation Hub](https://www.truenas.com/docs/core/coretutorials/sharing/nfsshare/#connecting-to-the-nfs-share-with-a-linuxunix-os)

安装必要资源：

```shell
sudo apt install nfs-common
```

获取 Helm Chart

```shell
helm repo add csi-driver-nfs https://raw.githubusercontent.com/kubernetes-csi/csi-driver-nfs/master/charts
```

我们有三个节点，将 NFS CSI 驱动插件部署成 3 个副本的形式：

```shell
helm install csi-driver-nfs csi-driver-nfs/csi-driver-nfs \
    --namespace kube-system \
    --set controller.replicas=3 \
    --set kubeletDir=/var/lib/kubelet
```

这个时候创建一个新的 Storage Class 的描述文件：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs.nas.example.com
provisioner: nfs.csi.k8s.io
parameters:
  server: nas.example.com
  share: /mnt/somepool/share/data/kubernetes/clusters/homelab-kubernetes-1
reclaimPolicy: Delete
volumeBindingMode: Immediate
mountOptions:
  - nfsvers=4.1
```

接下来直接 Apply 即可：

```shell
kubectl apply -f ./nfs-storage-class.yaml
```

- [NFS - Debian Wiki](https://wiki.debian.org/NFS)
- [Debian -- 软件包搜索结果 -- nfs](https://packages.debian.org/search?keywords=nfs)
- [csi-driver-nfs/charts at master · kubernetes-csi/csi-driver-nfs](https://github.com/kubernetes-csi/csi-driver-nfs/tree/master/charts)