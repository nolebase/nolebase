---
tags:
  - 开发/Git
  - 命令行/git
---
# Git 命令中文乱码的解决方案

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| git | git version 2.32.1 (Apple Git-133) | [Git (git-scm.com)](https://git-scm.com/) |

## 说明

在使用 `simple-git` npm 库调用 Git 命令的子命令 `git status` 或者是 `git diff-tree` 时候会出现中文文件名乱码的情况：

比如：

1. 获取包含中文文件名的提交记录哈希

```shell
$ git log --online
9ae153c (HEAD -> main, origin/main, origin/HEAD) chore: 将所有内部链接转换为 Markdown 链接
```

2. 使用查询到的 `9ae153c` 提交哈希进行 `diff-tree` 操作：

```shell
$ git diff-tree --no-commit-id --name-only -r 9ae153c
"\342\232\240\357\270\217 \347\237\245\350\257\206\345\272\223\351\241\273\347\237\245.md"
```

可以发现返回的数据中包含了 `\342\232\240\357\270\217 \347\237\245\350\257\206\345\272\223\351\241\273\347\237\245.md` 这样的乱码字符串，或者我们说出现了 `\xxx\xxx\xxx` 这样的乱码。

## 原因

出现这个问题的原因是因为 Git 命令全局配置下有一个名为 `core.quotepath` 的选项默认值为 `true`，这将导致 Git 命令会将「不寻常」的字符通过包裹双引号和反斜杠进行转译[^1]。将 `core.quotepath` 选项配置为 `false` 之后其将不会对高于 `0x80`（大于 ASCII 码表最大值 `0x7E`[^2]）的字符进行转译，而是选择全部逐字输出。

## 解决

在命令行程序中使用下面的命令进行配置：

```shell
git config --global core.quotepath false
```

## 参考资料

- [git乱码解决方案汇总 | ZRONG's BLOG](https://blog.zengrong.net/post/git-codec-issues/)
- [在git中出现中文乱码的解决方案_Johnny丶me的博客-CSDN博客_git utf8](https://blog.csdn.net/tyro_java/article/details/53439537)
- [Linux下Git命令中文显示乱码的问题解决：274\232\350\256\256\346\200\273\347\273\223 - EasonJim - 博客园](https://www.cnblogs.com/EasonJim/p/8403587.html)

[^1]: `core.quotepath`. The commands that output paths (e.g. _ls-files_, _diff_), when not given the -z option, will quote "unusual" characters in the pathname by enclosing the pathname in a double-quote pair and with backslashes, the same way strings in the C source code are quoted. From [git-config(1) - Linux man page](https://linux.die.net/man/1/git-config)
[^2]: [ASCII - Wikipedia](https://en.wikipedia.org/wiki/ASCII)
