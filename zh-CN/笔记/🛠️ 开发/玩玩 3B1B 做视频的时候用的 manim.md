---
tags:
  - 开发/语言/Python
  - 视频创作者/3Brown1Blue
  - 视频创作者/3Brown1Blue/3B1B
  - 开发/语言/Python/manim
  - 操作系统/macOS
---
# 玩玩 3B1B 做视频的时候用的 `manim`

> Note, there are two versions of manim. This repository began as a personal project by the author of [3Blue1Brown](https://www.3blue1brown.com/) for the purpose of animating those videos, with video-specific code available [here](https://github.com/3b1b/videos). In 2020 a group of developers forked it into what is now the [community edition](https://github.com/ManimCommunity/manim/), with a goal of being more stable, better tested, quicker to respond to community contributions, and all around friendlier to get started with. See [this page](https://docs.manim.community/en/stable/faq/installation.html#different-versions) for more details.

正如 [3b1b/manim](https://github.com/3b1b/manim) 所说，`manim` 有两个版本，一个是 3Brown1Blue 最早做视频的时候作为个人项目用的 [3b1b/manim](https://github.com/3b1b/manim)，一个是后来 2020 年有一群好心的开发者 fork 了原先的 [3b1b/manim](https://github.com/3b1b/manim) 然后说希望做一个社区版本 [ManimCommunity/manim](https://github.com/ManimCommunity/manim/)，更新更快，社区支持更好。

考虑到开源社区的规模效应，接下来都会采用 [ManimCommunity/manim](https://github.com/ManimCommunity/manim/) 作为讲解，如果你需要用 3B1B 的 [3b1b/manim](https://github.com/3b1b/manim) 版本，请根据他们的文档来进行配置哦！

## 配置一下环境吧

跟随 [Installation - Manim Community v0.18.0](https://docs.manim.community/en/stable/installation.html#conda-installation) 文档来配置 macOS 的环境和依赖。

```shell
brew install py3cairo ffmpeg
```

我使用的是搭载了 Apple Silicon 芯片 M1 的 Macbook Pro，按照文档的说明，这里需要安装一些额外的依赖：

```shell
brew install pango pkg-config scipy
```

## 创建项目和依赖

Anaconda 真的有一点点反人类，既然我们是要做演示用的动画，还是应避免则避免使用 Anaconda 这么庞大和繁重的组件好了。

从这里开始，我使用 Poetry 来创建项目、管理虚拟环境，以及添加和管理依赖：

```shell
poetry new manim-test
```

```shell
❯ poetry new manim-test
Created package manim_test in manim-test
```

安装 `manim` 吧：

```shell
poetry add manim
```

如果你遇到了类似这样的错误：

```shell
❯ poetry add manim
Using version ^0.18.0 for manim

Updating dependencies
Resolving dependencies... (0.0s)

The current project's Python requirement (>=3.11,<4.0) is not compatible with some of the required packages Python requirement:
  - manim requires Python >=3.8,<3.13, so it will not be satisfied for Python >=3.13,<4.0

Because no versions of manim match >0.18.0,<0.19.0
 and manim (0.18.0) requires Python >=3.8,<3.13, manim is forbidden.
So, because manim-test depends on manim (^0.18.0), version solving failed.

  • Check your dependencies Python requirement: The Python requirement can be specified via the `python` or `markers` properties

    For manim, a possible solution would be to set the `python` property to ">=3.11,<3.13"

    https://python-poetry.org/docs/dependency-specification/#python-restricted-dependencies,
    https://python-poetry.org/docs/dependency-specification/#using-environment-markers
```

不用惊慌，我们按照下面的修改来更新一下 `pyproject.toml` 就好了：

```toml
[tool.poetry]
name = "manim-test"
version = "0.1.0"
description = ""
authors = ["Neko Ayaka <neko@ayaka.moe>"]
readme = "README.md"
packages = [{include = "manim_test"}]

[tool.poetry.dependencies]
python = "^3.11" # [!code --]
python = ">=3.11,<3.13" # [!code ++]

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## 编写第一个 Scene 文件

可以清理一下不要的空文件，变成下面这样：

```shell
❯ tree
.
├── README.md
├── poetry.lock
└── pyproject.toml
```

然后我们创建一个新的目录

```shell
project/
```

在里面创建一个 `scene.py` 文件：

```python
from manim import Scene, Circle, Create, PINK

class CreateCircle(Scene):
	def construct(self):
	circle = Circle()
	circle.set_fill(PINK, opacity=0.5)
	self.play(Create(circle))
```

这就是第一个 Scene 了。

接下来运行下面的命令就可以获得一个 MP4 文件：

```shell
poetry run manim -pql project/scene.py CreateCircle
```

对于这个命令，

- `poetry run` 代表了将会使用包管理器 `poetry` 并创建一个内联的 Python 环境来执行 Python
- `manim` 就是 `manim` 的 CLI 程序
- `-pql` 是 2 个命令行的合集，它们是：
	- `-p` 代表了 `--preview`，将会在渲染完成后预览
	- `-q` 代表了 `--quality`
	- 紧随其后的 `l` 代表了这是 `-q` 也就是 `--quality` 的一个选项，代表了低质量的渲染，将会输出到 480P 15 帧

就像是这样：

```shell
❯ poetry run manim -pql project/scene.py CreateCircle
Manim Community v0.18.0

[12/05/23 18:13:24] INFO     Animation 0 : Partial movie file written in                                                                                      scene_file_writer.py:527
                             '~/manim-test/media/videos/scene/480p15/partial_movie_files/CreateCircle/1185818338_1912650126_22313245
                             7.mp4'
                    INFO     Combining to Movie file.                                                                                                         scene_file_writer.py:617
                    INFO                                                                                                                                      scene_file_writer.py:735
                             File ready at '~/manim-test/media/videos/scene/480p15/CreateCircle.mp4' # [!code hl]

                    INFO     Rendered CreateCircle                                                                                                                        scene.py:241
                             Played 1 animations
                    INFO     Previewed File at: '~/manim-test/media/videos/scene/480p15/CreateCircle.mp4' # [!code hl]
```

这个视频会被放在

```shell
media/videos/scene/480p15/CreateCircle.mp4
```

目录下面，现在的目录结构也会发生变化：

```shell
❯ tree
.
├── README.md
├── media # [!code ++]
│   ├── images # [!code ++]
│   │   └── scene # [!code ++]
│   └── videos # [!code ++]
│       └── scene # [!code ++]
│           └── 480p15  # [!code ++]
│               ├── CreateCircle.mp4 # [!code ++]
│               └── partial_movie_files # [!code ++]
│                   └── CreateCircle # [!code ++]
│                       ├── 1185818338_1912650126_223132457.mp4 # [!code ++]
│                       └── partial_movie_file_list.txt # [!code ++]
├── poetry.lock
├── project
│   ├── __pycache__ # [!code ++]
│   │   └── scene.cpython-311.pyc # [!code ++]
│   └── scene.py
└── pyproject.toml
```

它看起来是这样的：

<video controls muted>
  <source src="./assets/have-a-play-on-the-animation-engine-that-3b1b-uses-video-1.mp4" type="video/mp4">
</video>

## 渲染更高级的

刚才我们渲染出来的结果只有 480P 15 帧，所以预览的时候才感觉如此卡顿，这是正常的，这不怪你，也不怪 `manim`，这是因为在上面的例子中，我们使用的是这样的命令：

```shell
poetry run manim -pql project/scene.py CreateCircle
```

对于这个命令，

而 `-pql` 是 2 个命令行的合集，它们是：

- `-p` 代表了 `--preview`，将会在渲染完成后预览
- `-q` 代表了 `--quality`
- 紧随其后的 `l` 代表了这是 `-q` 也就是 `--quality` 的一个选项，代表了低质量的渲染，将会输出到 480P 15 帧

所以根据文档的说明，当我们在直接执行

```shell
manim -pql
```

的时候，实际上会自动回退到 `manim render` 的子命令调用上，这个时候我们可以通过执行

```shell
poetry run manim render --help
```

来观察 `-q` 都有哪些选项可以使用：

```shell
❯ poetry run manim render --help
Manim Community v0.18.0

Usage: manim render [OPTIONS] FILE [SCENE_NAMES]...

  Render SCENE(S) from the input FILE.

  FILE is the file path of the script or a config file.

  SCENES is an optional list of scenes in the file.

Global options:
  # ...

Render Options:
  -n, --from_animation_number TEXT
                                 Start rendering from n_0 until n_1. If n_1 is
                                 left unspecified, renders all scenes after n_0.
  -a, --write_all                Render all scenes in the input file.
  --format [png|gif|mp4|webm|mov]
  -s, --save_last_frame
  -q, --quality [l|m|h|p|k]      Render quality at the follow resolution # [!code focus]
                                 framerates, respectively: 854x480 15FPS, # [!code focus]
                                 1280x720 30FPS, 1920x1080 60FPS, 2560x1440 # [!code focus]
                                 60FPS, 3840x2160 60FPS # [!code focus]
  -r, --resolution TEXT          Resolution in "W,H" for when 16:9 aspect ratio
                                 isn\'t possible.

  # ...

Ease of access options:
  --progress_bar [display|leave|none]
                                 Display progress bars and/or keep them
                                 displayed.
  -p, --preview                  Preview the Scene\'s animation. OpenGL does a # [!code focus]
                                 live preview in a popup window. Cairo opens the # [!code focus]
                                 rendered video file in the system default media # [!code focus]
                                 player. # [!code focus]
  -f, --show_in_file_browser     Show the output file in the file browser.
  --jupyter                      Using jupyter notebook magic.

Other options:
  --help                         Show this message and exit.

Made with <3 by Manim Community developers.
```

可以看到 `-q` 或者 `--quality` 有 5 个选项 `l`，`m`，`h`，`p`，`k`，分别是

|     | 分辨率      | 帧率 |
| --- | ----------- | ---- |
| `l` | 854 x 480   | 15   |
| `m` | 1280 x 720  | 30   |
| `h` | 1920 x 1080 | 60   |
| `p` | 2560 x 1440 | 60   |
| `k` | 3840 x 2160 | 60   |

这个时候如果需要 4K 60 帧的渲染的话，就可以直接用

```shell
poetry run manim -pqk project/scene.py CreateCircle
```

来进行渲染，就像这样：

```shell
❯ poetry run manim -pqk project/scene.py CreateCircle
Manim Community v0.18.0

[12/05/23 18:54:04] INFO     Animation 0 : Partial movie file written in                                                                                      scene_file_writer.py:527
                             '~/manim-test/media/videos/scene/2160p60/partial_movie_files/CreateCircle/1457378895_1912650126_2231324
                             57.mp4'
                    INFO     Combining to Movie file.                                                                                                         scene_file_writer.py:617
                    INFO                                                                                                                                      scene_file_writer.py:735
                             File ready at '~/manim-test/media/videos/scene/2160p60/CreateCircle.mp4' # [!code hl]

                    INFO     Rendered CreateCircle                                                                                                                        scene.py:241
                             Played 1 animations
                    INFO     Previewed File at: '~/manim-test/media/videos/scene/2160p60/CreateCircle.mp4' # [!code hl]
```

，这个时候目录就会变成这样：

```shell
❯ tree
.
├── README.md
├── media
│   ├── images
│   │   └── scene
│   └── videos
│       └── scene
│           ├── 2160p60 # [!code ++]
│           │   ├── CreateCircle.mp4 # [!code ++]
│           │   └── partial_movie_files # [!code ++]
│           │       └── CreateCircle # [!code ++]
│           │           ├── 1457378895_1912650126_223132457.mp4 # [!code ++]
│           │           └── partial_movie_file_list.txt # [!code ++]
│           └── 480p15
│               ├── CreateCircle.mp4
│               └── partial_movie_files
│                   └── CreateCircle
│                       ├── 1185818338_1912650126_223132457.mp4
│                       └── partial_movie_file_list.txt
├── poetry.lock
├── project
│   ├── __pycache__
│   │   └── scene.cpython-311.pyc
│   └── scene.py
└── pyproject.toml
```

<video controls muted>
  <source src="./assets/have-a-play-on-the-animation-engine-that-3b1b-uses-video-2.mp4" type="video/mp4">
</video>

锵锵，这样就可以了！清晰且丝滑。
