---
tags:
  - 操作系统/Windows
  - 操作系统/Windows-Server
  - 软件/Windows/WindowsAdminCenter
  - 软件/Windows/Powershell
  - 命令行/Powershell
  - 数学/密码学/证书
  - 数学/密码学/证书/TLS/SSL
  - 命令行/openssl
  - 数学/密码学/算法/ECDSA
  - 数学/密码学/算法/ED25519
  - 数学/密码学/算法/RSA
  - 数学/密码学/证书/TLS/HTTPS
  - 命令行/msiexec
  - 软件/Windows/msiexec
---
# 在部署 Windows Admin Center 的 HTTPS 证书的时候遭遇无法保留端口 443 错误

## TL;DR

可能和证书算法和格式不兼容有关，通过 ED25519 和 ECDSA Secp256k1 算法生成了证书，而不是往常的 RSA 证书，但也许这是 Windows Admin Center 的 HTTPS 服务器尚不支持的，所以出现了问题，切换到 RSA 就好了。

## 缘由

```
1. Unhandled Exception
Microsoft.Deployment.WindowsInstaller.InstallerException
Failed to reserve port 443
```

```
1. 未处理的异常
Microsoft.Deployment.WindowsInstaller.InstallerException
无法保留端口 443
```

## 排查

通过事件查看器（`eventvwr.msc`）查阅了系统的日志之后发现 Windows Admin Center 的安装器以 1603 的错误代码返回了。

我尝试通过[[调试 MSI - 输出 MSI 安装器的输出为日志|将 MSI 安装器的日志输出]]的方式来调试：

```powershell
msiexec /i "C:\Users\neko.HOMELAB\Downloads\WindowsAdminCenter2306.msi" /l*v "log.log"
```

但是实际上依然不行，日志中就是单纯的描述了在绑定端口的时候出现了问题：

```
MSI (s) (94:D4) [23:46:23:247]: Executing op: ActionStart(Name=BindSslPort,,)
操作 23:46:23: BindSslPort.
MSI (s) (94:D4) [23:46:23:263]: Executing op: CustomActionSchedule(Action=BindSslPort,ActionType=3073,Source=BinaryData,Target=BindSslPort,CustomActionData=SME_PORT=443;SME_THUMBPRINT=46a713bd4e296069908c688837642c458d5700d5;SUPPORTED_SERVER_SKU=1)
MSI (s) (94:D0) [23:46:23:263]: Invoking remote custom action. DLL: C:\Windows\Installer\MSI74A1.tmp, Entrypoint: BindSslPort
SFXCA: Extracting custom action to temporary directory: C:\Windows\Installer\MSI74A1.tmp-\
SFXCA: Binding to CLR version v4.0.30319
Calling custom action Microsoft.ManagementExperience.Setup.CustomActions!Microsoft.ManagementExperience.Setup.CustomActions.CustomAction.BindSslPort
操作 23:46:23: 正在绑定 SSL 端口. 正在绑定 SSL 端口
异常:
Microsoft.Deployment.WindowsInstaller.InstallerException
无法保留端口 443
   在 Microsoft.ManagementExperience.Setup.CustomActions.CustomAction.<>c__DisplayClass32_0.<BindSslPort>b__0()
   在 Microsoft.ManagementExperience.Setup.CustomActions.CustomAction.RunInstallerAction(Session session, Func`1 action)
1: 未经处理的异常: Microsoft.Deployment.WindowsInstaller.InstallerException 无法保留端口 443
MSI (s) (94!94) [23:49:51:915]: Transforming table Error.

MSI (s) (94!94) [23:49:51:915]: 产品: Windows Admin Center -- 1: 未经处理的异常: Microsoft.Deployment.WindowsInstaller.InstallerException 无法保留端口 443

CustomAction BindSslPort returned actual error code 1603 (note this may not be 100% accurate if translation happened inside sandbox)
操作结束 23:49:51: InstallFinalize。返回值 3。
```

我尝试通过在服务（`services.msc`）中关闭正在运行的需要升级的 Windows Admin Center 或者切换端口来尝试解决这个问题，但是实际上没有效果，依然是一样的报错。

## 解决

我想起来在我尝试实践[[在本地用 OpenSSL 用配置文件和版本控制的方式创建、配置和使用 Intermediate CA（中间 CA）]]的时候通过 ED25519 和 ECDSA Secp256k1 算法生成了证书，而不是往常的 RSA 证书，我这个时候意识到可能是我使用了 Windows Admin Center 的 HTTPS 服务器尚不支持的证书算法导致的，于是我切换到了 RSA 算法来重新生成和部署证书，然后这个问题就被解决了。

## 参考资料

[Window's Admin Center Failes to Install Cannot reserve port.](https://community.spiceworks.com/topic/2467339-window-s-admin-center-failes-to-install-cannot-reserve-port)

[Windows Admin Center Installation Error](https://social.technet.microsoft.com/Forums/windowsserver/en-US/30c13d54-4abe-455b-bc36-71208116e991/windows-admin-center-installation-error?forum=WinServerPreview)

[Install fails: Failed to reserve port 6516 · Issue #2154 · MicrosoftDocs/windowsserverdocs](https://github.com/MicrosoftDocs/windowsserverdocs/issues/2154)

[Thumbprint format · Issue #611 · MicrosoftDocs/windowsserverdocs](https://github.com/MicrosoftDocs/windowsserverdocs/issues/611)

[Can not open the Page · Issue #645 · MicrosoftDocs/windowsserverdocs](https://github.com/MicrosoftDocs/windowsserverdocs/issues/645)

[安装windows admin center时提示端口的问题 - Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/1341345/windows-admin-center)

[MSI installation error 1603 - Windows Server | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/application-management/msi-installation-error-1603)
