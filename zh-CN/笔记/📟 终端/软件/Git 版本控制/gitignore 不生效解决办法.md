---
tags:
  - 命令行/git
  - 开发/Git
---
# .gitignore 不生效解决办法

当我们将 .gitignore 文件配置好后，却往往不能生效。这是因为 .gittignore 只能忽略那些没有被追踪（`track`）的文件，因为 git 存在本地缓存，如果文件已经纳入了版本管理，那么修改 .gittignore 是不能生效的。

那么解决办法就是将 git 的本地缓存删除

```shell
git rm -r --cached .
```

然后在提交就可以了

```shell
git add .
git commit -m "update .gitignore"
```
