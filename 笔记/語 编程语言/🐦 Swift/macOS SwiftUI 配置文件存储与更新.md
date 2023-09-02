# macOS SwiftUI 配置文件存储与更新

`UserDefaults` （`@AppStorage`[^1] [^3] 使用的 API） 允许你存储简单的类型和数据（理论上可以是任何类型）。`UserDefaults` 被自动写入一个属性列表，该列表位于：

`~/Library/Preferences/<yourbundleid>.plist`

如果你的应用程序是沙盒（Sandbox）的，那配置则会写入：

`~/Library/Containers/<Your Container>/Library/Preferences/<yourbundleid>.plist`

如果你使用自定义的方法来保存应用程序的配置/偏好，大多数开发者将这些数据存储在：`~/Library/Application Support/Your App/`中。

除非因为某些特殊原因有这样的需求，否则不鼓励将配置存储在应用程序的主目录里。这可能会使应用程序更难卸载和升级，而且会弄乱他们的主目录结构。[^2]

[^2]: [swift - 推荐的 SwiftUI MacOS 应用程序配置文件存储方式 - Stack Overflow](https://stackoverflow.com/questions/65619845/recommended-way-to-store-configuration-in-a-swiftui-macos-app)
[^1]: [AppStorage | Apple 开发者文档](https://developer.apple.com/documentation/swiftui/appstorage#relationships)
[^3]: [Settings | Apple 开发者文档](https://developer.apple.com/documentation/swiftui/settings)
