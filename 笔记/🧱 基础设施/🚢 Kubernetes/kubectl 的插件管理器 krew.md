---
tags:
  - 开发/云原生/Kubernetes
  - 开源/社区/Kubernetes
  - 命令行/kubectl
  - 命令行/kubectl/插件/krew
---
# kubectl 的插件管理器 krew

官网：[Krew – kubectl plugin manager](https://krew.sigs.k8s.io/)
安装：[Installing · Krew](https://krew.sigs.k8s.io/docs/user-guide/setup/install/)

## 通过 macOS 和 Linux 上的 `zsh` 进行安装

```shell
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)
```

然后在 `.zshrc` 中添加 `krew` 相关的 `PATH` 配置：

```shell
# Kubernetes
# krew
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
```

然后重载 `zsh`

```shell
source .zshrc
```

再次运行

```shell
kubectl krew
```

这个时候就能看到相关的帮助命令了！

```shell
$ kubectl krew

krew is the kubectl plugin manager.
You can invoke krew through kubectl: "kubectl krew [command]..."

Usage:
  kubectl krew [command]

Available Commands:
  help        Help about any command
  index       Manage custom plugin indexes
  info        Show information about an available plugin
  install     Install kubectl plugins
  list        List installed kubectl plugins
  search      Discover kubectl plugins
  uninstall   Uninstall plugins
  update      Update the local copy of the plugin index
  upgrade     Upgrade installed plugins to newer versions
  version     Show krew version and diagnostics

Flags:
  -h, --help      help for krew
  -v, --v Level   number for the log level verbosity

Use "kubectl krew [command] --help" for more information about a command.
```
