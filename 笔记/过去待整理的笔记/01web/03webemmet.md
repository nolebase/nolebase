---
title: Emmet 语法
---

### 1 Emmet 语法

Emmet语法的前身是Zen coding,它使用缩写,来提高html/css的编写速度, Vscode内部已经集成该语法.

1. 快速生成HTML结构语法
2. 快速生成CSS样式语法

### 1.1 快速生成HTML结构语法

1. 生成标签 直接输入标签名 按tab键即可 比如 div 然后tab 键， 就可以生成

   

2. 如果想要生成多个相同标签 加上 * 就可以了 比如 div*3 就可以快速生成3个div

3. 如果有父子级关系的标签，可以用 > 比如 ul > li就可以了

4. 如果有兄弟关系的标签，用 + 就可以了 比如 div+p

5. 如果生成带有类名或者id名字的， 直接写 .demo 或者 #two tab 键就可以了

6. 如果生成的div 类名是有顺序的， 可以用 自增符号 $

7. 如果想要在生成的标签内部写内容可以用 { } 表示

### 1.2 快速生成CSS样式语法

CSS 基本采取简写形式即可.

1. 比如 w200 按tab 可以 生成 width: 200px;
2. 比如 lh26px 按tab 可以生成 line-height: 26px;

### 1.3 快速格式化代码

Vscode 快速格式化代码: shift+alt+f

**也可以设置 当我们 保存页面的时候自动格式化代码:**

1)文件 ------.>【首选项】---------->【设置】; 2)搜索emmet.include;

3)在settings.json下的【工作区设置】中添加以下语句:

"editor.formatOnType": true,

"editor.formatOnSave": true