---
tags:
  - 软件/macOS
  - 操作系统/macOS
  - 软件/开源/ILSPY
  - 开发/dotnet
  - 开发/CSharp
  - 开发/CSharp/DLL
  - 开发/dotnet/DLL
  - 开发/逆向工程
  - 开发/逆向工程/反编译
---
# 在 macOS 上反编译一个 .NET 用的 DLL 文件

<script setup>
import ILSpy from './assets/ILSpy.png'
</script>

> 感谢 [c# - .NET decompiler for Mac or Linux - Stack Overflow](https://stackoverflow.com/questions/27413469/net-decompiler-for-mac-or-linux) 的回答者们给的很多有趣的方案。他们提及到了在 macOS 和 Linux 上可以用 [icsharpcode/ILSpy](https://github.com/icsharpcode/ILSpy) 开源项目反编译 DLL 文件。

## 方案一：用 VSCode 插件 [ilspy-vscode](https://marketplace.visualstudio.com/items?itemName=icsharpcode.ilspy-vscode)

VSCode 可以用 [ilspy-vscode](https://marketplace.visualstudio.com/items?itemName=icsharpcode.ilspy-vscode) 作为 VSCode 拓展进行反编译。

> 为什么不用 Visual Studio for Mac？
> 因为即将在 2024 年 8 月 31 日停止支持
> 在这里可以阅读更多信息： https://learn.microsoft.com/en-us/visualstudio/mac/what-happened-to-vs-for-mac?view=vsmac-2022

### 先决条件

[ilspy-vscode](https://marketplace.visualstudio.com/items?itemName=icsharpcode.ilspy-vscode) 需要 .NET 8 才能运行，你可以通过

```shell
dotnet --version
```

来查看 .NET 的版本号，如果需要安装 .NET 8 的话可以这样：

```shell
brew install dotnet@8
```

> 可能还会需要 VSCode 的 [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) 拓展（有关如何在 VSCode 中开发 C#，可以阅读 [Getting Started with C# in VS Code](https://code.visualstudio.com/docs/csharp/get-started)）

安装完成之后可以通过 <kbd data-macos-keyboard-key="command">command</kbd> + <kbd data-keyboard-key="shift">Shift</kbd> + <kbd>P</kbd> 打开 VSCode 的命令面板然后输入

```txt
Reload Window
```

来要求 VSCode 重新载入。

接下来，用 VSCode 打开包含有期望反编译的 `.dll` 文件的目录，在这个 `.dll` 文件上点击右键，然后点选「Decompile selected assembly」：

![](./assets/discompile-a-dll-that-dotnet-uses-on-macos-1.png)

这个时候在侧边栏就能找到 ILSPY 的反编译结果和界面了：

![](./assets/discompile-a-dll-that-dotnet-uses-on-macos-4.png)

## 方案二：用 [AvaloniaILSpy](https://github.com/icsharpcode/AvaloniaILSpy)

上面提到的例子，是使用 VSCode 作为界面 UI 去跑 ILSPY 完成反编译，而实际上 ILSPY 也是有自己的社区封装的 GUI 可以使用的，这在你不喜欢 VSCode 或者不想折腾 VSCode 插件的时候会很有用。

<AppContainer :icon-src="ILSpy" href="https://github.com/icsharpcode/AvaloniaILSpy">
  <template #image>
    <img src="./assets/ILSpy.png" p-4 />
  </template>
  <template #name>
    ILSpy
  </template>
  <template #by>
    icsharpcode
  </template>
</AppContainer>

在 [Releases · icsharpcode/AvaloniaILSpy](https://github.com/icsharpcode/AvaloniaILSpy/releases) 下载之后启动就行。

::: details 遇到了「“ILSpy” 已损坏，无法打开，您应该将它移到废纸篓」的提示？

![](./assets/discompile-a-dll-that-dotnet-uses-on-macos-2.png)

应该根据 [icsharpcode/AvaloniaILSpy: Avalonia-based .NET Decompiler (port of ILSpy)](https://github.com/icsharpcode/AvaloniaILSpy) 的文档，对 ILSpy 解除 macOS 系统保护限制：

```shell
xattr -rd com.apple.quarantine /Applications/ILSpy.app
```

:::

然后就能看到这样的界面了：

![](./assets/discompile-a-dll-that-dotnet-uses-on-macos-3.png)

![](./assets/discompile-a-dll-that-dotnet-uses-on-macos-5.png)

其他相关的反编译插件：

[Decompiler - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tintinweb.vscode-decompiler)
