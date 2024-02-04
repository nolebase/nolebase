---
tags:
  - AI
  - AI/PyTorch
  - 开发/Python/PyTorch
  - 开发/Python/PyTorchLightning
  - 开发/Python
---
# PyTorch Lightning 恢复训练进度

下面的代码基于这个镜像进行作业：

```
huggingface/transformers-pytorch-deepspeed-latest-gpu
```

在镜像中运行下面的命令安装 `lightning`：

```shell
pip install lightning
```

添加修改代码如下：

```python
import os
import glob

def find_latest_checkpoint():
    # 获取所有版本目录
    version_dirs = glob.glob('lightning_logs/version_*')
    # 按版本号排序
    version_dirs.sort(key=lambda x: int(x.split('_')[-1]))
    # 获取最新版本目录
    latest_version_dir = version_dirs[-1]
    # 获取该版本目录下的所有检查点文件
    ckpt_files = glob.glob(os.path.join(latest_version_dir, 'checkpoints', '*.ckpt'))
    # 按步骤号排序
    ckpt_files.sort(key=lambda x: int(x.split('=')[-1].split('.')[0]))
    # 获取最新的检查点文件
    latest_ckpt_file = ckpt_files[-1]

    return latest_ckpt_file

def main():
    # rest of the code...

    latest_ckpt_path = find_latest_checkpoint()

    if os.path.exists(latest_ckpt_path):
        logger.info(f'latest_ckpt_path detected, resuming from {latest_ckpt_path}')
        trainer.fit(model, mnist_data, ckpt_path=latest_ckpt_path)
    else:
        trainer.fit(model, mnist_data)

if __name__ == '__main__':
    main()
```

之后运行下面的命令就可以自动检测最新的检查点文件并恢复训练进度啦！

```shell
torchrun main.py
```

- [easyckpt的技术原理和使用方法_人工智能平台 PAI(PAI)-阿里云帮助中心](https://help.aliyun.com/zh/pai/user-guide/easyckpt?spm=a2c4g.11186623.0.0.18c02772MLDUbC)
- [easyckpt的技术原理和使用方法_人工智能平台 PAI(PAI)-阿里云帮助中心](https://help.aliyun.com/zh/pai/user-guide/easyckpt)
- [Pytorch模型resume training，加载模型基础上继续训练 - 知乎](https://zhuanlan.zhihu.com/p/159068033)
