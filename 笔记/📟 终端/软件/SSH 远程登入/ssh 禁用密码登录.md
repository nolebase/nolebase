# ssh 禁用密码登录

前往 `/etc/ssh/sshd_config` 文件，搜索 `PasswordAuthentication`，将 `yes` 改为 `no`。

```txt
PasswordAuthentication no
```
