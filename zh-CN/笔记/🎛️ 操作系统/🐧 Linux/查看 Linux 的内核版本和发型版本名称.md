---
tags:
  - 操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 计算机/操作系统/Linux/内核
  - 命令行/uname
  - 命令行/lsb_release
  - 命令行/hostnamectl
  - 计算机/操作系统/Linux/内核/procfs
  - 命令行/dmesg
---
# 查看 Linux 的内核版本和发型版本名称

## `uname`

```shell
uname -r
```

```shell
$ uname -r
5.15.13-051513-generic
```

## `lsb_release`

```shell
lsb_release
```

## `hostnamectl`

```shell
hostnamectl
```

```shell
hostnamectl
 Static hostname: neko-desktop
       Icon name: computer-desktop
         Chassis: desktop
      Machine ID: <ID>
         Boot ID: <ID>
Operating System: Ubuntu 22.04.1 LTS
          Kernel: Linux 5.15.13-051513-generic
    Architecture: x86-64
 Hardware Vendor: GIGABYTE
```

## `procfs`

```shell
cat /proc/version
```

```shell
$ cat /proc/version
Linux version 5.15.13-051513-generic (kernel@sita) (gcc (Ubuntu 11.2.0-13ubuntu1) 11.2.0, GNU ld (GNU Binutils for Ubuntu) 2.37) #202201050731 SMP Wed Jan 5 13:05:30 UTC 2022
```

## `dmesg`

```shell
sudo dmesg | grep "Linux version"
```

```shell
$ sudo dmesg | grep "Linux version"
[    0.000000] Linux version 5.15.13-051513-generic (kernel@sita) (gcc (Ubuntu 11.2.0-13ubuntu1) 11.2.0, GNU ld (GNU Binutils for Ubuntu) 2.37) #202201050731 SMP Wed Jan 5 13:05:30 UTC 2022
```

## `/etc/os-release`

```shell
cat /etc/os-release
```

```shell
$ cat /etc/os-release
PRETTY_NAME="Ubuntu 22.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.1 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```
