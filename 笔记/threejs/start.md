---
title: Three.js 从这里开始！
author: mophia
---

# Three.js 从这里开始！

> 如何创建一个简单的 Three.js 实例？

### 创建一个场景 Scene

```js
const scene = new THREE.Scene()
```

### 放入几何物体 Geometry

```js
// Geometry
const geo = new THREE.BoxGeometry(1, 1, 1)
```

### 创建物体材料 Material

```js
// Material
const mater = new THREE.MeshBasicMaterial({ color: 'red' })
```

### 创建网格 Mesh 用于组合图形和材料

```js
// new Mesh, and add geometry and material to the Mesh
const mesh = new THREE.Mesh(geo, mater)
```

### 创建一个相机 📷

```js
const sizes = {
  width: 800,
  height: 600
}
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
```

调整一下相机的角度

```js
camera.position.x = 1.2
camera.position.z = 6
camera.position.y = -1
```

### 把在场景中添加这个网格

```js
// add Mesh and Camera to the Scene
scene.add(mesh, camera)
```

### 使用 WebGL 在 HTML 的 Canvas 中绘制一个 从相机中看到的场景

```html
<canvas class="three"></canvas>
```

```js
// RENDERER
// Render the scene from the camera point of view, Result drawn into a canvas
// A canvas is a HTML element in which you can draw stuff.
// Three.js will use WebGL to draw the render inside this canvas.
// You can create it or you can let Three.js do it.
const canvas = document.querySelector('.three')
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
```

好了。到此，你就能获得一个漂亮的Three.js 方块了！

- [代码](https://github.com/mophia/threejs1)
- [项目地址](https://threejs1.vercel.app/)

### 完整代码

```js
import * as THREE from 'three';

document.querySelector('#app').innerHTML = `
<canvas class="three"></canvas>
`;

// console.log(THREE)

// 4 elements to get started
// - A scene that will contain objects
// - Some objects
// - A camera
// - A render

// Scene
const scene = new THREE.Scene()

// Geometry
const geo = new THREE.BoxGeometry(1, 1, 1)

// Material
const mater = new THREE.MeshBasicMaterial({ color: 'red' })

// new Mesh, and add geometry and material to the Mesh
const mesh = new THREE.Mesh(geo, mater)


// Camera
const sizes = {
  width: 800,
  height: 600
}
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)

camera.position.x = 1.2
camera.position.z = 6
camera.position.y = -1

// add Mesh and Camera to the Scene
scene.add(mesh, camera)

// RENDERER
// Render the scene from the camera point of view, Result drawn into a canvas
// A canvas is a HTML element in which you can draw stuff.
// Three.js will use WebGL to draw the render inside this canvas.
// You can create it or you can let Three.js do it.
const canvas = document.querySelector('.three')
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
```