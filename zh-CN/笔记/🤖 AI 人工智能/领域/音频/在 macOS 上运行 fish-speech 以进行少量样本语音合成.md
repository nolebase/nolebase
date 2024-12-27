---
tags:
  - AI
  - AI/大语言模型/LLM
  - AI/音频/文本转语音/TTS/语音合成/SpeechSynthesis
  - AI/音频/文本转语音模型/fish-speech
  - AI/企业/fish-audio
  - 操作系统/macOS
  - 命令行/终端
---
## 环境准备

如果没有 `mamba`，可以这样安装：

```shell
"${SHELL}" <(curl -L micro.mamba.pm/install.sh)
```

- [Micromamba Installation — documentation](https://mamba.readthedocs.io/en/latest/installation/micromamba-installation.html)
### 创建和安装 mamba/anaconda 环境和依赖

```shell
mamba create -n fish-speech python=3.10 -y
mamba activate fish-speech
mamba install cmake
```

或者 

```shell
micromamba create -n fish-speech python=3.10
micromamba activate fish-speech
micromamba install cmake
```

### 安装 pip 依赖

```shell
pip install torch torchvision torchaudio
pip install -e .
```

### 安装额外依赖

- macOS: `brew install sox`
- Linux: `apt install libsox-dev`

```shell
pip install huggingface_hub gradio
pip install openai-whisper fish-speech
```

## 创建启动脚本

```shell
#!/bin/bash

# Set UTF-8 encoding
export LC_ALL=en_US.UTF-8

USE_MIRROR=true
PYTHONPATH=$(dirname "$0")
PYTHON_CMD=$(which python)
API_FLAG_PATH=$(dirname "$0")/API_FLAGS.txt

HF_ENDPOINT="https://huggingface.co"
no_proxy=""

if [ "$USE_MIRROR" = true ]; then
    HF_ENDPOINT="https://hf-mirror.com"
    no_proxy="localhost, 127.0.0.1, 0.0.0.0"
fi

echo "HF_ENDPOINT: $HF_ENDPOINT"
echo "NO_PROXY: $no_proxy"
$PYTHON_CMD ./tools/download_models.py

API_FLAGS=""
flags=""

if [ -f "$API_FLAG_PATH" ]; then
    while IFS= read -r line; do
        if [ "${line:0:1}" != "#" ]; then
            line=$(echo "$line" | sed 's/ /<SPACE>/g' | sed 's/\\//g' | sed 's/<SPACE>/ /g')
            if [ -n "$line" ]; then
                API_FLAGS="$API_FLAGS$line "
            fi
        fi
    done < "$API_FLAG_PATH"
fi

if [ -n "$API_FLAGS" ]; then
    API_FLAGS=${API_FLAGS::-1}
fi

flags=""

if echo "$API_FLAGS" | grep -q -- "--api"; then
    echo
    echo "Start HTTP API..."
    mode="api"
    process_flags=true
elif echo "$API_FLAGS" | grep -q -- "--infer"; then
    echo
    echo "Start WebUI Inference..."
    mode="infer"
    process_flags=true
fi

if [ "$process_flags" = true ]; then
    for p in $API_FLAGS; do
        if [ "$p" != "--$mode" ]; then
            flags="$flags $p"
        fi
    done

    if [ -n "$flags" ]; then
        flags=${flags:1}
    fi

    echo "Debug: flags = $flags"

    if [ "$mode" = "api" ]; then
        $PYTHON_CMD -m tools.api $flags
    elif [ "$mode" = "infer" ]; then
        $PYTHON_CMD -m tools.webui $flags
    fi
fi

echo
echo "Next launch the page..."
$PYTHON_CMD fish_speech/webui/manage.py

```

## 启动管理 Web UI 界面

```shell
chmod +x ./start.sh
./start.sh
```