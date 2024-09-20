---
share: "true"
---

# 1 Makefile概述

> ......

# 2 Makefile介绍

你需要一个`makefile`去告诉`make`怎么做。大多数情况下，`makefile`告诉`make`如何去编译和链接程序。

## Makefile的语法规则

来看看最简单的语法形式：

```assembly
target ... : prerequisites ...
	recipe
	...
	...
```

+ `target`：目标是由程序生成的文件，常见的如`.o`文件。另外一个例子就是生成的可执行文件。同时目标还可以是一项动作的承载，比如：`clean`。
+ `prerequeisites`：是生成目标的输入文件。一个目标可以有多个依赖。
+ `recipe`：它是`make`的执行载体，一个`recipe`可能有多条命令在同一行或者在单独行。==请注意：你需要再每行`recipe`前放置一个`tab`。==如果你想在你的`recipe`前使用自己的前缀，而非`tab`。那么你可以使用`.RECIPEPREFIX`变量来替换。

带有`依赖`的规则中的`recipe`通常服务产生一个目标文件。然而，定义了`recipe`的规则通常不一定有`依赖`。比如`clean`。

**规则**用来解释*怎样*和*何时*生成一个确切的目标文件。`make`在`依赖`上执行`recipe`去产生或者更新目标。一条规则通常还可以解释为怎样和何时去执行一条动作。

一个`makefile`可以包含其他的文档规则，但是一个简单的`makefile`仅仅包含规则。

## 一个简单的`makefile`

```makefile
edit : main.o kbd.o command.o display.o \
       insert.o search.o files.o utils.o
        cc -o edit main.o kbd.o command.o display.o \
                   insert.o search.o files.o utils.o

main.o : main.c defs.h
        cc -c main.c
kbd.o : kbd.c defs.h command.h
        cc -c kbd.c
command.o : command.c defs.h command.h
        cc -c command.c
display.o : display.c defs.h buffer.h
        cc -c display.c
insert.o : insert.c defs.h buffer.h
        cc -c insert.c
search.o : search.c defs.h buffer.h
        cc -c search.c
files.o : files.c defs.h buffer.h command.h
        cc -c files.c
utils.o : utils.c defs.h
        cc -c utils.c
clean :
        rm edit main.o kbd.o command.o display.o \
           insert.o search.o files.o utils.o
```

这里的可执行目标是`edit`，它依赖8个`object`文件，并且每个都依赖于它的C源文件和3个头文件。

所有的C文件都包含`def.h`文件，但是仅仅只有编辑命令包含`command.h`，且一些修改编辑buffer的低级文件包含`buffer.h`。

我们可以使用如下命令：

```shell
# 生成可执行目标edit
make

# 清除工程
make clean
```

当我们的目标是一个文件时，任何依赖的改动都会导致目标的重编译和重链接。另外依赖会自动更新，比如在这里，`edit`依赖`main.o`，如果`main.c`修改了，这样就会导致`main.o`重新生成，同时`edit`也会重新生成。

**注：**`make`并不知道`recipe`如何工作的，这完全取决于你自己提供的`recpie`。`make`仅仅帮助你简化且自动构建目标。

`clean`它并不是一个**文件**，而是一个动作的名称。它不会产生任何动作，也不是其他规则的依赖。因此，除非你告诉它如何做，否则它什么也不干。它既不是依赖，也不需要任何依赖，所以它的唯一目的就是执行一个`recipe`。如果一个目标没有任何对应的文件，仅仅指示一个动作叫做**伪目标(phony target)**。

## make处理Makefile的过程

默认情况下，`make`会执行第一条目标。这叫做默认目标。

在上面的例程中，第一条是`edit`，所以你可以使用命令：

```shell
make
```

`make`读取**当前目录**的`Makefile`文件，并处理它的第一条规则。`edit`依赖于`.o`文件，但是`.o`文件又依赖于他自己的目标，所以，会先处理`.c与.h`文件，使其生成`.o`文件。

## Makefile中的变量

在上面的例程中，我们会重复写两次`obj`文件：

```makefile
edit : main.o kbd.o command.o display.o \
              insert.o search.o files.o utils.o
        cc -o edit main.o kbd.o command.o display.o \
                   insert.o search.o files.o utils.o
```

这样的两次编写会让我们容易出错。我们为了减少这的错误，使用变量来避免该问题。

下面是一个标准的`Makefile`的声明变量：`OBJ,obj,objects,OBJ,objs,OBJS`是一个`object`文件的列表。它可以像这样写：

```makefile
objects = main.o kbd.o command.o display.o \
          insert.o search.o files.o utils.o
```

然后，我们可以在每一个想要放置这样的列表的地方使用：`$(objects)`去替代。

然后，我们改进一下上面的`makefile`:

```makefile
objects = main.o kbd.o command.o display.o \
          insert.o search.o files.o utils.o

edit : $(objects)
        cc -o edit $(objects)
main.o : main.c defs.h
        cc -c main.c
kbd.o : kbd.c defs.h command.h
        cc -c kbd.c
command.o : command.c defs.h command.h
        cc -c command.c
display.o : display.c defs.h buffer.h
        cc -c display.c
insert.o : insert.c defs.h buffer.h
        cc -c insert.c
search.o : search.c defs.h buffer.h
        cc -c search.c
files.o : files.c defs.h buffer.h command.h
        cc -c files.c
utils.o : utils.c defs.h
        cc -c utils.c
clean :
        rm edit $(objects)
```



## 让make的recipe精简

我们没有必要为每一条C源文件写一条`recpie`，因为`make`能够自己计算出他们：==**隐式规则**会从`.c`文件更新为`.o`文件，使用`cc -c`命令。==

比如，它会使用`cc -c main.c -o main.o`去编译`main.c`为`main.o`。

再来修改一下上面的例程：

```makefile
objects = main.o kbd.o command.o display.o \
          insert.o search.o files.o utils.o

edit : $(objects)
        cc -o edit $(objects)

main.o : defs.h
kbd.o : defs.h command.h
command.o : defs.h command.h
display.o : defs.h buffer.h
insert.o : defs.h buffer.h
search.o : defs.h buffer.h
files.o : defs.h buffer.h command.h
utils.o : defs.h

.PHONY : clean
clean :
        rm edit $(objects)
```

上面的如`main.o`，它会默认的将`main.c`加入到依赖中，而上面没有写出来而已。

## Makefile的其他风格

如果一个`makefile`仅仅只使用隐式规则构建，这样的风格也是可以的：

```makefile
objects = main.o kbd.o command.o display.o \
          insert.o search.o files.o utils.o

edit : $(objects)
        cc -o edit $(objects)

$(objects) : defs.h
kbd.o command.o files.o : command.h
display.o insert.o search.o files.o : buffer.h
```

在这里我们将入口分组，通过依赖的方式取代了他的目标方式。也就是，相同的依赖归为一个规则。

## 清理(clean)规则

编译程序不是你唯一想编写规则的事。我们可以通过`Makefile`做些其他的事情：比如清空编译目录，使得整个文件夹干净清爽。

==方然，因为`clean`目标并不真实的存在文件，如果目录下有名为`clean`文件，这样会使得`make`不执行`recipe`，所以我们需要做一些小小改动==：

```makefile
.PHONY : clean
clean :
        -rm edit $(objects)
```

# 3 编写一个Makefile

## Makefile的组成

它由**5部分**组成：

+ 显示规则(*explicit rules*)：它表示了怎样和何时重构一个或多个文件。
+ 隐式规则( *implicit rules*): 和显示规则一样的作用。
+ 变量定义：它是一串字符串的定义，能够被后面的文本使用。
+ 命令：指示`make`命令在读取`Makefile`时做些特殊动作
  + 读取其他的`Makefile`
  + 决定是否丢弃或者保留部分`Makefile`
  + 定义多行变量
+ 注释：`#`是Makefile中的注释用法，但是请注意，记得在行首写`#`才能正常被视为注释。

```makefile
#这是注释
	# 这不是注释
```

在Makefile中，想多行续写和C语言类似：

```makefile
var=one$\
	word
```

## 使用自定义名称的Makefile

我们可以通过如下命令使用自己的Makefile名称：

```shell
make -f make.myMakfile
make -f Makefile.file

make --file=Makefile.my
```

如果不使用`-f或者--file`，则默认自动寻找当前目录下的`Makefile`文件。

## 包含其他的Makefile

通过`include`命令，我们可以暂时挂起读取当前的`makfile`，转而先读取其他的makefile：

```makefile
include filenames...
```

上面的`filenames`可以包含`shell`文件的名字形式，若文件为空，则什么都不会做，也不会打印错误。

包含的文件运行有空白和在开头有空行，但是注意一定不要有`tab`(或者`.RECIPEPREFIX`定义的符号)。包含多个文件，使用空格隔开：

```makefile
include foo *.mk $(bar)
```

可以等同于：

```makefile
include foo a.mk b.mk c.mk bish bash
```

当在处理`include`时，它会暂时停止读取当前包含的`makefile`，转而按顺序读取`include`中的列表，读取完成后才会继续读取当前的`makefile`。

使用该命令的场景有：

1. 如果有多个`makefile`处理各自的事务，但是需要使用一个公共的变量。
2. ....

如果要包含的`makfile`不再当前目录下，我们则需要使用`-I`或者`--include-dir`来进行搜索。

如果你想简单的忽略不存在或者无法执行的makefile，让其不产生错误信息，可以使用如下的命令来包含：

```makefile
-include filenams...
```

改命令也可使用`sinclude`替换。

## MAKEFILE环境变量

> 具体查看文档

## makefile是如何去重编译的

有时候，makefile能够被其他的激活重编译，比如：`RCS,SCCS`文件。

在读取所有的makefile之后，make会考虑每一个规则的处理顺序，并且尝试去更新它。如果开启了并行编译，则会并行编译。

如果有一个makefile有一个如何去更新目标规则或者隐式规则作用它，有必要的话，会更新该makefile。在所有的makefile被检查完毕，如果有有任何确实被修改了，make将会开始一个干净的记录且再次读取所有的makefile。每一次的重启都会导致特殊变量`MAKE_RESTARTS`的更新。

如果你知道你的一个或多个 makefile 不能被重制， 并且你想阻止 make 对它们执行隐式规则搜索， 也许是出于效率的考虑， 你可以使用任何防止隐式规则查找的正常方法来做到这一点。 例 如 ， 您可以编写一条以 makefile 为目标的显式规则， 并编写一个空`recpie`。

如果 makefile 指定了双冒号规则来重编译一个有`recipe`但没有先决条件的文件，那么该文件将始终被重编译。在 `makefile `的情况下，如果一个 makefile 有双冒号规则，并且有 recipe 但没有先决条件，那么在每次运行 make时都会被重编译，然后在 make 重新启动并再次读入 makefile 后又会被重编译。这会导致无限循环： make 会不断重编译 makefile 并重新启动，而不会做任何其他事情。因此，为了避免出现这种情况， make 不会尝试重编译那些被指定为双冒号规则目标的 makefile，这些规则有一个 recipe ，但没有先决条件。

伪目标具有相同的效果：它们永远不会被认为是最新的，因此被标记为伪目标的包含文件会导致 make 不断重启。为了避免这种情况， make 不会尝试重制被标记为伪的 makefile。

您可以利用这一点来优化启动时间：如果您知道您不需要重编译 Makefile，您可以通过添加以下任一选项来阻止 make 重编译：

```makefile
.PHONY: Makefile
#或者
Makefile:: ;
```

如果没有使用`"-f "`或`"--file "`选项指定要读取的 makefile， make 将尝试使用默认的 makefile 名称。 与使用`"-f "`或`"- -file "`选项明确请求的 makefile 不同， make 无法确定这些 makefile 应该存在。不过，如果默认的 makefile 不存在，但可以通过运行 make 规则来创建，那么您可能希望运行这些规则，以便使用该 makefile。

因此，如果默认的 makefile 都不存在， make 会尝试编译每一个 makefile，直到成功编译一个，或者没有可尝试的文件名为止。请注意，如果 make 无法找到或制作任何 makefile，这并不是错误； makefile 并不总是必须的。  

当您使用`"-t "`或`"--touch "`选项时 ，您不会希望使用过时的 makefile 来决定触及哪些目标。因此，` "-t "`选项对更新makefile没有影响；即使指定了`"-t"`，它们也会被更新。同样，` "-q"`（或`"--question"`）和`"-n"` （或`"--just-print"`）也不会阻止更新 makefile，因为过时的 makefile 会导致其他目标的错误输出。因此， `"make -f mfile -n foo "`将更新`mfile`，并将其读入，然后打印更新 `foo` 及其先决条件的 recipe ，而无需运行它。为 `foo` 打印的 recipe 将是mfile更新内容中指定的 recipe 。

上面的`-t,--touch`效果就是：它只会更新你的目标的时间戳，不会真的运行make过程。来看看以下例子：

```makefile
my_program:
	@echo "do something"

other:
	@echo "do otrher things"
```

我们通过命令：

```shell
make -t my_program
# 或者
make -t other
```

如果没有`other`这个文件，它会创建一个`otrher`，如果有，它会将它使用类似`touch命令`更新到最新时间。`my_program`也是一样。

而`-n`命令，也类似上面一样，不执行make过程，但make过程产生的打印都会打印出来。

## 重写其他Makefile的部分内容

有时，一个 makefile 与另一个 makefile 大同小异，这也是很有用的。你通常可以使用`"include "`指令将一个包含在另一个中，并添加更多目标或变量定义。不过，两个makefile 为同一个目标提供不同的 recipe 是会发生冲突。我们可以用下面的方法解决。

在包含 makefile 的 Makefile 中（希望包含另一个 makefile 的 Makefile），您可以使用 `match-anything` 模式规则来说明，要重编译任何无法根据包含 makefile 中的信息编译的目标， make 应在另一个 makefile 中查找。

例如，如果您有一个名为 `Makefile` 的 makefile，其中说明了如何制作目标文件`"foo"`（以及其他目标文件），那么您可以编写一个名为 `GNUmakefile` 的 makefile，其中包含：

```makefile
foo:
        frobnicate > foo

%: force
        @$(MAKE) -f Makefile $@
force: ;
```

如果你说`"make foo"`， make 会找到 `GNUmakefile` 并读取它，然后发现要制作`foo` ， 需 要 运 行 `recipe "frobnicate > foo"` 。 如 果 你 说` "make bar" `， make在`GNUmakefile`中找不到制作 bar 的方法，因此它将使用模式规则中的 `recipe ： "make -f Makefile bar'`。如果 Makefile 提供了更新 bar 的规则， make 就会应用该规则。同样，对于` GNUmakefile `未说明如何制作的任何其他目标，也是如此。  

其工作原理是，模式规则的模式仅为`"%"`，因此可以匹配任 何 目标文件。该规则指定了一个先决条件` force`，以保证即使目标文件已经存在， recipe 也能 运行。我们给强制目标一个空 recipe ，以防止 make 搜索隐含规则来构建它，否则它会应用相同的匹配规则来强制自己，并创建一个先决条件循环！

## make如何读取Makefile

`GNU make` 的工作分为两个不同的阶段。

+ ==在第一阶段==，它会读取所有的 makefile、包含的 makefile 等，并将所有变量及其值、隐式和显式规则内部化，同时建立所有目标及其先决条件的依赖关系图。
+ ==在第二阶段==， make 会使用这些内部化数据来确定哪些目标需要更新，并运行必要的 recipe 来更新它们。

理解这种两阶段方法非常重要，因为它直接影响到变量和函数的扩展方式；在编写makefile 时，这往往会引起一些困惑。下面总结了 makefile 中的不同结构体，以及结构体各部分的扩展阶段。

如果扩展发生在第一阶段，我们称之为**即时扩展**： make 会在解析 makefile 时扩展结构体的这一部分。如果扩展不是即时的，我们就说它是延迟的。延迟的构造部分的扩展会延迟到使用时才进行：要么是在即时上下文中被引用时，要么是在第二阶段需要时。您可能还不熟悉其中的某些结构。在以后的章 节 中，当你熟悉这些结构时 ， 可以参考本书的后面章节

### 变量分配

变量的定义可以如下：

```makefile
immediate = deferred
immediate ?= deferred
immediate := immediate
immediate ::= immediate
immediate :::= immediate-with-escape
immediate += deferred or immediate
immediate != immediate

define immediate
  deferred
endef

define immediate =
  deferred
endef

define immediate ?=
  deferred
endef

define immediate :=
  immediate
endef

define immediate ::=
  immediate
endef

define immediate :::=
  immediate-with-escape
endef

define immediate +=
  deferred or immediate
endef

define immediate !=
  immediate
endef
```

对于追加运算符`'+='`，如果变量先前被设置为简单变量（`':='`或`'::='`），则右侧被认为是立即的，否则是延迟的。

对于 "`立即-带转义`"运算符`":::="`，右侧的值会立即展开，然后转义（也就是说，展开结果中的所有实例都会被替换为 \$$）。

对于 `shell` 赋值运算符`"！ ="`，右边的值会立即被赋值并交给` shell`。结果存储在左侧命名的变量中，该变量被视为递归扩展变量（因此每次引用时都要重新赋值）。

### 条件指令

条件指令会被立即解析。例如，这意味着自动变量不能在条件指令中使用，因为在调用该规则的 recipe 之前，自动变量不会被设置。如果需要在条件指令中使用自变量， 必须将条件移到 recipe 中，并使用 shell 条件语法

### 规则定义

无论形式如何，规则总是以相同的方式展开：  

```makefile
immediate : immediate ; deferred
        deferred
```

也就是说，目标和先决条件部分会立即展开，而用于构建目标的` recipe `总是被延迟。这适用于`显式规则、模式规则、后缀规则、静态模式规则`和`简单的前提条件定义  `

## Makefile怎样被解析

GNU make 对 makefile 进行逐行解析。解析工作按以下步骤进行： 

1. 读入一个完整的逻辑行，包括反斜线换行（见第 3.1.1 节 [分割长行]，第 12 页）。
2.  删除注释（参见第 3.1 节 [Makefile 包含的内容]，第 11 页）。
3.  如果该行以 recipe 前缀字符开头，且我们处于规则上下文中，则将该行添加到当前 recipe 中并读取下一行（参见第 5.1 节 [ recipe 语法]，第 45 页）。
4.  扩充立即扩充上下文中出现的行元素（参见第 3.7 节 [make 如何读取 Makefile]，第 17 页）。
5.  扫描该行是否有分隔符，如": "或"="，以确定该行是 宏赋值还是规则（参见第45 页，第 5.1 节 [ recipe 语法]）。
6.  内化操作结果并读取下一行。

这样做会产生一个重要的特性：如果一条规则只 有 一行长，则宏可以扩展为整条规则  。它会如下工作：

```makefile
myrule = target : ; echo built

$(myrule)
```

但是，这样做是行不通的，因为 make 在展开行之后不会重新拆分行：  

```makefile
define myrule
target:
        echo built
endef

$(myrule)
```

上 述 makefile 的 结 果 是 定 义 了 一 个 目 标` "target"`， 其 依赖 为` "echo "`和`"build"`，就好像 `makefile` 包含了目标：`echo built`，而不是一个带有 `recipe` 的规则。扩充完成后，行中仍然存在的换行符，但将作为正常空白被忽略。

为了正确扩展多行宏，必须使用`eval`函数：这将导致 make 解析器在扩展宏的结果上运行（参见第 8.10 节 [Eval 函数]，第 103 页）。  

## 二次展开

> 该节内容复杂，不适合基础学习，暂时跳过

# 4 编写规则

规则出现在 `makefile` 中，说明何时以及如何重制某些文件，这些文件被称为规则的目标文件（通常每条规则只有一个目标文件）。它列出了作为目标的先决条件的其他文件，以及用于创建或更新目标的` recipe `。

规则的顺序并不重要，除了确定默认目标：如果你没有另行指定目标，` make `要考虑的 目标。默认目标是第一个` makefile `中第一条规则的第一个目标。有两个例外：以句号开头的目标不是默认目标，除非它也包含一个或多个斜线`"/"`；定义模式规则的目标对默认目标没有影响。 (参见第 129 页，第 10.5 节 [定义和重新定义模式规则]）。

因此，我们在编写` makefile `时，通常会将第一条规则作为编译整个程序或`makefile`所描述的所有程序的规则（通常使用名为` "all "`的目标）。参见第 9.2 节 [指定目标的参数]，第 109 页。

## 规则示例

```makefile
foo.o : foo.c defs.h       # module for twiddling the frobs
        cc -c -g foo.c
```

上面的目标(`target`)是：`foo.o`。

而依赖是(`prerequisites`)：foo.c defs.h

他有一行命令形式的`recipe`：`cc -c -g foo.c`，`recipe`起始标志位一个`tab`

## 规则语法

```makefile
targets : prerequisites
        recipe
        …
#或者
targets : prerequisites ; recipe
        recipe
        …
```

目标是文件名，以空格分隔。可以使用通配符（见第 4.3 节 [在文件名中使用通配符 ]， 第 25 页 ），`a(m) `形 式 的 名 称 代 表 存 档 文 件` a `中 的 成 员`m`（ 见第11.1节[存档成员作为目标]，第 139 页）。通常情况下，每条规则只有一个目标，但有时也有理由有更多目标（见第 4.9 节 [一条规则中的多个目标]，第 37 页）。

`recipe`以一个`tab`开始一行的，第一行 recipe 可能出现在先决条件后的一行，并带有制表符，也可能出现在同一行，并带有分号。无论哪种方式，效果都是一样的。 

由于美元符号用于开始变量引用，因此如果确实希望在目标或前提条件中使用`$`符号，则必须写两个美元符号，即`"$$"`。如果你想二次扩展(可以看二次扩展章节)，则必须写四个美元符号（`'$$$$'`） 。

您可以通过在换行符后插入反斜线来分割长行， 但这并不是必需的， 因为 make 对makefile 中的行长没有限制。  

规则告诉我们两件事： 目标何时过时， 以及必要时如何更新。  

过时的标准由`依赖`指定， `依赖`由用空格分隔的文件名组成。 (这里也允许使用通配符和存档成员）。如果目标文件不存在或比任何`依赖`都旧，则该目标文件为过时文件（通过比较最后修改时间）。这样做的目的是，目标文件的内容是根据先决条件中的信息计算出来的，因此如果任何先决条件发生变化，现有目标文件的内容就不一定有效了。如何更新由 recipe 指定。这是由 shell（通常为 `"sh"`）执行的一行或多行，但有一些额外的功能（参见第 5 章 [在规则中编写 recipe ]，第 45 页）。

## 依赖的类型

GNU make 可以理解==两种==不同类型的依赖：**普通依赖**和**顺序依赖（order-only prerequisites）**。

**普通依赖**有两种说法：首先，它规定了调用 recipe 的顺序：在启动目标的 recipe 之前，目标的所有依赖的 recipe 都要完成。其次，它规定了一种依赖关系：如果任何依赖比目标新，那么目标就会被视为过时，必须重建。

通常情况下，这正是您想要的：如果目标的依赖被更新，那么目标也应该被更新。

有时，您可能想确保依赖先于目标构建，但又不想在依赖更新时强制更新目标。**顺序依赖**就是用来创建这种关系的。通过在依赖列表中放置管道符号` (|) `可以指定只服从命令的依赖：管道符号左边的任何依赖都是正常的；右边的任何依赖都是只服从命令的：

```makefile
targets : normal-prerequisites | order-only-prerequisites
```

当然，正常依赖部分可以是空的。此外，您仍然可以为同一目标声明多行依赖：它们会被适当地添加（普通依赖会被附加到普通依赖列表中；顺序依赖会被追加到顺序依赖列表中）。请注意，如果您将同一个文件同时声明为*普通依赖*和*顺序依赖*，则普通依赖优先（因为它们具有严格的顺序依赖行为的超集）。  

在确定目标是否过时时，不会检查顺序依赖；即使顺序依赖被标记为伪目标（请参阅第 4.5 节 [伪目标]，第 31 页），也不会导致目标被重建。  

举个例子，目标文件要放在一个单独的目录中，而该目录在运行 make 之前可能并不存在。在这种情况下，您希望在将任何目标文件放入目录之前创建该目录，但由于每当文件添加、删除或重命名时，目录上的时间戳都会发生变化，因此我们当然不希望每当目录的时间戳发生变化时就重建所有目标文件。处理这种情况的一种方法是使用顺序依赖：将目录作为所有目标的顺序依赖：

```makefile
OBJDIR := objdir
OBJS := $(addprefix $(OBJDIR)/,foo.o bar.o baz.o)

$(OBJDIR)/%.o : %.c
        $(COMPILE.c) $(OUTPUT_OPTION) $<

all: $(OBJS)

$(OBJS): | $(OBJDIR)

$(OBJDIR):
        mkdir $(OBJDIR)
```

现在，如果需要，创建 objdir 目录的规则将在构建任何`".o "`之前运行，但不会构建任何`".o"`，因为` objdir `目录的时间戳发生了变化。  

**注意：**这里`order-only`依赖实际上翻译为`顺序依赖`并不准确，但大意是，管道后面的依赖(也是目标)，只会检查是否存在，但不会去根据它的更新时间来进行重编译。也就是说，该依赖只要是存在就不会触发重编译，即便是修改了改依赖文件的内容。

## 在文件名中使用通配符  

一个文件名可以使用通配符指定多个文件。 make 中的通配符是` "*"`、` "? "`和`"[...]" `，与`Bourne shell `中的通配符相同。例如， `*.c `指定的是工作目录中所有名称以`".c "`结尾的文件列表。

如果一个表达式匹配多个文件，则会对结果进行排序。 但是，多个表达式不会进行全局排序。例如，` *.c *.h`将列出名称以`".c "`结尾的所有文件，并进行排序，然后列出名称以`".h "`结尾的所有文件，并进行排序。

文件名开头的字符`"~"`也有特殊意义。如果是单独出现，或者后面有**斜线**，则代表你的主目录。例如 `~/bin `扩展为`/home/you/bin`。如果`'~'`后面跟了一个单词，那么该字符串就表示以该单词命名的用户的主目录。例如` ~john/bin `会展开为` /home/john/bin`。在没有为每个用户设置主目录的系统中（如`MS-DOS`或 `MS-Windows`），可以使用以下命令可以通过设置环境变量`HOME`来模拟这一功能。在目标和依赖中， make 会自动执行通配符扩展。在 recipe 中，由 shell 负责通配符扩展。在其他情况下，只有在使用通配符函数明确要求时，才会进行通配符扩展。

通配符的特殊意义可以通过在其前面使用反斜杠来关闭。因此， `foo/*bar` 指的是名称由` "foo"`、星号和 `"bar "`组成的特定文件。

### 通配符示例

通配符可以在规则的 recipe 中使用，由 shell 进行扩展。例如，这里有一条删除所有对象文件的规则：

```makefile
clean:
        rm -f *.o
```

通配符在规则的依赖中也很有用。 在 makefile 中加入以下规则后， "`make  print`"将打印自上次打印以来所有已更改的`".c "`文件：  

```makefile
print: *.c
        lpr -p $?
        touch print
```

上面的规则使用的是`print`作为一个空的目标(后面章节会提到)，这里的`$?`仅仅会表示上面的被最近修改过的依赖。

在定义变量时，通配符扩展不会发生。因此，如果您这样写：

```makefile
objects = *.o
```

那么变量 objects 的值就是实际字符串 `"*.o"`。但是，如果在目标或依赖中使用对象的值，通配符扩展将在目标或依赖中进行。如果在 recipe 中使用对象值，`shell`可能会在 recipe 运行时执行通配符扩展。要将对象设置为扩展，请使用  :

```makefile
objects := $(wildcard *.o)
```

上面是使用的函数来进行扩展的。



### 使用通配符的陷阱

下面是一个使用通配符扩展的拙劣例子，它并不能实现你的意图。假设你想说可执行文件`foo`是由目录中的所有对象文件组成的，你可以这样:

```makefile
objects = *.o

foo : $(objects)
        cc -o foo $(CFLAGS) $(objects)
```

`objects`的值是实际字符串` "*.o"`。通配符扩展发生在` foo `的规则中，因此每个现有的`'.o'`文件都会成为` foo `的依赖，并在必要时重新编译。

但如果删除所有`".o "`文件呢？当通配符没有匹配到任何文件时，它就会保持原样，这样 foo 就会依赖于名字奇怪的文件` *.o`。由于不可能存在这样的文件， `make `就会给你一个错误，说它不知道如何制作` *.o`，这并不是您所想要的！

实际上，使用通配符扩展可以获得所需的结果，但需要更复杂的技术，包括通配符函数和字符串替换。这些将在下一节中介绍。

微软操作系统（MS-DOS 和 MS-Windows）使用反斜线来分隔路径名中的目录，就像这样：

```shell
c:\foo\bar\baz.c
```

这相当于 Unix 风格的` c:/foo/bar/baz.c`（`c: `部分是所谓的盘符）。当 make 在这些系统上运行时，它支持路径名中的反斜线以及 Unix 风格的正斜线。不过，这种支持不包括通配符扩展，其中反斜线是一个引号字符。因此，在这些情况下必须使用Unix 风格的斜线。

### `wildcard`函数

通配符扩展在规则中会自动发生。 <u>但通配符扩展通常不会在变量被设置时或函数参数内部发生</u>。 如果要在这些地方进行通配符扩展， 需要使用通配符函数， 如下所示：

```makefile
$(wildcard pattern…)
```

该字符串在 makefile 中的任何位置使用时，都会被空格分隔的、与给定文件名模式之一相匹配的现有文件名列表所替换。如果没有与某个模式匹配的现有文件名，那么通配符函数的输出将省略该模式。请注意，这与未匹配通配符在规则中的表现不同，通配符在规则中是逐字使用而不是忽略（参见第 4.3.2 节 [通配符陷阱]，第 26 页）。

与规则中的通配符扩展一样，通配符函数的结果也会排序。同样，每个单独的表达式都是单独排序的，因此`"$(wildcard *.c *.h) "`将扩展到所有匹配`".c "`的文件并排序，然后是所有匹配`".h "`的文件并排序。

通配符函数的一种用法是获取一个目录中所有 C 源文件的列表，就像下面这样：  

```makefile
$(wildcard *.c)
```

我们可以将结果中的后缀`" .c "`替换为`".o"`，从而将 C 源文件列表转换为对象文件列表，就像这样：

```makefile
$(patsubst %.c,%.o,$(wildcard *.c))
```

(这里我们使用了另一个函数 patsubst。参见第 92 页，第 8.2 节 [字符串替换和分析函数]）。  

因此，编译目录中所有 C 语言源文件并将它们链接在一起的 makefile 可以这样写：

```makefile
objects := $(patsubst %.c,%.o,$(wildcard *.c))

foo : $(objects)
        cc -o foo $(objects)
```

(这利用了编译 C 程序的隐式规则--`foo.o`文件没有产生但是其会自动推导编译，因此无需编写编译文件的显式规则。有关`":="`的解释，请参见第 66 页第 6.2 节 [变量的两种类型]，它是`"="`的一种变体。）  

## 搜索依赖目录

对于大型系统，通常需要将源代码与二进制文件放在不同的目录下。 make 的目录搜索功能可以自动搜索多个目录来查找依赖，从而为这种做法提供了便利。当你在目录间重新分配文件时，你不需要改变单个规则，只需要改变搜索路径。

### VPATH： 搜索所有依赖的路径  

make 变量` VPATH `的值指定了` make `应搜索的目录列表。通常，这些目录会包含不在当前目录中的依赖文件；不过， `make`会将` VPATH `用作依赖和规则目标的搜索列表。

因此，如果当前目录中不存在被列为目标或依赖的文件， `make` 就会搜索`VPATH`中列出的目录，查找同名文件。如果在其中一个目录中找到文件，该文件就可能成为依赖（见下文）。规则可以指定依赖列表中的文件名，就好像它们都存在于当前目录中一样。参见第 30 页，第 4.4.4 节 [使用目录搜索编写 recipe ]。

在` VPATH `变量中，目录名用冒号或空格分隔。目录列出的顺序与 make 在搜索时遵循的顺序一致。 (在 MS-DOS 和 MS-Windows 中，分号被用作` VPATH `中目录名的分隔符，因为冒号可以用在路径名本身的驱动器字母之后）。

例如：

```makefile
VPATH = src:../headers
```

指定的路径包含两个目录，即 `src` 和` ../headers`，并按此顺序进行搜索。  

有了这个` VPATH `值，就有了下面的规则，

```makefile
foo.o : foo.c
```

上面的解释就像这样写的一样：  

```makefile
foo.o : src/foo.c
```

假设当前目录中不存在文件` foo.c`，但在目录  `src`中。

### vpath 指令  

与` VPATH `变量类似，但选择性更强的是` vpath `指令（**注意小写**），它允许你为特定类别的文件名指定搜索路径：那些与特定模式匹配的文件名。因此，你可以为一类文件名提供特定的搜索目录，而为其他文件名提供其他目录（或不提供）。

`vpath` 指令有三种形式：

+ **`vpath`模式目录(`vpath pattern directories`)**：指定与模式匹配的文件名的搜索路径目录。搜索路径（`directories`）是要搜索的目录列表，用冒号（MS-DOS 和 MSWindows 系统中为分号）或空格分隔，就像 `VPATH` 变量中使用的搜索路径一样。
+ **`vpath`模式 (`vpath pattern`)**：清除与模式相关的搜索路径。  
+ **`vpath `**：清除之前用 vpath 指令指定的所有搜索路径。

**`vpath` 模式**是一个包含`"%"`字符的字符串。该字符串必须与正在搜索的依赖的文件名相匹配， `"%"`字符与零个或多个字符的任意序列相匹配（与模式规则相同；参见第 10.5 节 [定义和重新定义模式规则]，第 129 页）。例 如 ， `%.h `会匹配以`.h `结尾的文件（如果没有`"%"`，则模式必须与依赖完全匹配，但这并不常用）。  

`vpath`指令模式中的`'%'`字符可以用前面的反斜线（`'\'`）加引号。否则会引出`'%'`字符的反斜线可以用更多的反斜线引出。在与文件名比较之前，会从模式中删除引用`"%"`字符或其他反斜线的反斜线。不会引出`"%"`字符的反斜线则不受影响 。  

当前目录中不存在依赖时，如果` vpath `指令中的模式与依赖文件的名称相匹配， 那么该指令中的目录就会像 `VPATH` 变量中的目录一样（并先于` VPATH `变量中的目录） 被搜索。

例如：

```makefile
vpath %.h ../headers
```

告诉 make 在` ./headers` 目录中查找名称以` .h `结尾的依赖，如果在当前目录下找不到该文件。

如果有多个` vpath` 模式与前提文件的名称相匹配，那么 make 会逐一处理每个匹配的 `vpath` 指令，搜索每个指令中提到的所有目录。 make 会按照多个 `vpath `指令在` makefile `中**出现的顺序**来处理它们；具有相同模式的多个指令是**相互独立**的。  因此：

```makefile
vpath %.c foo
vpath %   blish
vpath %.c bar
```

会在先在` foo`，接着是 `blish`，最后` bar `中查找以`".c "`结尾的文件，而  

```makefile
vpath %.c foo:bar
vpath %   blish
```

会在先在` foo`，接着是 `bar`，最后` blish `中查找以`".c "`结尾的文件。  

### 如何进行目录搜索  

当通过目录搜索找到依赖时，无论其类型如何（通用或专用），找到的路径名可能都不是依赖列表中实际提供的路径名。有时，通过目录搜索找到的路径会被丢弃。

决定是否保留或放弃通过目录搜索找到的路径的算法如下：

1. 如果在 makefile 中指定的路径下不存在目标文件，则会执行目录搜索。
2. 如果目录搜索成功，则保留该路径，并将该文件暂存为目标文件。
3.  该目标的所有依赖都使用相同的方法进行检查。
4.  处理依赖后，==可能需要也可能不需要==重建目标：
   1. 如果目标不需要重建，那么在目录搜索过程中找到的文件路径将用于包含该目标的任何依赖列表。简而言之，如果 make 不需要重建目标，则使用通过目录搜索找到的路径。  
   2. 如果目标文件确实需要重建（已经过时），在目录搜索过程中找到的路径名将被丢弃，目标文件将使用`makefile`中指定的文件名重建。简而言之，如果通过目录搜索找到的路径。make 必须重建，那么目标将在本地重建，而不是在通过目录搜索找到的目录中重建。

这种算法看似复杂， 但在实践中往往正中下怀。

其他版本的 make 使用一种更简单的算法： 如果文件不存在， 并且是通过目录搜索找到的， 那么无论是否需要构建目标文件， 都会使用该路径名。 因此， 如果要重建目标文件， 就会在目录搜索时发现的路径名下创建。

如果你希望部分或全部目录都是这样，可以使用 GPATH 变量向 make 表明这一点。

`GPATH`的语法和格式与` VPATH `相同（即以空格或冒号分隔的路径名列表）。如果通过目录搜索在` GPATH `中也出现的目录中发现了过时的目标文件，则不会丢弃该路径名。目标将使用扩展路径重建。

### 使用目录搜索编写`Recipes`

当通过目录搜索在另一个目录中找到依赖时，这并不能改变规则的 recipe ；它们将按所写的执行。因此，必须谨慎编写 recipe ，使其在 make 找到的目录中查找依赖。

这可以通过`"$^"`等自动变量来实现（参见第 10.5.3 节 [自动变量]，第 130 页）。例如，` "$^"`的值是规则的所有依赖列表，包括找到这些依赖的目录名称，而`"$@"`的值则是目标。因此

```makefile
foo.o : foo.c
        cc -c $(CFLAGS) $^ -o $@
```

(变量` CFLAGS `的存在是为了通过隐式规则为 C 语言编译指定标志；我们在这里使用它是为了保持一致性，以便它对所有 C 语言编译产生一致的影响；参见第 125 页，第10.3 节 [隐式规则使用的变量]）。

通常情况下，依赖还包括头文件，而这些头文件你并不想在 recipe 中提及。自动变量`"$<"`只是第一个依赖：  

```makefile
VPATH = src:../headers
foo.o : foo.c defs.h hack.h
        cc -c $(CFLAGS) $< -o $@
```

### 目录搜索和隐式规则  

通过`VPATH`或 `vpath` 指定的目录进行搜索也是在考虑隐式规则时进行的（参见第 10章 [使用隐式规则]，第 121 页）。

例如，当文件` foo.o `没有显式规则时， `make` 会考虑隐式规则，如内置规则，即如果存在` foo.c `文件，则编译该文件。如果当前目录中没有该文件，就会搜索相应的目录。如果任何目录中存在` foo.c`（ 或在` makefile `中被提及），就会应用 C 语言编译的隐含规则。

隐式规则的 recipe 通常会使用自动变量，这也是必要的；因此它们会使用通过目录搜索找到的文件名，而不需要额外的工作

### 链接库目录搜索 

目录搜索以一种特殊的方式适用于链接器使用的库。在编写名称为`"-lname "`的依赖时，这一特殊功能就会发挥作用。 (你可以看出这里发生了一些奇怪的事情，因为依赖通常是一个文件的名称，而库的文件名通常看起来像` libname.a`，而不是`"-lname"`）。   

当依赖的名称为`"-lname "`时， make 会通过搜索` libname.so `文件对其进行特殊处理，如果未找到，则搜索当前目录下的` libname.a `文件 和 `VPATH` 搜索路径所指定的目录中，然后是 `/lib`、 `/usr/lib` 和 `prefix/lib` 目录（通常为` /usr/local/lib`，但 `MS DOS/MS Windows` 版本的 make 会将 `prefix` 定义为`DJGPP` 安装树的根目录）。

例 如 ，如果系统中有一个` /usr/lib/libcurses.a`库（而没有`/usr/lib/libcurses.so `文件），则

```makefile
foo : foo.c -lcurses
        cc $^ -o $@
```

将导致执行 `"cc foo.c /usr/lib/libcurses.a -o foo "`命令，当`foo `早于` foo.c `或早于` /usr/lib/libcurses.a`。  

虽然默认搜索文件集是` libname.so`和` libname.a`， 但可通过`.LIBPATTERNS`变量进行自定义。该变量值中的每个单词都是一个模式字符串。当看到`"-lname "`这样的依赖时，make 将用` name `替换列表中每个模式中的百分号，并使用每个库文件名执行上述目录搜索。

`.LIBPATTERNS `的默认值是 `"lib%.so lib%.a"`，它提供了上述默认行为。通过将此变量设置为空值，可以完全关闭链接库扩展。

## 伪目标

伪目标文件并不是真正的文件名，而只是当你提出明确请求时要执行的指令的 名称。使用伪目标有两个原因：==一是为了避免与同名文件发生冲突，二是为了提高性能。==

如果您编写的规则的 recipe 不会创建目标文件，那么每次重制目标文件时，该recipe 都会被执行。下面是一个例子：

```makefile
clean:
        rm *.o temp
```

因为 rm 命令不会创建名为` clean `的文件，所以可能永远也不会有这样的文件存在。因此，每次说` "make clean "`时， `rm` 命令都会被执行。  

在本例中，如果在该目录中创建了名为` clean `的文件， clean 目标将无法正常运行。因为它没有依赖，` clean `会一直被认为是最新的，其 recipe 也不会被执行。为避免这一问题，您可以明确声明目标为伪目标，将其作为特殊目标` .PHONY `的依赖（请参阅第 4.8 节 [特殊内置目标名称]，第 34 页），如下所示 ：

```makefile
.PHONY: clean
clean:
        rm *.o temp
```

完成后，无论是否存在名为` clean `的文件， `"make clean "`都会运行 recipe 。  要始终重建模式规则，可以考虑使用 "`force target`"（见第 4.6 节 [无 recipe 或依赖的规则]，第 33 页）。

伪目标在递归调用 make 时也很有用（参见第 5.7 节 [make 的递归使用]，第 56 页）。在这种情况下， makefile 通常会包含一个变量，列出若干要编译的子目录。处理这种情况的一种简单方法是定义一条规则，其中包含一个循环遍历子目录的recipe，就像下面这样：

```makefile
SUBDIRS = foo bar baz

subdirs:
        for dir in $(SUBDIRS); do \
          $(MAKE) -C $$dir; \
        done
```

不过，这种方法也有问题。首先，在子 make 中检测到的任何错误都会被该规则忽略，因此即使有一个子` make `出错，它也会继续编译其余的目录。要解决这个问题，可以添加` shell `命令来记录错误并退出，但这样一来，即使在调用` make `时使用了` -k`选项，它也会这样做，这就很不幸了。其次，也许更重要的是，你无法充分利用` make`并行编译目标的能力（参见第 5.4 节 [并行执行]，第 51 页），因为只有一条规则。每个` makefile `的目标都会被并行编译，但一次只能编译一个子目录。

通过将子目录声明为 `.PHONY` 目标（您必须这样做，因为子目录显然始终存在，否则将无法构建），可以消除这些问题:

```makefile
SUBDIRS = foo bar baz

.PHONY: subdirs $(SUBDIRS)

subdirs: $(SUBDIRS)

$(SUBDIRS):
        $(MAKE) -C $@

foo: baz
```

这里我们还声明，在` baz `子目录完成之前， `foo `子目录不能被构建；这种关系声明在尝试并行构建时尤为重要。

对于` .PHONY `目标，将跳过隐式规则搜索（请参阅第 10 章 [隐式规则]，第 121 页）。这就是为什么将目标声明为` .PHONY `有利于提高性能，即使您并不担心实际文件是否存在。

伪目标文件不应是真实目标文件的依赖；如果是，则每次 make 考虑该文件时，都会运行其 recipe 。只要伪目标不是真实目标的依赖，那么只有当伪目标是指定目标时，才会执行伪目标 recipe （参见第 9.2 节 [指定目标的参数]，第 109页）。

不应将包含的` makefile `声明为伪目标。伪目标文件并不代表真实文件，而且由于目标文件总是被认为是过时的， make 总是会重建它， 然后重新执行自身（参见第 3.5 节[`Makefile`如何重制]， 第 15 页） 。 为了避免这种情况， 如果被标记为伪目标的包含文件被重新构建， make不会重新执行自身。

伪目标可以有依赖。当一个目录包含多个程序时，最方便的做法是在一个makefile `./Makefile `中描述所有程序。由于默认情况下重制的目标将是`makefile`中的第一个，因此通常会将其命名为` "all"`，并将所有程序作为依赖。例如：

```makefile
all : prog1 prog2 prog3
.PHONY : all

prog1 : prog1.o utils.o
        cc -o prog1 prog1.o utils.o

prog2 : prog2.o
        cc -o prog2 prog2.o

prog3 : prog3.o sort.o utils.o
        cc -o prog3 prog3.o sort.o utils.o
```

现在，你可以只说` "make "`来重制所有三个程序，或者指定要重制的程序作为参数（如` "make prog1 prog3"`）。虚假性不会继承：除非明确声明，否则伪目标的依赖本身并不是虚假的。

当一个伪目标是另一个伪目标的依赖时，它就是另一个伪目标的子程序。例如，这里的` "make cleanall "`将删除对象文件、差异文件和文件程序：

```makefile
.PHONY: cleanall cleanobj cleandiff

cleanall : cleanobj cleandiff
        rm program

cleanobj :
        rm *.o

cleandiff :
        rm *.diff
```

## 无 recipe 或依赖的规则  

如果一条规则没有依赖或 recipe ，而规则的目标是一个不存在的文件，那么每当运行其规则时， make 都会假定该目标已被更新。这意味着依赖于该目标的所有目标都将始终运行其 recipe 。

一个例子可以说明这一点：

```makefile
clean: FORCE
        rm $(objects)
FORCE:
```

在这里，目标 `"FORCE "`满足了特殊条件，因此依赖于它的目标`clean`会被强制运行其recipe 。` FORCE`这个名称并没有什么特别之处，但它是常用的名称之一。  

正如您所看到的，这样使用` "FORCE "`和使用`".PHONY: clean "`的结果是一样的。使用`".PHONY "`更明确、更高效。不过，其他版本的 make 并不支持`".PHONY"`，因此 `"FORCE "`会出现在许多` makefile `中。参见第 4.5 节 [伪目标]，第 31 页。

## 记录事件的空目标文件  

空目标文件是伪目标文件的一种变体，用于保存您不时明确要求的操作 recipe。与伪目标不同，该目标文件可以真实存在，但文件内容并不重要，通常是空的。

空目标文件的目的是通过最后修改时间记录规则 recipe 的最后执行时间。这样做是因为 recipe 中的一条命令是更新目标文件的触摸命令。

空目标文件应该有一些依赖（否则没有意义）。当您要求重制空目标文件时，如果有任何依赖比目标文件更新近；换句话说，如果依赖自上次重制目标文件后发生了更改，则会执行 recipe 。下面是一个例子：

```makefile
print: foo.c bar.c
        lpr -p $?
        touch print
```

在此规则下，如果源文件在上次` "make print "`后发生了更改， `"make print "`将执行` lpr `命令。自动变量`"$? "`只用于打印已更改的文件（参见第 130 页，第 10.5.3 节 [自动变量]）。  

## 特殊的内置目标名

+ `.PHONY `：

> 具体的查看文档

## 多目标规则

当一条显式规则有多个目标时，可以有两种处理方式：作为**独立目标**或作为**分组目标**。处理方式由目标列表后的分隔符决定。  

### 具有独立目标的规则  

使用标准目标分隔符 : 的规则定义独立的目标。这等同于为每个目标编写一次相同的规则，并重复依赖和 recipe 。通常，recipe 会使用`"$@"`等自动变量来指定要构建的目标。  

具有独立目标的规则在两种情况下非常有用：

+ 你想要的只是依赖，而不是 recipe 。例如

```makefile
kbd.o command.o files.o: command.h
```

为上述三个对象文件分别提供了一个额外的依赖。它等同于书写：  

```makefile
kbd.o: command.h
command.o: command.h
files.o: command.h
```

+ 类似的 recipe 适用于所有目标。可以使用自动变量`"$@"`将要重制的特定目标替换到命令中（参见第 10.5.3 节 [自动变量]，第 130 页）。例如：

```makefile
bigoutput littleoutput : text.g
        generate text.g -$(subst output,,$@) > $@
```

相当于：

```makefile
bigoutput : text.g
        generate text.g -big > bigoutput
littleoutput : text.g
        generate text.g -little > littleoutput
```

在这里，我们假设假设程序` generate `有两种输出，一种是`"-big"`，另一种是`"- little"`。关于` subst `函数的解释，请参见第 92 页第 8.2 节 [字符串替换和分析函数]。

假设您想根据目标改变依赖，就像变量`"$@"`允许您改变 recipe 一样。在普通规则中无法对多个目标进行更改，但在静态模式规则中可以做到。请参见第 40 页第4.11节 [静态模式规则]。

### 目标分组规则  

如果您的`recipe`不是独立目标，而是通过一次调用生成多个文件，您可以通过声明规则使用分组目标来表达这种关系。分组目标规则使用分隔符 `&:`（此处的`"&"`表示` "all"`）。

当 `make` 构建任何一个分组目标时，它知道该组中的所有其他目标也会因调用`recipe `而更新。此外， 如果只有部分分组目标已过期或丢失，`make`会意识到运行`recipe` 将更新所有目标。最后，如果任何一个分组目标已过期，则所有分组目标都会被视为已过期。

下面有一个定义分组目标的例子：

```makefile
.PHONY: all

all: foo bar biz

foo bar biz &: dependency
        @echo running $@
        touch foo bar biz


.PHONY: clean
clean:
        rm foo bar biz
```

在执行分组目标的`recipe`期间，自动变量`"$@"`会被设置为触发规则的组中特定目标的名称。在分组目标规则的`recipe`中使用该变量时必须谨慎。

与独立目标不同，分组目标规则必须包含`recipe`。不过，作为分组目标成员的目标也可能出现在没有`recipe`的独立目标规则定义中。

每个目标只能有一个与之相关的`recipe`。如果一个分组目标出现在一个独立的目标规则中，或出现在另一个分组目标规则的`recipe`中，您将收到警告，后一个 `recipe`将取代前一个`recipe `。此外，该目标将从前组移除，只出现在新组中 。

如果希望一个目标出现在多个组中，则必须在声明包含该目标的所有组时使用双冒号分组目标分隔符` &::`。双冒号分组目标各自独立考虑，如果多个目标中至少有一个需要更新，则每个双冒号分组规则的`recipe`最多执行一次。

这里与普通多目标区别在于：==普通多目标在执行过程中会执行`3`次recipe，而分组多目标只会执行一次recipe。==我们来看看结果对比：

```makefile
# 上面的Makefile执如下：
make clean
touch dependency
make

# 结果如下：
running foo
touch foo bar biz

# 第二次执行如下：
make: Nothing to be done for 'all'.
```

上面可以看到recipe仅仅执行了一次，且`$@`表示的是第一个`target`。但是在第二次执行，因为所有的目标都存在，则不再执行。我们尝试把改为下面代码：

```makefile
.PHONY: all

all: foo bar biz

# touch 时减少一个目标
foo bar biz &: dependency
        @echo running $@
        touch foo bar


.PHONY: clean
clean:
        rm foo bar biz
```

执行如下命令：

```makefile
# 上面的Makefile执行下面的命令
make clean
touch dependency
make

# 第一次结果
running foo
touch foo bar 

# 第二次 直接执行make
running biz
touch foo bar 

# 第三次 直接执行make
running biz
touch foo bar 
```

可以看到，分组多目标会检测是否所有目标都存在，只要一个目标不存在，就会执行一次。如果两个目标或者三个目标不存在，都会只执行一次。

我们也可以试着将`&:`改为`:`，这样就是一个普通分组，文件如下：

```makefile
.PHONY: all

all: foo bar biz

foo bar biz : dependency
        @echo running $@
        touch $@


.PHONY: clean
clean:
        rm foo bar biz
```

可以自己尝试一下结果如何，对比上面分组多目标的结果来理解该知识点。

==注意：`make`版本需要`>= 4.3`，如：使用的是`4.2`，并没有该效果，它会变成普通的多目标==

## 单目标对应多规则  

一个文件可以是多个规则的目标文件。所有规则中提到的依赖都会合并为目标的一个依赖列表。如果目标文件早于任何规则中的依赖，则会执行 recipe 。

一个文件只能执行一个 recipe 。如果有多条规则为同一文件提供了执行方法， make会使用最后一条规则，并打印错误信息。 (作为特例，如果文件名以点开头，则不会打印错误信息。这种奇怪的行为只是为了与` make `的其他实现兼容。你应该避免使用它）。有时，让同一目标调用在` makefile `不同部分定义的多个 recipe 是很有用的；为此，您可以使用**双冒号规则**（参见第 4.12 节 [双冒号]，第 42 页）。

仅有依赖的额外规则可用于同时为许多文件提供一些额外的依赖。例如，`makefile `通常有一个变量（如` objects`），其中包含系统中所有编译器输出文件的列表。下面的示例就是一个多规则：

```makefile
.PHONY: all

all: foo bar biz

foo bar biz &: dependency
        @echo running $@
        touch $@

foo : dependency
        @echo running $@-2
        echo 2 > $@

.PHONY: clean
clean:
        rm foo bar biz
```

结果是：

```shell
#键入如下命令
make clean
touch dependency
make

#执行结果
Makefile:10: warning: overriding recipe for target 'foo'
Makefile:6: warning: ignoring old recipe for target 'foo'
running foo-2
echo 2 > foo
```

如果希望间歇性地添加额外的依赖，可以使用这种方便的形式。  

另一个问题是，额外的依赖可以用变量来指定，而变量可以用 make 的命令行参数来设置（参见第 9.5 节 [覆盖变量]，第 113 页）。例如  

```makefile
extradeps=
$(objects) : $(extradeps)
```

意味着` "make extradeps=foo.h "`命令会将` foo.h `作为每个对象文件的依赖，而普通的 `"make"`命令则不会。  

如果目标的显式规则中都没有` recipe `，则搜索适用的隐式规则，以找到`recipe`（参见第10 章 [使用隐式规则]，第 121 页）。

## 静态规则模式(该方法比较常用)

态模式规则是指定多个目标并根据目标名称为每个目标构建依赖名称的规则。它们比具有多个目标的普通规则更通用，因为目标不必具有完全相同的依赖。它们的依赖必须类似，但不一定完全相同  。

### 静态规则语法

下面是静态模式规则的语法：

```makefile
targets ...: target-pattern: prereq-patterns ...
        recipe
        ...
```

目标列表指定了规则适用的目标。目标可以包含通配符，就像普通规则的目标一样（参见第 4.3 节 [在文件名中使用通配符]，第 25 页）。

`target-pattern `和` prereq-patterns `说明了如何计算每个目标的依赖。每个目标都与目标模式相匹配，以提取目标名称的一部分，称为**词干**。这个词干会被替换到每个依赖模式中，从而产生依赖名称（每个依赖模式产生一个）。  

每个模式通常只包含一次字符`"%"`。当目标模式匹配目标时， `"%"`可以匹配目标名称的任何部分；这部分称为**词干**。模式的其余部分必须完全匹配。例如，目标`foo.o `与以` "foo"`为词干的模式`"%.o"`匹配。目标文件` foo.c `和` foo.out `与该模式不匹配。

每个目标的依赖名称是通过替换每个依赖模式中`"%"`的词干而产生的。例如，如果一个依赖模式是` %.c`，那么替换词干` "foo"`就会 得到依赖名称`foo.c`。  

模式规则中的`'%'`字符可以用前面的反斜线`（'\'）`引出。本来要引用`"%"`字符的反斜线可以用更多的反斜线来引用。在将模式与文件名进行比较或在模式中插入词干之前，会从模式中删除引用`"%"`字符或其他反斜线的反斜线。没有引用`"%"`字符危险的反斜线则不会被删除。例如，模式` the\%weird\%pattern\ `的`'the%weird\'`位于执行`'%'`字符之前，而`'pattern\'`位于其后。最后两个反斜线没有被删除，因为它们不会影响任何`"%"`字符。  

下面是一个示例， 分别从相应的` .c` 文件编译` foo.o `和` bar.o`：

```makefile
objects = foo.o bar.o

all: $(objects)

$(objects): %.o: %.c
        $(CC) -c $(CFLAGS) $< -o $@
```

这里的`"$<"`是保存依赖名称的自动变量， `"$@"`是保存目标名称的自动变量；参见第130 页，第 10.5.3 节 [自动变量]。  

指定的每个目标都必须与目标模式匹配，否则将发出警告。如果您有一个文件列表，其中只有部分文件与模式匹配，您可以使用过滤器函数删除不匹配的文件名（参见第 92 页，第 8.2 节 [字符串替换和分析函数]）：

```makefile
files = foo.elc bar.o lose.o

$(filter %.o,$(files)): %.o: %.c
        $(CC) -c $(CFLAGS) $< -o $@
$(filter %.elc,$(files)): %.elc: %.el
        emacs -f batch-byte-compile $<
```

在这个示例中， `"$(filter %.o,$(files)) "`的结果是` bar.o`， 而第一条静态模式规则会通过编译相应的 C 源文件来更新每个对象文件。` $(filter %.elc,$(files)) "`的结果是` foo.elc`，因此该文件是由` foo.el `生成的。  

另一个例子说明了如何在静态模式规则中使用` $*`：  

```makefile
bigoutput littleoutput : %output : text.g
        generate text.g -$* > $@
```

运行生成命令时，` $* `将扩展为词干，即 "`大` "或 "`小`"。  

### 静态模式规则与隐式规则  

静态模式规则与定义为模式规则的隐式规则有许多共同之处（参见第 10.5 节 [定义和重新定义模式规则]，第 129 页）。两者都有一个目标模式和用于构造依赖名称的模式。两者的区别在于 make 如何决定规则何时适用。  

隐式规则可适用于任何与其模式匹配的目标，但只有当目标没有指定 recipe ，并且可以找到依赖时才适用。如果有多条隐式规则适用，则只有一条适用；选择取决于规则的顺序。

相比之下，静态模式规则适用于您在规则中指定的精确目标列表。它不能适用于任何其他目标，而且总是适用于指定的每个目标。如果有两条相互冲突的规则，而且都有 recipe ，那就是错误。  

由于这些原因，静态模式规则可能比隐式规则更好：

+ 对于一些名称无法用语法分类但可以用显式列表给出的文件，您可能希望覆盖通常的隐式规则。
+ 如果不能确定所使用目录的准确内容，就可能无法确定哪些其他无关文件可能会导致使用错误的隐式规则。选择可能取决于隐式规则搜索的顺序。静态模式规则则不存在这种不确定性：每条规则都精确地适用于指定的目标。

## 双冒号规则

**双冒号规则**是在目标名称后使用`":: "`而不是`": "`写成的显式规则。当同一目标出现在多条规则中时，它们的处理方式与普通规则不同。带有双引号的模式规则具有完全不同的含义（参见第 10.5.5 节 [匹配规则]，第 134 页）。

当一个目标出现在多条规则中时，所有规则必须是同一类型：全部为普通规则或全部为双冒号规则。如果是双冒号，则每条规则都独立于其他规则。如果目标比该规则的任何依赖都早，则会执行每条双引号规则的口诀。如果该规则没有依赖，则其recipe 始终会被执行（即 使 目标已经存在）。这可能导致不执行、执行任何或执行所有双引号规则。

目标相同的双冒号规则实际上是完全独立的。每条双冒号规则都是单独处理的，就像处理不同目标的规则一样。

目标的双冒号规则是按照它们在 makefile 中出现的顺序执行的。不过，双冒号规则真正有意义的情况是，执行 recipe 的顺序并不重要。

双冒号规则有点晦涩难懂，而且通常用处不大；它们提供了一种机制，用于处理更新目标的方法因导致更新的前提文件而异的情况，但这种情况很少见。

每个双引号规则都应指定一个 recipe ；如果没有指定，则将使用隐式规则。请参121 页，第 10 章 [使用隐含规则]。

## 自动生成依赖

在程序的 makefile 中，许多需要编写的规则往往只说明某个对象文件依赖于某个头文件。例如，如果`main.c`通过` #include `使用` defs.h`，你可以这样写：

```makefile
main.o: defs.h
```

你需要这样的规则，以便` make `知道，每当` defs.h `发生变化时，它必须重写` main.o`。你可以看到，对于一个大型程序，你必须在` makefile `中编写几十条这样的规则。而且，每次添加或删除` #include `时，你都必须非常小心地更新` makefile`。  

为了避免这种麻烦，大多数现代` C `语言编译器都可以通过查看源文件中的`#include `行来为您编写这些规则。通常可以通过编译器的`"-M "`选项来实现。例如，

```makefile
cc -M main.c
```

它的输出为：

```makefile
main.o : main.c defs.h
```

因此，您不必再亲自编写所有这些规则。编译器会帮你完成。  

请注意，这样的规则构成了在` makefile `中提及` main.o`，因此它永远不会被视为隐式规则搜索的中间文件。这意味着 make 不会在使用该文件后将其删除；参见第 10.4 节 [隐含规则链]，第 127 页。

在旧的 make 程序中，传统的做法是使用` "make depend "`之类的命令，利用编译器的这一特性按需生成依赖。该命令将创建一个` depend `文件，其中包含所有自动生成的依赖；然后` makefile `可以使用` include `将它们读入（参见第 3.3 节 [包含]，第 13 页）。

在` GNU make `中，重制` Makefile `的功能使得这种做法不再适用--你不需要明确告诉`make `重新生成依赖，因为它总是会重新生成任何过时的` makefile`。参见第 3.5 节[重制 Makefile]，第 15 页。

我们推荐的自动生成依赖的做法是，每个源文件对应一个` makefile`。每个源文件`name.c `都有一个` makefile name.d`，其中列出了对象文件` name.o `所依赖的文件。这样，只需重新扫描已更改的源文件，即可生成新的依赖。  

以下是生成名为`name.d `的依赖文件（即 makefile）的模式规则从名为` name.c `的 C 源文件中提取：  

```makefile
%.d: %.c
        @set -e; rm -f $@; \
         $(CC) -M $(CPPFLAGS) $< > $@.$$$$; \
         sed 's,\($*\)\.o[ :]*,\1.o $@ : ,g' < $@.$$$$ > $@; \
         rm -f $@.$$$$
```

有关定义模式规则的信息，请参见第 129 页，第 10.5 节 [模式规则]。如果`$(CC) `命令（或任何其他命令）执行失败（以非零状态退出）， `shell` 的`"-e "`标志会使其立即退出。

在使用` GNU C `编译器时，您可能希望使用`"-MM"`标志而不是`"-M"`。这样可以省略系统头文件的依赖。详情请参阅`《使用 GNU CC》`中的 "**控制预处理器的选项 **"一节。

sed 命令的目的是翻译（例如）：  

```makefile
main.o : main.c defs.h
```

翻译为：

```makefile
main.o main.d : main.c defs.h
```

这样，每个`".d"`文件都依赖于相应`".o"`文件所依赖的所有源文件和头文件。当任何源文件或头文件发生变化时， make 就会知道它必须重新生成依赖。

一旦定义了重制`".d"`文件的规则，就可以使用` include `指令将它们全部读入。请参见第 13 页第 3.3 节 [包含]。例如

```makefile
sources = foo.c bar.c

include $(sources:.c=.d)
```

(本例使用替换变量引用， 将源文件列表 `"foo.c bar.c "`转换为先决` makefile `列表`"foo.d bar.d"`。 有关替换引用的完整信息， 请参见第 69 页， 第 6.3.1 节 [替换引用] ） 。 由于`".d "`文件与其他` makefile `文件一样， `make `将根据需要重编它们， 而您无需再做任何工作。 参见第 15 页第 3.5 节 [重制 Makefile]。  

请注意， `".d "`文件包含目标定义； 应确保将` include` 指令放在` makefile `中第一个默认目标之后， 否则就有可能使随机对象文件成为默认目标。 参见第 2.3 节 [Make 如何工作]， 第 5 页。  

# 5 编写规则中的Recipe

规则的`recipe`由一条或多条` shell 命令`行组成，按照它们出现的顺序一次执行一条。通常情况下， 执行这些命令的结果是更新规则的目标。用户会使用许多不同的` shell `程序，但除非` makefile `另有说明，否则` makefile `中的`recipe `==**总是由` /bin/sh `解释**==。参见第 48 页，第 5.3 节 [ recipe 执行]。

## recipe 语法  

`Makefile `有一个不寻常的特性，即在一个文件中实际上有两种不同的语法。大部分` makefile `使用 **`make 语法`**（参见第 3 章 [编写 Makefile]，第 11 页）。然而， `recipe `是要由` shell `来解释的，因此它们是用**` shell `语法**编写的。 `make `程序并不试图理解` shell `语法：在将` recipe `交给 `shell` 之前，它只对` recipe `的内容进行极少数特定的翻译。

recipe 中的每一行都必须以制表符（或`.RECIPEPREFIX`变量；参见第 6.14 节 [特殊变量]，第 80 页），但 recipe 的第一行可以连接到目标和依赖行，中间用分号隔开。 makefile 中以制表符开头并出现在** "规则上下文 "**中的任何一行（即在规则开始后，直到另一条规则或变量定义之前），都将被视为该规则 recipe 的一部分。空白行和注释行可能会出现在 recipe 行中，但它们会被忽略。

这些规则的一些后果包括:

+ 以制表符开头的空行不是空行：它是一个空` recipe` （见第 62 页第 5.9 节 [空recipe ]）。
+ `recipe `中的注释不是` make `注释；它将按原样传递给` shell`。 `shell `是否将其视为注释取决于您的` shell`。
+ 在 **"规则上下文 "**中的变量定义，如果在行的第一个字符处用制表符缩进，则会被视为` recipe `的一部分，而不是 `make` 变量定义，并将其传递给 `shell`。  
+ **"规则上下文 "**中的条件表达式（`ifdef、 ifeq `等，参见第 7.2 节 [条件语法]，第86 页），如果在行的 第一个字符处用制表符缩进，将被视为` recipe `的一部分并传递给 `shell`。

### 划分recipe行

make解释recipe的少数方法之一是检查换行符前面是否有反斜杠`\`。如正常的`makefile`语法一样，通过在每个换行符前添加反斜杠，可以在 `makefile` 中将单个逻辑 `recipe` 行拆分成多个物理行。这样的行序列被视为一条 `recipe` 行，运行时将调用一个` shell `实例。

不过，与` makefile` 中其他地方的处理方式不同（参见第 3.1.1 节 [分割长行]，第 12页），`反斜杠/换行符`对不会从` recipe `中删除。**反斜线**和**换行符**都会保留并传递给`shell`。

如何解释`反斜线/换行符`取决于 `shell` 。如果第一个字符的下一行字符是` recipe `前缀字符（默认为制表符，参见第 6.14节 [特殊变量]，第 80 页），则该字符（且仅该字符）将被删除。 recipe 中不会出现空白。

例如，该 makefile 中的 all 目标的 recipe ：  

```makefile
all :
        @echo no\
space
        @echo no\
        space
        @echo one \
        space
        @echo one\
         space
```

由四条独立的` shell `命令组成，其中的输出为 :

```makefile
nospace
nospace
one space
one space
```

更复杂的例子是这个 makefile：  

```makefile
all : ; @echo 'hello \
        world' ; echo "hello \
    world"
```

将调用一个 shell，命令为 ：

```makefile
echo 'hello \
world' ; echo "hello \
    world"
```

根据 shell 引用规则，输出结果如下:

```makefile
hello \
world
hello     world
```

请注意，用双引号引用的字符串（`"..."`）中的`反斜杠/换行符对`已被删除，而用单引号引用的字符串（ "`...`"） 中的反斜杠/换行符对却未被删除。 这是默认 `shell（/bin/sh）`处理`反斜线/换行符对的方式。如果在 `makefile `中指定了不同的` shell`，可能会有不同的处理方式。

有时，您想在单引号内分割长行，但又不想在引号内容中出现`反斜线/换行符`。在将脚本传递给` Perl `等语言时经常会出现这种情况，因为脚本中多余的反斜线可能会改变脚本的含义，甚至导致语法错误。处理这种情况的一种简单方法是将引号字符串甚至整个命令放入一个 make 变量，然后在 recipe 中使用该变量。在这种情况下，将使用`makefile `的换行引号规则，并删除`反斜线/换行符`。如果我们用这种方法重写上面的例子:

```makefile
HELLO = 'hello \
world'

all : ; @echo $(HELLO)
```

我们将得到这样的输出结果 :

```makefile
hello world
```

如果愿意，也可以使用目标变量（参见第 6.11 节 [目标变量值]，第 78 页），使变量和使用该变量的 recipe 之间的对应关系更加紧密。

### 在 recipe 中使用变量  

`make `处理` recipe `的另一种方式是扩充` recipe `中的变量引用（参见第 6.1 节 [引用]，第65页）。这发生在` make `读完所有` makefile `并确定目标已过期之后；因此，未重建目标的` recipe `永远不会展开。

`recipe `中引用变量和函数的语法和语义与` makefile `中引用变量和函数的语法和语义完全相同。它们也有相同的引用规则：如果要在` recipe `中出现**美元符号**，必须将其加倍（`'$$'`）。对于像默认 shell 这样使用美元符号来引入变量的` shell`，重要的是要清楚你要引用的变量是` make `变量（使用单个美元符号）还是` shell `变量（使用**两个美元符号**）。例如：

```makefile
LIST = one two three
all:
        for i in $(LIST); do \
            echo $$i; \
        done
```

会将以下命令传递给 shell：  

```makefile
for i in one two three; do \
    echo $i; \
done
```

这就产生了预期的结果：  

```makefile
one
two
three
```

## Recipe 的回显

通常情况下， make 会在执行前打印 recipe 的每一行。我们将此称为因为这会让人觉得是您自己输入的。

当一行以`"@"`开头时，该行的回声将被抑制。在将该行传递给 `shell` 之前， `"@"`会被丢弃。通常情况下，如果命令的唯一作用是打印某些内容，就会用 到 这个功能，例如用` echo `命令来显示` makefile `的进度：

```makefile
@echo About to make distribution files
```

如果`make`使用了选项`-n`或者`--just-print`，它仅仅会回显命令，而不会执行它们。参见第 9.8 节 [选项摘要]，第 114 页。在这种情况下，甚至以`"@"`开头的`recipe `行也会被打印。该标记可用于找出认为有必要执行的` recipe `，而无需实际执行。

make 的`"-s "`或`"--silent "`标志可以阻止所有回声，就像所有以`"@"`开头的代码一样。在` makefile `中为不带依赖的特殊目标` .SILENT `设置规则也有同样的效果（见第 34 页，第 4.8 节 [特殊内置目标名称]）。  

## Recipe 执行  

当需要执行` recipe `来更新目标时，除非` .ONESHELL `特殊目标有效（参见第 5.3.1 节[使用单壳]，第 48 页），否则` recipe `的每一行都会调用一个新的子`shell`来执行（在实际操作中， make 可能会采取一些不影响结果的快捷方式）。

==**请注意**==： 这意味着设置` shell `变量和调用` shell 命令（如 cd）`（为每个进程设置本地上下文）不会影响 `recipe` 中的后续行。 如果您想使用 `cd` 影响下一条语 句 ，请将两条语句放在一个` recipe `行中。然后，` make `将调用一个` shell `运行整行，该` shell`将按顺序执行语句。例如：

```makefile
foo : bar/lose
        cd $(<D) && gobble $(<F) > ../$@
```

在这里，我们使用了` shell AND `运算符 (`&&`)，这样如果` cd `命令失败，脚本也会失败，而不会试图在错误的目录中调用 `gobble `命令，否则可能会造成问题（在这种情况下，至少会导致 `./foo `被截断）。  

### 使用一个shell

有时，您希望将 recipe 中的所有命令行传递给` shell `的单次调用。这通常在两种情况下有用：首先，在 recipe 由许多命令行组成的` makefile `中，它可以避免额外的进程，从而提高性能。其次，您可能希望在 recipe 命令中包含换行符（例如，您使用的解释器与`shell `的解释器截然不同）。如果` .ONESHELL `特殊目标出现在 makefile 的任何地方，那么每个目标的所有 recipe 行都将提供给 `shell` 的单次调用。 recipe 行之间的换行符将被保留。例如：

```makefile
.ONESHELL:
foo : bar/lose
        cd $(<D)
        gobble $(<F) > ../$@
```

现在，即使命令位于不同的` recipe `行上，也能按预期运行。  

如果出现了` .ONESHELL`，则只检查 `recipe` 第一行的特殊前缀字符（`'@'`、` '-'`和`'+'`）。在调用` SHELL `时，后面的行将包括`Recipe`行中的特殊字符。如果希望这些`Recipe`以一个特殊字符开始，你需要为其分配不要在第一行的第一个字符，尽可能添加一条注释或者相同。比如，下面的在`Perl`中执行将会出错，因为`make`会将第一个`@`去掉：

```makefile
.ONESHELL:
SHELL = /usr/bin/perl
.SHELLFLAGS = -e
show :
        @f = qw(a b c);
        print "@f\n";
```

不过，这两种方案中的任何一种都可以正常工作：  

```makefile
.ONESHELL:
SHELL = /usr/bin/perl
.SHELLFLAGS = -e
show :
        # Make sure "@" is not the first character on the first line
        @f = qw(a b c);
        print "@f\n";
```

或者：

```makefile
.ONESHELL:
SHELL = /usr/bin/perl
.SHELLFLAGS = -e
show :
        my @f = qw(a b c);
        print "@f\n";
```

作为一项特殊功能，如果 SHELL 被确定为` POSIX `风格的 shell，那么在处理 recipe之前， "内部 " recipe 行中的特殊前缀字符将被删除。 这一特性的目的是让现有的makefile添加` .ONESHELL `特殊目标后，仍能正常运行，而无需进行大量修改。由于在` POSIX shell `脚本中，特殊前缀字符在行首是不合法的，因此这并不是功能上的损失。例如:

```makefile
.ONESHELL:
foo : bar/lose
        @cd $(@D)
        @gobble $(@F) > ../$@
```

不过，即使有了这个特殊功能，带有` .ONESHELL `的 makefile 也会有明显的不同表现。例如，通常情况下，如果 recipe 中的任何一行失效，都会导致规则失效，不再处理其他 recipe 行。而在` .ONESHELL `下，除了最后一行之外，其他任何一行的失败都不会被 make 注意到。你可以修改` .SHELLFLAGS`，在 shell 中添加 `-e` 选项，这将导致命令行中任何地方的失败都会导致` shell `失败，但这本身也会导致你的 recipe 行为不同。最终，你可能需要强化你的 recipe 行，使它们能与 `.ONESHELL `一起工作。

### 选择shell

用作 shell 的程序取自` SHELL `变量。 如果 makefile 中没有设置这个变量， 则使用`/bin/sh `程序作为` shell`。传递给 shell 的参数取自` .SHELLFLAGS `变量。 `.SHELLFLAGS`的默认值是正常情况下(`-c`)的 ，或兼容模式下(`-ec`)。

与其他大多数变量不同的是，`SHELL`从不会被环境变量设置，这是因为`SHELL`变量是给用户自定义shell程序的交换接口。像这样影响 makefile 运行的个人选择是非常不好的。参见第 6.10节 [环境变量]，第 77 页。  

此外，在 `makefile` 中设置`SHELL `时，该值不会在 make 调用的 recipe 行环境中导出。取而代之的是导出从用户环境继承的值，如果有的话。您可以通过显式导出SHELL来覆盖这种行为（参见第 5.7.2 节 [将变量传递给子 make]，第 57 页），从而强制将其通过环境传递给 recipe 行。

不过，在 `MS-DOS` 和 `MS-Windows` 系统中，使用的是环境中的 `SHELL` 值，因为在这些系统中，大多数用户并不设置这个变量，因此它很可能是专门为 make 设置的。在 MS-DOS 上，如果 `SHELL` 的设置不适合 make，可以将` MAKESHELL `变量设置为make 应该使用的` shell`；如果设置了它，它将被用作` shell`，而不是 `SHELL`的值。  

#### 在 DOS 和 Windows 中选择shell  

在 MS-DOS 和 MS-Windows 中选择 shell 要比在其他系统中复杂得多。在 MS-DOS 中，如果未设置 SHELL，变量 COMSPEC 的值（始终为设置值）来代替。

在 MS-DOS 系统中，对 Makefile 中设置变量 SHELL 的行的处理是不同的。现有的shell（command.com）功能非常有限，许多 make 用户倾向于安装一个替代 shell。因此，在 MS-DOS 上， make 会检查 SHELL 的值，并根据它指向的是 Unix 风格还是DOS 风格的 shell 来改变其行为。这样，即使 SHELL 指向 command.com，也能实现合理的功能。

如果 SHELL 指向一个 Unix 风格的 shell， MS-DOS 上的 make 会额外检查是否确实能找到这个 shell；如果找不到，它就会忽略设置 SHELL 的那一行。在 MS-DOS 中， GNU make 在以下位置搜索 shell：  

1. SHELL 值所指向的准确位置。例 如 ，如果 makefile 指定 "SHELL = /bin/sh"，make 将在当前驱动器上的 /bin 目录中查找。
2. 在当前目录下。
3. 在 PATH 变量中的每个目录中依次输入。在检查的每个目录中， make 会首先查找特定文件（如上例中的 sh）。如果找不到，它还会在该目录中查找带有可执行文件扩展名的文件。例如` .exe、 .com、 .bat、.btm、 .sh `和其他一些扩展名。

如果其中任何一次尝试成功， SHELL 的值将被设置为找到的 shell 的完整路径名。但是，如果没有找到这些 shell， SHELL 的值将不会改变，因此设置它的那一行实际上将被忽略。因此，只有在运行 make 的系统中实际安装了 Unix 风格的 shell 时， make才会支持这种 shell 特有的功能。  

请注意， 这种对 shell 的扩展搜索仅限于在 Makefile 中设置 SHELL 的情况； 如果是在环境或命令行中设置， 则应将其设置为 shell 的完整路径名， 与 Unix 上的设置完全相同。

上述 DOS 特定处理的效果是， 包含` "SHELL = /bin/sh'`（许多 Unix makefile 都是这样做的），在 MS-DOS 上可以不加改动地工作，如果你有例如sh.exe 安装在 PATH 的某个目录下。

## 并行执行

GNU make 知道如何同时执行多个 recipe 。 通常情况下， make 一 次 只执行一个recipe ，等它完成后再执行下一个。不过， `"-j "`或`"--jobs "`选项可以让 make 同时执行多个 recipe 。您可以在 `makefile` 中禁止某些或所有目标的并行执行（参见第 51页，第 5.4.1 节[禁止并行执行]）。

在 MS-DOS 系统中， "`-j` "选项不起作用，因为该系统不支持多重处理。

如果`"-j "`选项后跟了一个整数，这就是一次要执行的 recipe 数量；这被称为作业槽数。如果`"-j "`选 项 后没有任何类似整数的内容，则作业槽数没有限制。默认的任务槽数是` 1`，即串行执行（一 次执行一个任务）。

处理递归 make 调用会引起并行执行的问题。有关这方面的更多信息，请参见第5.7.3 节 [向子 make 传递选项]，第 59 页

如果 recipe 失败（被信号杀死或以非零状态退出），且该 recipe 的错误未被忽略（参见第 5.5 节 [ recipe 中的错误]，第 54 页），则不会运行重制同一目标的其余 recipe行。如果 recipe 失败，且未给出"-k "或"--keep-going "选项（参见第 9.8 节 [选项摘要]，第 114页）， make 将中止执行。如果 make 因任何原因（包括信号）在子进程运行的情况下终止，它会等待子进程结束后才退出

当系统负载较高时，你可能希望运行的作业数量少于负载较低时。你可以使用"-l "选项，让 make 根据平均负载限制一次运行的作业数量。 -l "或"--max-load "选项后跟一个浮点数。例如:

```makefile
-l 2.5
```

如果平均负载超过 2.5，则不会让 make 启动多个作业。如果之前的"-l "选项设置了负载限制，则没有后面数字的"-l "选项会删除负载限制。  

更确切地说，当 make 要启动一个作业时，如果已经有至少一个作业在运行，它会检查当前的平均负载；如果它不低于用"-l "给出的限制， make 就会等待，直到平均负载低于该限制，或者直到所有其他作业都完成。

默认情况下，没有负载限制。  

### 禁用并行执行

如果`makefile`能完整、准确地定义所有目标之间的依赖关系，那么无论是否启用并行执行， `make` 都能正确地构建目标。这就是编写 `makefile` 的理想方式。  

然而，在有些情况下或者一个`makefile`中的所有目标无法并行执行，添加通知 make的所需依赖也不可行。在这种情况下， `makefile`可以使用各种方法来禁止并行执行。  

如果在任何地方指定了不带依赖的` .NOTPARALLEL `特殊目标，那么整个 `make`实例都将以串行方式运行，与并行设置无关。例如

```makefile
all: one two three
one two three: ; @sleep 1; echo $@

.NOTPARALLEL:
```

无论如何调用 make，目标 1、 2 和 3 都将连续运行。  

如果 .NOTPARALLEL 特殊目标有依赖，那么每个依赖都将被视为一个目标，这些目标的所有依赖都将串行运行。请注意，只有在构建此目标时才会串行运行依赖：如果其他目标列出了相同的依赖，且不在 .NOTPARALLEL 中，则这些依赖可能会并行运行。例如：

```makefile
all: base notparallel

base: one two three
notparallel: one two three

one two three: ; @sleep 1; echo $@

.NOTPARALLEL: notparallel
```

在这里， "make -j base "将并行运行目标 1、 2 和 3，而 "make -j notparallel'将串行运行它们。如果运行 "make -j all"，它们将并行运行，因为 base 将 它们列为依赖，而不是序列化的。  

`.NOTPARALLEL `目标不应包含命令。  

最后，您可以使用 .WAIT 特殊目标来精细控制特定依赖的序列化。当该目标出现在依赖列表中并启用并行执行时，在 .WAIT 左侧的所有依赖都完成之前， make 不会构建 .WAIT 右侧的任何依赖。例如：

```makefile
all: one two .WAIT three
one two three: ; @sleep 1; echo $@
```

如果启用了并行执行， make 会尝试并行构建一个和两个，但在两个都完成之前不会尝试构建第三个。

与提供给` .NOTPARALLEL` 的目标一样，` .WAIT `仅在构建依赖列表中出现的目标时生效。如果其他目标中存在相同的依赖，但没有 `.WAIT`，那么它们仍可并行运行。 因此 ，无论是目标的` .NOTPARALLEL` 和` .WAIT `在控制并行执行方面的可靠性都不如定义前提关系。不过，它们易于使用，在不太复杂的情况下可能就足够了。

该规则的任何自动变量中都不会出现 `.WAIT `依赖。

为了便于移植，您可以在 `makefile` 中创建 `.WAIT` 目标，但这并不是使用此功能的必要条件。如果创建了` .WAIT `目标，则它不应包含依赖或命令。

`.WAIT`功能在其他版本的 make 中也有实现， 并且在` POSIX `标准的` make `中也有规定。

### 并行执行期间的输出  

当并行运行多个 recipe 时，每个 recipe 的输出都会在生成后立即出现，因此不同recipe 的信息可能会穿插在一起，有时甚至会出现在同一行。这会给阅读输出带来很大困难。

要避免这种情况，可以使用`"--输出同步"（'-O'）`选项。该选项指示` make`保存所调用命令的输出，并在命令执行完毕后将其全部打印出来。

如果启用了工作目录打印（参见第 5.7.4 节 [`'--print-directory'`选项]，第 61 页），则会在每个输出分组周围打印进入/离开信息。如果不想看到这些信息，请在`MAKEFLAGS` 中添加"`--no-print-directory`"选项。  

同步输出的粒度分为四级，可通过为选项提供参数（如"`-Oline `"或"`--outputsync=recurse`"）来指定。  

+ `none`：这是默认设置：所有输出在生成时直接发送，不进行同步。  
+ `line`：recipe中每一行的输出都会分组，并在该行完成后立即打印。如果 recipe 由多行组成，则这些行可能与其他 recipe 的行穿插在一起。  
+ `target`：目标完成后， 每个目标的整个 recipe 输出将分组并打印。 如果给定的`output-sync`或 `-O` 选项没有参数，默认情况下也是如此。
+ `recurse`： 对每次递归调用 make 的输出进行分组，并在递归调用完成后打印出来。

无论选择哪种模式，总的创建时间都是一样的。唯一不同的是输出结果的显示方式。

`target` 和 `recurse `模式都会收集目标的整个 recipe 输出，并在 recipe 完成后不间断地显 示 出 来 。 两 者 的 区 别 在 于 如 何 处 理 包 含 make 的 递 归 调 用 的 recipe （参见第5.7 节[make 的递归使用]，第 56 页）。对于所有没有递归行的 recipe ， "目标 "和 "递归"模式的作用完全相同。

如果选择了 "`recurse`"模式，包含递归 make 调用的 recipe 将与其他目标相同： recipe 的输出（包括递归 make 的输出）将在整个 recipe 完成后保存并打印。这确保了由给定递归 make 实例构建的所有目标的输出都被集中在一起，从而使输出更易于理解。不过，这也会导致在编译过程中出现长时间看不到输出，然后是大量输出的情况。如果你不是在构建过程中观察，而是在事 后 查看构建日志，这可能是最好的选择。

如果你正在盯着屏幕看，长时间的静止(无任何输出)会让你无聊。目标输出同步模式会检测`make`是否使用标准方法递归表达用，使用标准方法递归调用时，它不会同步输出这些行。递归`make`将对其目标执行同步，每个目标的输出都将会立即显示每个目标的输出。请注意，行的输出不会同步(例如：如果递归行在运行`make`之前打印了一条信息，该信息将不会同步)。

“`line`”模式对于观察 `make` 输出以跟踪 `recipe` 何时开始和完成的前端非常有用。

如果 `make` 调用的某些程序确定输出写入的是终端而不是文件（通常被描述为 "交互 "模式和 "非交互 "模式），它们的行为可能会有所不同。例如，许多可以显示彩色输出的程序，如果确定它们不是写入终端， 就不会显示彩色输出。如果你的 `makefile` 调用了这样的程序，那么使用输出同步选项就会使程序认为它是在 "非交互 "模式下运行的，尽管输出最终会写入终端。

### 并行执行期间的输入  

两个进程不能同时从同一设备获取输入。为了确保一次只能有一个 `recipe` 尝试从终端获取输入， `make` 会使除一个正在运行的 recipe 外的所有其他` recipe `的标准输入流失效。 如果另一个 `recipe` 试图从标准输入流中读取数据， 通常会出现致命错误（ "`Broken pipe`"（管道断裂）信号）。

无法预测哪个` recipe `会有有效的标准输入流（来自终端，或您重定向 `make` 标准输入的地方）。第一个运行的 `recipe` 总是最先获得标准输入流，之后启动的第一个`recipe `将获得标准输入流，依此类推。

如果我们找到了更好的替代方案，我们将改变 `make` 在这方面的工作方式。与此同时，如果使用并行执行功能，则不应依赖任何使用标准输入的 `recipe` ；但如果不使用该功能，则标准输入在所有` recipe `中都能正常工作。

## recipe中的错误  

每次` shell `调用返回后，` make `都会查看其退出状态。如果` shell `调用成功（退出状态为零），则 `recipe` 中的下一行将在新的 shell 中执行；最后一行执行完毕后，规则结束。

如果出现错误（退出状态非零）， `make `就会放弃当前规则，甚至放弃所有规则。

有时，某个 `recipe` 行失效并不能说明问题。例如，你可能会使用 `mkdir` 命令来确保某个目录已经存在。如果目录已经存在，` mkdir `会报错，但你可能还是想让`make` 继续运行。

要忽略 `recipe` 行中的错误，请在该行文本的**开头**（初始制表符之后）写一个"`-`"(在初始的`tab`后面)。改`"-"`会被丢弃，当它传递给`shell`之前。

例如：

```makefile
clean:
	-rm -f *.o
```

当即便是`rm`失败，`make`也会依然继续执行下去。

使用`"-i "`或`"--ignore-errors "`标志运行` make `时，所有规则的所有` recipe `中的错误都会被忽略。如果没有依赖，` makefile `中的特殊目标` .IGNORE `规则也有同样的效果。这种方法不太灵活，但有时很有用。

当使用`"-"`或`"-i "`标记而导致错误被忽略时， `make` 会像处理成功一样处理错误返回，只是会打印出一条信息，告诉你 `shell` 退出时的状态代码，并说明错误已被忽略。

当发生一个 `make` 没有被告知要忽略的错误时，这 意味着当前目标无法正确重制，其他直接或间接依赖于它的目标也无法重制。由于这些目标的依赖没有得到满足，因此不会再为它们执行 `recipe` 。

在这种情况下， `make` 通常会立即放弃，返回非零状态。但是，如果指定了`"-k "`或`"--keep-going "`标志， `make` 会继续考虑待处理目标的其他依赖，必要时重新编译， 然后才放弃并返回非零状态。例 如 ，在编译一个对象文件出错后， `"make -k "`将继续编译其他对象文件，即使它已经知道链接它们是不可能的。参见第 9.8 节 [选项摘要]，第 114 页。

通常的行为假定你的目的是让指定的目标达到最新；一旦 `make` 发现这是不可能的，它可能会立即报告失败。而`"-k "`选项则表示，真正的目的是尽可能多地测试程序中的改动，也许是为了发现几个独立的问题，以便在下一次尝试编译之前全部改正。这就是` Emacs`编译命令默认使用`"-k "`标记的原因。

通常，当` recipe `行失败时，如果它对目标文件有任何改变，那么该文件就会损坏，无法使用——或者至少没有完全更新。然而文件的时间戳显示它现在是最新的，所以下次运行` make `时，它不会尝试更新该文件。这种情况与 shell 被信号杀死时的情况相同；参见第 55 页，第 5.6 节 [中断]。如果 `.DELETE_ON_ERROR` 作为目标出现，` make` 就会删除目标文件。这几乎总是你希望 `make` 做的事情，但并非历史惯例；因此为了兼容性，你必须明确要求这样做。

## 中断或杀死`make`

如果 `make` 在执行 `shell` 时收到==致命信号==，它可能会删除 `recipe` 本应更新的目标文件。如果目标文件的最后修改时间在 `make `首次检查后发生了变化，它就会删除该文件。

删除目标的目的是为了确保下次运行` make `时，它能从头开始重新制作。这是为什么呢？假设你在编译器运行时键入了` Ctrl+C`，而编译器已经开始编写对象文件`foo.o`。`Ctrl+C `会杀死编译器，从而产生一个不完整的文件，其最后修改时间比源文件` foo.c `新。但是` make `也会接收到 `Ctrl-c` 信号并删除这个不完整的文件。如果`make`没有这样做，下一次调用 `make` 时就会认为` foo.o `不需要更新，结果当链接器试图链接一个丢失了一半内容的对象文件时，就会出现奇怪的错误信息。

您可以通过将特殊目标设置为`.PRECIOUS `依赖于它来防止以这种方式删除目标文件。在重制目标之前，要检查该目标是否出现在`.PRECIOUS` 的依赖中，从而决定在出现信号时是否要删除该目标。这样做的原因有：目标已更新或者只是为了记录修改时间而存在（其内容并不重要），或者必须始终存在以防止其他麻烦。

尽管` make `会尽力进行清理，但在某些情况下清理是不可能的。例如， `make `可能会被一个无法捕获的信号杀死。或者，` make `调用的某个程序可能被杀死或崩溃，留下一个最新但已损坏的目标文件：` make `不会意识到这一故障要求对目标文件进行清理。或者` make `本身也可能遇到错误而崩溃。

因此，最好编写预防性的程序，这样即使失败也不会留下已损坏的目标文件。最常见的做法是创建临时文件，而不是直接更新目标文件，然后将临时文件重命名为最终目标文件名。有些编译器已经这样做了，所以你不需要编写预防性代码。

## `make`的递归使用  

递归使用` make` 意味着在` makefile `中使用` make `作为命令。当你想为组成一个大系统的不同子系统分别编写` makefile `时，这种技术就非常有用。例如，假设你有一个子目录` subdir`，它有自己的` makefile`，而你希望包含子目录的` makefile `在子目录上运行`make`。你可以这样写:

```makefile
subsystem:
	cd subdir && $(MAKE)
```

或者这样做：

```makefile
subsystem:
	$(MAKE) -C subdir
```

你可以通过复制这个例子来编写递归` make `命令，但要知道它们是如何工作的、为什么，以及子` make `与顶级` make `之间的关系。你可能会发现，将调用递归 `make `命令的目标声明为`".PHONY "`也是很有用的（关于何时有用的更多讨论，请参见第 4.5 节`[Phony Targets]`，第 31 页）。  

为了方便起见，当 `GNU make` 启动时（在处理完任何` -C `选项之后），它会将变量` CURDIR `设置为当前工作目录的路径名。 `make `不会再碰这个值：特别要注意的是，如果你包含了其他目录中的文件， `CURDIR` 的值也不会改变。该值的优先级与在`makefile `中设置的相同（默认情况下，环境变量` CURDIR `不会覆盖该值）。请注意，设置这个变量不会影响` make `的运行（例如，它不会导致` make `改变工作目录）。  

### `make`变量如何工作

递归 make 命令应始终使用变量 MAKE，而不是明确的命令名 "make"，如图所示：  

```makefile
subsystem:
	cd subdir && $(MAKE)
```

该变量的值是调用` make `时的文件名。如果文件名是`/bin/make`，那么执行的`recipe `就是`"cd subdir && /bin/make"`。如果使用指定的版本的`make`来运行顶层` makefile`，在递归调用时也将执行相同的指定版本。

作为一项特殊功能，在规则的` recipe `中使用` MAKE `变量可以改变`"-t"`（"`--触摸`"）、"`-n`"（"`--打印`"）或"`-q`"（"`--问题`"）选项的效果。使用` MAKE `变量与在` recipe `行开头使用`"+"`字符的效果相同。参见第111 页第9.3 节[代替执行` recipe `]。只有当` MAKE `变量直接出现在` recipe `中时，才会启用此特殊功能：如果`MAKE `变量是通过扩展其他变量引用的，则不适用。在后一种情况下，必须使用`"+"`标记才能获得这些特殊效果。

请看上例中的`"make -t "`命令。(`-t` 选项将目标标记为最新，但并不实际运行任何` recipe `；参见第111 页，第9.3 节[代替执行]）。根据`"-t "`的通常定义，示例中的`"make -t "`命令将创建一个名为子系统的文件，而不做任何其他操作。你真正想让它做的是运行`"cd subdir && make -t"`，但这需要执行` recipe`，而`"-t "`说的是不执行` recipe `。

该功能的特殊之处在于：只要规则的` recipe `行中包含变量` MAKE`，`"-t"`、`"-n "`和`"- q "`标记就不适用于该行。包含` MAKE `的` recipe `行将正常执行，尽管标记的存在会导致大多数` recipe `无法运行。通常的` MAKEFLAGS `机制会将这些标志传递给子运行程序（参见第5.7.3 节[向子运行程序传递选项]，第59 页），因此您触碰文件或打印` recipe `的请求会传递给子运行程序。

### 向`子-make`传递变量

顶级` make `的变量值可以通过环境的明确请求传递给子` make`。这些变量在`子make`中被定义为==默认值==，但它们不会覆盖子` make `使用的` makefile `中定义的变量，除非使用`"-e"`开关（参见第 9.8 节 [选项摘要]，第 114 页）。
要传递或导出变量， `make `会将变量及其值添加到运行 `recipe` 每一行的环境中。反过来，`子 make` 也会使用环境来初始化变量值表。参见第 6.10 节 [来自环境的变量]，第77 页。

除非有明确的要求，否则` make `只能导出初始环境中定义的变量，或在命令行中设置的变量，且变量名只能由*字母、数字和下划线*组成。`make `变量` SHELL `的值不会被导出。相反，调用环境中的` SHELL `变量值会传递给`子 make`。您可以使用` export `指令来强制` make `输出 `SHELL` 变量的值，详情如下。参见第 49 页，第 5.3.2 节 [`选择 Shell`]。

特殊变量` MAKEFLAGS `总是导出的（除非您未导出）。` MAKEFILES`如果您将其设置为任何内容，都会导出。

`make`会自动传递在命令行行中定义的变量的值，请看下一节。

如果变量是由`make`默认创建的，则通常不会导出，`子make`将自行定义这些变量。

如果要将特定变量导出到`子make`中，可使用导出指令，如下所示：  

```makefile
export variable...
```

如果要阻止变量被导出，可以使用` unexport `指令，如下所示：  

```makefile
unexport variable ...
```

在这两种形式中，`export`和`unexport`的参数都是扩展的，因此可以是变量或函数，扩展为要`(un)export`的变量名（列表）。

为了方便起见，您可以在定义变量的同时导出变量：  

```makefile
export variable = value
```

它的结果与下面一样：

```makefile
variable = value
export variable
```

和：

```makefile
export variable := value
```

与下面结果一致：

```makefile
variable := value
export variable
```

另外：

```makefile
export variable += value
```

与下面结果一致：

```makefile
variable += value
export variable
```

参见第 74 页，第 6.6 节 [为变量添加更多文本]。

您可能会注意到， make 中`export`和`unexport`指令的工作方式与` shell sh `中的工作方式相同。

如果希望默认导出所有变量，可以单独使用 `export`：

```makefile
export
```

这就告诉我们，`export`或`unexport`指令中没有明确提及的变量应该被导出。在`unexport`指令中给出的任何变量仍不会被导出  

在旧版本的` GNU make `中， `export `指令本身所引起的行为是默认的。 如果您的`makefile `依赖于这种行为，而您又希望与旧版本的 `make` 兼容，您可以在 `makefile `中添加特殊的` .EXPORT_ALL_VARIABLES `目标，而不是使用` export `指令。旧版本的 make 会忽略这个目标，而 `export` 指令则会导致语法错误。  

当使用` export `本身或` .EXPORT_ALL_VARIABLES `默认导出变量时，只有名称完全由字母数字和下划线组成的变量才会被导出。要导出其他变量，必须在导出指令中特别注明。

将变量值添加到环境中需要对其进行扩展。如果扩展变量会产生副作用（如` info`或` eval `或类似函数），那么每次调用命令时都会看到这些副作用。要避免这种情况，可以确保此类变量的名称在默认情况下不可导出。不过，更好的解决办法是完全不使用 "默认导出"功能，而是明确地按名称导出相关变量。  

你可以单独使用` unexport `来告诉` make `默认不导出变量。由于这是默认行为，只有在` export `本身被使用过的情况下（也许是在包含的` makefile `中），才需要这样做。你不能单独使用` export `和` unexport `来导出某些` recipe `的变量，而不导出其他`recipe `的变量。最后出现的` export` 或` unexport `指令将决定整个 `make `运行的行为。

作为一个特殊功能，变量` MAKELEVEL `在从一个关卡向下传递时会发生变化。该变量的值是一个字符串，是以十进制表示的级别深度。顶层` make `的值为 `"0"`；`子 make`为 `"1"`；`子子 make `为 `"2"`，以此类推。递增发生在 `make `为 `recipe` 设置环境时。

`MAKELEVEL `的主要用途是在条件指令中对其进行测试（参见第 7 章 [Makefile 的条件部分]，第 85 页）；通过这种方法，您可以编写这样的 `makefile`：如果递归运行，会有一种行为，而如果由您直接运行，则会有另一种行为。

您可以使用变量` MAKEFILES `使所有子` make `命令使用额外的` makefile`。` MAKEFILES`的值是一个以空白分隔的文件名列表。如果在外层` makefile `中定义了这个变量， 它就会通过环境向下传递， 并作为额外的` makefile `列表， 供子` make `在读取常规或指定的` makefile `之前读取。参见第 3.4 节 [变量` MAKEFILES`]，第 14 页。

### 向`子-make`传递`option`

诸如"-s "和"-k "之类的标志会通过变量` MAKEFLAGS `自动传递给子 make。这个变量由 make 自动设置，包含 make 收到的标志字母。因此，如果您执行 "make -ks"，那么 MAKEFLAGS 的值就是 "ks"。

因此，每个子 make 都会在其环境中获得 MAKEFLAGS 的值。作为回应，它将从该值中获取标志，并将其作为参数处理。参见第 9.8 节 [选项摘要]，第 114 页。这意味着 与 其 他 环 境 变 量 不 同 ， 环 境 中 指 定 的 MAKEFLAGS 优 先 于 makefile 中 指 定 的MAKEFLAGS。

MAKEFLAGS 的值是一组可能为空的字符，代表不带参数的单字母选项，其后是空格和任何带参数或具有长选项名的选项。如果一个选项既有单字母选项又有长选项，那么单字母选项总是优先。如果命令行中没有单字母选项，则 MAKEFLAGS 的值以空格开头。

同样，命令行中定义的变量也会通过 MAKEFLAGS 传递给子 make。 MAKEFLAGS 值中包含"="的字词会被 make 视为变量定义，就像它们出现在命令行中一样。参见第113 页，第 9.5 节 [覆盖变量]。

选项"-C"、 "-f"、 "-o "和"-W "不会放入 MAKEFLAGS；这些选项不会向下传递。

`-j`选项是一个特例（参见第 5.4 节 [并行执行]，第 51 页）。如果将其设置为某个数值 "N"，并且操作系统支持该选项（大多数 UNIX 系统都 支持，其他系统通常不支持），则父进程和所有子进程将进行通信，以确保它们之间只有 "N "个作业同时运行。请注意任何标记为递归的工作（见第 9.3 节[代替执行 recipe ]，第 111 页）都不计入工作总数（否则，我们可能会有'N'个子制作在运行，而没有空余时间来做真正的工作！）。

如果您的操作系统不支持上述通信，则不会在 MAKEFLAGS 中添加"-j "选项，这样子任务就会以非并行模式运行。如果将"-j "选项传递给子编译器，那么并行运行的工作就会比你要求的多得多。如果给出不带数字参数的"-j "选项，意思是并行运行尽可能多的作业，那么该选项就会被传递下去，因为多个无穷大并不比一个多。

如果不想向下传递其他标志，则必须更改 MAKEFLAGS 的值，例如像这样：  

```makefile
subsystem:
	cd subdir && $(MAKE) MAKEFLAGS=
```

命令行变量定义实际上出现在变量` MAKEOVERRIDES `中，而` MAKEFLAGS `包含对该变量的引用。如果想正常传递标志，但不想传递命令行变量定义，可以将MAKEOVERRIDES 重置为空，就像这样：

```makefile
MAKEOVERRIDES =
```

这样做通常没什么用。不过，有些系统对环境的大小有一个很小的固定限制，如果在`MAKEFLAGS `的值中加入过多信息，可能会超出这个限制。如果出现`"Arg list too long"`（Arg 列表太长）的错误信息，这可能就是问题所在。(为了严格遵守`POSIX.2`，如果`makefile`中出现特殊目标`".POSIX"`，则更改 MAKEOVERRIDES不会影响`MAKEFLAGS`。您可能对此并不关心）。

出于历史兼容性考虑，还有一个类似的变量` MFLAGS`。它的值与` MAKEFLAGS `相同，只是不包含命令行变量定义，而且除非为空，否则总是以连字符开头（MAKEFLAGS只有在选项开头没有单字母版本时才以连字符开头，例如`"--warn-undefinedvariables"`）。 MFLAGS 传统上在递归 make 命令中明确使用，如下所示：

```makefile
subsystem:
	cd subdir && $(MAKE) $(MFLAGS)
```

但现在 MAKEFLAGS 使这种用法变得多余。如果您希望您的 makefile 与旧版的 make程序兼容，请使用这种方法；它也能在更现代的 make 版本中正常工作。

如果您希望在每次运行 make 时设置某些选项，例如"-k"（参见第9.8 节[选项摘要]，第114 页），那么 MAKEFLAGS 变量也很有用。只需在环境中为 MAKEFLAGS 赋值即可。您也可以在 makefile 中设置 MAKEFLAGS，以指定对该 makefile 同样有效的其他标志。(请注意，您不能以这种方式使用 MFLAGS。设置该变量只是为了兼容； make 不会以任何方式解释你为它设置的值）。

当 make 解释 MAKEFLAGS 的值（无论是来自环境还是来自 makefile）时，如果该值不是以连字号开头，它首先会在前面加上一个连字号。然后，它会把值分割成以空格分隔的单词，并把这些单词当作命令行中的选项进行解析（除了"-C"、"-f"、"-h"、"-o"、"-W "和它们的长名称版本会被忽略，而且不会因为选项无效而出错）。

如果你确实在环境中加入了 MAKEFLAGS，你应该确保不要加入任何会严重影响make 的操作、破坏 make-文件和 make 本身的目的的选项。例如，"-t"、"-n "和"-q"选项，如果放在这些变量中，可能会产生灾难性的后果，至少会令人吃惊，甚至可能令人讨厌。

如果除了 GNU make 之外，您还想运行其它的 make 实现，因而不想在MAKEFLAGS 变量中添加 GNU make 特有的标志，可以将它们添加到 GNUMAKEFLAGS变量中。这个变量会在 MAKEFLAGS 之前被解析，解析方式与 MAKEFLAGS 相同。当make 构造 MAKEFLAGS 以传递给递归 make 时，它将包含所有的标志，甚至包括那些从 GNUMAKEFLAGS 中获取的标志。因此，在解析 GNUMAKEFLAGS 之后， GNU make 会将此变量设置为空字符串，以避免在递归过程中重复标志。

GNUMAKEFLAGS 最好只用于那些不会对 makefile 的行为造成实质性改变的标志。如果您的 Makefile 需要 GNU Make ，那么只需使用 MAKEFLAGS 即可。诸如"--no-printdirectory "或"--output-sync "之类的标志可能适合 GNUMAKEFLAGS。

### `‘--print-directory’   `选项

如果使用多级递归 make 调用， "-w "或"--print-directory "选项可以在 make 开始 处 理 和 结 束 处 理 时 显 示 每 个 目 录 ， 从 而 使 输 出 更 容 易 理 解 。 例 如 ， 如 果 在/u/gnu/make 目录下运行 "make -w"， make 会打印出一行如下的内容：

```makefile
make: Entering directory ‘/u/gnu/make’.
```

在做任何其他事情之前，并输入一行内容：  

```makefile
make: Leaving directory ‘/u/gnu/make’.
```

当处理完成时。  

通常情况下，您不需要指定这个选项，因为 "make "会帮您指定：如果同时使用"- s"（表示保持沉默）或使用"--no-print-directory "明确禁用"-w"，则 make 不会自动打开"-w"。  

### 定义预制的Recipes  

当同一命令序列在制作不同目标时都有用时，可以使用定义指令将其定义为预制序列，并在这些目标的 recipe 中引用预制序列。预制序列实际上是一个变量，因此名称不能与其他变量名冲突。

下面是一个定义预制recipe的例子：  

```makefile
define run-yacc =
yacc $(firstword $^)
mv y.tab.c $@
endef
```

在这里， `run-yacc `是被定义变量的名称；` endef `标志着定义的结束；中间的几行是命令。定义指令不会扩展变量引用和函数调用的预制序列；` "$"`字符即括号、变量名等都会成为定义变量值的一部分。有关` define `的完整解释，请参见第 76 页的第 6.8 节 [定义多行变量]。  

本例中的第一条命令是在使用预制序列的规则的第一个依赖上运行` Yacc`。 `Yacc`的输出文件名总是 `y.tab.c`。第二条命令将输出移至规则的目标文件名。  

要使用预制序列，请将变量替换到规则的` recipe `中。你可以像替换其他变量一样替换它（参见第 6.1 节 [变量引用的基础知识]，第 65 页）。因为定义的变量是递归扩展变量，所以你在定义中写入的所有变量引用都会被扩展。例如：

```makefile
foo.c : foo.y
	$(run-yacc)
```

当变量`"$^"`出现在` run-yacc `的值中时， `"foo.y"`将被替换为变量`"$^"`，而 `"foo.c "`将被替换为变量`"$@"`。  

这是一个现实的例子，但在实践中并不需要这个特殊的例子，因为 make 有一个隐含的规则，可以根据涉及的文件名找出这些命令（参见第 10 章 [使用隐含规则]，第121 页）。

在执行 recipe 时， canned 序列中的每一行都会被视为单独出现在规则中，并在前面加上制表符。特别是， make 会为每一行调用一个单独的子shell。您可以在预制序列的每一行中使用影响命令行的特殊前缀字符（'@'、 '-'和'+'）。请参见第 45 页，第 5章 [在规则中编写 recipe ]。例如，使用以下预制序列：

```makefile
define frobnicate =
@echo "frobnicating target $@"
frob-step-1 $< -o $@-step-1
frob-step-2 $@-step-1 -o $@
endef
```

`make `不会回显第一行，即` echo `命令。但它会呼应下面两行` recipe `。  

另一方面，菜谱行中指向罐头序列的前缀字符适用于序列中的每一行。因此，规则：

```makefile
frob.out: frob.in
	@$(frobnicate)
```

不会回显任何 recipe 行。 (有关"@"的详细解释，请参见第 47 页第 5.2 节 [ recipe 回声]）。

## 使用空`recipe`

有时，定义什么都不做的 recipe 也很有用。方法很简单，只需给出一个只包含空白，比如：

```makefile
target: ;
```

为目标定义了一个空 recipe 。您也可以使用以 recipe 前缀字符开头的一行来定义空 recipe ，但这会造成混乱，因为这样的一行看起来是空的。  

你可能想知道为什么要定义一个什么都不做的 recipe 。其中一个有用的原因是防止目标获得隐式 recipe （来自隐式规则或 .DEFAULT 特殊目标；参见第 10 章 [隐式规则]，第 121 页，以及第 10.6 节 [定义最后的默认规则]，第 135 页）。

空 recipe 还可用于避免因另一个 recipe 的副作用而创建的目标出现错误：如果目标不存在，空 recipe 可确保 make 不会抱怨它不知道如何构建目标，并且 make 会认为目标已经过时。

您可能倾向于为并非实际文件的目标定义空 recipe ，这样做只是为了重制其依赖。但这并不是最好的方法，因为如果目标文件确实存在，依赖可能无法正确重制。请参阅第 31 页第 4.5 节 [伪目标]，了解更好的方法。

# 6 变量的使用

变量是在` makefile `中定义的名称，代表一串文本，称为变量值。这些值通过明确的请求被替换到目标、依赖、` recipe `和` makefile `的其他部分。 (在其他一些 make 版本中，变量被称为宏）。

除 了 recipe 、使用`"="`的变量定义的右侧以及使用 define 指令的变量定义的主体之外， makefile 所有部分的变量和函数在读取时都会展开。变量展开时的值是其最新定义的值。换句话说，变量的作用域是动态的。

变量可以代表文件名列表、传递给编译器的选项、运行的程序、查找源文件的目录、写入输出的目录，或者其他任何你能想象到的内容。  

变量名可以是任何不包含`":"、 "#"、 "="`或空格的字符序列。但是，变量名如果包含字母、数字和下划线以外的字符，则应慎重考虑，因为在某些 shell 中，这些字符无法通过环境传递给子编译器（参见第 5.7.2 节 [向子编译器传递变量]，第 57 页）。以". "和大写字母开头的变量名可能会在未来的` make `版本中被赋予特殊含义。

变量名区分大小写。 `"foo"`、`"FOO "`和`"Foo "`都指代不同的变量。  

在变量名中使用大写字母是传统的做法，但我们建议对用于`makefile`内部目的的变量名使用小写字母，而对控制隐含规则的参数或用户应使用命令选项覆盖的参数保留大写字母（参见第 9.5 节 [覆盖变量]，第 113 页）。  

少数变量的名称只有一个标点符号或几个字符。这些就是自动变量，它们有特殊的用途。参见第 10.5.3 节 [自动变量]，第 130 页  。

## 变量引用基础知识  

要替换一个变量的值，在括号或大括号中写入一个美元符号，然后写入变量名： `"$(foo) "`或`"${foo}"`都是对变量` foo `的有效引用。由于`"$"`的特殊意义，所以必须写`"$$"`才能在文件名或` recipe `中产生单个美元符号的效果。  

变量引用可以在任何情况下使用：目标、依赖、`recipe`、大多数指令和新变量值。下面是一个常见的例子，一个变量包含了程序中所有对象文件的名称：

```makefile
objects = program.o foo.o utils.o
program : $(objects)
	cc -o program $(objects)
$(objects) : defs.h
```

变量引用是通过严格的文本替换来实现的。 因此， 规则：

```makefile
foo = c
prog.o : prog.$(foo)
	$(foo)$(foo) -$(foo) prog.$(foo)
```

由于变量赋值时会忽略变量值前的空格，因此 foo 的值正是 `"c"`。 (实际上，不要这样编写你的`makefile`！）。  

美元符号后跟一个除美元符号、开括弧或开括号以外的字符，该字符将作为变量名。因此，可以用`"$x"`来引用变量` x`。不过，这种做法可能会导致混淆（例如， `"$foo "`指的是变量` f `后面的字符串` oo`），因此我们建议在所有变量周围使用括号或大括号，即使是单字母变量也不例外，除非省略括号或大括号能显著提高可读性。自动变量（参见第 10.5.3 节 [自动变量]，第 130 页）的可读性通常会得到改善。

## 变量的两种特性

### 递归扩展变量赋值  

第一种变量是递归扩展变量。这种变量由使用`"="`的行定义（参见第 6.5 节 [设置变量] ，第 72 页），或由 define 指令定义（参见第 6.8 节 [定义多行变量]，第 76 页）。您指定的值将被逐字安装；如果它包含对其他变量的引用，则在该变量被替换时（在扩展其他字符串的过程中），这些引用将被扩展。这种情况称为递归扩展。

例如：

```makefile
foo = $(bar)
bar = $(ugh)
ugh = Huh?

all:;echo $(foo)
```

将回显`‘Huh?’: ‘$(foo)’`扩展为`‘$(bar)’`  ，再扩展为`'$(ugh)'`，最后扩展为`‘Huh?’  `。

大多数其他版本的` make `都只支持这种变量排序。它有优点也有缺点。优点（大多数人认为）是：  

```makefile
CFLAGS = $(include_dirs) -O
include_dirs = -Ifoo -Ibar
```

将实现原意：当 `"CFLAGS "`在` recipe `中展开时，它将展开为`"-Ifoo -Ibar-O'`。其主要缺点是不能在变量末尾添加内容，如：

```makefile
CFLAGS = $(CFLAGS) -O
```

因为它会导致变量扩展的无限循环。 (实际上，`make `会检测到无限循环并报错）。另一个缺点是，定义中引用的任何函数（参见第 8 章 [转换文本的函数]，第 91 页）在每次展开变量时都会被执行。这使得运行速度变慢；更糟糕的是，它会导致**通配符**和**shell 函数**产生不可预知的结果， 因为你无法轻易控制它们何时被调用，甚至是被调用多少次。

### 简单扩展变量赋值  

为了避免递归扩展变量带来的问题和不便，还有另一种方法：简单扩展变量。  

简单的扩展变量是由使用` ':=' `或` '::=' `的行来定义的（参见第 6.5 节 [设置变量]，第72 页）。这两种形式在` GNU make `中是等价的，但` POSIX `标准只描述了`'::='`形式（ `POSIX` 第 8 期的 `POSIX` 标准增加了对`'::='`的支持）。  

在定义简单扩展变量时，会对变量值进行一次扫描，并扩展任何对其他变量和函数的引用。扩充完成后，变量值将不再被扩充：当变量被使用时，其值将被逐字复制为扩充后的值。如果变量值包含变量引用， 则扩展结果将包含定义变量时的变量值。因此：

```makefile
x := foo
y := $(x) bar
x := later
```

等同于：

```makefile
y := foo bar
x := later
```

下面是一个更复杂的示例，说明如何将":="与 shell 函数结合使用（参见第 8.14节 [shell 函数]，第 107 页）。 (参见第 8.14 节 [shell 函数]，第 107 页。）这个示例还显示了变量 MAKELEVEL 的使用，当它从一级向下传递时，它将发生变化。 (有关MAKELEVEL 的信息请参见第 57 页第 5.7.2 节 [向子 make 传递变量]）。

```makefile
ifeq (0,${MAKELEVEL})
whoami := $(shell whoami)
host-type := $(shell arch)
MAKE := ${MAKE} host-type=${host-type} whoami=${whoami}
endif
```

这样使用":="的好处是，一个典型的 "进入目录 " recipe 看起来就像这样：

```makefile
${subdirs}:
	${MAKE} -C $@ all
```

简单的扩展变量通常可以使复杂的 makefile 编程变得更加容易，因为它们的工作方式与大多数编程语言中的变量类似。 它们允许你使用变量自身的值（或由某个扩展函数以某种方式处理过的值） 重新定义变量， 并更有效地使用扩展函数（参见第 8 章 [转换文本的函数]， 第 91 页） 。

您还可以使用它们在变量值中引入受控的前导空白。 在替换变量引用和函数调用之前， 输入中的前导空白字符会被丢弃； 这意味着你可以在变量值中加入前导空格， 通过变量引用来保护它们， 就像下面这样：  

```makefile
nullstring :=
space := $(nullstring) # end of the line
```

在这里， 变量空格的值正好是一个空格。 这里加入 "# 行尾 "注释只是为了清晰起见。 由于尾部空格字符不会从变量值中删除， 因此在行尾只留一个空格也会产生同样的效果（但却很难阅读） 。 如果在变 量 值 的末尾加上空格， 最好在行尾加上这样的注释， 以明确自己的意图。 相反， 如果你不想在变量值的末尾添加任何空白字符， 就一定要记住不要在一些空白字符之后的行尾随意添加注释， 比如这样的注释：

```makefile
dir := /foo/bar # directory to put the frobs in
```

在这里， 变量`dir`的值是`"/foo/bar"`（后面有四个空格） ， 这可能不是我们的本意。 (想象一下`"$(dir)/file "`这样的定义吧！ ） 。  

### 立即扩展变量分配  

另一种赋值形式允许立即展开， 但与简单赋值不同的是， 由此产生的变量是递归的：每次使用时都会再次展开。 为了避免出现意想不到的结果， 在值被立即展开后， 将自动加上引号： 展开后值中的所有 $ 实例都将转换为 $$。 这类赋值使用操作符":::="。

例如：

```makefile
var = first
OUT :::= $(var)
var = second
```

会导致` OUT `变量包含文本 `"first"`， 而这里：

```makefile
var = one$$two
OUT :::= $(var)
var = three$$four
```

结果是` OUT `变量包含文本` "one$$two"`。 该值在变量赋值时被展开， 因此结果是` var`的第一个值 `"one$$two"`被展开； 然后该值在赋值完成前被重新转义， 得到最终结果`"one$$two"`。  

此后， 变量 OUT 被视为递归变量， 因此在使用时会重新展开。  

这在功能上似乎等同于`":="/"::="`操作符， 但也有一些不同之处：  

首先， 赋值后的变量是一个普通的递归变量； 当你用`'+='`对其进行追加时， 右侧的值不会立即展开。 如果希望`"+="`操作符立即展开右侧的值， 则应使用`":="/"::="`赋值  

其次， 这些变量的效率略低于简单的扩展变量， 因为它们在使用时需要重新扩展，而不仅仅是复制。 不过， 由于所有变量引用都是转义的， 因此这种扩展只是取消转义值， 不会扩展任何变量或运行任何函数。  

下面是另一个例子：  

```makefile
var = one$$two
OUT :::= $(var)
OUT += $(var)
var = three$$four
```

之后，`OUT`的值就是文本`"one$$two $(var)"`。 使用该变量时， 它将被展开， 结果将是`"one$two three$four"`。  

这种赋值方式等同于传统的` BSD make ':=' `操作符； 正如你所看到的， 它的工作方式与` GNU make ':=' `操作符略有不同。 `POSIX `规范在第 8 期中加入了` :::= `操作符，以提供可移植性。

### 条件变量赋值  

还有一种变量赋值操作符， 即"?="。 这被称为条件变量赋值运算符， 因为它只有在变量尚未定义的情况下才有效。 这条语句：

```makefile
FOO ?= bar
```

与此完全等价（参见第 8.11 节 [原点函数]， 第 104 页） ：  

```makefile
ifeq ($(origin FOO), undefined)
FOO = bar
endif
```

请注意， 被设置为空值的变量仍被定义， 因此`'?='`不会设置该变量。  

## 变量引用的高级功能  

本节将介绍一些高级功能， 你可以用它们以更灵活的方式引用变量。  

### 替换参考  

**替换引用**是用您指定的改动来替换变量的值。 它的形式为`"$(var:a=b)"`（ 或`"${var:a=b}"`） ， 其含义是获取变量` var `的值， 将单词末尾的每个` a `替换为该值中的` b`， 然后替换出字符串。  

当我们说 "在单词末尾 "时， 我们的意思是 a 必须出现在空格后或值的末尾才能被替换； 值中出现的其他 a 不会被更改。 例如：

```makefile
foo := a.o b.o l.a c.o
bar := $(foo:.o=.c)
```

将` "bar "`设置为` "a.c b.c l.a c.c"`。 参见第 72 页第 6.5 节 [设置变量]。

替换引用是` patsubst `扩展函数的简称（参见第8.2 节[用于字符串替换和分析的函数]，第92 页）：`$(var:a=b)'`是相当于`"$(patsubst %a,%b,var)"`。我们提供替换引用以及`patsubst `以与` make `的其他实现兼容。

另一种替换引用可以让你充分发挥` patsubst `函数的威力。它的形式与上述`"$(var:a=b)"`相同，只是现在` a `必须包含一个`"%"`字符。这种情况等同于`'$(patsubst a,b,$(var))'`。关于` patsubst `函数的说明，请参见第92 页第8.2 节[用于字符串替换和分析的函数]。例如：

```makefile
foo := a.o b.o l.a c.o
bar := $(foo:%.o=%.c)
```

将`"bar "`设置为` "a.c b.c l.a c.c"`。  

### 计算变量名  

计算变量名是一个高级概念， 在更复杂的制作文件编程中非常有用。 在简单的情况下， 你不需要考虑它们， 但它们可能非常有用。  

变量可以在变量名内部引用。 这称为计算变量名或嵌套变量引用。 例如：

```makefile
x = y
y = z
a := $($(x))
```

将` a `定义为`'z'`：` '$($(x))'`中的`'$(x)'`扩展为`'y'`， 因此`'$($(x))'`扩展为`'$(y)'`， 进而扩展为`'z'`。 这里没有明确说明要引用的变量名， 而是通过扩展`'$(x)'`计算得出。 这里的引用`"$(x) "`嵌套在外部变量引用中。  

前面的示例显示了两级嵌套， 但任何级数都是可能的。  

例如， 这里有三个级别：  

```makefile
x = y
y = z
z = u
a := $($($(x)))
```

在这里，最内层的`"$(x) "`扩展为` "y"`，因此`"$($(x)) "`扩展为`"$(y)"`， `"$(y) "`又扩展为`"z"`；现在我们有了`"$(z)"`，它变成了` "u"`。  

变量名中对递归展开变量的引用将按常规方式重新展开。 例如：

```makefile
x = $(y)
y = z
z = Hello
a := $($(x))
```

将 a 定义为` "Hello"`：` "$($(x)) "`变为`"$($(y))"`，然后变为`"$(z)"`，最后变为` "Hello"`。  

嵌套变量引用也可以包含修改引用和函数调用（参见第 8 章 [转换文本的函数]， 第91 页），就像其他引用一样。  

例如， 使用` subst `函数（参见第 8.2 节 [用于字符串替换和分析的函数]， 第 92 页）：

```makefile
x = variable1
variable2 := Hello
y = $(subst 1,2,$(x))
z = y
a := $($($(z)))
```

最终将 a 定义为` "Hello"`。 虽然没有人会想写出像这样错综复杂的嵌套引用， 但它确实有效：` "$($($(z))) "`扩展为`"$($(y))"`， 然后变成`"$($(subst 1,2,$(x)))"`。 这样就从` x `中获取了值` "variable1"`， 并通过替换将其改为` "variable2"`， 这样整个字符串就变成了`"$(variable2)"`， 一个简单的变量引用， 其值为` "Hello"`。  

计算变量名不一定完全由一个变量引用组成。 它可以包含多个变量引用以及一些不变文本。 例如：

```makefile
a_dirs := dira dirb
1_dirs := dir1 dir2

a_files := filea fileb
1_files := file1 file2

ifeq "$(use_a)" "yes"
a1 := a
else
a1 := 1
endif

ifeq "$(use_dirs)" "yes"
df := dirs
else
df := files
endif

dirs := $($(a1)_$(df))
```

将根据` use_a `和` use_dirs `的设置， 赋予` dirs `与 `a_dirs`、 `1_dirs`、` a_files `或`1_files`相同的值。  

计算出的变量名也可用于替换引用：  

```makefile
a_objects := a.o b.o c.o
1_objects := 1.o 2.o 3.o
```

来源` := $($(a1)_objects:.o=.c)  `

根据` a1 `的值，将数据源定义为` "a.c b.c c.c "`或` "1.c 2.c 3.c"`。  

使用嵌套变量引用的唯一限制是， 它们不能指定要调用的函数名称的一部分。 这是因为在对嵌套引用进行扩展之前， 要对识别的函数名称进行测试。 例如：

```makefile
ifdef do_sort
func := sort
else
func := strip
endif

bar := a d b g q c

foo := $($(func) $(bar))
```

试图将变量` "sort a d b g q c "`或` "strip a d b g q c "`的值赋予` "foo"`，而不是将`"a d b g q c "`作为` sort `或` strip `函数的参数。如果这种改变被证明是一个好主意，那么这种限制可以在将来取消。

您也可以在变量赋值的左侧或定义指令中使用计算变量名， 例如：

```makefile
dir = foo
$(dir)_sources := $(wildcard $(dir)/*.c)
define $(dir)_print =
lpr $($(dir)_sources)
endef
```

本例定义了变量` "dir"`、` "foo_sources "`和` "foo_print"`。  

请注意， 嵌套变量引用与递归扩展变量有很大不同（参见第 6.2 节 [变量的两种类型]， 第 66 页） ， 不过在进行` makefile `编程时， 两者都会以复杂的方式一起使用。  

## 变量如何取值  

变量可以通过几种不同的方式获取值：  

+ 您可以在运行 make 时指定一个覆盖值。 参见第 113 页， 第 9.5 节 [覆盖变量]。
+ 您可以通过赋值（参见第 6.5 节 [设置变量]， 第 72 页） 或逐字定义（参见第 6.8节 [定义多行变量]， 第 76 页） 在 makefile 中指定一个值。
+ 您可以使用 let 函数（参见第 98 页， 第 8.5 节 [Let 函数]） 或 foreach 函数（参见第 99 页， 第 8.6 节 [Foreach 函数]） 指定一个短时值。
+ 环境中的变量将成为 make 变量。 参见第 77 页， 第 6.10 节 [来自环境的变量]。
+ 每条规则都有几个自动变量被赋予新值。 每个自动变量都有一个常规用途。 参见第 10.5.3 节 [自动变量]， 第 130 页。
+ 有几个变量的初始值是恒定的。 参见第 125 页， 第 10.3 节 [隐式规则使用的变量]。

## 设置变量  

要在`makefile`中设置变量， 请写一行以变量名开头的文字， 后面跟一个赋值操作符`"="、 ":="、 "::="或"::="`。 运算符后面的内容和该行的首行空白都将成为变量值。 例如：

```makefile
objects = main.o foo.o bar.o utils.o
```

定义了一个名为` objects `的变量，其值为`"main.o foo.o bar.o utils.o"`。变量名周围和`"="`后面的空白将被忽略。

用`'='`定义的变量是递归扩展变量。用`':='`或`'::='`定义的变量是简单展开的变量；这些定义可以包含变量引用，这些引用将在定义之前展开。用`'::='`定义的变量是立即展开的变量。参见第6.2 节[变量的两种类型]，第66 页，对不同赋值操作符的描述。

变量名可能包含函数和变量引用，读取该行时会展开这些引用，以找到要使用的实际变量名。

除了计算机内存容量外，变量值的长度没有限制。为了便于阅读，可以将变量值分割成多行（参见第3.1.1 节[分割长行]，第12 页）。

如果从未设置过变量名，大多数变量名的值都是空字符串。有几个变量的内置初始值不是空值，但可以用常规方法设置（参见第10.3 节[隐式规则使用的变量]，第125 页）。有几个特殊变量在每条规则中都会自动设置为新值，这些变量称为自动变量（参见第10.5.3 节[自动变量]，第130 页）。

如果你希望一个变量只有在尚未被设置的情况下才被设置为一个值，那么你可以使用速记运算符`"?="`来代替`"="`。变量`'FOO'`的这两种设置是相同的（参见第8.11 节[`origin `函数]，第104 页）：

```makefile
FOO ?= bar
```

和：

```makefile
ifeq ($(origin FOO), undefined)
FOO = bar
endif
```

shell 赋值操作符"！ ="可用于执行 shell 脚本并将变量设置为其输出。 该操作符首先对右侧进行求值， 然后将结果传递给 shell 执行。 如果执行结果以换行结束， 则删除该换行； 所有其他换行均由空格替换。 然后将结果字符串放入指定的递归扩展变量中。例如：

```makefile
hash != printf ’\043’
file_list != find . -name ’*.c’
```

如果执行的结果可能产生` $`， 而你又不希望后面的内容被解释为 make 变量或函数引用， 那么你就必须在执行过程中用` $$ `替换每个` $`。 另外， 你也可以将一个简单扩展的变量设置为使用` shell `函数调用运行程序的结果。参见第 107 页， 第 8.14 节[shell 函数]。 例如：

```makefile
hash := $(shell printf ’\043’)
var := $(shell find . -name "*.c")
```

与` shell `函数一样， 刚刚调用的` shell `脚本的退出状态也存储在 `.SHELLSTATUS `变量中。

## 为变量添加更多文本  

通常， 在已定义的变量值上添加更多文字是很有用的。 您可以使用包含 "+="的一行来实现这一目的， 如下所示：

```makefile
objects += another.o
```

这会获取变量 objects 的值， 并在其中添加文本 "another.o"（如果已经有值， 则在前面加上一个空格） 。 因此：

```makefile
objects = main.o foo.o bar.o utils.o
objects += another.o
```

将对象设置为` "main.o foo.o bar.o utils.o another.o"`。  

使用 `"+="`类似于：

```makefile
objects = main.o foo.o bar.o utils.o
objects := $(objects) another.o
```

但在使用更复杂的数值时，它们的不同之处就变得很重要了。

如果变量之前没有定义过，`"+="`的作用就像普通的`"="`：定义一个递归扩展的变量。但是，如果之前定义过变量，`"+="`的具体作用取决于你最初定义的是哪种变量。关于两种变量的解释，请参见第66 页第6.2 节[变量的两种类型]。

使用 "+="添加变量值时， 就好像在变量的初始定义中包含了额外的文本一样。 如果你先用":="或"::="定义了变量， 使其成为一个简单展开的变量， 那么 "+="就会添加到这个简单展开的定义中， 并在将新文本追加到旧值之前将其展开， 就像":="所做的那样（关于":="或"::="的详细解释， 请参见第 72 页的第 6.5 节 [设置变量]） 。 事实上：

```makefile
variable := value
variable += more
```

完全等同于：

```makefile
variable := value
variable := $(variable) more
```

另一方面， 在使用 "+="时， 如果您首先定义了一个变量， 并使用普通"="或"::="进行递归扩展， 那么无论该 变量的值是什么， make 都会将未扩展的文本附加到现有值上。 这意味着：

```makefile
variable = value
variable += more
```

大致相当于：

```makefile
temp = value
variable = $(temp) more
```

当然， 它从未定义过名为 temp 的变量。 当变量的旧值包含变量引用时， 这一点就非常重要了。 举个常见的例子：

```makefile
CFLAGS = $(includes) -O
...
CFLAGS += -pg # enable profiling
```

第一行定义了` CFLAGS `变量， 并引用了另一个变量` includes`。 (`CFLAGS `用于` C `语言编译规则； 参见第 10.2 节 [内置编译器目录]。 第 122 页） 。 使用`"="`定义使` CFLAGS `成为一个递归扩展变量， 这意味着在`make` 处理 `CFLAGS` 的定义时，` "$(includes) -O "`不会被扩展。 因此， `"include"`变量的值不需要定义就能生效。 它只需要在引用` CFLAGS `之前定义即可。 如果我们不使用`"+="`而直接追加` CFLAGS `的值， 我们可能会这样做：

```makefile
CFLAGS := $(CFLAGS) -pg # enable profiling
```

这很接近， 但并不完全符合我们的要求。 使用`":="`会将` CFLAGS `重新定义为一个简单展开的变量； 这意味着` make `在设置变量之前会展开文本`"$(CFLAGS) -pg"`。 如果还没有定义` includes`， 我们就会得到`'-O -pg'`， 以后再定义` includes` 将不会有任何效果。 相反， 通过使用` "+="`， 我们将` CFLAGS `设置为未扩展的值`"$(includes) -O - pg"`。 这样， 我们就保留了对` includes `的引用， 因此如果以后定义了该变量， 像`"$(CFLAGS) "`这样的引用仍然会使用它的值。  

## 覆盖指令  

如果变量是通过命令参数设置的（ 参见第 9.5 节 [覆盖变量]， 第 113 页） ， 那么makefile 中的普通赋值将被忽略。 如果想在` makefile `中设置变量， 即使它是通过命令参数设置的， 可以使用`override  `指令， 也就是类似下面这样的一行：

```makefile
override variable = value
```

或者：

```makefile
override variable := value
```

要在命令行定义的变量中添加更多文本， 请使用：

```makefile
override variable += more text
```

参见第 74 页， 第 6.6 节 [为变量添加更多文本]。

标有`override`标志的变量赋值优先级高于其他所有赋值， 另一个覆盖标志除外。 该变量的后续赋值或追加如果没有标记`override`， 将被忽略。  

`override`指令的发明并不是为了让` Makefile `和命令参数之间的战争升级。 它的发明是为了改变和增加用户通过命令参数指定的值。  

例如， 假设您在运行 C 编译器时总是希望使用"-g "开关， 但又希望允许用户像往常一样使用命令参数指定其他开关。 你可以使用这条`override`指令：

```makefile
override CFLAGS += -g
```

您还可以将覆盖指令与定义指令一起使用。 正如您所期望的那样：  

```makefile
override define foo =
bar
endef
```

有关定义的信息， 请参阅下一节。  

## 定义多行变量  

另一种设置变量值的方法是使用定义指令。该指令的语法与众不同，它允许在变量值中包含换行符，这既方便定义命令的预制序列（参见第 5.8 节 [定义预制 recipe ]，第61页），也方便定义 makefile 的语法部分，以便与 eval 配合使用（参见第 8.10节[Eval 函数]，第 103 页）。

在定义指令的同一行中，紧跟着被定义变量的名称和赋值操作符（可选），仅此而已。变量的赋值出现在下面几行。变量值的结束标记为一行仅包含 endef 字样。

除了语法上的差异， define 的工作方式与其他变量定义一样。变量名可能包含函数和变量引用，在读取指令时，这些引用将被展开，以找到要使用的实际变量名。

`endef `之前的最后一个换行符不包含在值中；如果希望值包含尾部换行符，则必须包含一个空行。例如，要定义一个包含换行符的变量，必须使用两个空行，而不是一个空行：

```makefile
define newline


endef
```

如果愿意，可以省略变量赋值操作符。如果省略，` make `会将其假定为`"="`，并创建一个递归扩展变量（参见第 66 页，第 6.2 节 [变量的两种类型]）。当使用 `"+="`操作符时，变量值会像其他追加操作一样追加到前一个变量值上：新旧变量值之间用一个空格隔开。

你可以嵌套定义指令： make 会跟踪嵌套的指令，如果它们没有全部用 endef 适当关闭，则会报错。请注意，以 recipe 前缀字符开头的行被视为 recipe 的一部分，因此在这样的行中出现的任何 define 或 endef 字符串都不会被视为 make 指令。  

```makefile
define two-lines
echo foo
echo $(bar)
endef
```

在 recipe 中使用时，前面的示例在功能上等同于此：  

```makefile
two-lines = echo foo; echo $(bar)
```

因为用分号分隔的两条命令就像两条独立的 shell 命令。不过请注意，使用两行独立命令意味着 make 将调用两次 shell，每行运行一个独立的子 shell。参见第 48 页，第 5.3节 [ recipe 执行]。

如果希望使用 define 进行的变量定义优先于命令行变量定义，可以将覆盖指令与define 一起使用：  

```makefile
override define two-lines =
foo
$(bar)
endef
```

参见第 75 页第 6.7 节 [覆盖指令]。  

## 取消定义变量

如果要清除一个变量，通常将其值设置为空就足够了。无论是否设置，展开这样的变量都会得到相同的结果（空字符串）。但是，如果使用 flavor（参见第 8.12 节[Flavor 函数]，第 105 页）和 origin（参见第 8.11 节 [Origin 函数]，第 104 页）函数， 从未被设置的变量和空值变量是有区别的。 在这种情况下， 你可能需要使用undefine 指令使变量看起来好像从未被设置过。例如：

```makefile
foo := foo
bar = bar
undefine foo
undefine bar
$(info $(origin foo))
$(info $(flavor bar))
```

 本例将为这两个变量打印 `"undefine"`。  

如果要取消命令行变量定义，可以使用覆盖指令与` undefine `指令一起使用，与变量定义的方法类似：

```makefile
override undefine CFLAGS
```

## 环境变量  

`make`中的变量可以来自运行`make`的环境。 `make`启动时看到的每个环境变量，都会转换成具有相同名称和值的` make `变量。不过，如果在` makefile `或命令参数中明确赋值，则会覆盖环境变量。(如果指定了`"-e "`标志，则环境中的值会覆盖` makefile `中的赋值。参见第9.8 节[选项摘要]，第114 页。但不建议这样做）。

因此，通过在环境中设置` CFLAGS `变量，您可以使大多数` makefile` 中的所有` C`语言编译器使用您喜欢的编译器开关。这对于具有标准或常规含义的变量是安全的，因为您知道没有` makefile `会将它们用于其他用途。(注意这并不完全可靠；有些makefile 会显式地设置` CFLAGS`，因此不会受到环境值的影响）。

`make `运行` recipe `时， `makefile `中定义的一些变量会被置入 `make` 调用的每条命令的环境中。默认情况下，只有来自` make `环境或在命令行中设置的变量才会被放到命令的环境中。你可以使用` export `指令传递其他变量。详见第57 页第5.7.2 节[向子`make`传递变量]

不建议使用其他环境变量。` Makefile `的运行依赖于其控制之外的环境变量是不明智的，因为这会导致不同的用户从同一个` makefile `中得到不同的结果。这违背了大多数`makefile`的初衷。

`SHELL`环境变量通常用于指定用户选择的交互式` shell`。因此， `make`会以一种特殊的方式来处理`SHELL`环境变量；参见第49 页，第5.3.2 节[选择 shell]。

## 目标特定变量值

`make`中的变量值通常是全局的，也就是说，无论在何处求值，变量值都是相同的（当然，除非重置变量值）。用`let`函数（参见第8.5 节[Let 函数]，第98 页）或`foreach`函数（参见第8.6 节[`Foreach`函数]，第99 页）定义的变量以及自动变量（参见第10.5.3 节[自动变量]，第130 页）是例外。

另一个例外是特定于目标的变量值。此功能允许您根据`make`正在构建的目标，为同一变量定义不同的值。与自动变量一样，这些值只能在目标的`recipe`中使用（以及在其他特定目标的分配中使用）。

像这样设置目标变量值：

```makefile
target ... : variable-assignment
```

特定于目标的变量赋值可以使用`export、 unexport、 override 或 private`作为前缀；这些变量赋值只对该变量实例应用其正常行为。

多个目标值可分别为目标列表中的每个成员创建一个特定于目标的变量值。

变量赋值可以是任何有效的赋值形式：**`递归赋值（'='）`**、**`简单赋值（':='或'::='）`**、**`直接赋值（'::='）`**、**`附加赋值（'+='）`**或**`条件赋值（'?='）`**。在变量赋值中出现的所有变量都将在目标上下文中进行评估：因此，任何先前定义的特定于目标的变量值都将生效。请注意，该变量实际上不同于任何 `"global"`值：这 两个变量不必具有相同的性质（递归与简单）。

目标变量的优先级与其他 makefile 变量相同。命令行中提供的变量（如果使用"-e "选项，则环境中的变量）优先。指定覆盖指令后，特定目标变量的值将优先。

目标特定变量还有一个特点：当你定义了一个目标特定变量后，该变量值也会对该目标的所有依赖及其依赖等生效（除非这些依赖用它们自己的目标特定变量值覆盖了该变量）。因此，举例来说，这样的语句：

```makefile
prog : CFLAGS = -g
prog : prog.o foo.o bar.o
```

会在 prog 的 recipe 中将 CFLAGS 设置为"-g"，但同时也会在创建 prog.o、 foo.o和bar.o 的 recipe 以及创建其依赖的任何 recipe 中将 CFLAGS 设置为"-g"。  

请注意，每次调用 make 时，给定的依赖最 多 只能编译一次。如果同一文件是多个目标的依赖，而每个目标的特定于目标的变量都有不同的值，那么第一个要编译的目标将是将导致构建该依赖，并且该依赖将继承第一个目标的特定目标值。它将忽略其他目标的特定目标值。  

## 特定模式的变量值  

除了目标变量值（参见第 6.11 节 [目标变量值]，第 78 页）， GNU make 还支持模式变量值。在这种形式中，变量是为任何与指定模式匹配的目标定义的。

像这样设置特定模式的变量值：  

```makefile
pattern ... : variable-assignment
```

其中， `pattern `是`%-pattern`。与目标特定变量值一样，多个模式值会为每个模式单独创建一个模式特定变量值。变量赋值可以是任何有效的赋值形式。除非指定覆盖，否则任何命令行变量设置都将优先。

例如：

```makefile
%.o : CFLAGS = -O
```

将为所有匹配`%.o`模式的目标分配`CFLAGS`值`"-O"`。

如果一个目标匹配多个模式，则首先解释匹配模式中词干较长的特定变量。例如，这会导致更具体的变量优先于更通用的变量：  

```makefile
%.o: %.c
	$(CC) -c $(CFLAGS) $(CPPFLAGS) $< -o $@

lib/%.o: CFLAGS := -fPIC -g
%.o: CFLAGS := -g

all: foo.o lib/bar.o
```

在本例中， CFLAGS 变量的第一个定义将用于更新 lib/bar.o，尽管第二个定义也适用于该目标。导致相同词干长度的特定模式变量将按照它们在 makefile 中的 定 义顺序进行处理。

模式专用变量会在为该目标明确定义的目标专用变量之后、为父目 标 定义的目标专用变量之前进行搜索。  

## 抑制继承

如前几节所述，依赖可以继承` make `变量。这种能力允许你根据哪些目标导致了依赖的重建，来修改依赖的行为。例如，你可能会在调试目标上设置一个特定于目标的变量，那么运行` "make debug"`就会导致该变量被所有调试目标的依赖继承，然而，执行`make all`不会产生这样的效果。

但有时，您可能不希望某个变量被继承。在这种情况下， make 提供了 private修饰符。尽管该修饰符可用于任何变量赋值，但它对目标变量和特定模式变量最有意义。任何标记为私有的变量对其本地目标都是可见的，但不会被依赖继承的全局变量。标记为私有的全局变量在全局作用域中可见，但不会被任何目标继承，因此也不会在任何 recipe 中可见。

例如，请看这个 makefile：  

```makefile
EXTRA_CFLAGS =

prog: private EXTRA_CFLAGS = -L/usr/local/lib
prog: a.o b.o
```

由于使用了私有修改器， `a.o`和`b.o`不会从目标进程继承`EXTRA_CFLAGS`变量赋值。  

## 其他特殊变量  

GNU make 支持一些具有特殊属性的变量。  

+ `MAKEFILE_LIST`

包含 make 解析过的每个 makefile 的名称，按解 析 顺序排列。该名称会在make 开始解析 makefile 之前添加。因此，如果 makefile 做的第一件事就是检查这个变量中的最后一个词，那么它就是当前 makefile 的名称。然而， 一旦当前 makefile 使用了 include， 最后一个词将是刚刚被包含的makefile。  

如果名为 Makefile 的 makefile 有此内容：  

```makefile
name1 := $(lastword $(MAKEFILE_LIST))

include inc.mk

name2 := $(lastword $(MAKEFILE_LIST))

all:
    @echo name1 = $(name1)
    @echo name2 = $(name2)
```

那么您就会看到这样的输出结果：  

```makefile
name1 = Makefile
name2 = inc.mk
```

+ `.DEFAULT_GOAL  `

如果命令行中没有指定目标，则设置默认目标（参见第 9.2 节 [指定目标的参数]，第 109 页）。通过 .DEFAULT_ GOAL 变量，可以发现当前的默认目标， 通过清除其值重新启动默认目标选择算法， 或明确设置默认目标。下面的示例说明了这些情况：  

```makefile
# Query the default goal.
ifeq ($(.DEFAULT_GOAL),)
$(warning no default goal is set)
endif

.PHONY: foo
foo: ; @echo $@

$(warning default goal is $(.DEFAULT_GOAL))

# Reset the default goal.
.DEFAULT_GOAL :=

.PHONY: bar
bar: ; @echo $@

$(warning default goal is $(.DEFAULT_GOAL))

# Set our own.
.DEFAULT_GOAL := foo
```

此 makefile 会打印：

```makefile
no default goal is set
default goal is foo
default goal is bar
foo
```

请注意，为` .DEFAULT_GOAL `分配多个目标名称是无效的， 会导致错误。  

+ `MAKE_RESTARTS  `

只有当 make 实例重新启动时，才会设置此变量（参见第 3.5 节 [Makefile如何重制]，第 15 页）：它将包含此实例重新启动的次数。请注意，这与递归（由 MAKELEVEL 变量计算）不同。您不应设置、修改或导出此变量。

+ `make_termout`，`make_termerr  `

当 make 启动时，它会检查 stdout 和 stderr 是否会在终端上显示输出。如果是，它会将 MAKE_TERMOUT 和 MAKE_TERMERR 分别设置为终端设备的名称（如果无法确定，则设置为 true）。如果设置了这些变量，它们将被标记为导出变量。 make 不会更改这些变量，如果已经设置，也不会修改。  

这些值可以用来（特别是与输出同步相结合（见第 5.4.2 节 [并行执行期间的输出]，第 53 页））确定 make 本身是否正在向终端写入；例 如 ，可以通过测试这些值来决定是否强制 recipe 命令生成彩色输出。

如果你调用了一个子 make 并重定向了它的 stdout 或 stderr，那么如果你的makefile 依赖于这 些 变量，你也有责任重置或取消导出这些变量。  

+ `.RECIPEPREFIX  `

该变量值的第一个字符将作为引入 recipe 行的字符。如果变量为空（因为它是 de- fault），该字符就是标准制表符。例如，这是一个有效的`makefile`：

```makefile
.RECIPEPREFIX = >
all:
> @echo Hello, world
```

`.RECIPEPREFIX`的值可以多次更改；一旦设置，就会对所有已解析的规则有效，直到修改为止。

+ `.VARIABLES`

扩展为迄今为止定义的所有全局变量的名称列表。这包括空值变量和内置变量（参见第 10.3 节 [隐式规则使用的变量]，第 125 页），但不包括任何只在特定目标上下文中定义的变量。请注意，给该变量分配的任何值都将被忽略；它将始终返回其特殊值。

+ `.FEATURES`

扩展为该版本`make`支持的特殊功能列表。可能的值包括但不限于：

|      功能名      | 说明                                                         |
| :--------------: | ------------------------------------------------------------ |
|     archives     | 支持使用特殊文件名语法的 ar（存档）文件。 参见第 139 页，第 11 章 [使用 make 更新存档文件]。 |
|  check-symlink   | 支持 -L（--check-symlink-times）标记。参见第 114 页第 9.8 节 [选项摘要]。 |
|     else-if      | 支持 "else if "非嵌套条件句。请参见第 86 页第 7.2 节 [条件语法]。 |
|  extra-prereqs   | 支持 .EXTRA_PREREQS 特殊目标。                               |
|  grouped-target  | 支持显式规则的分组目标语法。请参见第 37 页第 4.9 节 [规则中的多个目标]。 |
|      guile       | 将 GNU Guile 作为嵌入式扩展语言。参见第 12.1 节 [GNU Guile 集成]，第 143 页。 |
|    jobserver     | 支持 "作业服务器 "增强型并行编译。请参见第 51 页第 5.4 节 [并行执行] |
|  jobserver-fifo  | 支持使用命名管道的 "作业服务器 "增强型并行编译。 参见第13 章 [集成 GNU make]， 第 153 页。 |
|       load       | 支持动态加载对象，用于创建自定义扩展。参见第 12.2 节 [加载动态对象]，第 145 页。 |
| notintermediate  | 支持 .NOTINTERMEDIATE 特殊目标。参见第 13 章 [GNU make 的集成] ，第 153 页。 |
|     oneshell     | 支持 .ONESHELL 特殊目标。请参见第 48 页，第 5.3.1 节 [使用One Shell]。 |
|    order-only    | 支持仅订单依赖。请参见第 24 页第 4.2 节 [前置条件类型]。     |
|   output-sync    | 支持 --output-sync 命令行选项。参见第 114 页第 9.8 节 [选项摘要]。 |
| second-expansion | 支持依赖清单的二次扩展。                                     |
|   shell-export   | 支持将 make 变量导出到 shell 函数。                          |
|  shortest-stem   | 使用 "最短词干 "方法在多个适用选项中选择使用哪种模式。请参见第 133 页，第 10.5.4 节 [模式匹 recipe 式]。 |
| target-specific  | 支持特定目标和特定模式变量赋值。请参见第 78 页，第 6.11节 [特定目标变量值]。 |
|     undefine     | 支持 undefine 指令。参见第 77 页，第 6.9 节 [未定义指令]。   |

+ `.INCLUDE_DIRS  `

扩展到搜索包含的 makefile 的目录列表（见第 3.3 节 [包括其他 Makefile]，第 13 页）。请注意，修改该变量的值不会改变搜索的目录列表。

+ `.EXTRA_PREREQS`

该变量中的每个词都是一个新的依赖，会添加到设置了该变量的目标中。这些依赖与普通依赖的不同之处在于，它们不出现在任何自动变量中（参见第 10.5.3 节 [自动变量]，第 130 页）。这样就可以定义不影响 recipe 的依赖。

考虑一条连接程序的规则：

```makefile
myprog: myprog.o file1.o file2.o
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $^ $(LDLIBS)
```

现在假设你想增强这个 makefile，以确保编译器的更新会导致程序被重新链接。你可以将编译器作为依赖添加，但必须确保它不会作为参数传递给链接命令。你需要这样的文件：

```makefile
myprog: myprog.o file1.o file2.o $(CC)
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ \
		$(filter-out $(CC),$^) $(LDLIBS)
```

然后再考虑是否有多个额外的依赖：它们都必须被过滤掉。使用.EXTRA_PREREQS 和特定目标变量可以提供更简单的解决方案：

```makefile
myprog: myprog.o file1.o file2.o
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $^ $(LDLIBS)
myprog: .EXTRA_PREREQS = $(CC)
```

如果您想在无法轻易修改的 makefile 中添加依赖，该功能也很有用：您可以创建一个新文件，如` extra.mk`：

```makefile
myprog: .EXTRA_PREREQS = $(CC)
```

然后调用` make -f extra.mk -f Makefile`。  

全局设置`.EXTRA_PREREQS`将导致这些依赖被添加到所有目标中（这些目标本身并没有用特定于目标的值覆盖它）。请注意，`make`会很聪明地避免将 `.EXTRA_PREREQS`中列出的依赖添加为自身的依赖。  

# 7 Makefile的条件部分  

**条件**指令会根据变量的值来决定是否遵守或忽略`makefile`中的部分内容。条件指令可以将一个变量的值与另一个变量的值进行比较，也可以将一个变量的值与一个常量字符串进行比较。条件指令控制`make`在`makefile`中实际 "看到 "的内容，因此不能用于在执行时控制`recipe`。

## 条件式示例

下面的条件示例告诉 make，如果 CC 变量为 "gcc"，则使用一组库，否则使用另一组 库。它的工作原理是控制两个 recipe 行中的哪一个将被用于规则。结果是，"CC=gcc "作为 make 的参数，不仅改变了使用的编译器，也改变了链接的库。

```makefile
libs_for_gcc = -lgnu
normal_libs =

foo: $(objects)
ifeq ($(CC),gcc)
	$(CC) -o foo $(objects) $(libs_for_gcc)
else
	$(CC) -o foo $(objects) $(normal_libs)
endif
```

这个条件使用了三个指令：一个 ifeq、一个 else 和一个 endif。

ifeq 指令是条件句的开头，用于指定条件。它包含两个参数，以逗号分隔，并用 圆括号包围。对两个参数进行变量替换，然后进行比较。如果两个参数匹配，则执行 ifeq 之后的 makefile 行，否则忽略。

else 指令的作用是，如果前一个条件失败，则执行后面的命令行。 在上例中， 这意味着只要第一个备选链接命令没有使用，就会使用第二个备选链接命令。在条件 中使用 else 指令是可选的。

endif 指令结束条件。每个条件都必须以 endif 结束。 无条件 makefile 文本如下。

正如本例所示，条件在文本层面上起作用：根据条件，条件行被视为 makefile 的一 部分，或被忽略。这就是为什么 makefile 中较大的语法单元（如规则）可能会与条件 的开头或结尾交叉。

当变量 CC 的值为 "gcc "时，上述示例就会产生这样的效果：

```makefile
foo: $(objects)
	$(CC) -o foo $(objects) $(libs_for_gcc)
```

当变量 CC 具有任何其他值时，效果都是这样：

```makefile
foo: $(objects)
	$(CC) -o foo $(objects) $(normal_libs)
```

通过将变量赋值条件化，然后无条件地使用该变量，可以用另一种方法得到等效 的结果：

```makefile
libs_for_gcc = -lgnu
normal_libs =

ifeq ($(CC),gcc)
	libs=$(libs_for_gcc)
else
	libs=$(normal_libs)
endif

foo: $(objects)
	$(CC) -o foo $(objects) $(libs)
```

## 条件句语法

没有其他条件的简单条件的语法如下：

```makefile
conditional-directive
text-if-true
endif
```

`text-if-true`可以是任何文本行，如果条件为真，则作为 makefile 的一部分。如果条件为假，则不使用文本。

复合条件的语法如下：

```makefile
conditional-directive
text-if-true
else
text-if-false
endif
```

或者：

```makefile
conditional-directive-one
text-if-one-is-true
else conditional-directive-two
text-if-two-is-true
else
text-if-one-and-two-are-false
endif
```

"else 条件-指令 "子句的数量可根据需要而定。一旦给定条件为真，则使用 text-iftrue，不再使用其他子句；如果没有条件为真，则使用 text-if-false。text-if-true 和 textif-false 可以是任意行数的文本。

无论条件是简单还是复杂，无论是否在 else 之后，条件指令的语法都是一样的。 有四种不同的指令可以测试不同的条件。下面是它们的列表:

+ ```makefile
  ifeq (arg1, arg2)
  ifeq ’arg1’ ’arg2’
  ifeq "arg1" "arg2"
  ifeq "arg1" ’arg2’
  ifeq ’arg1’ "arg2"
  ```

  展开 arg1 和 arg2 中的所有变量引用并进行比较。如果它们相同，则文本if-true 有效；否则，文本-if-false（如果有）有效。 你经常要测试一个变量是否具有非空值。当变量值由变量和函数的复杂展 开式产生时，你认为是空的展开式实际上可能包含空白字符，因此不会被 视为空值。不过，可以使用 strip 函数（参见第 8.2 节 [文本函数]，第 92 页）来避免将空白字符解释为非空值。例如：

  ```makefile
  ifeq ($(strip $(foo)),)
  text-if-empty
  endif
  ```

  将对 text-if-empty 进行评估，即使 $(foo) 的扩展包含空白字符。

+ ```makefile
  ifneq (arg1, arg2)
  ifneq ’arg1’ ’arg2’
  ifneq "arg1" "arg2"
  ifneq "arg1" ’arg2’
  ifneq ’arg1’ "arg2"
  ```

  展开 arg1 和 arg2 中的所有变量引用并进行比较。如果它们不同，则文本if-true 有效；否则，文本-if-false（如果有）有效

+ ```makefile
  ifdef variable-name
  ```

  ifdef 形式的参数是变量的名称，而不是变量的引用。如果该变量的值为 非空值，if-true 文本有效；否则，if-false 文本（如果有）有效。从未定义 过的变量值为空。文本变量名（variable-name）是展开的，因此它可以是 一个展开为变量名的变量或函数。例如：

  ```makefile
  bar = true
  foo = bar
  ifdef $(foo)
  frobozz = yes
  endif
  ```

  变量引用` $(foo) `被展开，得到 bar，它被认为是一个变量的名称。变量 bar 不会被展开，但其值会被检查以确定是否为非空。 请注意，ifdef 只测试变量是否有值。它不会扩展变量以查看该值是否为 非空。因此，使用`ifdef`要测试空值，请使用` ifeq ($(foo),)`。例如：

  ```makefile
  bar =
  foo = $(bar)
  ifdef foo
  frobozz = yes
  else
  frobozz = no
  endif
  ```

  将` "frobozz "`设置为` "yes"`，而：

  ```makefile
  foo =
  ifdef foo
  frobozz = yes
  else
  frobozz = no
  endif
  ```

  设置为`"no"`。

+ ```makefile
  ifndef variable-name
  ```

  如果变量 variable-name 的值为空，则 text-if-true 有效；否则，text-iffalse（如果有）有效。变量名的扩展和测试规则与 ifdef 指令相同。

允许在条件指令行开头使用额外的空格，但不允许使用制表符。(如果该行以制表符开头，它将被视为规则recipe的一部分）。除此之外，除了在指令名称或参数中插入额外的空格或制表符外，在其他地方插入额外的空格或制表符不会产生任何影响。以"#"开头的注释可以出现在行尾。

在条件中起作用的另外两个指令是 else 和 endif。每条指令都写成一个单词，没有参数。行首允许并忽略额外的空格，行尾则忽略空格或制表符。以"#"开头的注释可以出现在行尾。

条件会影响 make 使用 makefile 中的哪些行。如果条件为真，make 会将文本-if -true 中的行作为 makefile 的一部分来读取；如果条件为假，make 会完全忽略这些行。因此，makefile 的语法单元（如规则）可以安全地跨越条件的开头或结尾。

make 在读取 makefile 时会对条件进行评估。因此，在测试条件时不能使用自变量 ，因为它们在运行 recipe 时才被定义（参见第 10.5.3 节 [自变量]，第 130 页）。

为了防止难以容忍的混乱，不允许在一个 makefile 中开始一个条件，而在另一个 makefile 中结束它。不过，您可以在条件中写入包含指令，只要您不试图在包含的文 件中终止条件。

## 测试条件的Flags

你可以编写一个条件用来测试`make`命令`Flags`比如通过使用变量`MAKEFLAGS`和`findstring`函数来测试`-t`。当你`touch`不足以使得一个文件更新时。

调用`MAKEFLAGS`会使得所有的单字符选项(比如`-t`)放到第一个字中，并且这个字如果没有任何选项给定，它将会是空字符串。为了使其工作，将其添加到开始是非常有必要的，比如：`-${MAKEFLAGS}`。

函数`findstring`字符串中是否有子串。如果你想使用`-t`标志进行测试，使用`t`作为其第一个字符串，且`MAKEFLAGS`作为字中的第一个参数。

比如，这里有一个如何分配使用`ranlib -t`去完成标记结构（archive）文件最新：

```makefile
archive.a: ...
ifneq (,$(findstring t,$(firstword -$(MAKEFLAGS))))
    +touch archive.a
    +ranlib -t archive.a
else
	ranlib archive.a
endif
```

前置的`+`号表示该`recipe`行就像递归，所以它将会执行，尽管使用了`-t`标志。

%%  %%