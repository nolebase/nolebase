---
tags:
  - 命令行/ssh
  - 开源/软件/ssh
  - 计算机/信息技术/安全
  - 计算机/信息技术/安全/网络安全
  - 计算机/信息技术/安全/操作系统安全
---
# ssh 禁用密码登录

前往 `/etc/ssh/sshd_config` 文件，搜索 `PasswordAuthentication`，将 `yes` 改为 `no`。

```txt
PasswordAuthentication no
```
