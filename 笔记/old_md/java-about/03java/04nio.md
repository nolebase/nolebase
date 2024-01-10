---

title: 04 开始学习nio

---

## 1 、 了解nio
### 1.1 Java NIO 基本介绍

* Java NIO（New IO）也有人称之为 java non-blocking IO是从Java 1.4版本开始引入的一个新的IO API，可以替代标准的Java IO API。NIO与原来的IO有同样的作用和目的，但是使用的方式完全不同，NIO支持面向缓冲区的、基于通道的IO操作。NIO将以更加高效的方式进行文件的读写操作。NIO可以理解为非阻塞IO,传统的IO的read和write只能阻塞执行，线程在读写IO期间不能干其他事情，比如调用socket.read()时，如果服务器一直没有数据传输过来，线程就一直阻塞，而NIO中可以配置socket为非阻塞模式。

* NIO 相关类都被放在 java.nio 包及子包下，并且对原 java.io 包中的很多类进行改写。

* NIO 有三大核心部分：Channel( 通道) ，Buffer( 缓冲区), Selector( 选择器)

* Java NIO 的非阻塞模式，使一个线程从某通道发送请求或者读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用时，就什么都不会获取，而不是保持线程阻塞，所以直至数据变的可以读取之前，该线程可以继续做其他的事情。 非阻塞写也是如此，一个线程请求写入一些数据到某通道，但不需要等待它完全写入，这个线程同时可以去做别的事情。

* 通俗理解：NIO 是可以做到用一个线程来处理多个操作的。假设有 1000 个请求过来,根据实际情况，可以分配20 或者 80个线程来处理。不像之前的阻塞 IO 那样，非得分配 1000 个。


### 1.2 NIO 和 BIO 的比较

* BIO 以流的方式处理数据,而 NIO 以块的方式处理数据,块 I/O 的效率比流 I/O 高很多
* BIO 是阻塞的，NIO 则是非阻塞的
* IO 基于字节流和字符流进行操作，而 NIO 基于 Channel(通道)和 Buffer(缓冲区)进行操作，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。Selector(选择器)用于监听多个通道的事件（比如：连接请求，数据到达等），因此使用单个线程就可以监听多个客户端通道


| NIO                       | BIO                 |
| ------------------------- | ------------------- |
| 面向缓冲区（Buffer）      | 面向流（Stream）    |
| 非阻塞（Non Blocking IO） | 阻塞IO(Blocking IO) |
| 选择器（Selectors）       |                     |


### 1.3  NIO 三大核心原理示意图

NIO 有三大核心部分：**Channel( 通道) ，Buffer( 缓冲区), Selector( 选择器)**



**Buffer缓冲区**

缓冲区本质上是一块可以写入数据，然后可以从中读取数据的内存。这块内存被包装成NIO Buffer对象，并提供了一组方法，用来方便的访问该块内存。相比较直接对数组的操作，Buffer API更加容易操作和管理。

**Channel（通道）**

Java NIO的通道类似流，但又有些不同：既可以从通道中读取数据，又可以写数据到通道。但流的（input或output)读写通常是单向的。 通道可以非阻塞读取和写入通道，通道可以支持读取或写入缓冲区，也支持异步地读写。

**Selector选择器**

Selector是 一个Java NIO组件，可以能够检查一个或多个 NIO 通道，并确定哪些通道已经准备好进行读取或写入。这样，一个单独的线程可以管理多个channel，从而管理多个网络连接，提高效率

![nio01.png](/java/nio01.png)

* 每个 channel 都会对应一个 Buffer
* 一个线程对应Selector ， 一个Selector对应多个 channel(连接)
* 程序切换到哪个 channel 是由事件决定的
* Selector 会根据不同的事件，在各个通道上切换
* Buffer 就是一个内存块 ， 底层是一个数组
* 数据的读取写入是通过 Buffer完成的 , BIO 中要么是输入流，或者是输出流, 不能双向，但是 NIO 的 Buffer 是可以读也可以写。
* Java NIO系统的核心在于：通道(Channel)和缓冲区 (Buffer)。通道表示打开到 IO 设备(例如：文件、 套接字)的连接。若需要使用 NIO 系统，需要获取 用于连接 IO 设备的通道以及用于容纳数据的缓冲 区。然后操作缓冲区，对数据进行处理。简而言之，Channel 负责传输， Buffer 负责存取数据


### 1.4 NIO核心一：缓冲区(Buffer)

**缓冲区（Buffer**
一个用于特定基本数据类 型的容器。由 java.nio 包定义的，所有缓冲区 都是 Buffer 抽象类的子类.。Java NIO 中的 Buffer 主要用于与 NIO 通道进行 交互，数据是从通道读入缓冲区，从缓冲区写入通道中的

![nio02.png](/java/nio02.png)

**Buffer 类及其子类**
Buffer 就像一个数组，可以保存多个相同类型的数据。根 据数据类型不同 ，有以下 Buffer 常用子类： 
ByteBuffer CharBuffer  ShortBuffer IntBuffer LongBuffer FloatBuffer DoubleBuffer

上述 Buffer 类 他们都采用相似的方法进行管理数据，只是各自 管理的数据类型不同而已。都是通过如下方法获取一个 Buffer 对象：
```java
static XxxBuffer allocate(int capacity) : 创建一个容量为capacity 的 XxxBuffer 对象
```

**缓冲区的基本属性**
Buffer 中的重要概念： 
* 容量 (capacity) ：作为一个内存块，Buffer具有一定的固定大小，也称为"容量"，缓冲区容量不能为负，并且创建后不能更改。
* 限制 (limit)：表示缓冲区中可以操作数据的大小（limit 后数据不能进行读写）。缓冲区的限制不能为负，并且不能大于其容量。 写入模式，限制等于buffer的容量。读取模式下，limit等于写入的数据量。
* 位置 (position)：下一个要读取或写入的数据的索引。缓冲区的位置不能为 负，并且不能大于其限制 
* 标记 (mark)与重置 (reset)：标记是一个索引，通过 Buffer 中的 mark() 方法 指定 Buffer 中一个特定的 position，之后可以通过调用 reset() 方法恢复到这 个 position.
**标记、位置、限制、容量遵守以下不变式： 0 <= mark <= position <= limit <= capacity**

![nio03.png](/java/nio03.png)

**Buffer常见方法**
```java
Buffer clear() 清空缓冲区并返回对缓冲区的引用
Buffer flip() 为 将缓冲区的界限设置为当前位置，并将当前位置充值为 0
int capacity() 返回 Buffer 的 capacity 大小
boolean hasRemaining() 判断缓冲区中是否还有元素
int limit() 返回 Buffer 的界限(limit) 的位置
Buffer limit(int n) 将设置缓冲区界限为 n, 并返回一个具有新 limit 的缓冲区对象
Buffer mark() 对缓冲区设置标记
int position() 返回缓冲区的当前位置 position
Buffer position(int n) 将设置缓冲区的当前位置为 n , 并返回修改后的 Buffer 对象
int remaining() 返回 position 和 limit 之间的元素个数
Buffer reset() 将位置 position 转到以前设置的 mark 所在的位置
Buffer rewind() 将位置设为为 0， 取消设置的 mark
```

**缓冲区的数据操作**

```java
Buffer 所有子类提供了两个用于数据操作的方法：get()put() 方法
取获取 Buffer中的数据
get() ：读取单个字节
get(byte[] dst)：批量读取多个字节到 dst 中
get(int index)：读取指定索引位置的字节(不会移动 position)
    
放到 入数据到 Buffer 中 中
put(byte b)：将给定单个字节写入缓冲区的当前位置
put(byte[] src)：将 src 中的字节写入缓冲区的当前位置
put(int index, byte b)：将指定字节写入缓冲区的索引位置(不会移动 position)
```

**使用Buffer读写数据一般遵循以下四个步骤：**
* 1.写入数据到Buffer
* 2.调用flip()方法，转换为读取模式
* 3.从Buffer中读取数据
* 4.调用buffer.clear()方法或者buffer.compact()方法清除缓冲区

***直接与非直接缓冲区***

`byte byffer` 可以是两种类型，一种是基于直接内存（也就是非堆内存）；另一种是非直接内存（也就是堆内存）。对于直接内存来说，JVM将会在IO操作上具有更高的性能，因为它直接作用于本地系统的IO操作。而非直接内存，也就是堆内存中的数据，如果要作IO操作，会先从本进程内存复制到直接内存，再利用本地IO处理。

从数据流的角度，非直接内存是下面这样的作用链：

```
本地IO-->直接内存-->非直接内存-->直接内存-->本地IO
```

而直接内存是：
```
本地IO-->直接内存-->本地IO
```
在做IO处理时，比如网络发送大量数据时，直接内存会具有更高的效率。直接内存使用allocateDirect创建，但是它比申请普通的堆内存需要耗费更高的性能。不过，这部分的数据是在JVM之外的，因此它不会占用应用的内存。所以呢，当你有很大的数据要缓存，并且它的生命周期又很长，那么就比较适合使用直接内存。只是一般来说，如果不是能带来很明显的性能提升，还是推荐直接使用堆内存。字节缓冲区是直接缓冲区还是非直接缓冲区可通过调用其 isDirect()  方法来确定。

* 1 有很大的数据需要存储，它的生命周期又很长
* 2 适合频繁的IO操作，比如网络并发场景

### 1.5 NIO核心二：通道(Channel)

通道（Channel）：由 java.nio.channels 包定义 的。Channel 表示 IO 源与目标打开的连接。 Channel 类似于传统的“流”。只不过 Channel 本身不能直接访问数据，Channel 只能与 Buffer 进行交互

1、 NIO 的通道类似于流，但有些区别如下：
* 通道可以同时进行读写，而流只能读或者只能写
* 通道可以实现异步读写数据
* 通道可以从缓冲读数据，也可以写数据到缓冲:
2、 BIO 中的 stream 是单向的，例如 FileInputStream 对象只能进行读取数据的操作，而 NIO 中的通道(Channel)是双向的，可以读操作，也可以写操作。
3、 Channel 在 NIO 中是一个接口
```java
public interface Channel extends Closeable{}
```
常用的Channel实现类
* FileChannel：用于读取、写入、映射和操作文件的通道。
* DatagramChannel：通过 UDP 读写网络中的数据通道。
* SocketChannel：通过 TCP 读写网络中的数据。
* ServerSocketChannel：可以监听新进来的 TCP 连接，对每一个新进来的连接都会创建一个 SocketChannel。 【ServerSocketChanne 类似 ServerSocket , SocketChannel 类似 Socket】

**FileChannel 类**

获取通道的一种方式是对支持通道的对象调用getChannel() 方法。支持通道的类如下：

- FileInputStream
- FileOutputStream
- RandomAccessFile
- DatagramSocket
- Socket
- ServerSocket 获取通道的其他方式是使用 Files 类的静态方法 newByteChannel() 获取字节通道。或者通过通道的静态方法 open() 打开并返回指定通道

FileChannel的常用方法:
```java
int read(ByteBuffer dst) 从 从  Channel 到 中读取数据到  ByteBuffer
long  read(ByteBuffer[] dsts) 将 将  Channel 到 中的数据“分散”到  ByteBuffer[]
int  write(ByteBuffer src) 将 将  ByteBuffer 到 中的数据写入到  Channel
long write(ByteBuffer[] srcs) 将 将  ByteBuffer[] 到 中的数据“聚集”到  Channel
long position() 返回此通道的文件位置
FileChannel position(long p) 设置此通道的文件位置
long size() 返回此通道的文件的当前大小
FileChannel truncate(long s) 将此通道的文件截取为给定大小
void force(boolean metaData) 强制将所有对此通道的文件更新写入到存储设备中
```

1. 向文件写数据
```java
  public static void write() {
        try {
            // 1、字节输出流通向目标文件
            FileOutputStream fos = new FileOutputStream("data01.txt");
            // 2、得到字节输出流对应的通道Channel
            FileChannel channel = fos.getChannel();

            // 3、分配缓冲区
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            buffer.put("hello,clxmm!".getBytes());

            // 4、把缓冲区切换成写出模式
            buffer.flip();
            channel.write(buffer);
            channel.close();
            System.out.println("写数据到文件中！");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

2. 向文件读数据
```java
private static void read() {
        try {
            FileInputStream is = new FileInputStream("data01.txt");
            // 得到问价字节输入流的文件通道
            FileChannel channel = is.getChannel();
            // 定义一个缓冲区
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            // 读数据到缓冲区
            channel.read(buffer);
            buffer.flip();

            String s = new String(buffer.array(), 0, buffer.remaining());
            System.out.println(s);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
```

3. 复制文件
```java
private static void copy() {
        try {
            File file = new File("data01.txt");
            File outFile = new File("date02.txt");

            FileInputStream fis = new FileInputStream(file);

            FileOutputStream fos = new FileOutputStream(outFile);

            FileChannel fisChannel = fis.getChannel();
            FileChannel fosChannel = fos.getChannel();

            // 分配缓冲区
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            while (true) {
                // 先清空缓冲区
                buffer.clear();
                int flag = fisChannel.read(buffer);
                if (flag == -1) {
                    break;
                }
                // 缓冲区切换到可读模式
                buffer.flip();
                fosChannel.write(buffer);
            }

            fisChannel.close();
            fosChannel.close();
        } catch (Exception e) {

        }


    }
```

4. 分散 (Scatter) 和聚集 (Gather)

分散读取（Scatter ）:是指把Channel通道的数据读入到多个缓冲区中去

聚集写入（Gathering ）是指将多个 Buffer 中的数据“聚集”到 Channel。

```java
private static void test() throws Exception {
    FileInputStream fis = new FileInputStream("data01.txt");
    FileOutputStream fos = new FileOutputStream("data03.txt");

    //2. 分配指定大小的缓冲区
    ByteBuffer buf1 = ByteBuffer.allocate(4);
    ByteBuffer buf2 = ByteBuffer.allocate(1024);
    ByteBuffer[] buffers = new ByteBuffer[]{buf1,buf2};


    FileChannel fisChannel = fis.getChannel();
    FileChannel fosChannel = fos.getChannel();

    // 从通道读取数据分散到各个缓冲区
    fisChannel.read(buffers);
    for (ByteBuffer buffer : buffers) {
        buffer.flip();   // 切换到读模式
        System.out.println(new String(buffer.array(),0,buffer.remaining()));
        /**
            * hell
            * o,clxmm!
            */
    }
    // 聚集写入到通道
    fosChannel.write(buffers);
    fisChannel.close();
    fosChannel.close();
}
```
5. transferFrom() 从目标通道中去复制原通道数据
6. transferTo() 把原通道数据复制到目标通道
```java
  private static void test02() throws Exception {
        // 1、字节输入管道
        FileInputStream is = new FileInputStream("data01.txt");
        FileChannel isChannel = is.getChannel();
        // 2、字节输出流管道
        FileOutputStream fos = new FileOutputStream("data04.txt");
        FileOutputStream fos1 = new FileOutputStream("data05.txt");
        FileChannel osChannel = fos.getChannel();
        FileChannel fos1Channel = fos1.getChannel();
        // 3、复制 从目标通道中去复制原通道数据
//        osChannel.transferFrom(isChannel,isChannel.position(),isChannel.size());
        // 、复制  把原通道数据复制到目标通道
        isChannel.transferTo(isChannel.position(),isChannel.size(),fos1Channel);

        isChannel.close();
        osChannel.close();
    }
```

### 1.6 NIO核心三：选择器(Selector)

概述：
选择器（Selector） 是 SelectableChannle 对象的多路复用器，Selector 可以同时监控多个 SelectableChannel 的 IO 状况，也就是说，利用 Selector可使一个单独的线程管理多个 Channel。Selector 是非阻塞 IO 的核心

![nio04.png](/java/nio04.png)

* Java 的 NIO，用非阻塞的 IO 方式。可以用一个线程，处理多个的客户端连接，就会使用到 Selector(选择器)
* Selector 能够检测多个注册的通道上是否有事件发生(注意:多个 Channel 以事件的方式可以注册到同一个
Selector)，如果有事件发生，便获取事件然后针对每个事件进行相应的处理。这样就可以只用一个单线程去管
理多个通道，也就是管理多个连接和请求。
* 只有在 连接/通道 真正有读写事件发生时，才会进行读写，就大大地减少了系统开销，并且不必为每个连接都
创建一个线程，不用去维护多个线程
* 避免了多线程之间的上下文切换导致的开销

1. 应用

创建 Selector ：通过调用 Selector.open() 方法创建一个 Selector。
```
Selector selector = Selector.open();
```
向选择器注册通道：SelectableChannel.register(Selector sel, int ops)
```java
//1. 获取通道
ServerSocketChannel ssChannel = ServerSocketChannel.open();
//2. 切换非阻塞模式
ssChannel.configureBlocking(false);
//3. 绑定连接
ssChannel.bind(new InetSocketAddress(9898));
//4. 获取选择器
Selector selector = Selector.open();
//5. 将通道注册到选择器上, 并且指定“监听接收事件”
ssChannel.register(selector, SelectionKey.OP_ACCEPT);
```

当调用 register(Selector sel, int ops) 将通道注册选择器时，选择器对通道的监听事件，需要通过第二个参数 ops 指定。可以监听的事件类型（用 可使用 SelectionKey  的四个常量 表示）：
* 读 : SelectionKey.OP_READ （1）
* 写 : SelectionKey.OP_WRITE （4）
* 连接 : SelectionKey.OP_CONNECT （8）
* 接收 : SelectionKey.OP_ACCEPT （16）
* 若注册时不止监听一个事件，则可以使用“位或”操作符连接。
  int interestSet = SelectionKey.OP_READ|SelectionKey.OP_WRITE 

#### NIO非阻塞式网络通信原理分析
* Selector 示意图和特点说明
Selector可以实现： 一个 I/O 线程可以并发处理 N 个客户端连接和读写操作，这从根本上解决了传统同步阻塞 I/O 一连接一线程模型，架构的性能、弹性伸缩能力和可靠性都得到了极大的提升。
![nio05.png](/java/nio05.png)

* 服务端流程

1、当客户端连接服务端时，服务端会通过 ServerSocketChannel 得到 SocketChannel：1. 获取通道

 ServerSocketChannel ssChannel = ServerSocketChannel.open();

2、切换非阻塞模式

ssChannel.configureBlocking(false);

3、绑定连接

 ssChannel.bind(new InetSocketAddress(9999));

4、 获取选择器

 Selector selector = Selector.open();

5、 将通道注册到选择器上, 并且指定“监听接收事件”

 ssChannel.register(selector, SelectionKey.OP_ACCEPT);

6、轮询式的获取选择器上已经“准备就绪”的事件 

```java
//轮询式的获取选择器上已经“准备就绪”的事件
 while (selector.select() > 0) {
        System.out.println("轮一轮");
        //7. 获取当前选择器中所有注册的“选择键(已就绪的监听事件)”
        Iterator<SelectionKey> it = selector.selectedKeys().iterator();
        while (it.hasNext()) {
            //8. 获取准备“就绪”的是事件
            SelectionKey sk = it.next();
            //9. 判断具体是什么事件准备就绪
            if (sk.isAcceptable()) {
                //10. 若“接收就绪”，获取客户端连接
                SocketChannel sChannel = ssChannel.accept();
                //11. 切换非阻塞模式
                sChannel.configureBlocking(false);
                //12. 将该通道注册到选择器上
                sChannel.register(selector, SelectionKey.OP_READ);
            } else if (sk.isReadable()) {
                //13. 获取当前选择器上“读就绪”状态的通道
                SocketChannel sChannel = (SocketChannel) sk.channel();
                //14. 读取数据
                ByteBuffer buf = ByteBuffer.allocate(1024);
                int len = 0;
                while ((len = sChannel.read(buf)) > 0) {
                    buf.flip();
                    System.out.println(new String(buf.array(), 0, len));
                    buf.clear();
                }
            }
            //15. 取消选择键 SelectionKey
            it.remove();
        }
    }
}
```

* 客户端流程
1.获取通道

SocketChannel sChannel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9999));

2.切换非阻塞模式

sChannel.configureBlocking(false);

3.分配指定大小的缓冲区

ByteBuffer buf = ByteBuffer.allocate(1024);

4.发送数据给服务端
```java
Scanner scan = new Scanner(System.in);
while(scan.hasNext()){
	String str = scan.nextLine();
	buf.put((new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(System.currentTimeMillis())
			+ "\n" + str).getBytes());
	buf.flip();
	sChannel.write(buf);
	buf.clear();
}
//关闭通道
sChannel.close();
```
7. NIO非阻塞式网络通信入门案例
服务端
```java
public class Server {
    /**
     * nio 非阻塞 服务端
     */
    public static void main(String[] args) throws Exception {
        // 获取服务端通道
        ServerSocketChannel ssChanel = ServerSocketChannel.open();

        // 切换非阻塞
        ssChanel.configureBlocking(false);

        //3. 绑定连接
        ssChanel.bind(new InetSocketAddress(9999));
        //4. 获取选择器
        Selector selector = Selector.open();
        //5. 将通道注册到选择器上, 并且指定“监听接收事件”
        ssChanel.register(selector, SelectionKey.OP_ACCEPT);
        //6. 轮询式的获取选择器上已经“准备就绪”的事件

        while (selector.select() > 0) {
            System.out.println("轮一轮");
            Iterator<SelectionKey> it = selector.selectedKeys().iterator();
            while (it.hasNext()) {
                //8. 获取准备“就绪”的是事件
                SelectionKey sk = it.next();
                if (sk.isAcceptable()) {
                    //10. 若“接收就绪”，获取客户端连接
                    SocketChannel sChannel = ssChanel.accept();
                    //11. 切换非阻塞模式
                    sChannel.configureBlocking(false);
                    //12. 将该通道注册到选择器上
                    sChannel.register(selector, SelectionKey.OP_READ);
                } else if (sk.isReadable()) {
                    //13. 获取当前选择器上“读就绪”状态的通道
                    SocketChannel sChannel = (SocketChannel) sk.channel();
                    //14. 读取数据
                    ByteBuffer buf = ByteBuffer.allocate(1024);
                    int len = 0;
                    while ((len = sChannel.read(buf)) > 0) {
                        buf.flip();
                        System.out.println(new String(buf.array(), 0, len));
                        buf.clear();
                    }
                }
                //15. 取消选择键 SelectionKey
                it.remove();
            }
        }
    }
}
```
客户端
```java
public class Client {
    public static void main(String[] args) throws Exception {
        SocketChannel channel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9999));

        channel.configureBlocking(false);

        //3. 分配指定大小的缓冲区
        ByteBuffer buf = ByteBuffer.allocate(1024);
        //4. 发送数据给服务端
        Scanner scan = new Scanner(System.in);
        while (true) {
            System.out.print("输入：" );
            String str = scan.nextLine();
            buf.put((new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(System.currentTimeMillis())
                    + "\n" + str).getBytes());
            buf.flip();
            channel.write(buf);
            buf.clear();
        }
        //5. 关闭通道


    }
}
```