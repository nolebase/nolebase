---

title: 03 java bio

---

## 1. 学习bio

###  1.1 基于BIO形式下的文件上传
**客户端代码**
```java
 /**
     * 客户端上传任意文件类型的文件数据非服务端保存起来
     */
    public static void main(String[] args) {
        try (
                InputStream is = new FileInputStream("/Users/yuanmengen/Documents/图片/柯南.jpg")
        ) {
            Socket socket = new Socket("127.0.0.1", 9999);
            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
            dos.writeUTF(".jpg");
             //  3、先发送上传文件的后缀给服务端
            byte[] buffer = new byte[1024];
            int len;
            while ((len = is.read(buffer)) > 0) {
                dos.write(buffer, 0, len);
            }
            dos.flush();
            socket.shutdownOutput();   // 通知服务端数据发送完毕
            Thread.sleep(10000);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
```
**服务端代码**
```java
/**
     * 服务端，接收客户端的任意类型的文件，并保存到服务端的磁盘
     */
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(9999);

            while (true){
                Socket socket = serverSocket.accept();
                // 交给一个独立的线程来处理与这个客户端的文件通信需求。
                new ServerReaderThread(socket).start();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

 public class ServerReaderThread extends Thread {
    private Socket socket;

    public ServerReaderThread(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            // 1、得到一个数据输入流读取客户端发送过来的数据
            DataInputStream dis = new DataInputStream(socket.getInputStream());
            // 2、读取客户端发送过来的文件类型
            String suffix = dis.readUTF();
            System.out.println("服务端已经成功接收到了文件类型：" + suffix);
            String path = "/Users/yuanmengen/Desktop/test/";
            OutputStream os = new FileOutputStream(path + UUID.randomUUID().toString() + suffix);

            // 4、从数据输入流中读取文件数据，写出到字节输出流中去
            byte[] buffer = new byte[1024];
            int len;
            while ((len = dis.read(buffer)) > 0) {
                os.write(buffer, 0, len);
            }
            os.close();
            System.out.println("服务端接收文件保存成功！");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}   

```

### 1.2 Java BIO模式下的端口转发思想
一个客户端的消息可以发送给所有的客户端去接收。（群聊实现）


![bio04](/java/bio04.png)

**服务端代码**
```java
public class Server {
    /**
     * bio 模式下的端口转发
     * 服务端：
     *  注册端口
     *  接收客户端的socket 连接，交给一个独立的线程来处理
     *  把当前连接的客户端socket 存到一个socket集合中
     *  接收客户端的消息，推送非当前所有在线的socket 接收
     */

    public  static List<Socket> socketList = new ArrayList<>();
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(9999);
            while (true) {
                Socket accept = serverSocket.accept();
                // 把登陆的客户端socket 存入到一个集合中
                socketList.add(accept);
                // 当前登陆成功的socket中 分配一个独立的线程来处理与之通信
                new  ServerReadThread(accept).start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }



    }
}


public class ServerReadThread extends Thread {
    private Socket socket;

    public ServerReadThread(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            // 1. 从socket 中获取当前客户端的输入流
            BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            String msg;

            while ((msg = br.readLine()) != null) {
                // 2. 接收到客户端消息后，推送给所有的在想socket
                senMsgToAllClient(msg);
            }
        } catch (Exception e) {
            System.out.println("有人下线");
            Server.socketList.remove(socket);
            e.printStackTrace();
        }
    }

    /**
     * 把消息推送给所有的socket
     */
    private void senMsgToAllClient(String msg) {
        List<Socket> socketList = Server.socketList;

        socketList.forEach((e) -> {
            try {
                PrintStream ps = new PrintStream(e.getOutputStream());
                ps.println(msg);
                ps.flush();
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        });
    }
}
```

### 1.3 基于BIO模式下即时通信



