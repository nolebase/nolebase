---
tags:
  - 操作系统/macOS
  - 命令行/pkill
  - 命令行/kill
  - 命令行/awk
---

# 音频坏了？可以试试看重启系统组件 `coreaudiod`

新版本系统：

```shell
sudo pkill coreaudiod
```

老版本系统：

```shell
sudo kill -9 `ps ax|grep 'coreaudio[a-z]' | awk '{print $1}'`
```

## 参考资料

- [macbook pro - Restarting sound service? - Ask Different](https://apple.stackexchange.com/questions/16842/restarting-sound-service)
