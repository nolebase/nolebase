---
tags:
  - 开发/Git
  - 网站/GitHub
---
# 国内 GitHub 加速

## FastGit 使用说明

关于 FastGit 的使用，本质上与 `git` 有关。常规的面向 GitHub 的 `clone` 命令可能如下：

```shell
git clone https://github.com/author/repo
```

使用 FastGit 时，可使用如下命令：

```shell
git clone https://hub.fastgit.org/author/repo
```

正如您所见， FastGit 仅仅是 GitHub 的代理，所以我们仅需要替换远程地址。

当然，您也可以直接修改 `git` 的配置，使用 FastGit 替换所有指向 GitHub 的链接：

```shell
git config --global url."https://hub.fastgit.org/".insteadOf "https://github.com/"
git config protocol.https.allow always
```

[FastGit 官方文档](https://doc.fastgit.org/zh-cn/#%E5%85%B3%E4%BA%8E-fastgit)

## 别的类似镜像

[https://gitclone.com/](https://gitclone.com/)

[https://github.com/HuangCongQing/mirrors](https://github.com/HuangCongQing/mirrors)
