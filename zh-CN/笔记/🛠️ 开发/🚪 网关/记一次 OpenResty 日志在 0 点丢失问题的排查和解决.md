---
tags:
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关/OpenResty
  - 开发/故障排查
---

# 记一次 OpenResty 日志在 0 点丢失问题的排查和解决

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Debian | 11/5.10.127-1/amd64 |  |
| OpenResty | openresty/1.21.4.1 | [OpenResty® - Official Site](https://openresty.org/en/) |

## 起因

最早发现这个问题的起因是我在查询网站统计的时候。

我查询时发现会有大段的时间没有数据可以展示和统计出来，也会发现其实数据不太真实，登录到 Kibana 对网站的网关数据进行进一步调查之后就能发现一些端倪。

![an-openresty-log-missing-on-everyday-0-issue-troubleshooting-and-fix-record-screenshot-01](assets/an-openresty-log-missing-on-everyday-0-issue-troubleshooting-and-fix-record-screenshot-01.png)

我发现似乎在 0 点之后数据流就会停止传输，无论是哪个请求 URI 都是如此。我为了修复这个问题多次重启过 OpenResty 的进程，每次重启之后都会恢复正常，但是到了 0 点之后又会 100% 断开。

我优先排查的 OpenResty，确认了 OpenResty 没有发生重载和重启，我也去排查了 Logstash 和 Filebeat 的运行日志，发现这两个进程都没有发生过重新启动，日志里也没有提到有出现错误，但是 Filebeat 的 stdout 日志中会大量提到「在过去 xx 时间段内没有任何日志」。

这十分奇怪，为什么会没有日志呢？

如果我们列出在 OpenResty 配置文件当中配置的日志文件路径 `/var/log/nginx` ，我们可以发现其实 `access.log` 是会有好几份结尾为 `.<数字>.gz` 复制的。另外一个很重要的信息是：我这里的 OpenResty 是从原先默认配置的 Nginx 中迁移过来的，且在 Debian 系统中安装 Nginx 的会自动配置默认的 Logrotate 策略，不幸的是，我迁移之后并没有单独为 OpenResty 进行过 Logrotate 策略的调整和重新配置，也许是这个策略导致的问题。

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

我们可以打开 `/etc/logrotate/conf.d/nginx` 看看，可以发现里面有一行 `postrotate` 配置，这行配置下面有一个 `if` 条件判断的语句伴随，其含义是：
如果 `/var/run/nginx.pid` 存在的话，那么使用 `kill -USR1 <Nginx 进程 ID>` 命令将 Nginx 杀掉并重新载入。我印象里我在迁移 OpenResty 的时候对 pid 路径进行过修改，有可能是因为没有读取到 `/var/run/nginx.pid`，且 Logrotate 依然把原先的文件切分到了新的文件里，导致原先 OpenResty 打开的日志文件的 file descriptor 无法再次进行写入了，但是也无法正常关闭，也许是这么个原因？

```txt
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

我到 OpenResty 的文件中对 PID 文件路径配置进行了检查，发现确实和 Logrotate 配置中的有区别，也大概和我上面猜想的情况一模一样。

```nginx
user  nginx;
worker_processes  auto;

error_log  /usr/local/openresty/nginx/logs/error.log notice;
pid        /usr/local/openresty/nginx/logs/nginx.pid;
```

我们再次打开 Logrotate 对 Nginx 日志的 rotate 策略进行编辑：

把原先的错误脚本

```shell
if [ -f /var/run/nginx.pid ]; then
		kill -USR1 `cat /var/run/nginx.pid`
fi
```

替换为使用正确 PID 路径的脚本

```shell
if [ -f /usr/local/openresty/nginx/logs/nginx.pid ]; then
	    kill -USR1 `cat /usr/local/openresty/nginx/logs/nginx.pid`
fi
```

得到下面的 Logrotate 文件：

```txt
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

再次重新启动整个 OpenResty，观察两天之后发现修复完成了。
