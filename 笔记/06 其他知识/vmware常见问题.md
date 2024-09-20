---
share: "true"
---
1. 手动挂载共享目录
```shell
sudo mount -t fuse.vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other
```
2. 没有网络图标
```shell
systemctl stop NetworkManager &&
sudo rm /var/lib/NetworkManager/NetworkManager.state &&
systemctl start NetworkManager
```