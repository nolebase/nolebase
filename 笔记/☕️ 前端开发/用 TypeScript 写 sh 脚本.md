---
tags:
  - 开发/语言/TypeScript
  - 命令行/sh
---
# 用 TypeScript 写 shell 脚本

想要直接执行 TypeScript 或者把它当作 shell 脚本时可以尝试以下方法

#### 首先在全局安装 `tsx`

```shell
npm i -g tsx
```

#### 然后你可以直接使用这个命令来执行 TypeScript 文件

```shell
tsx ./myScript.ts
```

#### 想要像 `.sh` 文件一样可以直接执行？

在文件头部添加这行注释吧：`#!/usr/bin/env tsx`
像这样：

```ts
#!/usr/bin/env tsx

console.log('hello world')
```

别忘了添加「执行」权限：

```shell
chmod +x ./myScript.ts
```

然后就可以像 `.sh` 文件一样直接使用了

```shell
> ./myScript.ts
hello world
```
