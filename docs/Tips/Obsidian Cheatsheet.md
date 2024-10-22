---
tags:
  - cheatsheet
  - obsidian
  - tips
---
関連: [[Obsidian]]
## Edit Properties

> - Use the **Add file property** [command](https://help.obsidian.md/Plugins/Command+palette).
> - Use the **`Cmd/Ctrl+;`** [hotkey](https://help.obsidian.md/User+interface/Hotkeys).
> https://help.obsidian.md/Editing+and+formatting/Properties#Hotkeys

## Twitter Card (X Card)

`twitter.com`ドメインにURLを変更することで動作する。`x.com`では動作しない。
いつまで`twitter.com`で動作するか、怪しい。

```
![](https://x.com/nitaking_/status/1800411639646429542)
```

> [!warning]
> >
> `Quartz @4.3.1`上では表示されないので注意。

- twitter.com
	![](https://twitter.com/nitaking_/status/1800411639646429542)
- x.com
	![](https://x.com/nitaking_/status/1800411639646429542)

## Set Folder Path

`File and links > Default location for new attachments`

See also: https://forum.obsidian.md/t/add-images-folder/3856

## Centering Image Technique

### 1) Using Markdown alt

> `![[image.png | center | 256]]` or
> 
> `![Photo | center | 256](image.png)`
> 
> The css to achieve that is as follows:
> 
> img[alt*="center"] {
>     display: block;
>     margin-left: auto;
>     margin-right: auto;
> }
> 
https://www.reddit.com/r/ObsidianMD/comments/v1fs0f/centering_images_in_reading_mode/