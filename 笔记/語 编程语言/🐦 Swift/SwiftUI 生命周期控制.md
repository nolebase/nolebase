# SwiftUI 生命周期控制

## 窗口关闭前

创建一个 `ViewController` 类，这个类可以放在 `<项目根目录>/ViewControllers/ViewController.swift` 文件中（如果该文件不存在，则可以自行创建）

`<项目根目录>/ViewControllers/ViewController.swift` 

```
import Foundation
import AppKit

class ViewController: NSViewController, NSWindowDelegate {
    override func viewDidAppear() {
        self.view.window?.delegate = self
    }
    
    func windowWillClose() {
        print("before close")
    }
}
```
