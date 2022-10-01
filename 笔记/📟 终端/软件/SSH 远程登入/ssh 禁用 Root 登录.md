# ssh 禁用 Root 登录

前往 `/etc/ssh/sshd_config` 文件，搜索 `PermitRootLogin`，将 `yes` 改为 `no`。

```
PermitRootLogin no
```
