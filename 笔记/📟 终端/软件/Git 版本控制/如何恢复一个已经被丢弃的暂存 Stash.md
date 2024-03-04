---
tags:
  - 开发
  - 命令行/git
  - 命令行/git/Stash
  - 命令行/git/历史
  - 命令行/git/操作
  - 命令行/git/恢复
  - 命令行/cut
  - 命令行/grep
  - 命令行/xargs
  - 计算机/操作系统/Linux/命令行
  - 开发/Git
---

# 如何恢复一个已经被丢弃的暂存 Stash

最近在工作中经常需要来回切换分支并且 Stash 各种临时的不需要提交的，但是开发的时候需要修改的变更（比如为某个 Vue/React 组件进行开发的时候制作了一个页面来预览和测试组件），但是我有的时候会不小心把没有正确起名字的 Stash 也给全部丢弃掉，但当意识到需要找回这份 Stash 的时候去 Git Reflog 中翻寻的话又会因为有太多记录了而半天都找不到自己想要的东西，无奈之下就去 Google 上搜索了一下，然后偶然在 StackOverflow 中找到了这么一条非常有意思的命令来方便查找自己想要的、被丢弃的 Stash：

```shell
git fsck --unreachable | grep commit | cut -d" " -f3 | xargs git log --merges --no-walk --grep=<你要搜索的 Stash 名称，Stash 一般默认以 WIP 开头>
```

来源：[recovery - How do I recover a dropped stash in Git? - Stack Overflow](https://stackoverflow.com/a/5879550/19954520)

## TL;DR

如果你需要寻找你丢失的 Stash，直接运行上面的命令就好了，最后的 `--grep=<你要搜索的 Stash 名称，Stash 一般默认以 WIP 开头>` 是用来帮忙搜索 Stash 标题的，你可以去掉这个 `--grep` 参数，也可以把占位符换成你的 Stash 可能使用过的标题进行搜寻。对我个人而言我都会好好命名 Stash，或者直接用 WIP，所以对我而言使用 `WIP` 或者具体的名字去寻找会比较简单快速。

使用的效果是这样的：

```shell
❯ git fsck --unreachable | grep commit | cut -d" " -f3 | xargs git log --merges --no-walk --grep=WIP
Checking object directories: 100% (256/256), done.
Checking objects: 100% (82/82), done.
commit 726b3be5de2fbc1e37496fee33d686bff1001bcb
Merge: 95e340e 3ec8098
Author: Ayaka Neko <neko@ayaka.moe>
Date:   Thu Nov 25 14:47:19 2021 +0800

    WIP on main: 95e340e 小音更新了知识库: 2021-11-02 11:52:35
```

中间这段

> WIP on main: 95e340e 小音更新了知识库: 2021-11-02 11:52:35

就是 Stash 曾经使用的标题了，你可以通过这段标题和日期时间找到你需要的 Stash。

最后把 `commit` 后面的 hash 复制出来使用下面的命令执行：

```shell
git stash apply <commit_hash>
```

比如：

```shell
git stash apply 726b3be5de2fbc1e37496fee33d686bff1001bcb
```

然后就能恢复 Stash 了！

🎉 恭喜，你现在找回了你想要的 Stash，可以继续回到工作上啦！

## 解释

那么接下来我们来了解一下为什么会有这样的命令和效果。在命令行里，命令与命令间可以通过被称之为管道符 `|` 的字符来传递信息，因此管道符可以将不同的命令的返回数据串联在一起，在接下来的讲解中我们会基于管道符 `|` 和被调用的命令本身拆开来逐个说明。

### 第一段命令

```shell
git fsck --unreachable
```

`git fsck` 是命令本身，`--unreachable` 是参数。

- `git fsck` 是一个用来验证数据库中的对象的连接性和有效性的命令[^1]（用人话来说：看看现在的 `.git/object` 目录中所记录的「对象」们（可以理解为一个提交，一个 Stash 等等），验证一下这些「对象」和「对象」之间的关系）。
- `--unreachable` 是 `git fsck` 的一个参数，用来要求打印出目前记录过的「对象」里已经不能从任何参考节点到达的对象（也就是我们弄丢的这些 Stash，commit，branch，tag）。（有关 *reachable* 和 *unreachable* 对象的知识，可以阅读[这里](https://git-scm.com/docs/gitglossary/#Documentation/gitglossary.txt-aiddefreachableareachable)和[这里](https://git-scm.com/docs/gitglossary/#Documentation/gitglossary.txt-aiddefunreachableobjectaunreachableobject)）

所以这个命令可以用来打印出我们目前 Git 仓库中已经*弄丢*的「对象」们，或者说，Stash 们。

它的输出可能长这样：

```shell
git fsck --unreachable
Checking object directories: 100% (256/256), done.
Checking objects: 100% (82/82), done.
unreachable blob 6180dc58dc7c3112fff1cdbb7852fbe4fe942b01
unreachable tree 03c1f688f4749f5938180e96e19fe7e33e72b1ac
unreachable blob 2a4166ffc8cd6e72a03dba4df115f7aa65fdc990
unreachable commit 4a81b846a25c459e8c4ec8ec0f9574e1853ed989
unreachable blob 67c1a30284ce9e50cf930347c9ba8f6be0dffedb
unreachable tree 6f01ea3794e7eb040da9592b287f7e4bffa85793
unreachable commit 5fc2505971797600dd926d786499d068d8343b9a
unreachable tree 9702117312b9430e3004d9819d7a22b0c6e41e96
unreachable tree f642aab9b837713ddf31ede8b018bb46bc69ecb0
unreachable tree 2d8364d29f446ef00a4dff03ebbcb592236b5484
```

### 第二段命令

```shell
grep commit
```

`grep` 是命令本身，`commit` 是传递给 `grep` 的参数。

`grep` 命令想必你已经很熟悉了，如果不熟悉，可以阅读以下 [`man grep`](https://man7.org/linux/man-pages/man1/grep.1.html)，或者觉得麻烦的话也可以看看[Grep - 维基百科](https://zh.wikipedia.org/zh-tw/Grep)。简而言之，`grep` 命令在这里的作用是在输入的文本数据流中搜索我们给它传递的 `commit` 的字符串，并且把这些命中的行列举出来。如果我们的前一个输出是

```shell
unreachable blob 6180dc58dc7c3112fff1cdbb7852fbe4fe942b01
unreachable tree 03c1f688f4749f5938180e96e19fe7e33e72b1ac
unreachable blob 2a4166ffc8cd6e72a03dba4df115f7aa65fdc990
unreachable commit 4a81b846a25c459e8c4ec8ec0f9574e1853ed989
unreachable blob 67c1a30284ce9e50cf930347c9ba8f6be0dffedb
unreachable tree 6f01ea3794e7eb040da9592b287f7e4bffa85793
unreachable commit 5fc2505971797600dd926d786499d068d8343b9a
unreachable tree 9702117312b9430e3004d9819d7a22b0c6e41e96
unreachable tree f642aab9b837713ddf31ede8b018bb46bc69ecb0
unreachable tree 2d8364d29f446ef00a4dff03ebbcb592236b5484
```

这样的话，那么 `grep commit`  命令在这里就可以帮我们把 `commit` 相关的行提取出来，长这样：

```shell
unreachable commit 4a81b846a25c459e8c4ec8ec0f9574e1853ed989
unreachable commit 5fc2505971797600dd926d786499d068d8343b9a
```

### 第三段命令

```shell
cut -d" " -f3
```

这个就有点太晦涩难懂了。不过依然可以很好的理解：`cut` 是命令本身，`-d` 和 `-f` 都是参数。

`cut` 是做什么的呢？`cut` 命令可以帮忙将特定文件，或者通过管道符 `|` 传输的文本切成多段。

- `-d" "` 的 `-d` 是分隔符的意思，这里我们指定我们的分割符为 `" "`（1 个空格）。
- `-f3` 的 `-f` 是在分割后我们需要选择的字段名。比如这里我们用 `-d` 将之前的输出按 1 个空格进行切分后，选择了字段 3。这样说也许依然很晦涩难懂，不如我们在下面的例子中进行进一步的讲解。

上一段命令的输出为：

```shell
unreachable commit 4a81b846a25c459e8c4ec8ec0f9574e1853ed989
unreachable commit 5fc2505971797600dd926d786499d068d8343b9a
```

这次我们把数据继续喂给 `cut`，于是能得到下面的输出：

```shell
4a81b846a25c459e8c4ec8ec0f9574e1853ed989
5fc2505971797600dd926d786499d068d8343b9a
```

这意味着我们将字符串切分为了

```javascript
["unreachable", "commit", "4a81b846a25c459e8c4ec8ec0f9574e1853ed989"]
```

这样的数组之后使用 `-f3` 选中了第三个元素，也就是最后一个元素，并且输出这个元素。

### 第四段命令

```shell
xargs git log --merges --no-walk --grep=WIP
```

`xargs` 是命令本身，`git log --merges --no-walk --grep=WIP` 是它的参数，但是这并不意味着 `xargs` 内置了 `git`，`git` 其实是被 `xargs` 调用的命令。还记得我们最开始提到过，管道符 `|` 可以将数据传递给其他的命令工具吗？这里我们需要把之前第三段命令的输出看作是 `xargs` 的实际参数。

那为什么我们会需要使用 `xargs` 呢？这是因为在使用 Unix / Linux 和通过命令行进行很多操作的时候都会遇到很多不支持管道符 `|` 来传入参数的命令工具，使用 `xargs` 可以很好的解决这个问题，虽然 `xargs` 的原始功能其实是[^2]：

> **xargs** reads items from the standard input, delimited by blanks (which can be protected with double or single quotes or a backslash) or newlines, and executes the *command* (default is *echo*) one or more times with any *initial-arguments* followed by items read from standard input.

中文解释：

> xargs 从标准输入中读取以空格（可以用双引号、单引号或反斜线保护）或换行符分隔的条目，然后执行命令（默认为 echo）一次或多次，并在从标准输入读取的条目后面加上任何初始参数。

但是实际上，你可以通过它这样的特性，通过给它输入一个多行的文本，文本中包含着需要执行的命令会需要的参数，然后 `xargs` 就会自动帮你展开成多个的参数传递给接受多个参数的命令，比如默认的 `echo`。

比如这里有个例子：

```shell
$ echo 'Line 1
Line 2
Line 3' | xargs
Line 1 Line 2 Line 3
```

它相当于帮你执行了

```shell
echo 'Line 1' 'Line 2' 'Line 3'
```

根据上面我们的解释，那我们可以理解为 `xargs` 将会接受我们在第三段命令中的输出，并且转换为单行多个参数传递给 `git log --merges --no-walk --grep=WIP` 命令，如果我们上面的输出是：

```shell
4a81b846a25c459e8c4ec8ec0f9574e1853ed989
5fc2505971797600dd926d786499d068d8343b9a
```

那么接下来 `xargs git log --merges --no-walk --grep=WIP` 命令的效果其实等同于：

```shell
git log --merges --no-walk --grep=WIP 4a81b846a25c459e8c4ec8ec0f9574e1853ed989 5fc2505971797600dd926d786499d068d8343b9a
```

### 第五段命令

```shell
git log --merges --no-walk --grep=WIP
```

终于到了我们需要获得结果的时刻了！

`git log` 是命令本身，`--merges` 是参数，`--no-walk` 是参数，`--grep=WIP` 也是参数：

- `git log` 可以展示历史记录
- `--merges` 只输出合并记录
- `--no-walk` 只输出我们要求它输出的 commit（提交），而不去递归搜寻 commit（提交）的祖先
- `--grep` 用于在提交消息中进行搜索，`--grep=WIP` 表示只在提交记录中搜索提交消息匹配 `WIP` 字样的条目

所以这段命令就是要求 Git 将我们找到的这些已经*丢失*的提交的记录，并且要求只包含合并的提交（Stash 其实是一种合并提交，所以这里我们希望找到 Stash 的话就只需要看合并提交就没问题啦），要求不用寻找提交的祖先，并且要求提交消息（也就是 Stash 的名称）匹配 `WIP` 的记录。

## 结束

这就是全部的命令说明和讲解啦，我感觉还是很巧妙的。你可以把它保存为一个脚本或者配置为 git alias 然后在需要的时候捞出来用！

其实不光是这个命令很有用，在我找到这个命令的回答里也有其他很多非常有意思的解法，有兴趣的话也可以去阅读和尝试看看！

祝你开发旅程顺利，永远都能找到你需要的提交，以及，记得不要在喝醉了或者嗑药的情况下执行危险的操作哦！

## 参考资料

- [Git - gitglossary Documentation (git-scm.com)](https://git-scm.com/docs/gitglossary/#Documentation)
- [git fsck: how --dangling vs. --unreachable vs. --lost-found differ? - Stack Overflow](https://stackoverflow.com/a/36671659/19954520)
- [Git - git-log Documentation](https://git-scm.com/docs/git-log)

[^1]: [Git - git-fsck Documentation (git-scm.com)](https://git-scm.com/docs/git-fsck/zh_HANS-CN#_%E6%8F%8F%E8%BF%B0)
[^2]: [xargs - Linux manual page](https://man7.org/linux/man-pages/man1/xargs.1.html)
