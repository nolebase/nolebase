---
status: 尚未完成
---
# 自建 Docker Registry

### 安装 Docker

可以参考官方指南在 Debian 11 上安装 Docker：[Install Docker Engine on Debian | Docker Documentation](https://docs.docker.com/engine/install/debian/)

也可以执行下面的脚本，每次一行：

```shell
sudo apt update
```

```shell
sudo apt install ca-certificates curl gnupg lsb-release
```

```shell
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```shell
sudo apt update
```

```shell
sudo apt install docker-ce docker-ce-cli containerd.io
```
