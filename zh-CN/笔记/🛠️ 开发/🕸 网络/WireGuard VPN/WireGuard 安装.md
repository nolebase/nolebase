---
tags:
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 操作系统/CentOS
  - 操作系统/CentOS/CentOS-8
  - 操作系统/Fedora/Fedora-33
  - 操作系统/Fedora
  - 命令行/apt
  - 命令行/dnf
  - 命令行/brew
  - 计算机/网络/WireGuard
  - 计算机/网络/VPN
  - 计算机/操作系统/Linux/内核
  - 操作系统/macOS
  - 计算机/网络/组网
  - 计算机/网络/协议/UDP
---
# WireGuard 安装

## 说明

## 安装

### Debian/Ubuntu

#### Debian 11 / Ubuntu 20

##### 安装

先更新软件源列表，然后安装

```shell
sudo apt update
sudo apt install wireguard wireguard-tools
```

#### Debian 10 / Ubuntu 14

##### 安装

Debian 10 需要安装额外的软件源才可以安装 WireGuard：backport

```shell
echo "deb http://deb.debian.org/debian buster-backports main" | sudo tee /etc/apt/sources.list.d/buster-backports.list
```

```shell
sudo apt update
sudo apt -t buster-backports install wireguard wireguard-tools wireguard-dkms
```

### CentOS/Fedora

#### CentOS 8 / Fedora 33

##### 检查先决条件

请确保有安装 `epel-release` 和 `elrepo-release`：
检查是否有安装:

1. `rpm` 是 **RHEL 软件包管理器** 的缩写，用于安装静态安装包或管理已经安装的包
2. `-qa` 参数表示查询全部已有安装包，q 代表查询，a 代表全部

```shell
rpm -qa | grep epel-release
rpm -qa | grep elrepo-release
```

如果没有返回值，需要安装一下：

```shell
sudo dnf install epel-release elrepo-release
```

##### 安装

```shell
sudo dnf install kmod-wireguard wireguard-tools
```

### macOS

#### 安装

```shell
brew install wireguard-tools
```
