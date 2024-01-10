---
title: 02 maven 与springboot
---

### 2.1 maven 概述

* 自动构建
* 依赖管理


maven 的目录结构
- src 目录
- targer
- pom.xml

src 目录  包含main和test连个目录
main 放生产代码和生产问价的，test用来放测试代码和资源

main目录包含 java 和resource两个文件夹，java文件夹里方java代码，resource里面防一些配置文件和资源

maven 工程 在编译的时候 会把class文件和resource文件根据各自的目录结构进行合并，拷贝到同一目录下，最后打包


**pom**文件

maven的打包由pom由pom文件进行管理
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!--    模型版本需要设置为 4。0 -->
    <modelVersion>4.0.0</modelVersion>


    <!--    定义pom的继承关系-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.7</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <!--    工程标识， 在一个组织会项目中通常是唯一的-->
    <groupId>org.clxmm</groupId>
    <!--    工程标识，通常为项目的名称-->
    <artifactId>autowierdemo</artifactId>
    <!--    工程标识，版本号-->
    <version>0.0.1-SNAPSHOT</version>


    <name>autowierdemo</name>
    <description>Demo project for Spring Boot</description>

    <!--    定义属性，可以用在后面的定义中 -->
    <properties>
        <java.version>11</java.version>
    </properties>

    <!--    打包方式-->
    <packaging>jar</packaging>


    <!--定义依赖关系-->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>


    <!--    定义构建方法-->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>


    <!--    maven的仓库,不写，默认用 setting文件的仓库地址 -->
<!--    <repositories>-->
<!--        -->
<!--        -->
<!--    </repositories>-->


</project>

```

### 2.2 的生命周期
* clean（清理）
* Default（构建）
* Site（站点，生成一些报告，如测试报告，api文档）

每个生命周期是相互独立的 

**clean**
pre-clean（预备工作）  --》  clean  --》 post-clean （善后工作）

**default**
validate ， initialize ， generate-sources ，process-sourcess，generate-resources ，process-resources，**compile**
process-class,generate-test-sources,process-test-resources,process-test-resources,test-compile,process-test-class,**test**
preare-package,**package**,pre-integration-test,integration-test,post-integration-test,**verfy**,**install**,**deploy**


**site**

pre-site,**site**,post-site,site-deploy


生命周期的执行其实是有maven绑定的插件去执行的，完成相应的插件


### 2.3 maven的插件

插件的每个功能称为插件的目标，plugin goal

**spring-boot-maven-plugin**
springboot：run

springboot：repackage

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202106/maven20210620190552.png)


这些没有与maven的生命周期绑定起来，只是在插件中引进来


很多时候我们会把plugin 中的目标与生命周期中的阶段绑定起来的，

**内置绑定**

clean -> maven-clean-plugin:clean

default (jar/war)
process-resources -> maven-resources-plugin:resources 

compile -> maven-complie-plugin:compile 

process-test-resources -> maven-resource-plugin:testResources


default(pom)

install

deploy 


site

site

site-delpoy

**自定义绑定**





例子：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202106/maven20210620192200.png)





### 2.4 ide与maven对比





