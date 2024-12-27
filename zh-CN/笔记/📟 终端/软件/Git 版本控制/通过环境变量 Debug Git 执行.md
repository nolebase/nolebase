---
tags:
  - 开发/Git
  - 命令行/git
---
# 通过环境变量 Debug Git 执行

最近在做 mlperf 的时候，clone 的 https://github.com/mlcommons/training 总是会在 clone 之后无法 checkout 到分支，会报错提示：

```shell
* GnuTLS recv error (-9): Error decoding the received TLS packet.
* Closing connection 0
error: RPC failed; curl 56 GnuTLS recv error (-9): Error decoding the received TLS packet.
fatal: the remote end hung up unexpectedly
fatal: early EOF
fatal: index-pack failed
```

手动使用

```shell
git status
```

也无法修复，偶然在 [Repo 之解决 GnuTLS recv error (-9): Error decoding the received TLS packet(二十九) CSDN 博客](https://blog.csdn.net/u010164190/article/details/124282644) 和 [ubuntu - How to fix git error: RPC failed; curl 56 GnuTLS - Stack Overflow](https://stackoverflow.com/questions/38378914/how-to-fix-git-error-rpc-failed-curl-56-gnutls) 看到了大家分享的解决方案：

```shell
export GIT_TRACE_PACKET=1
export GIT_TRACE=1
export GIT_CURL_VERBOSE=1
```

开启之后就能看到 Git 是如何请求各种资源并且遭遇到不同的错误的了。