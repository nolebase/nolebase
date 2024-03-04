---
tags:
  - 运维
  - 运维/物理机
  - 运维/服务器
  - 运维/服务器/戴尔/PowerEdgeR730
  - 运维/服务器/戴尔/iDRAC9
  - 运维/服务器/戴尔/iDRAC
  - 数学/密码学/证书/TLS
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/TLS/HTTPS
  - 数学/密码学/证书
  - 数学/密码学/证书/TLS/域名证书
  - 命令行/racadm
  - 操作系统/Windows
  - 操作系统/Windows-Server
---
# 配置 iDRAC 的 TLS SSL 证书

## 下载 Windows 管理需要使用的 racadm 命令

[Integrated Dell Remote Access Controller 9 RACADM CLI Guide | Dell 香港](https://www.dell.com/support/manuals/zh-hk/poweredge-c6420/idrac_4.00.00.00_racadm/supported-racadm-interfaces?guid=guid-a5747353-fc88-4438-b617-c50ca260448e&lang=en-us)

下载 Dell EMC OpenManage DRAC Tools, includes Racadm (64bit),v9.2.0

![](./assets/dell-idrac-1.png)

下载后解压并打开安装包进行安装。
安装后可以选择配置 Windows 系统变量 Path，将 Dell OpenManage 程序安装位置目录下的 rac5 目录添加到 Path 中，如果不希望配置，则可以选择直接打开 Windows Terminal (管理员权限) 并切换目录到 rac5 的目录：

比如我的是 `C:\Program Files\Dell\SysMgt\rac5`，则

```shell
cd "C:\Program Files\Dell\SysMgt\rac5"
```

切换后需要上传我们的证书和证书密钥

## 上传证书和证书密钥

### 上传证书密钥

#### 命令

```shell
racadm -r <ip_address> -i sslkeyupload -t 1 -f <key file path>
```

#### 示例

```shell
racadm -r 10.0.0.100 -i sslkeyupload -t 1 -f 'F:\certs\home.cat\general \home.cat.key'
```

```shell
PS rac5> racadm -r 10.0.0.100 -i sslkeyupload -t 1 -f 'F:\certs\home.cat\general
\home.cat.key'
Security Alert: Certificate is invalid - Certificate is not signed by Trusted Third Party
Continuing execution. Use -S option for racadm to stop execution on certificate-related errors.
UserName: root
Password:
SSL key successfully uploaded to the RAC.
```

#### 上传证书

#### 命令

```shell
racadm -r <ip_address> -i sslcertupload -t 1 -f <cer file path>
```

### 示例

```shell
racadm -r 10.0.0.100 -i sslcertupload -t 1 -f 'F:\certs\home.cat\general\home.cat.cer'
```

```shell
PS rac5> racadm -r 10.0.0.100 -i sslkeyupload -t 1 -f 'F:\certs\home.cat\general\home.cat.cer'
Security Alert: Certificate is invalid - Certificate is not signed by Trusted Third Party
Continuing execution. Use -S option for racadm to stop execution on certificate-related errors.
UserName: root
Password:
DH010: Reset iDRAC to apply new certificate. Until iDRAC is reset, the old
certificate will be active. Reset the iDRAC. The iDRAC can be reset by pressing
the Identify button for 15 seconds. Using the RACADM command line utility, run
"racadm racreset".
```

## 重设 iDRAC 控制器

### 命令

```shell
racadm -r <ip_address> -u root -p <password> racreset
```

## 延伸阅读

- [Dell : How to install a custom issued SSL certificate on iDRAC | ITechLounge.net](https://www.itechlounge.net/2018/03/dell-how-to-install-a-custom-issued-ssl-certificate-on-idrac/)
- [支援 PowerEdge R730 | 驅動程式與下載 | Dell 香港](https://www.dell.com/support/home/zh-hk/product-support/product/poweredge-r730/drivers)
