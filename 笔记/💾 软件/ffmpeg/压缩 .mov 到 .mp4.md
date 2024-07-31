---
tags:
  - 软件/macOS
  - 命令行/终端
  - 软件/ffmpeg
  - 软件/视频编辑
  - 软件/音频编辑
  - 软件/视频转码
  - 软件/音频转码
---
# 压缩 `.mov` 到 `.mp4`

```shell
ffmpeg -i {in-video}.mov -vcodec h264 -acodec aac {out-video}.mp4
```

![[Pasted image 20240731163214.png]]

## 参考资料

- [macos - convert .mov video to .mp4 with ffmpeg - Super User](https://superuser.com/questions/1155186/convert-mov-video-to-mp4-with-ffmpeg)