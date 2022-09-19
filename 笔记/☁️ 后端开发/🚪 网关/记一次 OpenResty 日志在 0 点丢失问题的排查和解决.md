# 记一次 OpenResty 日志在 0 点丢失问题的排查和解决

#网关 #nginx #openresty #故障排查

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-08-30 | 创建 |

##### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Debian | 11/5.10.127-1/amd64 |  |
| OpenResty | openresty/1.21.4.1 | [OpenResty® - Official Site](https://openresty.org/en/) |

## 起因

问题起因是

![an-openresty-log-missing-on-everyday-0-issue-troubleshooting-and-fix-record-screenshot-01](an-openresty-log-missing-on-everyday-0-issue-troubleshooting-and-fix-record-screenshot-01.png)

```shell
sudo ls -la /var/log/nginx/
总用量 0
drwxr-xr-x  2 root     adm         0  8月 27 00:00 .
drwxr-xr-x 12 root     root        0  8月 28 00:00 ..
-rw-r-----  1 nginx    adm         0  8月 27 00:00 access.log
-rw-r-----  1 nginx    adm         0  8月 30 10:34 access.log.1
-rw-r-----  1 nginx    adm         0  8月 26 15:39 access.log.2.gz
-rw-r-----  1 nginx    adm         0  8月 18 10:54 access.log.3.gz
-rw-r-----  1 nginx    adm         0  8月 16 23:56 access.log.4.gz
-rw-r-----  1 nginx    adm         0  8月 15 23:21 access.log.5.gz
-rw-r-----  1 nginx    adm         0  8月 14 23:59 access.log.6.gz
-rw-r-----  1 nginx    adm         0  8月 13 23:50 access.log.7.gz
-rw-r-----  1 nginx    adm         0  8月 12 23:59 access.log.8.gz
-rw-r-----  1 nginx    adm         0  8月 11 23:58 access.log.9.gz
```

```logrotate
/var/log/nginx/*.log {
        daily
        missingok
        rotate 52
        compress
        delaycompress
        notifempty
        create 640 nginx adm
        sharedscripts
        postrotate
                if [ -f /var/run/nginx.pid ]; then
                        kill -USR1 `cat /var/run/nginx.pid`
                fi
        endscript
}
```

```nginx
user  nginx;
worker_processes  auto;

error_log  /usr/local/openresty/nginx/logs/error.log notice;
pid        /usr/local/openresty/nginx/logs/nginx.pid;
```

```logrotate
/usr/local/openresty/nginx/logs/*.log {
        daily
        missingok
        rotate 52
        compress
        delaycompress
        notifempty
        create 640 nginx adm
        sharedscripts
        postrotate
                if [ -f /usr/local/openresty/nginx/logs/nginx.pid ]; then
                        kill -USR1 `cat /usr/local/openresty/nginx/logs/nginx.pid`
                fi
        endscript
}
```