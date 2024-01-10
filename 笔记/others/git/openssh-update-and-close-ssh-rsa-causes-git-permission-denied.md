---
title: 解决 macOS Ventura SSH远程仓库连接失败/代码提交失败的问题
author: 刘俊 Romance
---

## 问： macOS 更新到 macOS13 Ventura 之后，忽然发现不能提交代码，远程仓库连接失败了，该怎么办？很急。。。在线等

![](https://user-images.githubusercontent.com/15993908/65325720-3e35c280-dbcd-11e9-82c4-1a0a8caaf174.png)

### 答：问题出在了伴随着系统的更新，OpenSSH 工具也更新了。用原本 `ssh-rsa` 加密算法生成的密钥不能被读取了。

> 我们平时Git提交用的是OpenSSH。而从 `OpenSSH 8.8/8.8p1` 版本开始，就默认关闭了 `ssh-rsa` 算法。macOS Ventura 把系统版本更新到了 `OpenSSH_9.0p1` ，所以我们原本用 `ssh-rsa` 生成的密钥，在默认状态下，就不能被解密了。

通过命令行

```shell
ssh -V
```

来查询咱 OpenSSH 的版本是不是大于等于 `8.8/8.8p1`。

## 那么，如何解决呢？

### 方法一（🌟推荐） 生成 ed25519 算法的密钥

```shell
ssh-keygen -t ed25519
```

执行命令，输入相关信息（像我就一路回车了哈哈哈），然后我们把公钥 `SSH Key` 添加到 Github/GitLab/服务器 上就ok啦！

查看公钥的信息也许可以使用以下命令稍作微调哟！

```shell
cat ~/.ssh/ed25519.pub
```

### 方法二 重新启用 RSA/SHA1

在 `~/.ssh/config` 文件中新增：

```shell
Host *
	HostkeyAlgorithms +ssh-rsa
	PubkeyAcceptedAlgorithms +ssh-rsa

# 启用单个主机或地址可以把 * 替换为 xxx-host
```

哈哈，最后附上此问题的“罪魁祸首”：OpenSSH 更新的日志

```md
OpenSSH 8.8/8.8p1 (2021-09-26)
Incompatibility is more likely when connecting to older SSH implementations that have not been upgraded or have not closely tracked improvements in the SSH protocol. For these cases, it may be necessary to selectively re-enable RSA/SHA1 to allow connection and/or user authentication via the HostkeyAlgorithms and PubkeyAcceptedAlgorithms options. For example, the following stanza in ~/.ssh/config will enable
RSA/SHA1 for host and user authentication for a single destination host:

Host old-host
  HostkeyAlgorithms +ssh-rsa
  PubkeyAcceptedAlgorithms +ssh-rsa

We recommend enabling RSA/SHA1 only as a stopgap measure until legacyimplementations can be upgraded or reconfigured with another key type(such as ECDSA or Ed25519).

OpenSSH 8.7/8.7p1 (2021-08-20)
OpenSSH will disable the ssh-rsa signature scheme by default in thenext release.
```

> 鸣谢：https://likfe.com/2022/10/25/ventura-ssh-error/#more 作者：他叫自己MR张
