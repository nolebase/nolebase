---
title: 07 gradle
---

## 1 Gradle工具使用入门到精通

### 课程引导语

​     Java作为一门世界级主流编程语言，有一款高效易用的项目管理工具是java开发者共同追求的心愿和目标。先是2000年Ant，后有2004年Maven两个工具的诞生，都在java市场上取得了巨大的成功。但是二者都有一定的不足和局限性。

​     2012年基于Ant和Maven产生的Gradle，弥补了Ant和Maven的不足，带来了一些更高效的特点。它使用一种基于Groovy的特定领域语言(DSL)来声明项目设置，抛弃了基于XML的各种繁琐配置。面向Java应用为主。当前其支持的语言限于Java、Groovy和Scala，计划未来将支持更多的语言。

### 课程简介

​    本课程主要分以下几个步骤来讲解gradle工具的使用：

1. Gradle安装配置（Windows版）

2. Gradle和idea集成

3. Groovy语言简单介绍

4. Gradle仓库的配置

5. Gradle入门案例

6. Gradle创建java web工程并在tomcat下运行

7. Gradle构建多模块项目



**下载地址**

[https://services.gradle.org/distributions/](https://services.gradle.org/distributions/)

## 2:Groovy语言

```groovy
// groovy
println("hello world");

// 省略分号
// 省略括号

println "hello groovy"

// groovy 定义变量
// def 弱类型，groovy根据情况来赋予相应的类型
def i = 18;
println i

def s = "hello world"
println s


// 1 定义集合
def list = ['a','b']
list << 'c'
println list[2]


// 2定义map
def map = ['k1':'v1','k2':'v2']
map.k3 = 'v3'
println map.get('k3')
println map.k3



// 3 groovy 闭包
// 什么是闭包？闭包其实就是一段代码块，在gradle中，主要是把闭包当参数使用
// 定义闭包
def b1 = {
    println 'hello b1'
}

// 定义方法，参数为闭包类型
def  method1 (Closure closure) {
    closure()
}

// 调用
method1 (b1)


def b2 = {
    v ->
        println "hello ${v}"

}

def  method2(Closure closure) {
    closure("clxmm")
}

method2(b2)


```

