---
title: 02 thread 介绍
---

## 线程简介

### 程序，进程，线程

- 程序：指令和数据的集合，本身没有任何运行的含义，是一个静态概念
- 进程：程序的一次执行过程，动态概念，是系统资源分配的单位
- 线程：一个进程可以包含若干个线程，一个进程中至少有一个线程，线程是cpu调度和执行的单位


### java线程的核心概念

- 线程就是独立的执行路径
- 在程序运行时，即使自己没有创建线程，后台也会有多个线程，如主线程，gc线程；
- main（）称之为主线程，为系统入口，用于执行整个程序
- 在一个进程中，如果开辟了多个线程，线程的运行有调度器安排，调度器是与操作系统密切相关的，先后顺序不能人为的干预
- 对·1同一份资源操作时，会存在资源争夺的问题，需要加入并发控制
- 每个线程都会带来额外的开销，如cpu调度时间，并发控制开销，
- 每个线程在自己的工作内存交互，内存控制不当会造成数据不一致


### 线程的创建方式
- Thread class   ： 继承Thread类
- Runnable 接口： 实现Runnable （继承了Thread）
- Callable 接口： 实现  Callable 接口


**Thread**

- 自定义线程继承Thread类
- 重写run方法，添加线程执行主体
- 创建线程对象，调用start（）方法

普通线程与多线程
![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202106/Thread20210630202914.png)


线程开启不一定立即执行，由cpu调度

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Test02 extends Thread {


    private String url;

    private String fileName;

    @Override
    public void run() {
        WebDownloader webDownloader = new WebDownloader();

        try {
            webDownloader.downloader(url,fileName);
            System.out.println("success");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    public static void main(String[] args) {
        Test02 test01 = new Test02("http://img.itboyhub.com/2021/02/20210601185454.png","1.jpg");
        Test02 test02 = new Test02("http://img.itboyhub.com/2021/02/20210601185454.png","2.jpg");
        Test02 test03 = new Test02("http://img.itboyhub.com/2021/02/20210601185454.png","3.jpg");


        test01.start();
        test02.start();
        test03.start();
        

    }
}
```


**Runnable**

- 定义MyRunnable类实现Runnable接口
- 实现run方法，编写线程执行主体
- 创建线程对象，启动start（）方法


```java
public class Test03 implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(i);
        }
    }


    public static void main(String[] args) {

        Test03 test03 = new Test03();

        Thread thread = new Thread(test03);
        thread.start();
    }
}
```


**推荐使用Runnable接口，避免单继承的局限性，灵活方便，同时，一个对象被多个线程使用**


```java
/**
 * @author clxmm
 * @Description 多个线程操同一个对象
 * @create 2021-07-01 8:07 下午
 */
public class Test04 implements Runnable {


    private int ticketNums = 10;


    @Override
    public void run() {
        while (true) {
            if (ticketNums<=0) {
                break;
            }
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "拿到了第：" + ticketNums--);
        }
    }


    public static void main(String[] args) {
        Test04 test04 = new Test04();

        new Thread(test04,"c1").start();
        new Thread(test04,"c2").start();
        new Thread(test04,"c3").start();
    }


}
```

**Callable**

可以获取返回结果；可以抛出异常
- 创建执行服务  ExecutorService executorService = Executors.newFixedThreadPool(3);
- 提交执行   Future\<Boolean> submit = executorService.submit(test06Callable);
- 获取结果  Boolean aBoolean = submit.get();
- 关闭服务  executorService.shutdown();


```java
public class Test06Callable implements Callable<Boolean> {



    @Override
    public Boolean call() throws Exception {

        System.out.println(Thread.currentThread().getName());
        return false;
    }


    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Test06Callable test06Callable = new Test06Callable();
        Test06Callable test06Callable1 = new Test06Callable();

        // 创建执行服务
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        // 提交执行任务
        Future<Boolean> submit = executorService.submit(test06Callable);
        Future<Boolean> submit1= executorService.submit(test06Callable1);

        // 获取执行结构
        Boolean aBoolean = submit.get();
        System.out.println(aBoolean);
        // 关闭服务
        executorService.shutdown();

    }
}
```


### 静态代理

```java
/**
 * @author clxmm
 * @Description 静态代理
 * @create 2021-07-01 8:41 下午
 */
public class StaticProxy {

    public static void main(String[] args) {

        You you = new You();
//        you.hppyMarry();

        WeddingCompany weddingCompany = new WeddingCompany(you);
        weddingCompany.hppyMarry();


        new WeddingCompany(new You()).hppyMarry();
        new Thread(()-> System.out.println("haha")).start();
    }
}


interface Marry {

    void hppyMarry();
}



class You implements Marry {
    @Override
    public void hppyMarry() {
        System.out.println("---haha");
    }
}

// 代理角色
class WeddingCompany implements Marry{

    private Marry targert;

    public WeddingCompany(Marry targert) {
        this.targert = targert;
    }

    @Override
    public void hppyMarry() {
        before();
        this.targert.hppyMarry();
        after();
    }

    private void before() {
        System.out.println("before");
    }

    private void after() {
        System.out.println("after");
    }

}
```


### Lamda 表达式
- 避免内部类定义过多
- 函数式编程


### 线程的状态


![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202106/thread20210703193020.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/thread20210703193237.png)

### 线程的方法

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/thread20210703193453.png)


### 停止线程

- 不推荐使用jdk提供的 stop 、destroy （废弃）
- 推荐线程自己停止下来
- 建议使用一个标志进行终止，（变量falg=false时，则线程停止）

```java
/**
 * @author clxmm
 * @Description 停止线程的方法
 * @create 2021-07-03 7:50 下午
 */
public class Test07Stop implements Runnable {

    // 标识
    private boolean flag = true;

    @Override
    public void run() {


        int i= 0;
        while (flag) {
            System.out.println("run Thread: " + i++);
        }


    }

    // 转换标志位的方法
    public void stop() {
        this.flag = false;
    }


    public static void main(String[] args) {

        Test07Stop stop = new Test07Stop();

        new Thread(stop).start();
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread().getName() + ":" +i);
            if (i==9) {
                stop.stop();
                System.out.println("线程该停止了");
            }
        }
    }
}
```

### 线程休眠

- sleep(long millis)  指定当前线程阻塞的毫秒数；
- sleep 存在异常InterruptedException；
- sleep时间到达后，线程进入就绪状态
- sleep 可以模拟网络延时，倒计时等
- 每一个对象都有一个锁，sleep不会释放锁

```java
public class Test09Sleep {


    public static void main(String[] args) throws InterruptedException {
        tenDown();
    }

    // 模拟倒计时
    public static void tenDown() throws InterruptedException {
        int num = 10;
        while (true) {
            Thread.sleep(1_000);
            System.out.println(num--);
            if (num <= 0) {
                break;
            }
        }


    }
}
```

### 线程礼让 (yield)

- 礼让线程，让当前正在执行的线程暂停，但不阻塞
- 让线程从运行状态转为就绪状态
- **让cpu重新调度，礼让不一定成功，取决于cpu的调度**

```java
public class Test10Yield {


    public static void main(String[] args) {
        MyYield myYield = new MyYield();
        new Thread(myYield).start();
        new Thread(myYield).start();
        // 成功的状态，取决于cpu
        //Thread-0run
        //Thread-1run
        //Thread-1stop
        //Thread-0stop
    }

}


class MyYield implements Runnable {
    @Override
    public void run() {
        System.out.println( Thread.currentThread().getName()+"run");

        Thread.yield();
        System.out.println(Thread.currentThread().getName()+"stop");
    }
}
```


### 线程强制执行（join）

- Join合并线程，待此线程执行完成后，再执行其他线程，其他线程阻塞
 ```java
 public class Test11join  implements Runnable{


    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) {
            System.out.println("vip");
        }

    }


    public static void main(String[] args) throws InterruptedException {
        Test11join test11join = new Test11join();
        Thread thread = new Thread(test11join);
        thread.start();
        
        for (int i = 0; i < 100; i++) {

            if (i==50) {
                thread.join();
            }

            System.out.println("main:"+i);
        }
        
    }
}
 ```


 ### 线程状态观测

 **Thread State**

 - new 尚未启动的线程
 - runnable 在java虚拟机中执行的线程处于
 - blocked 被阻塞等待监视器锁定的线程
 - waiting 正在等待另一个线程执行特定动作的线程
 - timed——waiting 正在等待另一个线程执行动作达到指定等待时间的线程
 - terminated 已经退出的线程

 **一个线程可以在给定时间点处于一个状态。这些状态是不反映任何操作系统线程状态的虚拟机状态**

 ```java
 public class Test12State {


    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                try {
                    Thread.sleep(1_000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("----");
        });


        Thread.State state = thread.getState();
        System.out.println(state); // new
        thread.start();
        state = thread.getState();
        System.out.println(state);   // run
        
        while (state != Thread.State.TERMINATED) {
            Thread.sleep(100);
            state = thread.getState();
            System.out.println(state);

        }

    }
    
}
 ```