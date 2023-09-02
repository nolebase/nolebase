# `find` 查找

## 说明

find，查找的含义，这个命令用于查找文件和目录，使用方法很简单

### 语法

```shell
find <搜索目录> -name <搜索对象>
```

### 示例

我们要寻找一个叫做 `meow` 的文件，藏在 `tests` 文件夹下面

```shell
$ tree
.
├── hello
└── tests
    ├── meow
    └── test1

$ find ./ -name meow
./tests/meow
```

这样就能找到了，会返回相对位置

## 参数

### 最大层级 - 参数 maxdepth

有时候目录的层级会很复杂，我们不希望递归搜索太久，可以限制搜索的层级数，需要添加**参数 `maxdepth`**，max depth（最大深度）的含义。`maxdepth` 接受数字类型的值。

示例：

我们要寻找一个叫做 `meow2` 的文件，藏在 `test1` 文件夹下面

```shell
$ tree # 当前目录下的文件结构
.
├── hello
└── tests
    ├── meow
    └── test1
        └── meow2

$ find ./ -name meow2 -maxdepth 2

$ find ./ -maxdepth 2 -name meow
./tests/meow

$ find ./ -maxdepth 3 -name meow2
./tests/test1/meow2
```

如果限制了只能最多两层的话，找不到 meow2，但是能找到 meow，限制了最多三层的话就能找到 meow2 了

**⚠️ 注意**：这个地方 `maxdepth` 参数必须放在最前面，要不然会报错。原因是 `maxdepth` 会影响到后面参数的匹配结果

### 搜索类型 - 参数 type

有时候不想搜索到目录，有时候不想搜索到文件，我们可以限制搜索的类型，需要添加**参数 `type`**， type（类型）的含义。`type` 参数接受两种字符串类型的值，分别是 **f**（file 文件）和 **d**（directory 目录）。

1. 限制文件

```shell
$ tree # 当前目录下的文件结构
.
├── hello
└── tests
    ├── meow
    └── test1
        └── meow2

$ find ./ -name meow -type f
./tests/meow

$ find ./ -name meow -type d

```

限制为 `f` 的时候能搜索到 `meow` 文件，`d` 的时候就搜索不到了。

2. 限制目录

```shell
$ tree # 当前目录下的文件结构
.
├── hello
└── tests
    ├── meow
    └── test1
        └── meow2

$ find ./ -name test1 -type d
./tests/test1

$ $find ./ -name test1 -type f

```

限制为 `d` 的时候能搜索到 `test1` 目录，`f` 的时候就搜索不到了。
