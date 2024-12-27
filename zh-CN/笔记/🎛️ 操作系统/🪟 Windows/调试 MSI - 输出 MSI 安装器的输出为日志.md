---
tags:
  - 操作系统/Windows
  - 操作系统/Windows-Server
  - 软件/Windows/msiexec
  - 操作系统/Windows/MSI
  - 软件/Windows/WindowsAdminCenter
  - 命令行/msiexec
  - 软件/Windows/Powershell
  - 命令行/Powershell
---
# 调试 MSI - 输出 MSI 安装器的输出为日志

```powershell
msiexec /i "installer.msi" /l*v "log.log"
```

比如如果要调试 Windows Admin Center 的安装包的话我们可以执行：

```powershell
msiexec /i "C:\Users\neko.HOMELAB\Downloads\WindowsAdminCenter2306.msi" /l*v "log.log"
```

## 参考资料

[msiexec | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/msiexec#logging-options)

[logging - Create an MSI log file - Stack Overflow](https://stackoverflow.com/questions/7126077/create-an-msi-log-file>)