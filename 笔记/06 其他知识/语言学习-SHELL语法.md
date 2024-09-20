---
share: "true"
---
# shell 语法

## shell 概述

### 脚本解释器

&emsp;&emsp;`shell`脚本都是以`#！`开头，告知系统该文件的执行需要一个解释器。常见的解释器类型如下：

```shell
#!/bin/sh
#!/bin/bash
#!/usr/bin/perl
#!/usr/bin/tcl
#!/bin/sed -f
#!/usr/awk -f
```

+ `Shell`的种类有很多种，包括`sh、csh、tcsh、ash、bash`。
+ 可以通过`cat /etc/shells`来查看系统使用的`shell`类型。
+ `#!/bin/sh`是`linux`默认的`bash`。

### 调用脚本

&emsp;&emsp;执行脚本有三种方式：

+ `sh helloworld.sh`
+ `bash helloworld.sh`或者`bash +x helloworld.sh`
+ `./helloworld.sh`

### 第一个脚本

```shell
#!/bin/bash

echo "helloworld"
```

&emsp;&emsp;`#!/bin/bash`可以换成`#!/bin/sh`。

### 管道

> `Linux`中可以将两个或者多个命令连接到一起的符号`(|)`，称为管道符。
>
> 理念：把上一个命令的输出作为下一个命令的输入。

语法格式：

```shell
command | command_2 | ... | command_N
# 示例
cat helloworld.sh | grep hello
```

管道的应用：在`grep`、`tail`、`cat`、`sed`、`awk`等命令比较常见。

## shell中的特殊字符

|                          特殊字符                          |                             功能                             |                             说明                             |                      注意                      |
| :--------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :--------------------------------------------: |
|                            `#`                             | 1.注释<br />2.声明解释器的类型<br />3.某些特定的模式匹配操作使用 |                              /                               |                                                |
|                            `；`                            |             命令分隔符，可以在同一行上写多个命令             |                     某些情况需要使用转义                     |                                                |
|                            `;;`                            |                        终止`case`选项                        |                                                              |                                                |
|                            `.`                             |                        `bash`内置命令                        | 1.`.`放在文件名前面表示隐藏文件<br />2.移动文件操作时，如果是单独点作为参数时表示当前目录，如：`cp o.txt .`<br />3.两个点`..`表示上一级目录<br />4.正则表达式中的匹配符 |                                                |
|                            `""`                            |                           表示字符                           |                                                              |                                                |
|                            `''`                            |                           表示字符                           |                                                              |                                                |
|                            `，`                            |                          逗号操作符                          |                        连接一系列操作                        |                                                |
|                            `\`                             |                            反斜杠                            |                         一般用来转义                         |                                                |
|                            `/`                             |                             斜杠                             |                    作为文件名路径的分隔符                    |                                                |
|                            `*`                             |   1.乘法算数操作符<br />2.两个`**`表示幂运算<br />3.通配符   |                                                              |                                                |
|                            `？`                            |         1.测试测试通配符<br />2.通配符，在正则中使用         |     在表达式中测试一个条件的结果，类似C语言的三元操作符      |                                                |
|                            `$`                             |         1.引用变量<br />2.正则表达式中，表示行结束符         |                                                              |                                                |
|                           `${}`                            |                           参数替换                           |                                                              |                                                |
|                        `$*`或者`$@`                        |                           位置参数                           |                                                              |                                                |
|                            `$$`                            |                          进程ID变量                          |                     保存所在脚本的进程ID                     |                                                |
|                            `$?`                            |                        退出状态码变量                        |            可保存命令、函数或脚本本身的退出状态码            |                   一般是0或1                   |
|                            `{}`                            |                 大括号，代码快，也叫做内部组                 |                在函数或者判断语句中使用代码快                | 在大括号中不允许有空白，除非空白被引用或者转义 |
|                            `[]`                            |          1.测试条件<br />2.数组元素<br />3.字符范围          |         作为字符范围时，方括号描述一个匹配的字符范围         |                                                |
| `>`<br />`&>`<br />`>&`<br />`>>`<br />`<<`<br />`>`<br /> |                            重定向                            |                                                              |                                                |

## 转义符

|       转义符        |                     含义                      |          实例           |
| :-----------------: | :-------------------------------------------: | :---------------------: |
| `\n,\r,\t,\v,\b,\a` |                  通用的转义                   |                         |
|       `\0xx`        |     转换为八进制的`ASCLL`码，等价于`0xx`      |                         |
|        `\*`         |                  表示双引号                   |                         |
|        `\$`         | 表示`$`本身的意思，跟在后面的变量名不会起作用 | `echo \$variables ~~~~` |
|        `\\`         |                  表示反斜线                   |       `echo "\\"`       |

## shell参数符号

| 字符符号  |                         功能（用途）                         |
| :-------: | :----------------------------------------------------------: |
|   `$0`    |                   `shell`文件本身的文件名                    |
| `$1 ~ $n` |                             参数                             |
|   `$?`    | 最后运行命令的结束代码(返回值)，执行成功返回0，不成功则返回非零值(一般解释为错误码) |
|   `$$`    |                       `shell`本身的PID                       |
|   `$!`    |                   最后运行的后台进程的PID                    |
|   `$*`    | 所有参数列表。如`"$*"`用`"`括起来了，以`"$1 $2 $3...$n"`形式输出 |
|   `$@`    |                    所有参数列表，类似`$*`                    |
|   `$#`    |                   添加到`shell`的参数个数                    |

## 变量

> 变量表示数据的方法。是计算机为了保存数据项而在内存中分配的一个位置或一组位置的标识或名字

### shell变量概述

> `shell`变量有系统变量和自定义变量两种

&emsp;&emsp;对于变量名的声明规则类似于其他编程语言。由字母、数字、下划线组成，但不能以数字开头。

```shell
hello_123 	#合法
123_hello 	#不合法
```

### 内部变量

|    系统变量     |            说明            |
| :-------------: | :------------------------: |
| `$BASH_VERSION` |        查看bash版本        |
|     `$BASH`     | `bash`二进制程序文件的路径 |
|     `$USER`     |          当前用户          |
|     `$EUID`     |         有效用户ID         |
|   `$FUNCTION`   |      当前用户所属的组      |
|    `$GROUP`     |      当前用户所属的组      |
|   `$HOSTNAME`   |       当前主机的名字       |
|     `$PATH`     |    可执行文件的搜索路径    |
|      `pwd`      |       当前的工作目录       |

### 自定义变量基本语法

+ 定义变量

```shell
VARIABLE=1
INTERG=22
STRING=opq
```

+ 设置变量

```shell
set VARIABLE=90
```

+ 删除变量

```shell
unset VARIABLE=99
```

+ 声明静态变量

```shell
readonly VARIABLE=99
# 注意静态变量不能使用unset
```

+ 使用变量

```shell
$VARIABLE
```

+ 变量赋值

```shell
# 简单赋值
a=123 && echo $a

# 命令行赋值
str=`cat hellowrld.sh`  #两个字符串间不能有空格
str=$(cat /etc/os-release)
```

**注意：赋值时，变量与字符串间不能有空格**

+ 局部变量

```shell
#只在代码款或函数中可见，外部不可用
{
	a="qq"
}
echo $a #无法使用改变量
```

+ Bash变量

> 不区分类型，都是字符串，不允许进行数值计算，除非变量中包

+ 其他注意

> 如果变量的值中间有空格，则使用引号(单引号与双引号均可)括起来

### 环境变量

> 会影响用户接口和shell的行为。环境变量是一个**全局变量**。
>
> 通过`export`命令将变量声明为环境变量即可

```shell
export VERIABLE=99

echo $VERIABLE
```

> 假如到`/root/.bashrc`文件下面也可以环境变量的添加，添加完成后使用`source /root/.bashrc`

```shell
source /root/.bashrc
```

### 引用变量

> 一般使用`$`来引用变量

## 运算符

### 赋值运算符

`=`：通用赋值运算，可用于算术和字符串的赋值。

### 算术运算符

| 运算符 | 描述 |    备注    |
| :----: | :--: | :--------: |
|  `+`   | 加法 | 延伸：`+=` |
|  `-`   | 减法 | 延伸：`-=` |
|  `*`   | 乘法 | 延伸：`*=` |
|  `**`  | 求幂 |            |
|  `/`   | 除法 | 延伸：`/=` |
|  `%`   | 求模 | 延伸：`%=` |
|  `++`  | 自增 |            |
|  `--`  | 自减 | 延伸：`+=` |

示例：

```shell
#!/bin/bash
a=5

let a+=2
echo "plus : $a"

let res=a-1
echo $res
```

### 位运算符

> 略

### 比较运算符

| 运算符 |     英文全称     |  中文描述  | 示例 |
| :----: | :--------------: | :--------: | :--: |
| `-eq`  |      equal       |    等于    |      |
| `-ne`  |    not equal     |   不等于   |      |
| `-gt`  |   greater than   |    大于    |      |
| `-lt`  |   lesser than    |    小于    |      |
| `-ge`  | greater or equal | 大于或等于 |      |
| `-le`  | lesser or equal  | 小于或等于 |      |

```shell
# 条件测试
[ 1 -eq 1 ] && echo "true"
[ 1 -eq 0 ] || echo "false"

[ 58 -ge 5 ] && echo "true"
```

### 逻辑运算符

| 运算符 |    描述     | 等价使用 | 具体说明 |
| :----: | :---------: | :------: | :------: |
|  `&&`  | 逻辑与(AND) |   `-a`   |    /     |
|  `||`  | 逻辑或(OR)  |   `-o`   |    /     |

```shell
# 只有该用法
command1 && command2
command3 && command4

# && 当command1为真，则执行command2
# || 当command3为真，则执行command4
```

## 操作字符串

> 字符串是由`单引号('')`或者`双引号("")`或者也不可用引号。

+ 单引号

  + 原样输出
  + 单引号内不能使用单引号

  

+ 双引号

  + 如果其中使用了变量，则变量内容也会被替换
  + 如果再次使用引号，则使用转义符

  

+ 不用引号

  + 性质和双引号一致，但是字符串不能有空格

### 字符串的长度

> 直接使用`${#string}`来计算字符串的长度。

```shell
# 三种
${#String}
expr length $String
expr "$String" : '.*'

String=QQ123
echo ${#String}
> 5

expr length $String
> 5

expr "$String" : '.*'
```

### 所以子串第一次出现的位置

```shell
expr index "$String" '$substring'

# 示例
String=QQ123
expr index "$String" '3'
> 5
```



### 提取子串

+ 使用`“:”`来截取

```shell
# 从string字符串的左边第start个字符开始，向右截取到最后，start从0开始
${string:start}

# 从string字符串的左边第start个字符开始，向右截取length个字符
${string:start:length}

# 从string字符串的右边第start个字符开始，向右截取到最后。start从1开始
${string:0-start}

# 从string字符串的右边第start个字符开始，向右截取length个字符。
${string:0-start:length}
```

+ 匹配截取

```shell
# 从string字符串左边第一次出现*chars的位置开始，截取*chars右边所有字符
${string#*chars}

# 从string字符串左边最后一次出现*chars的位置开始，截取*chars右边的所有字符
${string##*chars}
#=================================================================#
#=================================================================#
# 从string字符串右边第一次出现chars*的位置开始，截取chars*左边的所有字符
${string%chars*}

# 从string字符串右边最后一次出现chars*的位置开始，截取chars*左边的所有字符
${string%%chars*}

## 注意*是通配符，并且该方式不支持正则，也就是没办法替换"\n"这种,正则表达式的替换需要使用sed
```

### 字符串的拼接

```shell
# 直接并排放即可
str1="hello"
str2="world"
result1=${str1}${str2}
```

### 字符串的替换

+ 替换一个

```shell
# 对string操作，将str1替换为str2
${string/str1/str2}
```

+ 替换所有

```shell
# 对string操作，将str1全部替换为str2
${string//str1/str2}
```

+ 替换开头一个

```shell
${string/#str1/str2} # 类似上面字符串提取子串
```

+ 替换最后一个

```shell
${string/%str1/str2} # 类似上面字符串提取子串
```

## 数组

> `bash`只支持一维数组。数组元素可使用符号`var[number]`来初始化。
>
> 脚本使用`declare -a var`语句来指定一个数组。
>
> 数组访问：通过`下标`的方式访问。数组元素的下标从`0`开始，和C语言类似。下标可以是`整数`或者`算术表达式`，其值范围：`[0,∞]`。
>
> 在数组中，`${#arry[*]}`与`${#arry[@]}`表示数组的元素个数。

```shell
# 
arry=(1 1 1 1 1)
echo ${#arry[*]}
> 5
```

### 数组声明与初始化

> shell中使用括号来表示数组，元素之间则使用`空格`来分隔

```shell
# 等号两边不能空格
arrary_name=(ele1 ele2 ele3 ... elen)
declare -a arry=(ele1 ele2 ele3 ... elen)

# 声明
arr=(1 2 3 4 5)
array=([1]=77 [2]=11 [3]=00)
declare -a arr=(1 1 1 1 1 1)
```

### 访问数组元素

+ 访问单个元素

```shell
# 数组名[索引]
$(arry_name[index]) #没有这个 x
${arry_name[index]}

# 实例
arry=(2 1 44 55 66)
echo ${arry[0]}
> 2
echo $(arry[2]) # 错误示例，没有使用括号访问，只有中括号
```

+ 访问所有元素

```shell
${arry[*]}
${arry[@]}

```

+ 使用`declare -a`语句可加速后面数组的操作速度(未验证)

### 删除数组

```shell
# 删除特定元素
unset array_name[index]

# 删除整个数组
unset array_name
```

### 数组遍历

+ 方式一：

```shell
# 不带数组下标
for ele in ${arry_name[@]}
do
	:
	echo "do anything $ele"
done
```

+ 方式二

```shell
# 标准for
for(( i=0;i<${#arry_name[*]};i++)) do
	echo ${arry_name[i]};
done
```

+ 方式三

```shell
# 带数组下标控制
for i in ${!arry_name[@]}
do
	printf "%s\t%s\n" "$i" "${arry[$i]}"
done
```

+ 方式四

```shell
# while
i=0
while [ $i -lt ${#array_name[@]} ]
do
	echo ${array_name[$i]}
	let i++
done
```

## 分支与循环控制

> 在使用分支前，我们需要先了解一下条件，通过测试命令返回的结果，if分支才能接受。
>
> 而条件测试实际上是可以单独使用的，不一定需要if。

### test(测试命令)

#### 格式

```shell
# 格式一
test 条件表达式

# 格式二
[ 条件表达式 ]

# 格式三
[[ 条件表达式 ]]
```

#### 示例

```shell
# 测试1
test 5 -gt 3
echo $?

# 测试2
[ 5 -lt 3 ]
echo $?

# 测试3
[[ 9 > 5 ]]
echo $? #结果为0
[[9\>5]]
echo $? #结果为0
((9>5))
echo $? #结果为0
```

### if

> `if/then`结构用来判断命令列表的`退出状态码`是否为`0`

```shell
# 单分支
if [ condition ];then
	command1
fi

# 双分支
if [ condition ];then
	command
else
	command2
fi

# 多分支
if [ condition1 ];then
	command
elif [ conditon2 ];then
	command
elif [ conditon3 ];then 
	command
else
	command
fi

# 嵌套
if [ condition ];then
	if [ condition ];then 
		command1
	fi
fi
```

#### 整数比较

> 前面已经说过了

**注意：**命令与命令之间使用`&&`和`||`表示逻辑与、或。（有短路效应）

| 运算符 |     英文全称     |  中文描述  | 示例 |
| :----: | :--------------: | :--------: | :--: |
| `-eq`  |      equal       |    等于    |      |
| `-ne`  |    not equal     |   不等于   |      |
| `-gt`  |   greater than   |    大于    |      |
| `-lt`  |   lesser than    |    小于    |      |
| `-ge`  | greater or equal | 大于或等于 |      |
| `-le`  | lesser or equal  | 小于或等于 |      |

```shell
# 
[$(ls |wc -l) -gt 10] && echo "文件数大于10"

# 
if [ 8 -lt 10 ];then
	echo "8 < 10"
fi
```

#### 组合

+ `-a,&&`:与
+ `-o,||`:或
+ `!`:非

```shell
# 测试一
if [ 0 ];then
	echo "true"
fi
root:~#true
if ! [ 0 ];then
	echo "true"
fi
root:~#什么都没打打印。（注意在“[ ]”中的0被认为是一个字符，使用"if ((0))"才是判断为假 ）

# 测试二
if [ 1 -gt 3 -a 6 -gt 3 ];then
	echo "true"
else
	echo "false"
fi
root:~#false

#测试三
if [ 1 -gt 3 && 6 -gt 3 ] #错误示例
if [ 1 -gt 3 ] && [ 6 -gt 3 ];then
	echo "true"
else
	echo "false"
fi
root:~#false
if [ 1 -gt 3 ] || [ 6 -gt 3 ];then
	echo "true"
else
	echo "false"
fi
root:~#true
if [[ 1 -gt 3 || 6 -gt 3 ]];then #注意&&与||只能在"[[]]"中使用，在"[ && ]"是错误的
	echo "true"
else
	echo "false"
fi
root:~#true

```

#### 字符串比较

| 符号          | 解释                    |
| ----------- | --------------------- |
| ` == `,`=`  | 等于                    |
| `!=`        | 不等于                   |
| `>`         | 大于                    |
| `<`         | 小于                    |
| `-z string` | 测试字符串是否为空。空-1，非空-0    |
| `-n string` | 测试制定支付串是否为不空。非空-1，空-0 |

**注意：**符号两边加空格

```shell
#等于
if [ "hello" ==  "hello" ];then #两个字符串间月等号必须空格
	echo "mached"
else
	echo "unmached"
fi
root:~#mached
if [ "hello" ==  "hellx" ];then #两个字符串间与等号必须空格
	echo "mached"
else
	echo "unmached"
fi
root:~#unmached
if [ "hello" =  "hellx" ];then #两个字符串间与等号必须空格
	echo "mached"
else
	echo "unmached"
fi
root:~#unmached

#不等于
if [ "hello" !=  "hellx" ];then #两个字符串间与等号必须空格
	echo "true"
else
	echo "false"
fi
root:~#true

#大于,按每个字符依次比较其ascii码，当遇到不相等的返回。不相同字符前面大于后面返回真，后面大于前面返回假
if [ "hellq" \>  "hellx" ];then #这里"\>"是必须加的，否则结果会出乎意料
	echo "true"
else
	echo "false"
fi
root:~#false
if [ "helly" \>  "hellx" ];then
	echo "true"
else
	echo "false"
fi
root:~#true
if [ "hellq">"hellx" ];then #这里就不需要"\"了
	echo "true"
else
	echo "false"
fi
root:~#false

#小于，与大于同样
#略

# 其他，同样的一个使用test来测试
if test "helly" \>  "hellx";then
	echo "true"
else
	echo "false"
fi


```

#### 文件测试

|   符号    | 功能                         |
| :-------: | ---------------------------- |
| `-e FILE` | 测试文件是否存在             |
| `-f file` | 测试文件是否为普通文件       |
| `-d file` | 测试指定路径是否为目录       |
| `-r file` | 测试文件对当前用户是否可读   |
| `-w file` | 测试文件对当前用户是否可写   |
| `-x file` | 测试文件对当前用户是否可执行 |
|   `-z`    | 是否为空。空-1，非空-0       |
|   `-a`    | 是否为不空。非空-1，空-0     |

#### [],[[|]],(())分辨

> 以上都是test(测试)命令
#### if中的正则表达式
语法格式如下：
```shell
if [[ "$STRING" =~ "123" ]];then
fi
```
....
### for

+ 语法

```shell
# [list]表示一个列表
for ele in [list];do
	command
done

# 类似C语言
for((i=0;i<=5;i++));do
	command
done
```

+ 实例

```shell
for i in 1 2 3 4 5;do
	echo $i
done
> 1
> 2
> 3
> 4
> 5
```

### while

+ 语法

```shell
while [ condition ];do
	command
	command2
done
```

### until

> 与`while`相反。如果`condition`为`false`则进入循环。

+ 语法

```shell
until condition;do
	command1
	command2
done
```

### break 和 continue

> 用法与C语言一致，不在赘述。

### case

> `case`类似于C语言中的`switch`语句.
>
> 因为`default`缘故必会执行，一般会用来显示`help`信息

+ 语法

```shell
case arg/expression in
	condition1)
		command1
	;;
	codition2)
		command2
	;;
	condition3)
		command3
	;;
	condition4)
		command4
	;;
	*)
		command
esac
```

+ condition的正则

condition支持简单的正则表达式，如下：

| 用法  | 说明              |      |
| ----- | ----------------- | ---- |
| *     | 表示任意字符      |      |
| ?     | 表示单个字符      |      |
| [abc] | abc中任意一个     |      |
| [m-n] | m-n中的字符都可以 |      |
| \|    | 或                |      |

+ 实例

```shell
#已进行shellcheck检查
echo "Please input your Score : "
read -r score

case $score in #固定格式，判断数字，然后直接类似C语言中的goto语句
    [9][0-9]|100) # 十位 和个位的组合
        echo "The Level is A"
        ;; # 固定格式
    [8][0-9]|90)
        echo "The Level is B"
        ;;
    [67][0-9]|80)
        echo "The Level is C"
        ;;
    [0-5][0-9]|[0-9])
        echo "The Level is D, please pay attention it"
        ;;
    *) #固定格式
        echo "The input is False"
esac # 注意结尾不能少
```

### select

> 与`case`语句类似

+ 语法

```shell
select arg in [list];do
	command_1
	command_2
	...
	break #break必须有，否者会让你一直选择内容，无法退出（只能使用[ctrl+c]）
done
```

+ 实例

```shell
select arg in 33 44 55 66 77;do
	echo "select number="$arg
	break
done
> 1) 33
> 2) 44
> 3) 55
> 4) 66
> 5) 77
> #? 5	       #[输入你的选择的序号]
> select number=77
```

## 函数

> 函数：实现一系列操作的`代码块(完成特定的task)`。一个函数就是一个子程序。
>
> 目的：提高代码质量

### 自定义函数

+ 语法

```shell
# 方式1
function func_name()
{
	command1
	...
	[return value] #可选
}

# 方式2
func_name()
{
	command1
	...
	[return value] #可选
}
```

**<font color=red>注意:</font>** 函数括号中不填参数，而是由`$1 ... $n`来访问

### 函数使用

> shell中直接使用函数名字即可

```shell
func_name [param_1] [param_2] [param_3] ... [param_n]
```

+ 实例

```shell
function add()
{
	echo $1+$2;
}
add 1 2
> 3
```

### 函数返回值

+ 返回数值

```shell
# 使用return可返回0-255的数值
function max()
{
	return 1
}

max 12 32
echo "max value = $?"
```



+ 返回串

```shell
# 使用echo返回字符串
function min()
{
	echo "min value is 9"
}

result=`min 12 65`
//或者
result=$(min 12 65)
echo $result
```
### 系统函数

> 暂时未使用到

## 字符串的显示颜色

> ANSI定义可屏幕属性相关颜色输出的转义码来表示。一般搜索CSI序列可得到更多信息。
>
> 一般会看到打印信息中显示特殊的颜色。通过`echo`带颜色属性，以及`参数 -e`。语法格式如下：

```shell
# 方法1
echo -e "\033[字背景颜色;文字颜色m 字符串\033[0m"

# 方法2
echo -e "\e[字背景颜色;文字颜色m 字符串\e[0m"
```

**<font color=yellow>说明：</font>**`-e`让`echo`启用`转义序列`。其中字体或者背景等编号都会以`m`结尾。

|             颜色              | 字体颜色  | 背景颜色  | 显示控制说明                        |
| :-------------------------: | :---: | :---: | :---------------------------- |
| <font color=black>黑</font>  | `30m` | `40m` | `0m `---- 关闭所有属性              |
|  <font color=red>红</font>   | `31m` | `41m` | `1m` ---- 设置字体高亮（也就是粗体字）      |
| <font color=green>绿</font>  | `32m` | `42m` | `2m` ---- 设置字体变暗（也就是灰字）       |
| <font color=yellow>黄</font> | `33m` | `43m` | `3m` ---- 设置斜体                |
|  <font color=blue>蓝</font>  | `34m` | `44m` | `4m` ---- 设置字体下划线             |
| <font color=purple>紫</font> | `35m` | `45m` | `5m` ---- 设置字体闪烁              |
|  <font color=cyan>青</font>  | `36m` | `46m` | `7m` ---- 设置颜色反转              |
| <font color=white>白</font>  | `37m` | `47m` | `8m` ---- 设置隐藏（如`Linux`中输入密码） |

**补充：**

| 控制码         | 说明           |     |
| ----------- | ------------ | --- |
| `\033[9m`   | ~~文字划线~~     |     |
| `\033[3nm`  | 设置前景色`[0,7]` |     |
| `\033[4nm`  | 设置背景色`[0,7]` |     |
| `\033[nA`   | 光标上移动n行      |     |
| `\033[nB`   | 光标下移动n行      |     |
| `\033[nC`   | 光标右移动n行      |     |
| `\033[nD`   | 光标左移动n行      |     |
| `\033[y;xH` | 光标移动到`(x,y)` |     |
| `\033[2J`   | 清屏           |     |
| `\033[K`    | 清除从光标到行尾的内容  |     |
| `\033[s`    | 保存光标位置       |     |
| `\033[u`    | 恢复光标位置       |     |
| `\033[?25`  | 隐藏光标         |     |
| `\033[?25h` | 显示光标         |     |

> 更多信息参考:https://misc.flogisoft.com/bash/tip_colors_and_formatting

操作示例：

```shell
# 只定义字体颜色
echo -e "\e[31mhere are my books\e[0m"

# 只定义字体+背景颜色
echo -e "\e[37;31mhere are my books\e[0m"

# 定义字体+背景颜色+控制（闪烁，下划线）
echo -e "\e[4;5;37;31mhere are my books\e[0m"
```

## IO重定向

> 常用重定向相关的`文件描述符`有以下三个：

| 文件描述符号 | 解释   | 命令       | 设备      |
| ------ | ---- | -------- | ------- |
| 0      | 标准输入 | `stdin`  | 键盘      |
| 1      | 标准输出 | `stdout` | 屏幕      |
| 2      | 标准错误 | `stderr` | 错误消息至屏幕 |

### 重定向符号及功能说明

| 符号                                 | 描述                                               | 注意点                | 用法                            |
| ---------------------------------- | ------------------------------------------------ | ------------------ | ----------------------------- |
| `:> filename` 或<br /> `> filename` | 如果文件存在，则创建一个`0`长度的文件（与touch类似）                   | `: `是一个占位符，不产生任何输出 |                               |
| `1>filename`                       | 重定向`stdout` 到文件 `filename`中                      |                    |                               |
| `1>>filename`                      | 如果文件存在，则直接重定向追加到文件`filename`后面，如果不存在，则创建。        |                    |                               |
| `2>>filename`                      | 重定向并追加`stderr`到文件`filename`                      |                    |                               |
| `&>filename`                       | 将`stdout` 和 `stderr` 都重定向到文件`filename`           |                    |                               |
| `2>&1`                             | 重定向`stderr`到`stdout`，将错误消息的输出，发送到与标准输出所指向的地方     |                    |                               |
| `i>&j`                             | 重定向文件描述符`i`到`j`，指向`i`文件的所有输出都发送到`j`              |                    |                               |
| `>&j`                              | 默认的，重定向`fd 1（stdout）`到`j`，所有传递到`stdout`的输出都送到j中去 |                    |                               |
| `0<filename` 或 <br />`< filename`  | 从文件中接受输入                                         |                    | `grep search_word < filename` |
| `[j] <> filename`                  | 将`filename`打开，然后将`fd j`分配给他，如果`filename`不存在，则创建。 | 如果fd未指定，则默认fd是0。   |                               |

### 关闭文件描述符

|     符号     | 说明                  |
| :----------: | --------------------- |
|    `n<&-`    | 关闭输入文件描述符`n` |
| `0<&-`,`<&-` | 关闭`stdin`           |
|    `n>&-`    | 关闭输出文件描述符`n` |
| `1>&-`,`>&-` | 关闭`stdout`          |

### 代码块的重定向

> 代码块：`{}`括起来的命令。例如：`for`,`while`,`until`,`case`等
>
> 具体用法：将重定向命令符号卸载代码块的结尾。
>
> 实现功能：使得代码块内部的所有标准输入输出重定向。

+ 实例1

```shell
echo "This is Code block redirect Example"
echo 
{
    echo "SolerHO";
    echo "shell";
    echo "55"
} > infor.log   # 将代码块重定向输出到infor.log 文件中

{
    read -r name;
    read -r dev_lang;
    read -r age
} < infor.log   # 将infor.log重定向输入到代码块 

echo "My Name is $name, The programming language being used is $dev_lang, age is $age"
```

+ 实例2

```shell
while read n;do
	((sum += n))
	echo "this number:$n"
done < nums.txt > log.txt
cat log.txt
```

### 其他重定向：`<<`,`<<<`

#### <<

> 这种形式被称为`“Here Document”`,后面跟随一个分解符。它运行你直接在命令行或脚本中定义一大段文本，然后将其作为命令的标准输入。
>
> 分解符是任意不包含空格的字符串，通常是一个单词或者一对引号。
>
> + `<< delimiter`
> + `<< "delimiter"`

- 示例1

```shell
cat << EOF > output.txt #下面是需要手动输入的
> Hello PX
>     I'm Bob.
> EOF
cat output.txt
> Hello PX
>     I'm Bob.
```

注意：对`delimiter`使用双引号与不使用双引号区别在于：使用双引号，接下来输入的`“Here Document”`会被当成字面内容传递给命令（除换行符）。而不使用双引号，则会对其中的变量扩展，命令替换。

#### <<<

> 这是`“Here String”`机制。在Bash和一些其他shell中可用。
>
> 它用来将一个字符直接传送给命令作为输入，而不需要创建临时文件。

### 使用示例

| 符号     | 示例                                                  | 解释                                                  | 备注    |
| ------ | --------------------------------------------------- | --------------------------------------------------- | ----- |
| `>`    | cat > file_a.txt                                    | **标准输出**重定向                                         | 等于：1> |
| `2>`   | cp 2> /dev/null                                     | 标准错误重定向                                             |       |
| `>>`   | echo "hello shell!" >> file_a.txt                   | 标准输出重定向（append）                                     |       |
| `<`    | cat < file_a.txt                                    | 标准输入重定向                                             |       |
| `>&`   | realpath >& file_a.txt                              | 合并标准输出与标准错误至指定文件中（后面需要跟上位置）                         |       |
| `&>`   | realpath > file_a.txt                               | 与上面基本等价，微小区别                                        |       |
| `&>>`  | cat exist_file.txt no-exist_file.txt &>> file_a.txt | 合并输出重定向至指定文件中(append)，file_a.txt可以是1                |       |
| `2>&1` | ls -all 2>&1                                        | 合并输出重定向，将[`标准错误`]输出到[`标准输出`]指向的目标，实现正常信息与错误信息输出到一处。 |       |
| `1>&2` | cat file.txt oopp.txt > /dev/null 1>&2              | 合并输出重定向，将[`标准输出`]输出到[`标准错误`]指向的目标，实现正常信息与错误信息输出到一处。 |       |
| `2&>1` | 无，错误操作                                              |                                                     |       |
| `1&>2` | 无，错误操作                                              |                                                     |       |

> 以下示例会用到文件`a.txt`，其中内容是：
>
> ```tex
> Hello PX:
>   I'm LiHua, from Ameriaca.
> ```

+ 示例1

```shell
# 将"ls -all"的标准输出输出到/dev/null
ls -all > /dev/null

# 假设b.txt不存在，file.txt存在
cat file.txt b.txt > ./output.txt
> cat: b.txt: 没有那个文件或目录
cat output.txt
> Hello PX:
> 	I'm LiHua, from Ameriaca.
```

上面可以看到标准输出被输出到`output.txt`文件。

+ 示例2

```shell
# 假设b.txt不存在，file.txt存在
cat file.txt b.txt 2> ./output.txt
> Hello PX:
  I'm LiHua, from Ameriaca.
cat output.txt
> cat: b.txt: 没有那个文件或目录
```

可以看到标准输出直接被打印了，但是标准错误被保存到`output.txt`文件中。<font color=red>注意："2"与">"之间不能有空格！</font>

+ 示例3

```shell
echo "Hello PX!" > ./output.txt

cat file.txt b.txt >> ./output.txt
> cat: b.txt: 没有那个文件或目录
cat output.txt
> Hello PX!
> Hello PX:
>	I'm LiHua, from Ameriaca.


cat file.txt b.txt 2>> ./output.txt
> Hello PX:
>	I'm LiHua, from Ameriaca.
cat output.txt
> Hello PX!
> Hello PX:
>	I'm LiHua, from Ameriaca.
> cat: b.txt: 没有那个文件或目录
```

+ 示例4

```shell
# 使用tee输入到文件夹
tee ouput.txt
> JJJJJLLLLL!!!!
> JJJJJLLLLL!!!!
> ^C
cat output.txt
> JJJJJLLLLL!!!!
echo '<Hello PX!>' > output.txt
tee < ouput.txt
> <Hello PX>

# 使用文件夹作为输入源
cat < output.txt
> <Hello PX>
```

这里可以看到，某些命令默认后面跟的是输出（比如上面的`tee output.txt`）,而`cat`默认后面是输入源。所以`<`命令可以指定后面文件为输入源。所以在使用的时候要对该命令有实际的了解。

+ 示例5

```shell
cat file.txt b.txt 2>&1 > output.txt
> cat: b.txt: 没有那个文件或目录
cat output.txt
> Hello PX:
> 	I'm LiHua, from Ameriaca.


cat file.txt b.txt  > output.txt 2>&1
cat output.txt
> Hello PX:
>	I'm LiHua, from Ameriaca.
> cat: b.txt: 没有那个文件或目录
```

这里可以看到`2>&1`放在`>`前面与后面有区别：

1. `cat file.txt b.txt 2>&1 > output.txt`虽然[标准错误]复制了[标准输出]的输出位置，但是此时的标准输出仍然还是屏幕终端，之后[标准输出]被重定向至`output.txt`文件中。

```shell
# 可以使用strace来追踪系统调用情况
dup2(1,2)
open(file.txt) == 3
dup2(3,1)
```

2. `cat file.txt b.txt 2>&1 > output.txt`这里将[标准输出]定向到`output.txt`文件，之后[标准错误]复制[标准输出]定向位置。

```shell
# 可以使用strace来追踪系统调用情况
open(file.txt) == 3
dup2(3,1)
dup2(1,2)
```

**注：当然实际情况:`strace cat file.txt b.txt 2>&1 > output.txt`并不能实现抓取，因为重定向会被认为是`strace`的重定向。** ^5935c8



### 正则

#### POSI字符类

| 字符         | 描述                                                    | ⚠️注意点                                 |
| ------------ | ------------------------------------------------------- | --------------------------------------- |
| `[:alnum:]`  | 匹配字母和数字，等价于`A-Za-z0-9`                       |                                         |
| `[:alpha]`   | 匹配字母，等价于 `A-Za-z`                               |                                         |
| `[:blank:]`  | 匹配一个空格或一个制表符`（tab）`                       |                                         |
| `[:cntrl:]`  | 匹配控制字符                                            |                                         |
| `[:digit:]`  | 匹配十进制数字，等价于`0-9`                             |                                         |
| `[:graph:]`  | 打印任何可视的字符。ASCII码范围：`33 ～ 126` 之间的字符 | 不包括空格字符（空格字符的ASCII码是32） |
| `[:print:]`  | 打印任何可视的字符。ASCII码范围：`33 ～ 126` 之间的字符 | 包含空格                                |
| `[:lower:]`  | 匹配小写字母，等价于 `a-z`                              |                                         |
| `[:upper:]`  | 匹配大写字母，等价于`A-Z`                               |                                         |
| `[:space:]`  | 匹配空白字符（空格和水平制表符）                        |                                         |
| `[:xdigit:]` | 匹配16进制数字，等价于` 0-9A-Fa-f`                      |                                         |

#### 扩展RE字符

> 该正则是在`grep`中学习过。

#### 应用场景

```shell
- Linux文本处理：sed、grep、awk、cat、tail、head、tee、uniq、sort
- Linux工具：vim
- 其他的编程语言
```



## shell脚本静态检查(shellcheck)

### 安装

```shell
# 方式 1 ： 直接命令行方式安装
apt-get install shellcheck   # Ubuntu

# centos暂时未使用 yum install ShellCheck，建议直接使用源码方式安装

# 方式 2 ： 源代码方式
wget https://github.com/koalaman/shellcheck/releases/download/v0.8.0/shellcheck-v0.8.0.linux.x86_64.tar.xz && tar -xf shellcheck-v0.8.0.linux.x86_64.tar.xz && cp shellcheck-v0.8.0/shellcheck /usr/bin/

# 查看shellcheck 版本
shellcheck --version
```

### 使用

```shell
shellcheck test.sh
```

```shell
px@ubuntu:~$ shellcheck ./test.sh 

In ./test.sh line 5:
for ele in ${arry[@]}
           ^-- SC2068: Double quote array expansions to avoid re-splitting elements.


In ./test.sh line 7:
	echo $ele
             ^-- SC2086: Double quote to prevent globbing and word splitting.


In ./test.sh line 11:
for i in ${!arry[@]}
         ^-- SC2068: Double quote array expansions to avoid re-splitting elements.


In ./test.sh line 13:
	echo "[$i]="${arry[i]}
                    ^-- SC2086: Double quote to prevent globbing and word splitting.


In ./test.sh line 22:
process_info=$(ps -ef)
^-- SC2034: process_info appears unused. Verify it or export it.


In ./test.sh line 25:
	echo $line;
             ^-- SC2086: Double quote to prevent globbing and word splitting.


In ./test.sh line 26:
done <<< $(ps -ef)
         ^-- SC2046: Quote this to prevent word splitting.
```

## 参考链接

https://juejin.cn/post/6844904045329514504

https://juejin.cn/post/6962032698697187364

https://myshell-note.readthedocs.io/en/latest/index.html

https://github.com/koalaman/shellcheck

# grep

> 命令的选项过于多，所以不完全展示用法，只展示常用的一些控制选项。

## 学习

### 命令用法

<font color="red">grep  [选项]  模版们  [文件  ...]</font>

<font color="red">grep  [选项]  -e  模版们  ...  [文件  ...]</font>

<font color="red">grep  [选项]  -f  模版_文件  ...  [文件 ...]</font>

> ​		`grep `是对每个文件匹配模板(就是要匹配的子串，一般在C++也会将匹配目标写成pattern)。每一个模板或多个是独立的字符串，并且`grep`按行打印匹配模板的结果。通常，在shell命令中，匹配模板需要使用引号引起来。
>
> ​		有”-“的文件表示标准输入。如果没有给出文件，递归搜索会检查工作目录，并且非递归搜索则是读取标准输入。
>
> ​		此外，变体程序`egrp`、`fgrep`和`rgrep`分别与`grep-E`、`grep-F`和`grep-r`相同。不推荐使用这些变体，但提供这些变体是为了向后兼容。

### 选项
#### 通用程序信息
```shell		
--help
-V， --version
```

#### 模板语法
```shell
-E, --extended-regexp 使用扩展的正则
-F，--fixed-strings 固定字符串
-G, --basic-regexp 基础正则表达式（这是默认的）
```

#### 匹配控制

```shell
-e 模板们， --regexp=模板们
	使用模板们作为匹配规则，如果有多个正则或者与”-f“使用，会利用所有给定的匹配规则进行匹配。这个选项的意义在于保证匹配规则以”-“开头。
-f 文件, --file=文件
	从文件中获取模板，每行一个。如果此选项被多次使用或与-e（--regexp）选项组合使用，搜索给定的所有模板。空文件包含零个模板，因此不匹配任何模板。
-i, --ignore-case
	字面意思。
--no-ignore-case
	辨认大小写，这个是默认的选项。它能够抵消已经使用了”-i“选项的shell脚本。
-v, --invert-match
	反转匹配状态，选择未匹配的行。
-w, --word-regexp
	只有一个单词被匹配才会被打印。如果只是某个字符串中有部分，则不会打印。
-x, --line-regexp
	只有一行完全匹配才会被打印。
-y
	-i的过去时同义词
```

#### 通用输出控制

```shell
-c, --count
	为每个打印输出添加计数。
--color[=WHEN], --colour[=WHEN]
	围绕着匹配（非空）字符串、匹配行、上下文行、文件名、行号、字节偏移量和分隔符（用于字	段和上下文行组）以及用于显示它们的转义序列在终端上显示颜色。颜色由环境变量GREP_COORS	 定义。这个仍然支持不推荐使用的环境变量GREP_COLOR，但其设置没有优先级。WHEN可以是：    never、always、auto。
-L, --files-without-match
	只打印未被匹配的文件的名称
-l, --files-with-matches
	只打印有匹配的文件的名称
-m NUM, --max-count=NUM	
	匹配到给定次数后停止匹配
-o, --only-matching
	只打印该行匹配的字符，其他该行上下文内容不打印
-q, --quiet, --silent
	所有的输出都不会到STDOUT上，如果没有任何匹配则会立马退出以0的状态。
-s, --no-messages
	关闭所有的错误

```

#### 行前缀输出控制

```shell
-b, --byte-offset
	输出同时打印字节在改行的偏移位置
-H, --with-filename
	打印匹配文件的名称，这是个默认开启的选项
-h, --no-filename
	不打印匹配的文件名称
--label=LABEL
	将给定<标签>作为标准输入文件名前缀
-n, --line-number
	打印行号
-T, --initial-tab
	行首制表符对齐（如有必要）
-Z, --null
 	在<文件>名最后打印空字符
```

#### 上下文行控制

```shell
-A NUM, --after-context=NUM
	打印匹配文字该段后的额外n行
-B NUM, --before-context=NUM
	打印匹配文字该段前的额外n行
-C NUM, -NUM, --context=NUM
	打印匹配文字改行的前后n行

```

#### 文件与文件夹选择

```shell
-a, --text
	处理二进制文件就如同处理文本一样，等同`--binary-files=text`
--binary-files=TYPE
	设定二进制文件的 TYPE（类型）
-D ACTION, --devices=ACTION
	如果读入的是设备，FIFO，套接字，则可以使用此来配置处理。默认的ACTION=read。
-d ACTION, --directories=ACTION
	与上面意义一样，只不是针对文件夹
--exclude=GLOB
	跳过匹配 GLOB 的文件
--exclude-from=FILE
	跳过所有匹配给定文件内容中任意模式的文件
--exclude-dir=GLOB
	跳过所有匹配 GLOB 的目录
--include=GLOB
	只匹配那些匹配 GLOB 的文件。 GLOB 使用通配符。
-r, --recursive
	-r 表示递归读取目录。但是如果目录有符号链接，不会读取符号链接指向的文件。
-R, --dereference-recursive
	与 -r 类似，区别在于，如果目录下有符号链接，它会读取符号链接指向的文件。
```

#### 其他选项

```shell
--line-buffered
	每行输出后刷新输出缓冲区
 -U, --binary
 	...
```

### 关键用法讲解与实例

> 文件名为`demo.txt`,文件内容如下：

```tex
	The Universal Serial Bus Specification [2] defines the powerful concept of a “device class”. Devices that have similar reporting characteristics are grouped together into a “device class”. Instead of requiring a separate software driver for each new type of computer peripheral device, a single class driver is provided for each device class. The “HID class” is one such group, and these devices further have the capability to describe themselves to the class driver, e.g., what types of data they can send and exactly how they report data. This enables future devices to be developed without the need to modify the host software.
	Though defined by specifications released by the USB Implementers Forum, Inc., the USB HID protocols are not specific to USB or any other type of physical data transport. It is the intention of this document to describe how to use the  USB HID protocols over the Bluetooth wireless communications system, allowing manufacturers of input devices 
to produce high performance, interoperable, and secure wireless input devices.
```

+ `-i`忽略大小写

```shell
grep -i devices
# 可以匹配到：devices Devices DeviceS
```

+ `-n`打印行号
+ `-s`关闭所有错误
+ `-r`递归搜索
+ `-v`打印未匹配的行

```shell
grep -v devices
```

+ `-c`打印文件中匹配的成功次数

```shell
grep -rc devices
# 打印如下，后面数字是匹配次数
# demo.text:3
# help.txt:2
# HOWTO.txt:0
# liu1.txt:0
# oop.txt:0
# px1.txt:0
```

+ `-A,-B,-C`：after，before，context-line

```shell
grep -A 2 -B 3 devices
```

+  `--exclude`

```shell
#使用通配符*，指明后缀
grep -nisr devices --exclude=*.txt
# 一个都没匹配到

# 文件全名
grep -nisr devices --exclude=demo.txt
# 可以匹配到几个

# 多个类型文件
grep -nisr devices --exclude=*.{txt,png,c}
```

+ `--exclude-dir`

```shell
# 除去一些文件夹
grep -nisr devices --exclude-dir={sys,proc}
```

# awk

> awk命令会一次读取一行，按照输入的分隔符进行切片，将每片直接保存在内建的变量：`$1,$2,$3...`等。`$0`表示所有的段。其默认的分割符为空格。

[GNU参考](www.gnu.org/software/gawk/manual/gawk.html)

## 基础用法

### 格式

```shell
awk [options] 'program' File....
```

+ option:
  + `-F`:指定输入时用到的字段分割符
  + `-v`:var=VALUE,自定义一个变量。(注：在AWK中引用变量不需要加$,直接可以使用)
  + `-f`:引入awk执行脚本,他的命令是：`awk -f program-file File...`
+ program格式如下:

```shell
pattern { action }
pattern { action }
```

### 编程语法(program)



# sed

> `sed(stream editor)`流编辑器，是一个面向行处理的工具，它以“行”位处理单位，针对每一行进行处理，处理后的结果会输出到标准输出`(STDOUT)`。他不会对文件进行贸然更改而是将(除非使用`i`)，而是将所有的结果输出到标准输出中。

## 命令用法

```shell
sed [选项]... {脚本(如果没有其他脚本)} [输入文件]... #来自中文--help
sed SCRIPT INPUTFILE...
sed OPTIONS... [SCRIPT] [INPUTFILE...]
```

**实际上可能下面两条使用得较多**

<font color=green>**`Tips`:**</font>此处的*script(脚本)*实际上应该翻译成:一系列命令。`script`并不是通用的一种语法格式，而是sed内建。使用时，script的意义是用该脚本处理每一行数据。

##  选项

```shell
 -n, --quiet, --silent
                 取消自动打印模式空间。仅仅显示处理后的数据
      --debug
                 annotate program execution
  -e 脚本, --expression=脚本
                 添加“脚本(命令-command)”到程序的运行列表
  -f 脚本文件, --file=脚本文件
                 添加“脚本文件”到程序的运行列表
  --follow-symlinks
                 直接修改文件时跟随软链接
  -i[扩展名], --in-place[=扩展名]
                 直接修改文件（如果指定扩展名则备份文件）
  -l N, --line-length=N
                 指定“l”命令的换行期望长度
  --posix
                 关闭所有 GNU 扩展
  -E, -r, --regexp-extended
                 在脚本中使用扩展正则表达式
                 （为保证可移植性使用 POSIX -E）。
  -s, --separate
                 将输入文件视为各个独立的文件而不是单个
                 长的连续输入流。
      --sandbox
                 在沙盒模式中进行操作（禁用 e/r/w 命令）。
  -u, --unbuffered
                 从输入文件读取最少的数据，更频繁的刷新输出
  -z, --null-data
                 使用 NUL 字符分隔各行
      --help     打印帮助并退出
      --version  输出版本信息并退出

如果没有 -e, --expression, -f 或 --file 选项，那么第一个非选项参数被视为
sed脚本。其他非选项参数被视为输入文件，如果没有输入文件，那么程序将从标准
输入读取数据。
```

## 用法

### Script的语法

> 接下来的语法都是建立在该基础上的

Script组成结构：

```shell
' 地址界定+编辑命令[命令附加选项] ' #中间不用空格，连接使用，编辑命令实际上也可称为操作。
```

用来处理的文档模板,下面测试会用该文件（`disk.list`）：

```shell
Filesystem      Size  Used Avail Use% Mounted on
udev            1.9G     0  1.9G   0% /dev
tmpfs           391M  4.9M  386M   2% /run
/dev/sda1       492G   53G  414G  12% /
tmpfs           2.0G   36M  1.9G   2% /dev/shm
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
/dev/loop2       63M   63M     0 100% /snap/gtk-common-themes/1506
/dev/loop4      2.3M  2.3M     0 100% /snap/gnome-system-monitor/157
/dev/loop5      256M  256M     0 100% /snap/gnome-3-34-1804/36
/dev/loop3      2.5M  2.5M     0 100% /snap/gnome-calculator/748
/dev/loop0       56M   56M     0 100% /snap/core18/1885
/dev/loop6      219M  219M     0 100% /snap/gnome-3-34-1804/66
/dev/loop7      384K  384K     0 100% /snap/gnome-characters/550
/dev/loop1       56M   56M     0 100% /snap/core18/1997
/dev/loop8       33M   33M     0 100% /snap/snapd/11588
/dev/loop10     1.0M  1.0M     0 100% /snap/gnome-logs/100
/dev/loop11     640K  640K     0 100% /snap/gnome-logs/103
/dev/loop9      2.3M  2.3M     0 100% /snap/gnome-system-monitor/148
/dev/loop12      65M   65M     0 100% /snap/gtk-common-themes/1514
/dev/loop13     2.5M  2.5M     0 100% /snap/gnome-calculator/884
/dev/loop14     384K  384K     0 100% /snap/gnome-characters/570
/dev/loop15      30M   30M     0 100% /snap/snapd/8542
tmpfs           391M   52K  391M   1% /run/user/1000
```

#### 地址界定

+ 空地址

```shell
sed -n '/^\/dev/p' disk.list
# -n表示仅仅输出处理结果后的数据，如果不加的话，会输出整个disk.list
# 这里script-> '/^\/dev/p',使用的是正则表达式，"/^\/dev/""表示寻找"/dev"开头的行。
# p则是编辑命令类，其实也称为操作,表示打印
# 这里没有限定行数

sed 's/dev/sys/' disk.list > disk_new.list
```

+ 单地址

```shell
sed -n '3p' disk.list
# 处理(打印)第三行
```

+ 地址范围

```shell
sed -n '3,4p' disk.list
# 处理(打印)3到4行的数据

sed '3s/tmpfs/unknownfs/' disk.list
# 替换disk.list内容中第三行中“tmpfs”为“unknownfs”.
# 这里没有加-n，使用-n无显示数据。

sed -n '8,$p' disk.list
# $表示最后一行，这里是打印8到最后一行
# 行号是从1开始，而0行则表示整个文件的内容。
```

+ 步长

```shell
sed -n '1~2p' disk.list
# 总体表现为打印奇数行
# 实际上是从1行开始，隔两行（从下一行数起，打印第2行数据）才打印。

sed -n '2~2p' disk.list
# 总体表现为打印偶数数行
```

+ 正则来作为界定

> 正则使用两个斜杠`/regExp/`来括起来。

```shell
sed '/^\/dev/s/M/兆/g' disk.list
# 对行开头是"/dev"的行替换其中的"M"为中文"兆"
# g-表示该行所有都进行替换，不加g的话，只会替换第一个

sed '1,/lock/s/M/兆/g' disk.list
# !!!这里是将行号与正则结合的选行
```

+ 反选行

> `!`加在地址界定末尾，命令之前，表示取这些行的补集。

```shell
sed -n '2,$!p' disk.list
# 打印除第2行到最后一行的补集[2,∞]，也就是[1,1],整个集合是[0,∞]

sed -n '1~2!p' disk.list
# 本来是打印奇数行，取补集，则是打印偶数行

sed '/dev/!s/G/吉/g' disk.list |sed '/dev/!s/(?=[0-9])M/兆/g'
# 将行开头不含有"/dev"的行中的“G”，“M”替换为吉和兆
# 这里“(?=[0-9])”使用了非捕获元

```

+ 额外附加行

> 使用`+`完成

```shell
sed -n '2,+2p' disk.list
# 打印第2行，并额外打印后2行(第3,4行)
```

+ 额外倍数行

```shell
sed -n '5,~5p' disk.list
# 打印从第5行开始至第10行。
# “~5”表示“5的倍数行”，有：5,10,15...
# 而从5开始数起，最近的是10，故打印：[5,10]行
```

#### 命令

| 命令 | 说明                                                         | 示例                                                         |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `d`  | 删除                                                         | `sed '1,2d' disk.list`                                       |
| `p`  | 显示模式空间内容                                             | `sed '1~2p' disk.list`                                       |
| `a`  | 在匹配到的行后面追加文本（一行）                             | `sed '4,5a \text\nsecond' disk.list`<br />添加多个行用`\`分隔开 |
| `i`  | 将匹配到的行的前面插入文本（一行）                           | `sed '3i \text\none' disk.list`                              |
| `c`  | 把匹配到的行替换为指定的文本（一行）                         | `sed '/tempfs/c \~~' disk.list`                              |
| `w`  | 保存模式空间匹配到的行至指定的文件中                         |                                                              |
| `r`  | 读取指定文件的内容至当前文件被模式匹配到的行后面，实现文件合并 | `sed '4,5r /etc/issue' disk.list`<br />每一行的下一行都会加该文件的内容 |
| `=`  | 为模式匹配到的行打印行号                                     |                                                              |
| `!`  | 条件取反                                                     | 前面有过示例，使用在地址界定上。                             |
| `s`  | 查找替换，其分隔符可以自己指定，除`s///`还有`@@@`和`###`。<br />命令扩展选项：1.`s/pattern/string/g`中的`g`表示全局替换<br />2.`s/pattern/string/gw /path/file`中的`w`表示将数据保存至`/path/file`<br />3.`p`显示替换成功的行 |                                                              |

### 查找

> 查找并不改变原本内容，只是找到对应文本。

```shell
# 输出第三行的内容
sed -n '3p' disk.list

# 输出3-5行内容
sed -n '3,5p' disk.list

# 输出第3行与第5行内容。使用分号隔开
sed -n '3p;5p' disk.list

# 输出所有的奇数行
sed -n 'p;n' disk.list
sed -n '1~2p' disk.list

# 输出所有的偶数行
sed -n 'n;p' disk.list
sed -n '2~2p' disk.list

# 输出1-5行中的奇数行
sed -n '1,5{p;n}' disk.list
# 输出1-5行中的偶数行
sed -n '1,5{2~2p}' disk.list
# 输出7行以后的偶数行
sed -n '7,${n;p}' disk.list

# 从第3行输出，再额外追加输出5行
sed -n '3,+5p' disk.list
```

### 删除

> 利用的是命令`d`,注意是删除匹配到条件的整行。这里不再赘述，因为前面`Script`语法提过

### 插入

> 利用命令`i`,注意是在匹配的行上一行添加内容行。
>
> 利用命令`a`,注意是在匹配的行下一行添加内容行。

```shell
sed '2i This is context' disk.list
sed '\/dev\/a This is append context' disk.list
```



### 替换

#### 基于`c`的替换

> 前后提过

#### 基于`s`的替换

> 这种替换是部分替换

```shell
sed 's/dev/***' disk.list
# 将每一行的第一个dev替换为“***”

sed 's/dev/***/2' disk.list
# 将每一行的第2个dev替换为“***”

sed 's/dev/***/g' disk.list
# 将每一行的所有dev替换为“***”

sed 's/^/#/' disk.list
# 在每一行前面加一个#

sed '/dev/s/^/#/' disk.list
# 在含dev行的前面加#

sed '3,5s/dev/***/g' disk.list
# 将3-5行中的dev替换为"***"
```

### 迁移符合条件的文本

> 迁移文本的参数

```shell
H:赋值到剪贴板
g、G:将剪贴板中的数据覆盖/追加至指定行
w:保存为文件
r:读取指定文件
a:追加指定内容
I、i:忽略大小写
```

```shell
sed '/^\w+/{H;d};$G' disk.list
# 将含有dev的行剪切，粘贴到最后一行
# {;}用于多个操作

sed '1,5/{H;d};14G' disk.list
# 将1-5行的内容追加到14行后

sed '3a #####' disk.list
# 在第三行后追加行"#####"

sed '/dev/a ####' disk.list
# 在含有dev的行后一行插入一个新行，内容为“####”

sed '3a ####\n#####' disk.list
# 在第三行后面插入，"\n"表示换行
```

### 使用文件来控制

> `-f`命令运行文件中的`script`，文件格式如下(`sed.script`)：

```shell
1，5H
1,5D
14G
```

接着，使用命令：

```shell
# 文件内容不变，但是输出是改变的
sed -f sed.script disk.list


# 或者修改源文件，加上"-i"
sed -f sed.script -i disk.list
```

**<font color=red size=5>注意：</font>**`sed` 中使用变量的话需要使用`""`而不是`''`。

# read

[参考](https://www.computerhope.com/unix/bash/read.htm)

> 从屏幕标准输入中读取一行。默认情况下。read将`换行符`视作行的结尾。

# declare

[参考](https://www.computerhope.com/unix/bash/declare.htm)

> + 声明`shell`变量和函数
> + 设置属性
> + 显示值

# let

[参考](https://www.computerhope.com/unix/bash/let.htm)

> + 用于计算算术表达式
>
> let是linux内置命令。而`((...))`是复合命令。

# expr

> 通用求值表达式：通过给定的操作（参数之间必须空格隔开）连接参数，并对参数求值。可使用算术、比较、字符串或逻辑操作。

```shell
expr 3 + 5
expr 3 \* 5 # 3乘以5
```



# print

# xargs



# test

[参考](https://www.computerhope.com/unix/bash/test.htm)

> + 检查文件类型并比较值

```shell
# 语法
test expression

# 应用 1：比较两个字符串（一般是判断字符串是否相等），比较运算符移步前面介绍部分 ---------> 比较运算符

# 应用 2：数字大小比较
```

# ping

