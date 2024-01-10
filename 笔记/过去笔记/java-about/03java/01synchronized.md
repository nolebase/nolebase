---

title: 05 并发编程中的synchronized  (1)

---

## 并发编程中的三个问题

### 1.可见性

- 可见性概念

  ​	可见性(Visibility):是指一个线程对共享变量进行修改，另一个先立即得到修改后的最新值。	

- 可见性演示

  ​	案例演示:一个线程根据boolean类型的标记flag， while循环，另一个线程改变这个flag变量的值，另 一个线程并不会停止循环。

```java
/**
     * 可见性问题
     * 1。创建要一个共享变量
     * 2。创建一条不断读取共享变量
     * 3。创建一条线程修改共享变量
     * 
     * 并发编程时，会出现可见性问题，当一个线程对共享变量进行了修改，另外的线程并没有立即看到修改
     * 后的最新值。
     */
    private static boolean flag = true;
    public static void main(String[] args) throws InterruptedException {
        new  Thread(() -> {
            while (flag) {

            }
        }).start();

        Thread.sleep(2_000);
        new  Thread(() -> {
            flag = false;
            System.out.println("修改了flag " + flag);
        }).start();


    }
```

### 2.原子性

 - 原子性概念

   原子性(Atomicity):在一次或多次操作中，要么所有的操作都执行并且不会受其他因素干扰而中断，要么所有的操作都不执行。

 - 原子性演示

   案例演示:5个线程各执行1000次 i++;

```java
   /**
     * 5个线程各执行1000次 i++;
     * @param args
     */
    private static int number = 0;
    public static void main(String[] args) throws InterruptedException {
        Runnable inc = () -> {
            for (int i = 0; i < 1000; i++) {
                number ++;
            }
        };

        List<Thread> list = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Thread t = new Thread(inc);
            t.start();
            list.add(t);
        }

        for (Thread thread : list) {
            thread.join();
        }

        System.out.println(number);
    }

```

​		其中，对于 number++ 而言(number 为静态变量)，实际会产生如下的 JVM 字节码指令:

```
9: getstatic     #12                 // Field number:I
12: iconst_1
13: iadd
14: putstatic     #12                 // Field number:I
```

​		由此可见number++是由多条语句组成，以上多条指令在一个线程的情况下是不会出问题的，但是在多 线程情况下就可能会出现问题。比如一个线程在执行13: iadd时，另一个线程又执行9: getstatic。会导 致两次number++，实际上只加了1。

**并发编程时，会出现原子性问题，当一个线程对共享变量操作到一半时，另外的线程也有可能来操作共 享变量，干扰了前一个线程的操作。**

### 3.有序性

- 有序性概念

  ​		有序性(Ordering):是指程序中代码的执行顺序，Java在编译时和运行时会对代码进行优化，会导致 程序最终的执行顺序不一定就是我们编写代码时的顺序。

- 有序性演示

  jcstress是java并发压测工具。https://wiki.openjdk.java.net/display/CodeTools/jcstress

  修改pom文件，添加依赖:

  ```xml
  <dependency>
      <groupId>org.openjdk.jcstress</groupId>
      <artifactId>jcstress-core</artifactId>
      <version>0.5</version>
  </dependency>
  ```

```java
@JCStressTest
@Outcome(id = {"1","4"}, expect = Expect.ACCEPTABLE, desc = "ok")
@Outcome(id = "0", expect = Expect.ACCEPTABLE_INTERESTING,desc = "danger")
@State
class Test03Ordering {


    int num = 0;
    boolean ready = false;

    // 线程一执行的代码
    @Actor
    public void actor1(I_Result r) {
        if (ready) {
            r.r1 = num + num;
        } else {
            r.r1 = 1;
        }
    }

    // 线程2执行的代码
    @Actor
    public void actor2(I_Result r) {
        num = 2;
        ready = true;
    }

}
```



​		I_Result 是一个对象，有一个属性 r1 用来保存结果，在多线程情况下可能出现几种结果? 情况1:线 程1先执行actor1，这时ready = false，所以进入else分支结果为1。

​		情况2:线程2执行到actor2，执行了num = 2;和ready = true，线程1执行，这回进入 if 分支，结果为 4。

​		情况3:线程2先执行actor2，只执行num = 2;但没来得及执行 ready = true，线程1执行，还是进入 else分支，结果为1。

​		还有一种结果0。

程序代码在执行过程中的先后顺序，由于Java在编译期以及运行期的优化，导致了代码的执行顺序未必 就是开发者编写代码时的顺序。

## 第二章:Java内存模型( JMM)

### 1. 计算机结构

- 计算机结构简介

冯诺依曼，提出计算机由五大组成部分，输入设备，输出设备存储器，控制器，运算器。

- CPU
- 内存
- 缓存

### 2. Java内存模型

#### Java内存模型的概念

​	Java Memory Molde (Java内存模型/JMM)，千万不要和Java内存结构混淆

​	https://download.oracle.com/otn-pub/jcp/memory_model-1.0-pfd-spec-oth-JSpec/memory_model-1_0-pfd-spec.pdf

Java内存模型，是Java虚拟机规范中所定义的一种内存模型，Java内存模型是标准化的，屏蔽掉了底层不同计算机的区别。 

Java内存模型是一套规范，描述了Java程序中各种变量(线程共享变量)的访问规则，以及在JVM中将变量 存储到内存和从内存中读取变量这样的底层细节，具体如下。

- 主内存

  主内存是所有线程都共享的，都能访问的。所有的共享变量都存储于主内存。

- 工作内存

  每一个线程有自己的工作内存，工作内存只存储该线程对共享变量的副本。线程对变量的所有的操 作(读，取)都必须在工作内存中完成，而不能直接读写主内存中的变量，不同线程之间也不能直接 访问对方工作内存中的变量。

Java内存模型的作用

​	Java内存模型是一套在多线程读写共享数据时，对共享数据的可见性、有序性、和原子性的规则和保障。

synchronized,volatile 

#### CPU缓存，内存与Java内存模型的关系

​		通过对前面的CPU硬件内存架构、Java内存模型以及Java多线程的实现原理的了解，我们应该已经意识 到，多线程的执行最终都会映射到硬件处理器上进行执行。

​		但Java内存模型和硬件内存架构并不完全一致。对于硬件内存来说只有寄存器、缓存内存、主内存的概 念，并没有工作内存和主内存之分，也就是说Java内存模型对内存的划分对硬件内存并没有任何影响， 因为JMM只是一种抽象的概念，是一组规则，不管是工作内存的数据还是主内存的数据，对于计算机硬 件来说都会存储在计算机主内存中，当然也有可能存储到CPU缓存或者寄存器中，因此总体上来说， Java内存模型和计算机硬件内存架构是一个相互交叉的关系，是一种抽象概念划分与真实物理硬件的交叉。

​	Java内存模型是一套规范，描述了Java程序中各种变量(线程共享变量)的访问规则，以及在JVM中将变量 存储到内存和从内存中读取变量这样的底层细节，Java内存模型是对共享数据的可见性、有序性、和原 子性的规则和保障。

## 第三章 synchronized保证三大特性

1. synchronized与原子性

	synchronized保证原子性的原理，synchronized保证只有一个线程拿到锁，能够进入同步代码块。
2. synchronized与可见性
	synchronized保证可见性的原理，执行synchronized时，会对应lock原子操作会刷新工作内存中共享变 量的值
```java
package com.itheima.demo02_concurrent_problem; 
/**
案例演示:
一个线程根据boolean类型的标记flag， while循环，另一个线程改变这个flag变量的值， 另一个线程并不会停止循环.
*/
public class Test01Visibility {
// 多个线程都会访问的数据，我们称为线程的共享数据
private static boolean run = true;
  
public static void main(String[] args) throws InterruptedException {
Thread t1 = new Thread(() -> { 
  while (run) {
    // 方法2
    synchronized(obj) {
      
    }
    //方法2
    // 或者 打印，里面有用到synchronized
    // 增加对象共享数据的打印，println是同步方法
    System.out.println("run = " + run); }
    });
t1.start(); 
Thread.sleep(1000);  
Thread t2 = new Thread(() -> { 
  run = false;
  System.out.println("时间到，线程2设置为false"); 
});
  t2.start(); }
}
```
3. synchronized与有序性
	
	重排序： 为了提高程序的执行效率，编译器和CPU会对程序中代码进行重排序。
	
	as-if-serial语义的意思是: 不管编译器和CPU如何重排序，必须保证在单线程情况下程序的结果是正确 的。
	synchronized后，虽然进行了重排序，保证只有一个线程会进入同步代码块，也能保证有序性。
	synchronized保证有序性的原理，我们加synchronized后，依然会发生重排序，只不过，我们有同步 代码块，可以保证只有一个线程执行同步代码中的代码。保证有序性

## 第四章:synchronized的特性

###  1. 可重入特性

一个线程可以多次执行synchronized,重复获取同一把锁。

```java
public class Demo1 {


    public static void main(String[] args) {
        new MyThread().start();
        new MyThread().start();
    }


}

// 自定义一个线程类
class MyThread extends Thread {

    @Override
    public void run() {
        synchronized (MyThread.class) {
            System.out.println(getName() + "1");
        }

        synchronized (MyThread.class) {
            System.out.println(getName() + "2");
        }


    }
}
```

输出：

Thread-01
Thread-02
Thread-11
Thread-12

说明：synchronized的锁对象中有一个计数器(recursions变量)会记录线程获得几次锁.

1. 可以避免死锁

2. 可以让我们更好的来封装代码

   synchronized是可重入锁，内部锁对象中会有一个计数器记录线程获取几次锁啦，在执行完同步代码块时，计数器的数量会-1，知道计数器的数量为0，就释放这个锁。

### 2. 不可中断特性

​	synchronized不可中断特性

​		一个线程获得锁后，另一个线程想要获得锁，必须处于阻塞或等待状态，如果第一个线程不释放锁，第 二个线程会一直阻塞或等待，不可被中断。

​	Lock的可中断特性

不可中断

```java
public class Demo02_Uninterruptible {
    /*
    目标:演示synchronized不可中断
    1.定义一个Runnable
    2.在Runnable定义同步代码块
    3.先开启一个线程来执行同步代码块,保证不退出同步代码块
    4.后开启一个线程来执行同步代码块(阻塞状态)
    5.停止第二个线程
    */
    private static Object obj = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable runnable = () -> {
            synchronized (obj) {
                String name = Thread.currentThread().getName();
                System.out.println(name + "进入同步代码块");
                // 保证不退出同步代码块
                try {
                    Thread.sleep(888888);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };


        // 3.先开启一个线程来执行同步代码块
        Thread t1 = new Thread(runnable);
        t1.start();
        Thread.sleep(1000);

        // 4.后开启一个线程来执行同步代码块(阻塞状态)
        Thread t2 = new Thread(runnable);
        t2.start();

        // 5.停止第二个线程
        System.out.println("停止线程前");
        t2.interrupt();
        System.out.println("停止线程后");


        System.out.println(t1.getState());
        System.out.println(t2.getState());
    }
}
```



输出：

Thread-0进入同步代码块
停止线程前
停止线程后
TIMED_WAITING
BLOCKED。 // 并没有中断

可中断

```java
public class Demo03_Interruptible {
    //演示Lock不可中断和可中断

    private static Lock lock = new ReentrantLock();

    public static void main(String[] args) throws InterruptedException {
//        test01();
        test02();
    }

    //可中断
    public static void test02() throws InterruptedException {
        Runnable run = () -> {
            String name = Thread.currentThread().getName();
            boolean b = false;
            try {
                b = lock.tryLock(3, TimeUnit.SECONDS);
                if (b) {
                    System.out.println(name + "获得锁,进入锁执行");
                    Thread.sleep(88888);
                } else {
                    System.out.println(name + "在指定时间没有得到锁做其他操作");
                }
                Thread.sleep(8888);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (b) {
                    lock.unlock();
                    System.out.println(name + " unlock");
                }
            }


        };
        Thread t1 = new Thread(run);
        t1.start();
        Thread.sleep(1000);
        Thread t2 = new Thread(run);
        t2.start();
        /**
         * Thread-0获得锁,进入锁执行
         * Thread-1在指定时间没有得到锁做其他操作
         */
//        System.out.println("停止t2线程前");
//        t2.interrupt();
//        System.out.println("停止t2线程后");
//        Thread.sleep(1000);
//        System.out.println(t1.getState());
//        System.out.println(t2.getState());

        /**
         *  输出
         * 停止t2线程前
         * 停止t2线程后
         * java.lang.InterruptedException
         * 	at java.util.concurrent.locks.AbstractQueuedSynchronizer.doAcquireNanos(AbstractQueuedSynchronizer.java:936)
         * 	at java.util.concurrent.locks.AbstractQueuedSynchronizer.tryAcquireNanos(AbstractQueuedSynchronizer.java:1247)
         * 	at java.util.concurrent.locks.ReentrantLock.tryLock(ReentrantLock.java:442)
         * 	at prg.clxmm.nature.Demo03_Interruptible.lambda$test02$0(Demo03_Interruptible.java:28)
         * 	at java.lang.Thread.run(Thread.java:748)
         * TIMED_WAITING
         * TERMINATED
         */

    }

    // Lock不可中断
    public static void test01() throws InterruptedException {
        String name = Thread.currentThread().getName();
        Runnable run = () -> {
            try {

                lock.lock();
                Thread.sleep(888888);
                System.out.println(name + "获得锁，进入锁执行");
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
                System.out.println(name + "unlock");
            }
        };

        Thread t1 = new Thread(run);
        t1.start();
        Thread.sleep(1000);
        Thread t2 = new Thread(run);
        t2.start();


        System.out.println("停止t2线程前");
        t2.interrupt();
        System.out.println("停止t2线程后"); //
        Thread.sleep(1000);
        System.out.println(t1.getState());
        System.out.println(t2.getState());
        /**
         * 输出
         * 停止t2线程前
         * 停止t2线程后
         * TIMED_WAITING
         * WAITING
         */

    }

}
```



不可中断是指，当一个线程获得锁后，另一个线程一直处于阻塞或等待状态，前一个线程不释放锁，后 一个线程会一直阻塞或等待，不可被中断。

synchronized属于不可被中断

Lock的lock方法是不可中断的

Lock的tryLock方法是可中断的

## 第五章:synchronized

monitorenter

https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.monitorenter

翻译过来: 每一个对象都会和一个监视器monitor关联。监视器被占用时会被锁住，其他线程无法来获 取该monitor。 当JVM执行某个线程的某个方法内部的monitorenter时，它会尝试去获取当前对象对应 的monitor的所有权。其过程如下:

1. 若monior的进入数为0，线程可以进入monitor，并将monitor的进入数置为1。当前线程成为 monitor的owner(所有者)

2. 若线程已拥有monitor的所有权，允许它重入monitor，则进入monitor的进入数加1

3. 若其他线程已经占有monitor的所有权，那么当前尝试获取monitor的所有权的线程会被阻塞，直

   到monitor的进入数变为0，才能重新尝试获取monitor的所有权。

monitorenter小结:

synchronized的锁对象会关联一个monitor,这个monitor不是我们主动创建的,是JVM的线程执行到这个 同步代码块,发现锁对象没有monitor就会创建monitor,monitor内部有两个重要的成员变量owner:拥有 这把锁的线程,recursions会记录线程拥有锁的次数,当一个线程拥有monitor后其他线程只能等待



monitorexit：

https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html%23jvms-6.5.monitorexit

1. 能执行monitorexit指令的线程一定是拥有当前对象的monitor的所有权的线程。

2. 执行monitorexit时会将monitor的进入数减1。当monitor的进入数减为0时，当前线程退出

   monitor，不再拥有monitor的所有权，此时其他被这个monitor阻塞的线程可以尝试去获取这个 monitor的所有权

monitorexit释放锁。 

monitorexit插入在方法结束处和异常处，JVM保证每个monitorenter必须有对应的monitorexit。



synchroznied出现异常会释放锁吗? 

会释放锁



同步方法：

https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.10

可以看到同步方法在反汇编后，会增加 ACC_SYNCHRONIZED 修饰。会隐式调用monitorenter和 monitorexit。在执行同步方法前会调用monitorenter，在执行完同步方法后会调用monitorexit。

通过javap反汇编我们看到synchronized使用编程了monitorentor和monitorexit两个指令.每个锁对象 都会关联一个monitor(监视器,它才是真正的锁对象),它内部有两个重要的成员变量owner会保存获得锁 的线程,recursions会保存线程获得锁的次数,当执行到monitorexit时,recursions会-1,当计数器减到0时 这个线程就会释放锁



synchronized与Lock的区别

1. synchronized是关键字，而Lock是一个接口。
2. synchronized会自动释放锁，而Lock必须手动释放锁。
3. synchronized是不可中断的，Lock可以中断也可以不中断。
4. 通过Lock可以知道线程有没有拿到锁，而synchronized不能。
5. synchronized能锁住方法和代码块，而Lock只能锁住代码块。
6. Lock可以使用读锁提高多线程读效率。
7. synchronized是非公平锁，ReentrantLock可以控制是否是公平锁。



