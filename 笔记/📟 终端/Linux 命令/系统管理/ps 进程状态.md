# `ps` 进程状态

## 说明

**p**rocess **s**tatus，进程状态的含义，使用这个命令可以显示当前进程的状态，类似于 windows 的任务管理器中「程序」列表。

### 语法

```shell
ps [参数] [--help]
```

### 示例

如果不加参数直接执行 ps，会得到当前会话中的进程信息

```shell
$ ps
    PID TTY          TIME CMD
  28615 pts/0    00:00:02 zsh # zsh 是我们的命令行 shell 程序
  35019 pts/0    00:00:00 ps # ps 是我们刚刚执行的这个命令的程序
```

ps 会有每一个单独的列字段去描述每一个列所代表的信息：

```shell
$ ps -aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.2 183848 11392 ?        Ss   10月03   0:06 /usr/lib/systemd/systemd --switched-root --system --deserialize 18
root           2  0.0  0.0      0     0 ?        S    10月03   0:00 [kthreadd]
root           3  0.0  0.0      0     0 ?        I<   10月03   0:00 [rcu_gp]
root           4  0.0  0.0      0     0 ?        I<   10月03   0:00 [rcu_par_gp]
root         650  0.0  0.1  50252  5400 ?        Ss   10月03   0:00 /usr/sbin/smartd -n -q never
polkitd      652  0.0  0.5 1630220 24048 ?       Ssl  10月03   0:01 /usr/lib/polkit-1/polkitd --no-debug
root         653  0.0  0.1 124896  4784 ?        Ssl  10月03   0:12 /usr/sbin/irqbalance --foreground
dbus         655  0.0  0.1  56400  5296 ?        Ss   10月03   0:03 /usr/bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
root         656  1.4  0.5 392512 20572 ?        Ssl  10月03 161:43 /usr/sbin/NetworkManager --no-daemon
root         657  0.0  0.3 219308 14080 ?        Ss   10月03   0:00 /usr/sbin/sssd -i --logger=files
libstor+     658  0.0  0.0  19740  2004 ?        Ss   10月03   0:01 /usr/bin/lsmd -d
root         665  0.0  0.1  69184  5616 ?        Ss   10月03   0:00 /usr/bin/qemu-ga --method=virtio-serial --path=/dev/virtio-ports/org.qemu.guest_agent.0 --blacklist=guest-file-open,guest-file-close,guest-file-read,guest-file-write,guest-file-seek,
chrony       671  0.0  0.0 128772  3512 ?        S    10月03   0:00 /usr/sbin/chronyd
rngd         674  0.0  0.1 233876  6756 ?        Ssl  10月03   0:11 /usr/sbin/rngd -f --fill-watermark=0
root         683  0.0  0.9 1174540 40004 ?       Ssl  10月03   2:48 /usr/local/bin/gateway-proxy
root         684  0.0  1.2 838016 50212 ?        Ssl  10月03   0:00 node /usr/bin/serve -s /opt/ayaka/sso-admin/dist -l 3100
root         687  0.0  0.1  92320  7560 ?        Ss   10月03   0:05 /usr/sbin/sshd -D -oCiphers=aes256-gcm@openssh.com,chacha20-poly1305@openssh.com,aes256-ctr,aes256-cbc,aes128-gcm@openssh.com,aes128-ctr,aes128-cbc -oMACs=hmac-sha2-256-etm@openssh.c
```

| USER 行程拥有者 | PID  进程 ID | %CPU CPU 占用率 | %MEM 内存占用率 | VSZ 虚拟内存占用大小 | RSS 物理内存占用大小 | TTY 终端的次要装置号码 | STAT 该进程状态 | START 开始时间 | TIME 运行时间 | COMMAND 执行的命令 |
| ---- | ---- | ---- | ---- | ---- | ------- | ---- | ---- | ----- | ---- | ------- |
| root | 1    | 0.0  | 0.2  | 183848 | 11392 | ?    | Ss    | 10月03 | 0:06 | /usr/lib/systemd/systemd --switched-root --system --deserialize 18|

其中 STAT（进程状态）字段还包含了以下的不同含义：

| 字段值      | 含义                                                      |
| ----------- | --------------------------------------------------------- |
| D           | 无法中断的休眠状态（通常是 IO 进程）                      |
| R           | 正在执行中                                                |
| S           | 静止状态                                                  |
| s           | 进程的领导者（在它之下有子进程）                          |
| T           | 暂停执行                                                  |
| Z           | 不存在但暂时无法消除                                      |
| W           | 没有足够的记忆体分页可分配                                |
| `<`           | 高优先序的行程                                            |
| N           | 低优先序的行程                                            |
| L           | 有内存分页分配并锁在内存内（实时系统）                    |
| l（小写 L） | 多线程，克隆线程（使用 CLONE_THREAD, 类似 NPTL pthreads） |
| +           | 正在背景运行的进程                                        |

## 参数

### 列出所有进程 - 参数 A

### 其他参数

| 参数             | 说明                                   |
| ---------------- | -------------------------------------- |
| **-e**           | 显示所有进程、环境变量                 |
| **-f**           | 全格式                                 |
| **-h**           | 不显示表头                             |
| **-l**（小写 L） | 长格式                                 |
| **-w**           | 宽输出                                 |
| **-a**           | 显示终端上所有进程，包括其他用户的进程 |
| **-r**           | 只显示正在运行的进程                   |
| **-x**           | 显示没有控制终端的进程                 |
| **-u**           | 以用户为主的格式来显示程序状态         |
| **-au**          | 显示较详细的咨询                       |
| **-aux**         | 显示所有包含其他使用者的进程           |
| **-C**           | 列出命令的状况                         |
| **--lines**      | 每页显示行数                           |
| **--width**      | 每页显示字符数                         |
