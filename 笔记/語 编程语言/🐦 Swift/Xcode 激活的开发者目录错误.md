---
tags:
  - 开发/Xcode
  - 操作系统/macOS
---
# Xcode 激活的开发者目录错误

错误：

```shell
sdef /Applications/Safari.app > Safari.sdef
xcode-select: error: tool 'sdef' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance
```

解决方案[^1]：

1. 确保 Xcode 在目录 `/Applications` 中，而不是 `/Users/{user}/Applications` 目录中
2. 使用 `xcode-select` 命令将开发者目录指向正确的位置 `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`

[^1]: [macos - xcode-select 激活的开发者目录错误 - Stack Overflow](https://stackoverflow.com/questions/17980759/xcode-select-active-developer-directory-error)
