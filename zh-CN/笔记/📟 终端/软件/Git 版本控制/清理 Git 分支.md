---
tags:
  - 开发/Git
  - 命令行/git
  - 命令行/git/操作
---

# 清理 Git 分支

## 清理追踪分支

```shell
git fetch origin --prune
```

或者

```shell
git remote update origin --prune
```

如果不想更新本地 Git 存储库但是想先执行试试的话：

```shell
git remote prune origin
```
## 清理本地分支

### 清理本地所有包含 `dev/` 的分支

```shell
git branch | grep "dev/" | xargs git branch -D
```
### 清理本地除去包含 `dev/` 的分支以外所有的分支

```shell
git branch | grep -v "dev/" | xargs git branch -D
```
