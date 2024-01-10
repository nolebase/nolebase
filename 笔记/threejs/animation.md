---
title: 动画
author: mophia
---

request animation frame

The purpose of requestAnimationFrame is to call the function provided on the next frame.
We are going to call the same function on each new frame.

Create a tick function and call it
In the function call it again but using window.requestAnimationFrame(...)

```js
const tick = () =>
{
  console.log('tick')
  window.requestAnimationFrame(tick)
}

tick()
```

Unfortunately,the higher the framerate,the faster the rotation

Subtract the previous time to get the deltaTime
Use the deltaTime in the animation

```js
let time Date.now()
const tick = () => {
  // Time
  const currentTime = Date.now()
  const deltaTime = currentTime - time

  // Update objects
  mesh.rotation.y += 0.01 * deltaTime
}
```

Three.js has a built-in solution named Clock
Instantiate a Clock and use its getElapsedTime() method

```js
const clock new THREE.clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  mesh.rotation.y = elapsedTime

  // ...
}

tick()

```

## gsap

Create a tween with gsap.to(...):
gsap.to(mesh.position,duration:1,delay:1,x:2 )
const tick ()-
/Render
renderer.render(scene,camera)
/Call tick again on the next frame
window.requestAnimationFrame(tick)
tick()
