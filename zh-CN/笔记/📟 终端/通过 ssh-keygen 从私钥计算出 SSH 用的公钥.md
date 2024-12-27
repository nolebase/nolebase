---
tags:
  - 命令行
  - 命令行/终端
  - 操作系统/macOS
  - 操作系统/Linux
  - 命令行/ssh-keygen
  - 命令行/ssh
  - 计算机/网络/协议/SSH
  - 开源/软件/ssh
---
# 通过 `ssh-keygen` 从私钥计算出 SSH 用的公钥

超级简单，像这样就可以了：

```shell
ssh-keygen -y -f <私钥地址>
```

就像这样：

```shell
$ ssh-keygen -y -f ~/.ssh/test_encrypted_ed25519
Enter passphrase:
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAyAbAwe4xj/1Or+BrppbdqxO23bcVXt+FhnwXz9tv7C neko@ayaka.moe
```

RSA 和 ED25519 都支持，都可以这么用。
