---
tags:
  - 命令行/终端
  - 命令行/apt
  - 命令行
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 操作系统/Debian/Debian-12
  - 运维
  - 基础设施/Homelab
  - 运维/物理机
  - 运维/内核
---
# 从 Debian 11 升级到 Debian 12

## 先检查升级来源是否是 Debian 11

查看发行版信息

```shell
lsb_release -a
```

查看内核版本

```shell
uname -mrs
```

查看 Debian 版本

```shell
cat /etc/debian_version
```

## 备份系统

## 查看和确认现在安装的 `apt` 包

```
sudo apt list '?narrow(?installed, ?not(?origin(Debian)))'
```

## 更新当前系统到最新 Debian 11

### 更新软件源 index

```shell
sudo apt update
```

### 更新可更新的包

```shell
sudo apt upgrade
```

### 系统更新

```shell
sudo apt full-upgrade
```

### 移除可自动移除的包

```shell
sudo apt --purge autoremove
```

### 重启并应用 Debian 11 系统更新造成的变更

一般而言可能会涉及到 `grub` 变更，或者别的 `systemd` 变更，这个时候可以重启应用一下现在的 Debian 11 更新

```
sudo reboot
```

## 将 `apt` 软件源从 `bullseye` 更新到 `bookworm`

首先是更新一下基础软件源，开始之前可以看一眼，确认一下内容：

```shell
sudo cat /etc/apt/sources.list
```

执行下面的操作之前，我们还是备份一下 `/etc/apt/sources.list` 本身：

```shell
sudo cp -v /etc/apt/sources.list /root/sources.list-backup.11.bullseye
```

可以用下面的命令全自动替换并且自动生成一个 `.bak` 文件作为备份：

```shell
sudo sed -i'.bak' 's/bullseye/bookworm/g' /etc/apt/sources.list
```

也可以自己通过

```shell
sudo vim /etc/apt/sources.list
```

进行手动修改和替换。

修改之后可以再看看有没有改错呢：

```shell
sudo cat /etc/apt/sources.list
```

## 将其他 `apt` 软件源从 `bullseye` 或者 `deb/11` 的引用更新到 `bookworm` 和 `deb/12`

记得检查一下其他拓展的软件源配置文件，比如 Docker，Kubernetes，Plex Media Server 这样的软件，这些拓展的软件源配置文件通常存放在：

```shell
/etc/apt/sources.list.d/
```

目录下面，可以通过

```shell
ls -la /etc/apt/sources.list.d/
```

查看

### 更新 Docker 的 `apt` 软件源

开始之前可以看一眼，确认一下内容：

```shell
sudo cat /etc/apt/sources.list.d/docker.list
```

执行下面的操作之前，我们还是备份一下 `/etc/apt/sources.list.d/docker.list` 本身：

```shell
sudo cp -v /etc/apt/sources.list.d/docker.list /root/sources.list.docker.list-backup.11.bullseye
```

可以用下面的命令全自动替换并且自动生成一个 `.bak` 文件作为备份：

```shell
sudo sed -i'.bak' 's/bullseye/bookworm/g' /etc/apt/sources.list.d/docker.list
```

也可以自己通过

```shell
sudo vim /etc/apt/sources.list.d/docker.list
```

进行手动修改和替换。

修改之后可以再看看有没有改错呢：

```shell
sudo cat /etc/apt/sources.list.d/docker.list
```

## 更新到 Debian 12

### 尝试索引和更新 Debian 12 Bookworm 相关的软件源

```shell
sudo apt update
```

### 更新 Debian 12 软件源下新更新的包

```shell
sudo apt upgrade --without-new-pkgs
```

### 系统更新到 Debian 12 相关的包

```shell
sudo apt full-upgrade
```

### 移除可自动移除的包

```shell
sudo apt --purge autoremove
```

## 更新完成，准备重启

重启前，为了避免 SSHD（SSH Server 的服务）出现问题和异常导致我们无法连接到远端机器，可以先用

```shell
sudo sshd -t
```

检查一下 `sshd` 相关的配置文件。

然后执行重启吧！

```shell
sudo reboot
```

## 检查是否更新完成

查看发行版信息

```shell
lsb_release -a
```

查看内核版本

```shell
uname -mrs
```

查看 Debian 版本

```shell
cat /etc/debian_version
```