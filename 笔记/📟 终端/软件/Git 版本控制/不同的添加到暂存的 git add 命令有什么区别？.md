---
tags:
  - 开发/Git
  - 命令行/git
---
# 不同的添加到暂存的 `git add` 命令有什么区别？

- `git add -A`
- `git add .`
- `git add -u`

这三者都有什么区别？又各自有什么坑？

## Git Version 1.x

| 命令           | 新文件 | 修改文件 | 删除文件 | 说明                |
| ------------ | --- | ---- | ---- | ----------------- |
| `git add -A` | ✔️  | ✔️   | ✔️   | 暂存所有（新建、修改、删除的）文件 |
| `git add .`  | ✔️  | ✔️   | ❌    | 只暂存新文件和修改文件       |
| `git add -u` | ❌   | ✔️   | ✔️   | 只暂存修改文件和删除文件      |

## Git Version 2.x

| 命令                           | 新文件 | 修改文件 | 删除文件 | 说明                     |
| ---------------------------- | --- | ---- | ---- | ---------------------- |
| `git add -A`                 | ✔️  | ✔️   | ✔️   | 暂存所有（新建、修改、删除的）文件      |
| `git add .`                  | ✔️  | ✔️   | ✔️   | 暂存当前目录下所有（新建、修改、删除的）文件 |
| `git add --ignore-removal .` | ✔️  | ✔️   | ❌    | 只暂存新文件和修改文件            |
| `git add -u`                 | ❌   | ✔️   | ✔️   | 只暂存修改文件和删除文件           |

## 已知的坑

1. 对于未正确配置 `.gitignore` 和在 `git --config -g` 的 `.gitignore` 的系统或者 `git` 的运行环境而言，如果直接使用 `git add -A` 的话，会出现把 `.DS_Store` 这样的无效的文件或者 `Trash-0` 这样的会有权限异常或者已经不存在或者有 symlink 的文件或者目录添加到 `.git` 的问题，往往 `git add -A` 执行的时候就会出现问题，这对于集成了 `git clone` 和 `git pull` 的工具而言会比较 critical；
2. 对于未正确配置 `.gitignore` 的 `git` 仓库，如果背后接入了 NFS 或者自定义的 FileSystem（文件系统），临时生成的文件：超大的 log，转换过的数据集，模型权重，或者 `huggingface-cli` 下载的模型，在使用 `git add -A` 的时候可能会遭遇 NFS 的性能瓶颈。

## 参考资料

- [git add - Difference between "git add -A" and "git add ." - Stack Overflow](https://stackoverflow.com/a/26039014/19954520)