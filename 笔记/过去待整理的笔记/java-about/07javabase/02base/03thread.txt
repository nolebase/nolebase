---
title: 03 thread 介绍(二)
---


## 线程简介（二）

### 线程优先级

- java提供一个线程调度器来监控程序中启动后进入就绪状态的所有线程，线程调度器按照优先级决定应该调度那个线程来执行
- 线程的优先级用数字标识，1到10
    - Thread
    - MIN_PRIORITY = 1;NORM_PRIORITY = 5;MAX_PRIORITY = 10;
- 获取或改变优先级
    - setPriority(int newPriority)
    - getPriority() 

**先设置优先级再启动**

优先级低只是意味着获得调度的概率低，并不是优先级低的不会被调用，都是看cpu的调度

性能倒置，一般不会


### 守护线程（daemon）

- 线程分为用户线程和守护线程
- 虚拟机必须确保用户线程执行完毕
- 虚拟机不用等待守护线程执行完毕
- 如：后台记录操作日志，监控内存，来及回收等待



**setDaemon(boolean on),默认是false**
```java
public class Test13Daemon {


    public static void main(String[] args) {
        God god = new God();
        People people = new People();
        Thread thread = new Thread(god);
        thread.setDaemon(true);  // 设置为守护线程
        thread.start();
        new Thread(people).start();
    }
}

class God implements  Runnable {
    @Override
    public void run() {
        while (true) {
            System.out.println("god");
        }
    }
}

class People implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
    }
}
```


##  02 线程同步


多个线程操作同一个资源


### 队列和锁

- 由于同一进程的多个线程共享一块存储空间，在带来方便的同时，也带来了访问冲突，为了保证数据在方法中被访问时的正确性，在访问时
加入**锁机制synchronized**，当一个线程获取对象的排他锁，独占资源，其他线程必须等待，使用会释放锁，存在以下问题
    - 一个线程有锁会导致其他所有需要此锁的线程挂起；
    - 在多线程竞争下，加锁、释放锁，会导致较多的上下文切换和调度延迟，引起性能问题
    - 如果一个优先级高的线程等待一个优先级低的线程释放锁，=会导致优先级倒置，引起性能问题；


### 线程不安全的例子

```java
public class Test01 {

    public static void main(String[] args) {
        BuyTicket buyTicket = new BuyTicket();
        
        new Thread(buyTicket).start();
        new Thread(buyTicket).start();
        new Thread(buyTicket).start();
    }


}


class BuyTicket implements Runnable {

    //
    private int ticketNums = 10;

    private boolean flag = true;

    @Override
    public void run() {

        while (flag) {
            buy();
        }

    }

    private void buy() {
        if (ticketNums <= 0) {
            flag = false;
            return;
        }


        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + ":" + ticketNums--);
    }

}
```


### 同步方法
- 通过private关键字保证数据对象只能被方法访问，所以我们只需要针对方法提出一套机制，这套机制就是synchronized关键字，有两种用法，
synchronized方法和synchronized块 **同步方法**
- synchronized方法控制对象的访问，每个对象对应一把锁，每个synchronized方法必须获得调用该方法的对象才能执行，否则线程会阻塞，
方法一旦执行，就会独占锁，知道该方法返回才能释放锁，后面被阻塞的线程才能获得这个锁，继续执行

**缺点，见一个大的方法声明为synchronized 将会影响效率**

synchronized 默认锁的是this
```java
    private synchronized void buy() {
        if (ticketNums <= 0) {
            flag = false;
            return;
        }


        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + ":" + ticketNums--);
    }
```


### 同步块

- synchronized（Obj）{}
- Obj 称为同步见识器
    - Obj可以是任何对象，但是推荐使用共享资源作为同步监视器
    - 同步方法中无需指定同步监视器，因为同步方法的同步监视器就是this就是对象本身，或者是class
- 同步监视器的执行过程
    - 1.第一个线程访问，锁定同步监视器，执行其中的方法
    - 2.第二个线程访问，发现同步监视器被锁定，无法访问
    - 3.第一个线程访问完毕，解锁同步监视器
    - 4 第二个线程访问完毕，发现同步监视器没锁，然后访问并锁定


### CopyOnWriteArrayList


```java
public static void main(String[] args) {
        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

        for (int i = 0; i < 100; i++) {

            new Thread(() -> {
                list.add(Thread.currentThread().getName());
            }).start();
        }


        try {
            Thread.sleep(3_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(list.size());
    }
```


### 死锁

多个线程各自独占一些共享资源，并且互相等待其他线程占用的资源才能运行，而4导致两个或多个线程都在等待对方释放资源，都停止执行的情况
某一个同步代码块同时拥有**两个以上对象的锁**就可能会发生’死锁‘的问题


### 避免死锁

死锁的必要条件
1. 互斥：一个资源每次只能被一个进程使用
2. 请求与保持： 一个进程因请求资源而阻塞时，对已获得的资源保持不放
3. 不剥夺：进程已经获得的资源，在未使用前，不能强行剥夺
4. 循环等待：若干个进程之间形成一种头尾相接的循环等待资源的关系

**破坏其中的一个或多个**


### lock锁

- 从jdk5 开始，通过显示定义同步锁对象来实现同步。同步锁使用Lock对象充当
- java.util.concurrent.locks。Lock 接口是控制多个线程对共享资源进行访问的工具。锁提供了对独占资源
的独立访问，每次只能又一个线程对Lock对象加锁，线程开始访问共享资源之前应先获得Lock对象
- ReentrantLock 类实现了Lock，它拥有与synchronized相同的并发性和内存语义，在实现线程安全的控制中，比较常用的是
ReentrantLock，可以显示加锁、释放锁

```java
public class Test03Lock implements Runnable {


    public static void main(String[] args) {
        Test03Lock lock = new Test03Lock();


        new Thread(lock).start();
        new Thread(lock).start();
        new Thread(lock).start();

    }


    private int num = 10;
    private final ReentrantLock lock = new ReentrantLock();


    @Override
    public void run() { 
        while (true) {
            lock.lock();  //加锁
            try {
                if (num > 0) {
                    try {
                        Thread.sleep(1_000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(num--);
                } else {
                    break;
                }
            } finally {
                lock.unlock(); //解锁
            }
        }
    }
}
```
![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/thread20210704204154.png)




## 03 线程协作

生产者消费者

### 线程通信


![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/thread20210704204958.png)

**管程法** 
```java 
/**
 * @author clxmm
 * @Description 测试生产和消费
 *  <p>管程法</p>
 * @create 2021-07-05 8:16 下午
 */
public class Test04PC {


    public static void main(String[] args) {
        SynContainer container = new SynContainer();


        new P(container).start();
        new C(container).start();


    }


}


class P extends Thread {


    SynContainer container;


    public P(SynContainer container) {
        this.container = container;
    }

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println("生产：" + i);
            container.push(new Chicken(i));
        }
    }
}


class C extends Thread {


    SynContainer synContainer;


    public C(SynContainer container) {
        this.synContainer = container;
    }

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            synContainer.pop();
            System.out.println("消费：" + i);
        }
    }
}

class Chicken {

    int i;

    public Chicken(int i) {
        this.i = i;
    }
}

// 缓存区
class SynContainer {

    Chicken[] chickens = new Chicken[10];

    int count = 0;


    public synchronized void push(Chicken chicken) {
        if (chickens.length == count) {
            // 通知消费，生产等待
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        chickens[count] = chicken;
        count++;
        // 可以消费
        try {
            this.notifyAll();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public synchronized Chicken pop() {
        if (count == 0) {
            // wait
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        count--;
        Chicken chicken = chickens[count];


        //通知生产
        try {
            this.notifyAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return chicken;
    }


}
```

**信号灯法**

```java
**
 * @author clxmm
 * @Description 测试生产和消费
 * <p>信号灯</p>
 * @create 2021-07-05 8:16 下午
 */
public class Test05PC {
    
    public static void main(String[] args) {
        Tv tv = new Tv();
        
        new Pl(tv).start();
        new Wa(tv).start();
    }


}


class Pl extends Thread {
    Tv tv;
    public Pl(Tv tv) {
        this.tv = tv;
    }
    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            if (i % 2 == 0) {
                this.tv.play(i + "播放");
            } else {
                this.tv.play(i + "广告");
            }

        }
    }
}


class Wa extends Thread {
    Tv tv;
    public Wa(Tv tv) {
        this.tv = tv;
    }

    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            System.out.print(i);
            tv.watch();

        }
    }
}


// 缓存区
class Tv {
    String voice;
    boolean flag = true;
    public synchronized void play(String voice) {
        if (!flag) {
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("表演了：" + voice);
        this.notifyAll();
        this.voice = voice;
        this.flag = !this.flag;
    }
    public synchronized void watch() {
        if (flag) {
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        System.out.println("观看了：" + voice);
        this.notifyAll();
        this.flag = !this.flag;
    }
}
```

## 线程池




![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/thread20210705205236.png)


###  使用线程池

- jdk1.5 Executors和ExecutorService
- Executors和ExecutorService 真正的线程池接口，常见的子类ThreadPoolExecutor
    - void execute(Runnable command);   执行任务/命令，一般用来执行Runnable
    - <T> Future<T> submit(Callable<T> task); 执行任务，有返回值，一般用来执行Callable
    - void shutdown();
- Executors 工具类，线程池的工厂

```java
public class Test06ThreadPool {


    public static void main(String[] args) {
        ExecutorService service =  Executors.newFixedThreadPool(10);

        service.execute(new MyThread());
        service.execute(new MyThread());
        service.execute(new MyThread());
        service.execute(new MyThread());

        service.shutdown();
        
    }
}

class MyThread implements Runnable {


    @Override
    public void run() {
        for (int i = 0; i < 2; i++) {
            System.out.println(Thread.currentThread().getName() + ";" + i);
        }
    }
}
```