---
tags:
  - 软件/Visual-Studio-Code/vscode
  - 操作系统/macOS
  - 命令行/xattr
  - 命令行/chown
  - 软件/Visual-Studio-Code
---
# 解决 VS Code 不能在只读卷上更新

#### VS Code 提示

> Cannot update while running on a read-only volume. The application is on a read-only volume. Please move the application and try again. If you're on macOS Sierra or later, you'll need to move the application out of the Downloads directory. See this link for more information.

#### 翻译过来是

>在只读卷上运行时无法更新。 该应用程序位于只读卷上。 请移动应用程序并重试。 如果您使用的是 macOS Sierra 或更高版本，则需要将应用程序移出下载目录。 有关更多信息，请参阅此链接。

#### 解决方案

```shell
sudo chown -R $USER ~/Library/Caches/com.microsoft.VSCode.ShipIt

xattr -dr com.apple.quarantine /Applications/Visual\ Studio\ Code.app
```

`chown` —— 改变文件的归属者（[chown 变更所属权](chmod%20变更权限.md)）

`xattr` —— 操作文件的扩展信息，这里用来删除文件和子文件的扩展信息

**然后彻底关闭 VS Code 后重新打开即可解决问题。**
