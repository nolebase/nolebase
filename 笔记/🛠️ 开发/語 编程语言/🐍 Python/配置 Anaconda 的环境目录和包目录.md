---
tags:
  - 开发/语言/Python/Anaconda
  - 开发/语言/Python
---
# 配置 Anaconda 的环境目录和包目录

可以使用

```shell
conda info
```

来查看 `anaconda` 现在配置的用户存储环境和包的目录。

默认情况下，执行 `conda info` 将会有类似下面的输出：

```shell
$ conda info

     active environment : base
    active env location : /opt/conda
            shell level : 1
       user config file : /home/neko/.condarc
 populated config files : /opt/conda/.condarc
          conda version : 4.10.1
    conda-build version : not installed
         python version : 3.8.10.final.0
       virtual packages : __cuda=12.2=0
                          __linux=6.2.0=0
                          __glibc=2.31=0
                          __unix=0=0
                          __archspec=1=x86_64
       base environment : /opt/conda  (writable)
      conda av data dir : /opt/conda/etc/conda
  conda av metadata url : https://repo.anaconda.com/pkgs/main
           channel URLs : https://conda.anaconda.org/conda-forge/linux-64
                          https://conda.anaconda.org/conda-forge/noarch
          package cache : /opt/conda/pkgs # [!code hl]
                          /home/neko/.conda/pkgs # [!code hl]
       envs directories : /opt/conda/envs # [!code hl]
                          /home/neko/.conda/envs # [!code hl]
               platform : linux-64
             user-agent : conda/4.10.1 requests/2.28.2 CPython/3.8.10 Linux/6.2.0-35-generic ubuntu/20.04.5 glibc/2.31
                UID:GID : 0:0
             netrc file : None
           offline mode : False
```

但是如果是在类似于 Docker 或者容器化的 Notebook 环境，甚至是正在打包的 Docker 镜像中的话，默认的 `$HOME/pkgs` 和 `$HOME/envs`（也就是上图的 `/home/neko/pkgs` 和 `/home/neko/envs`），以及 `/opt/conda` 目录中的数据不一定会被持久化，这个时候我们需要通过

```shell
conda config --prepend pkgs_dirs <目录>
conda config --prepend envs_dirs <目录>
```

来配置 `anaconda` 的环境目录和包目录：

创建需要配置的目录

```shell
mkdir -p .conda/pkgs
mkdir -p .conda/envs
```

执行配置设定

```shell
conda config --prepend pkgs_dirs $(pwd)/.conda/pkgs
conda config --prepend envs_dirs $(pwd)/.conda/envs
```

然后我们可以通过再次执行 `conda info` 命令来查看是否配置成功

```shell
$ conda info

     active environment : base
    active env location : /opt/conda
            shell level : 1
       user config file : /home/neko/.condarc
 populated config files : /opt/conda/.condarc
                          /home/neko/.condarc
          conda version : 4.10.1
    conda-build version : not installed
         python version : 3.8.10.final.0
       virtual packages : __cuda=12.2=0
                          __linux=6.2.0=0
                          __glibc=2.31=0
                          __unix=0=0
                          __archspec=1=x86_64
       base environment : /opt/conda  (writable)
      conda av data dir : /opt/conda/etc/conda
  conda av metadata url : https://repo.anaconda.com/pkgs/main
           channel URLs : https://conda.anaconda.org/conda-forge/linux-64
                          https://conda.anaconda.org/conda-forge/noarch
          package cache : /mnt/data/disk1/notebooks/demo-1/.conda/pkgs # [!code hl]
       envs directories : /mnt/data/disk1/notebooks/demo-1/.conda/envs # [!code hl]
                          /opt/conda/envs
                          /home/neko/.conda/envs
               platform : linux-64
             user-agent : conda/4.10.1 requests/2.28.2 CPython/3.8.10 Linux/6.2.0-35-generic ubuntu/20.04.5 glibc/2.31
                UID:GID : 0:0
             netrc file : None
           offline mode : False
```
