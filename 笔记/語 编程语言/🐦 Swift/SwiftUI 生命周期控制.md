# SwiftUI 生命周期控制

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v0.0.1 | 2021-12-03 | 补充未完成的文档 |
| Neko | v0.0.1 | 2021-12-01 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Swift | 5 | [https://swiftgg.gitbook.io/swift/swift-jiao-cheng](https://swiftgg.gitbook.io/swift/swift-jiao-cheng) [https://www.swift.org/documentation/](https://www.swift.org/documentation/) |

## 窗口

`<项目根目录>/App.swift`

```swift
@main
struct App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear() {
                    print("appeared")
                }
                .onDisappear() {
                    print("left")
                }
        }
    }
}
```

[SwiftUI App Lifecycle Explained – LearnAppMaking](https://learnappmaking.com/swiftui-app-lifecycle-how-to/)

## 应用程序

`<项目根目录>/AppDelegate.swift`

```swift
class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationWillTerminate(_ aNotification: Notification) {
        // App 结束前需要执行的代码，比如清理内存占用等
    }
}
```

`<项目根目录>/App.swift`

```swift
@main
struct App: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate // 添加此行

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear() {
                    print("appeared")
                }
                .onDisappear() {
                    print("left")
                }
        }
    }
}
```

[SwiftUI: respond to app termination on macOS - Stack Overflow](https://stackoverflow.com/questions/64940411/swiftui-respond-to-app-termination-on-macos)
