---
tags:
  - 开源/软件/kind
  - 命令行/kubectl
  - 命令行/kind
  - 开发/云原生/Kubernetes
---
# 用 `kind` 创建的测试集群快速部署应用并暴露 NodePort 服务到宿主机方便调试

## 编写和配置 `kind` 创建集群用的配置文件

我在编写和调试 Helm Chart，或者是在本地使用 `kind` 创建的集群中希望能够通过宿主机直接访问部署的 Pod 或者 Deploymen 的时候，不想再去单独编写和创建一个 Service 资源文件，或者说修改 Helm Chart 中有关 Service 资源的配置，而是直接通过手动创建服务和转发端口来快速调试应用和测试想法，这个时候怎么办呢？

这里会有一些常见的直接暴露端口的配置和命令，方便直接执行。

首先我们需要明确 `kind` 需要如何编写：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
  extraPortMappings:
  - containerPort: 30001
    hostPort: 30001
    protocol: TCP
```

通常而言我会通过上述的文件来为每个不同的业务需求构建一个独立的集群，然后在 `extraPortMappings` 字段中为我希望在之后应用部署完成之后暴露的端口添加一个端口映射：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
  extraPortMappings:
  - containerPort: 30001 # [!code focus]
    hostPort: 30001 # [!code focus]
    protocol: TCP # [!code focus]
```

::: details 想要映射更多的端口？

最好像下面这样一次性映射一大堆端口，方便灵活修改和配置。因为如果 `kind` 创建的 Kubernetes 集群还需要进一步的拉取很多超大型镜像的话，来回创建和销毁 `kind` 的集群资源，会造成镜像都得重新从头拉取和解压缩，这样很花时间。

```yaml
kind: Cluster
name: test
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
  extraPortMappings:
  - containerPort: 30001
    hostPort: 30001
    protocol: TCP
  - containerPort: 30002
    hostPort: 30002
    protocol: TCP
  - containerPort: 30003
    hostPort: 30003
    protocol: TCP
  - containerPort: 30004
    hostPort: 30004
    protocol: TCP
  - containerPort: 30005
    hostPort: 30005
    protocol: TCP
  - containerPort: 30006
    hostPort: 30006
    protocol: TCP
  - containerPort: 30007
    hostPort: 30007
    protocol: TCP
  - containerPort: 30008
    hostPort: 30008
    protocol: TCP
  - containerPort: 30008
    hostPort: 30008
    protocol: TCP
```

:::

编写之后创建集群即可：

```shell
kind create cluster --config ./kind.yaml --name some-cluster
```

## 给服务直接创建 NodePort 类型的服务


```shell
kubectl expose deployment <Deployment 名称> --name=<Deployment 名称>-nodeport --type=NodePort
```

比如如果是有一个 Grafana 的服务希望暴露的话：

```shell
kubectl expose deployment grafana --name=grafana-nodeport --type=NodePort
```

## 直接原地修改 NodePort 服务的暴露端口号为配置文件中定义的任何一个端口

```shell
kubectl patch service <服务名称> --type='json' --patch='[{"op": "replace", "path": "/spec/ports/0/nodePort", "value":<同步上面 kind 配置文件中的端口号>}]'
```

以上面的 Deployment 为例子的话，我一般会给 Deployment 添加后缀 -nodeport 来区分暴露的 Service 类型，那这个时候其实是可以写成这样的：

```shell
kubectl patch service <Deployment 名称>-nodeport --type='json' --patch='[{"op": "replace", "path": "/spec/ports/0/nodePort", "value":<同步上面 kind 配置文件中的端口号>}]'
```

比如如果是有一个 Grafana 的服务希望暴露并且映射为 `30001` 端口的话：

```shell
kubectl patch service grafana-nodeport --type='json' --patch='[{"op": "replace", "path": "/spec/ports/0/nodePort", "value":30001}]'
```