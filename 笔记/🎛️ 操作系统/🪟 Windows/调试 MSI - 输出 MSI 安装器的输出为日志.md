# 调试 MSI - 输出 MSI 安装器的输出为日志

[logging - Create an MSI log file - Stack Overflow](https://stackoverflow.com/questions/7126077/create-an-msi-log-file>)

```powershell
msiexec /i "installer.msi" /l*v "log.log"
```

比如如果要调试 Windows Admin Center 的安装包的话我们可以执行：

```powershell
msiexec /i "C:\Users\neko.HOMELAB\Downloads\WindowsAdminCenter2306 (1).msi" /l*v "log.log"
```
