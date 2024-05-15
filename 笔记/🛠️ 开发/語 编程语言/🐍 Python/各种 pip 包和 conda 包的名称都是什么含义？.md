---
tags:
  - 开发/Python
  - 命令行/pip
  - 命令行/conda
  - 开发/AI/CUDA
---
# 各种 Python 的 pip 包和 conda 包的名称都是什么含义？

## TL;DR

- `cp38` - CPython 3.8
- `py3` - Python 3
- `cu12` - 适用于 CUDA 12
- `cpu_generic` - 适用于通用 CPU
- `manylinux1_x86_64` - [pypa/manylinux: Python wheels that work on any linux (almost)](https://github.com/pypa/manylinux)

通过 `pip` 和 `conda` 安装的时候我们会遇到这样的输出：

```shell
Collecting torch
  Downloading torch-2.2.1-cp38-cp38-manylinux1_x86_64.whl.metadata (25 kB)
Collecting nvidia-cuda-nvrtc-cu12==12.1.105 (from torch)
  Using cached nvidia_cuda_nvrtc_cu12-12.1.105-py3-none-manylinux1_x86_64.whl.metadata (1.5 kB)
# ...
manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (3.0 kB)
Downloading torch-2.2.1-cp38-cp38-manylinux1_x86_64.whl (755.5 MB)
   ━━━╺━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 65.6/755.5 MB 14.5 MB/s eta 0:00:48
ERROR: Operation cancelled by user
(mlcommons-training) jovyan@neko-python-test-0:~/Git/NVIDIA/apex$ pip install torch==1.12
Collecting torch==1.12
  Downloading torch-1.12.0-cp38-cp38-manylinux1_x86_64.whl.metadata (22 kB)
Collecting typing-extensions (from torch==1.12)
  Using cached typing_extensions-4.10.0-py3-none-any.whl.metadata (3.0 kB)
Downloading torch-1.12.0-cp38-cp38-manylinux1_x86_64.whl (776.3 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 776.3/776.3 MB 2.1 MB/s eta 0:00:00
Using cached typing_extensions-4.10.0-py3-none-any.whl (33 kB)
Installing collected packages: typing-extensions, torch
Successfully installed torch-1.12.0 typing-extensions-4.10.0
```

```shell
  python_abi         conda-forge/linux-64::python_abi-3.8-4_cp38
  pytorch            conda-forge/linux-64::pytorch-2.1.2-cpu_generic_py38h1a28abb_1
  pytorch-mutex      pytorch/noarch::pytorch-mutex-1.0-cpu
  torchaudio         pytorch/linux-64::torchaudio-2.1.2-py38_cpu
  torchvision        pytorch/linux-64::torchvision-0.16.2-py38_cpu
```

```shell
package                    |            build
    ---------------------------|-----------------
    pytorch-2.1.2              |cpu_generic_py38h1a28abb_1        25.2 MB  conda-forge
    pytorch-mutex-1.0          |              cpu           3 KB  pytorch
    torchaudio-2.1.2           |         py38_cpu         4.8 MB  pytorch
    torchvision-0.16.2         |         py38_cpu        11.2 MB  pytorch
    ------------------------------------------------------------
                                           Total:       206.2 MB
```

这些输出虽然各自有各自的标签习惯，但是整体的规律还是相似的。

写了 `cpu` 的就是 CPU 可以用的，架构也会一并包含在内。