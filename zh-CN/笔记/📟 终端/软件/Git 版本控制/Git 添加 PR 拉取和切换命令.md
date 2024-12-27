---
tags:
  - 开发/Git
  - 命令行/git
  - 网站/GitHub
---
# Git 添加 PR 拉取和切换命令

## 说明

审核代码的时候可能 GitHub 的 PR 文件视图不太好阅读，上下文的代码查找也会需要大量的时间，拉取到本地阅读会方便不少。

如果直接通过 `git` 命令来执行 PR 的拉取的话又会太麻烦，可以通过 `git` 命令支持的 alias（别名）来定义一下拉取 PR 的命令集。

输入下面的指令来编辑 `git` 命令的别名：

命令说明：

1. `config` 表示我们需要变更 `git` 命令的配置
2. `--global` 表示我们需要变更全局配置
3. `-e` 表示使用配置的默认编辑器进行编辑

```shell
git config --global -e
```

打开后可能会看到类似的文件内容：

```ini
[user]
    signingkey = 
    email = neko@ayaka.moe
    name = Ayaka Neko
[core]
    editor = code -w --reuse-window
```

我们需要在文件末尾添加一个新的配置项 `[alias]` 来声明别名，如果你已经有 `[alias]` 配置项，可以只添加别名的内容：

别名配置语法（多个命令可以用 `&&` 符号连接起来）：

```ini
[alias]
    <别名> = "<执行的命令>"
```

添加快速拉取 PR 的别名只需要复制粘贴下面的代码即可：

```ini
[alias]
    pullpr = "!f(){\
        [ -z \"$1\" ] && { echo 使用方法: git pullpr PULL_REQUEST_ID [REMOTE_NAME] [NEW_BRANCH_NAME]; exit 1; }; \
        remote=${2:-upstream}; \
        branch=${3:-pr-$1}; \
        git fetch $remote \"pull/$1/head:$branch\"; \
        }; f "
    pr = "!f(){\
        branch=${3:-pr-$1}; \
        git pullpr \"$@\"; \
        git switch $branch; \
        }; f "
```

使用方法：

1. 拉取指定来源的 PR 到本地：

对于远程代码库的设定可以参阅 [Git 命令速记](Git%20%E5%91%BD%E4%BB%A4%E9%80%9F%E8%AE%B0.md) 中的「远程代码库」章节：

```shell
git pullpr <PR 的 ID> <远程代码库，默认为 upstream> <新的分支名称>
```

2. 快速拉取 PR 到本地：

```shell
git pr <PR 的 ID>
```
