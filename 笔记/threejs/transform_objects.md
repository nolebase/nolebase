---
title: 物体的变换 Transform Objects
author: mophia
---

变换物体有四种属性：

- 位置 Position
- 大小 Scale
- 旋转 Rotation
- 四元数（用于表示旋转） Quaternion

这些属性会被编译成矩阵。

每个轴的方向是任意的。在 Three.js 中，我们假定：

- `y 轴` 向上👆
- `z 轴` 向下👇
- `x 轴` 向右👉

一个单元的距离也是任意的。至于是 1 厘米、1 米、1 千米，这取决于你在设计和建造什么。

## 位置

mesh.position 是一个 Vector3 对象。如： `Vector { "x": 0.7, "y": -0.6, "z": 1}`，可以获取长度 `mesh.position.length()`，也可以把它恢复到1 `mesh.position.normalize()`

## 坐标辅助 Axes Helper

```js
const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper);
```

## 设置 Mesh 的大小和位置

```js
mesh.position.set(0.7, -1.2, -1.4)
mesh.scale.set(1.2,0.5,3)
```

## 设置相机的位置

```js
camera.position.set(-2, 1, 5)
```

## 旋转物体

使用 rotation 或者 quaternion（四元数）来旋转物体。更新其中一个的同时，会自动更新另一个。

```js
mesh.rotation.reorder('YXZ')
mesh.rotation.y = Math.PI *0.25
```

旋转也有 `x`、 `y` 、`z` 属性，不过它是一个 `Euler` （欧拉线）.
当你改变 `x`、 `y` 、`z` 属性的时候，你可以想象在物体中央插入一根木棍，然后围绕着木棍，旋转该物体.

需要小心的是，当你把物体绕着一个轴旋转时，你可能也在旋转了另一根轴.
旋转默认情况下 按 `x`、 `y` 、`z` 的顺序，你可能会得到奇怪的结果，就像一个轴不工作一样.这叫做 `gimbal lock` 万向节锁.
你可以在旋转之前，用 `reorder` 方法设置绕轴旋转的顺序.

```js
object.rotation.reorder('yxz')
```

`Euler` （欧拉线）便于理解，但会带来一些问题，所以大部分引擎和 3D 软件都使用 `Quaternion` （四元数）.

Object3D 实例有一个 `lookAt()` 方法，它能旋转，从而让 `z` 轴面对这你提供的 Vector3 目标对象.

``` js
camera.lookAt( new THREE.Vector3(0,-1,0) )
```

## 组 Group

创建一个组，然后把Mesh 添加到组中，就能实现整个Group的变幻和移动

```js
const group = new THREE.Group()

// cube1
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1), 
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

cube1.position.set(0, -3, 1)
cube1.scale.set(1.2, 0.5, 2)
cube1.rotation.reorder('YXZ')
cube1.rotation.y = Math.PI *0.25

group.add(cube1)
```
