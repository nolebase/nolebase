# 透过 Cloudflare Access（ZTNA）安全地远程访问 Kubernetes 集群



```shell
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo apt install ./cloudflared-linux-amd64.deb
```

> [!NOTE] 如果你需要升级
>
> ```shell
> mv cloudflared-linux-amd64.deb cloudflared-linux-amd64-<下载日期>.deb
> wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
> mv cloudflared-linux-amd64.deb cloudflared-linux-amd64-<下载日期>.deb
> sudo apt install ./cloudflared-linux-amd64-<下载日期>.deb
> ```

```shell
cloudflared tunnel login
```

```shell
You can obtain more detailed information for each tunnel with `cloudflared tunnel info <name/uuid>`
ID                                   NAME         CREATED              CONNECTIONS
0dcf109b-70ae-41d8-bb1a-af0da8918928 example-tunnel 2023-10-10T07:22:13Z 1xhkg01, 1xhkg09, 1xtpe01
```
