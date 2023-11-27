---
tags:
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes/Clusterpedia
  - 开源/软件/Clusterpedia
  - 开发
  - 命令行
  - 命令行/终端
  - 开发/语言/Golang
  - 命令行/go
  - 命令行/make
  - 命令行/curl
  - 命令行/openssl
  - 密码学/证书/TLS/mTLS
  - 密码学/证书/证书机构/CA
  - 密码学/证书/TLS
  - 开发/Git
  - 命令行/git
  - 命令行/kubectl
  - 软件/云原生/kubectl
---
# 如何开发和测试 Clusterpedia

## 准备工作

### 准备 apiserver 之后通信的时候使用的 mTLS 证书

根据文档 [kubernetes/sample-apiserver: Reference implementation of an apiserver for a custom Kubernetes API.](https://github.com/kubernetes/sample-apiserver#running-it-stand-alone) 来做一些本地的 Clusterpedia API Server 启动前的准备：

#### 创建 CA

```shell
openssl req -nodes -new -x509 -keyout ca.key -out ca.crt
```

#### 创建客户端证书

```shell
openssl req -out client.csr -new -newkey rsa:4096 -nodes -keyout client.key -subj "/CN=development/O=system:masters"
```

#### 签发客户端证书

```shell
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -sha256 -out client.crt
```

#### 打包客户端证书为 p12 证书

```shell
openssl pkcs12 -export -in ./client.crt -inkey ./client.key -out client.p12 -passout pass:password
```

### 准备 apiserver 测试时使用的临时数据库

本地测试的话，可以用 SQLite 来作为数据持久化：

```yaml
type: sqlite
dsn: file:test.db
lg:
  stdout: true
  color: true
  slowThreshold: 100ms
```

### 使用 kind 创建测试用的集群

```shell
kind create cluster
```

### 在希望测试的集群中应用 CRD

Clusterpedia 用到了 `ClusterSyncResources` 和 `PediaCluster` 两种自定义资源类型，你需要通过

```shell
kubectl apply -f https://raw.githubusercontent.com/clusterpedia-io/clusterpedia/main/kustomize/crds/cluster.clusterpedia.io_clustersyncresources.yaml
```

和

```shell
kubectl apply -f https://raw.githubusercontent.com/clusterpedia-io/clusterpedia/main/kustomize/crds/cluster.clusterpedia.io_pediaclusters.yaml
```

分别为他们创建，创建之后再次使用

```shell
kubectl get crd
```

就可以看到 Clusterpedia 相关的 CRD 资源了：

```shell
❯ kubectl get crd
NAME                                           CREATED AT
clustersyncresources.cluster.clusterpedia.io   2023-11-27T04:22:46Z
pediaclusters.cluster.clusterpedia.io          2023-11-27T04:22:53Z
```

当然你也可以通过

```shell
kubectl api-resources
```

来找到他们，就像这样：

```shell
❯ kubectl api-resources
NAME                              SHORTNAMES   APIVERSION                             NAMESPACED   KIND
bindings                                       v1                                     true         Binding
componentstatuses                 cs           v1                                     false        ComponentStatus
configmaps                        cm           v1                                     true         ConfigMap
endpoints                         ep           v1                                     true         Endpoints
events                            ev           v1                                     true         Event
limitranges                       limits       v1                                     true         LimitRange
namespaces                        ns           v1                                     false        Namespace
nodes                             no           v1                                     false        Node
persistentvolumeclaims            pvc          v1                                     true         PersistentVolumeClaim
persistentvolumes                 pv           v1                                     false        PersistentVolume
pods                              po           v1                                     true         Pod
podtemplates                                   v1                                     true         PodTemplate
replicationcontrollers            rc           v1                                     true         ReplicationController
resourcequotas                    quota        v1                                     true         ResourceQuota
secrets                                        v1                                     true         Secret
serviceaccounts                   sa           v1                                     true         ServiceAccount
services                          svc          v1                                     true         Service
mutatingwebhookconfigurations                  admissionregistration.k8s.io/v1        false        MutatingWebhookConfiguration
validatingwebhookconfigurations                admissionregistration.k8s.io/v1        false        ValidatingWebhookConfiguration
customresourcedefinitions         crd,crds     apiextensions.k8s.io/v1                false        CustomResourceDefinition
apiservices                                    apiregistration.k8s.io/v1              false        APIService
controllerrevisions                            apps/v1                                true         ControllerRevision
daemonsets                        ds           apps/v1                                true         DaemonSet
deployments                       deploy       apps/v1                                true         Deployment
replicasets                       rs           apps/v1                                true         ReplicaSet
statefulsets                      sts          apps/v1                                true         StatefulSet
tokenreviews                                   authentication.k8s.io/v1               false        TokenReview
localsubjectaccessreviews                      authorization.k8s.io/v1                true         LocalSubjectAccessReview
selfsubjectaccessreviews                       authorization.k8s.io/v1                false        SelfSubjectAccessReview
selfsubjectrulesreviews                        authorization.k8s.io/v1                false        SelfSubjectRulesReview
subjectaccessreviews                           authorization.k8s.io/v1                false        SubjectAccessReview
horizontalpodautoscalers          hpa          autoscaling/v2                         true         HorizontalPodAutoscaler
cronjobs                          cj           batch/v1                               true         CronJob
jobs                                           batch/v1                               true         Job
certificatesigningrequests        csr          certificates.k8s.io/v1                 false        CertificateSigningRequest
clustersyncresources                           cluster.clusterpedia.io/v1alpha2       false        ClusterSyncResources # [!code focus]
pediaclusters                                  cluster.clusterpedia.io/v1alpha2       false        PediaCluster # [!code focus]
leases                                         coordination.k8s.io/v1                 true         Lease
endpointslices                                 discovery.k8s.io/v1                    true         EndpointSlice
events                            ev           events.k8s.io/v1                       true         Event
flowschemas                                    flowcontrol.apiserver.k8s.io/v1beta3   false        FlowSchema
prioritylevelconfigurations                    flowcontrol.apiserver.k8s.io/v1beta3   false        PriorityLevelConfiguration
ingressclasses                                 networking.k8s.io/v1                   false        IngressClass
ingresses                         ing          networking.k8s.io/v1                   true         Ingress
networkpolicies                   netpol       networking.k8s.io/v1                   true         NetworkPolicy
runtimeclasses                                 node.k8s.io/v1                         false        RuntimeClass
poddisruptionbudgets              pdb          policy/v1                              true         PodDisruptionBudget
clusterrolebindings                            rbac.authorization.k8s.io/v1           false        ClusterRoleBinding
clusterroles                                   rbac.authorization.k8s.io/v1           false        ClusterRole
rolebindings                                   rbac.authorization.k8s.io/v1           true         RoleBinding
roles                                          rbac.authorization.k8s.io/v1           true         Role
priorityclasses                   pc           scheduling.k8s.io/v1                   false        PriorityClass
csidrivers                                     storage.k8s.io/v1                      false        CSIDriver
csinodes                                       storage.k8s.io/v1                      false        CSINode
csistoragecapacities                           storage.k8s.io/v1                      true         CSIStorageCapacity
storageclasses                    sc           storage.k8s.io/v1                      false        StorageClass
volumeattachments                              storage.k8s.io/v1                      false        VolumeAttachment
```

## 构建

通过 `make` 来执行构建

```shell
make apiserver
```

如果遭遇了

```shell
fatal: No names found, cannot describe anything.
```

也可以考虑原地创建一个 `git tag`

```shell
git tag -a v0.0.0 -m "test: v0.0.0"
```

如果希望删掉的话

```shell
git tag -D v0.0.0
```

现在可以开启 `apiserver` 了

```shell
./bin/apiserver --secure-port 8443 --storage-config sqlite.yaml --v=7 \
	--client-ca-file ca.crt \
	--kubeconfig ~/.kube/config \
	--authentication-kubeconfig ~/.kube/config \
	--authorization-kubeconfig ~/.kube/config
```

#### 使用 `curl` 来测试 Clusterpedia 的 apiserver 是否正常运作

然后你可以先用 curl 尝试调用一下接口看看是否正常

```shell
curl -fv -k --cert-type P12 --cert client.p12:password \
   https://localhost:8443/apis/clusterpedia.io/v1beta1/resources/version
```

比如这样：

```shell
❯ curl  -k --cert-type P12 --cert client.p12:password \
   https://localhost:8443/apis/clusterpedia.io/v1beta1/resources/version
{
  "major": "",
  "minor": "",
  "gitVersion": "v0.0.0-master+$Format:%H$",
  "gitCommit": "$Format:%H$",
  "gitTreeState": "",
  "buildDate": "1970-01-01T00:00:00Z",
  "goVersion": "go1.20.11",
  "compiler": "gc",
  "platform": "darwin/arm64"
}%
```

当然，想要使用 Postman 直接测试请求也可以，但是需要一些额外的配置步骤。

#### 使用 Postman 来测试 Clusterpedia 的 apiserver 是否正常运作

首先我们需要把我们在[准备 apiserver 之后通信的时候使用的 mTLS 证书](#准备-apiserver-之后通信的时候使用的-mtls-证书)步骤中的 P12 证书包配置到 Postman 中。

在 macOS 上的 Postman 进行这样的配置的时候，首先在菜单栏中的 Postman 中点选「Settings...（设置...）」来打开设置界面。

然后在如下图所示的配置界面中的左侧找到「Certificates（证书）」，点选后在右手侧的「Client cetificates（客户端证书）」部分中点选「Add Certificate...（添加证书...）」来配置证书。

![](./assets/how-to-develop-and-test-clusterpedia-screenshot-1.png)

接下来填写参数：

- Host 需要填写我们开发和测试的时候 Clusterpedia apiserver 所在的 IP，本地开发测试的话填写 `localhsot` 就好了，端口填写我们上一步给 `apiserver` 传递的参数 `--secure-port 8443` 的 `8443` 作为端口号。
- PFX File 需要点选并选中我们生成的 `client.p12` 证书文件
- Passphrase 需要填写我们在[准备 apiserver 之后通信的时候使用的 mTLS 证书](#准备-apiserver-之后通信的时候使用的-mtls-证书)步骤中给 `openssl` 传递的参数 `-passout pass:password` 的 `password` 字面量。

![](./assets/how-to-develop-and-test-clusterpedia-screenshot-2.png)

接下来新建一个请求，并且填写上我们之前使用 `curl` 去测试的时候请求的一模一样的 URL 去发送 GET 请求之后就能看到返回值了：

![](./assets/how-to-develop-and-test-clusterpedia-screenshot-3.png)
