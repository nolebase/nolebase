---
tags:
  - AI
  - 开发/语言/Python
  - 开发/语言/Python/Anaconda
  - 操作系统/macOS
  - 命令行/brew
  - 开源/软件/zsh
  - AI/JinaAI
---
# 在 macOS 上使用 `brew` 安装配置 Anaconda

## 步骤

```shell
brew install anaconda
```

在 `.zshrc` 中添加下面的 `anaconda` 配置

```shell
# Python ---------------------------------------------------------------------------

# Anaconda
source $HOMEBREW_PREFIX/anaconda3/bin/activate
conda init

# ------------------------------------------------------------------------------------
```

然后执行

```shell
source ~/.zshrc
```

来重新加载 `zsh`

如果你有 [[Neko 配置使用的 zsh alias|`reload` `alias`]] 的配置，也可以直接通过

```shell
reload
```

来重新加载 `zsh`

## 验证安装

安装成功之后可以通过运行

```shell
conda list
```

来查看是否安装正常和配置成功，理论上它会输出：

```shell
❯ conda list
# packages in environment at /opt/homebrew/anaconda3:
#
# Name                    Version                   Build  Channel
_anaconda_depends         2023.09         py311_openblas_1
abseil-cpp                20211102.0           hc377ac9_0
aiobotocore               2.5.0           py311hca03da5_0
aiofiles                  22.1.0          py311hca03da5_0
aiohttp                   3.8.5           py311h80987f9_0
aioitertools              0.7.1              pyhd3eb1b0_0
aiosignal                 1.2.0              pyhd3eb1b0_0
aiosqlite                 0.18.0          py311hca03da5_0
alabaster                 0.7.12             pyhd3eb1b0_0
```

## 其他配置注意事项

安装 `jina` 相关的 CLI 工具之后 `.zshrc` 可能会出现下面这样的脚本配置：

```shell
# JINA_CLI_BEGIN

## autocomplete
if [[ ! -o interactive ]]; then
    return
fi

compctl -K _jina jina

_jina() {
  local words completions
  read -cA words

  if [ "${#words}" -eq 2 ]; then
    completions="$(jina commands)"
  else
    completions="$(jina completions ${words[2,-2]})"
  fi

  reply=(${(ps:
:)completions})
}

# session-wise fix
ulimit -n 4096
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

# JINA_CLI_END
```

不用担心，这是 `jina` CLI 给配置的，可以把这部分脚本移动到 `# Python -----` 括起来的部分方便阅读和管理