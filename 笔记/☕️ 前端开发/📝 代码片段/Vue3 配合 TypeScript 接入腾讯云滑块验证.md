# Vue3 配合 TypeScript 接入腾讯云滑块验证

### 引入 SDK

找到 `index.html` 在 `<head>` 标签中增加腾讯云验证器 SDK 引用
`./index.html`:

```html
<!-- 腾讯云：滑块验证 -->
<!-- 验证码程序依赖(必须)。请勿修改以下程序依赖，如使用本地缓存，或通过其他手段规避加载，会影响程序的正常使用。 -->
<!-- 文档：https://cloud.tencent.com/document/product/1110/36841 -->
<script src="https://ssl.captcha.qq.com/TCaptcha.js" ></script>
```

### 封装 TypeScript 调用方法

为了兼容 TypeScript 类型提示，并且优雅的在 Vue3 中使用，我们用下面这个 `.ts` 文件对 SDK 的 `TencentCaptcha` 方法进行封装。

`./src/util/sliderValidator.ts`:

```typescript
/** 验证结果 */
export type SliderValidatorResult = {
  /** 验证结果，0：验证成功。2：用户主动关闭验证码。 */
  ret: number

  /** 验证成功的票据，当且仅当 ret = 0 时 ticket 有值。 */
  ticket: string

  /** 验证码应用ID */
  CaptchaAppId: string

  /** 自定义透传参数 */
  bizState: any

  /** 本次验证的随机串，请求后台接口时需带上 */
  randstr: string
}

/**
  # TencentCaptcha 的配置参数

  - res（用户主动关闭验证码）= `{ret: 2, ticket: null}`
  - res（验证成功） = `{ret: 0, ticket: string, randstr: string}`
  - res（客户端出现异常错误 仍返回可用票据） = `{ret: 0, ticket: string, randstr: string,  errorCode: number, errorMessage: string}`
*/
export type TencentCaptchaOptions = {

  /** 自定义透传参数，业务可用该字段传递少量数据，该字段的内容会被带入callback回调的对象中 */
  bizState?: any

  /** 开启自适应深夜模式 */
  enableDarkMode?: boolean

  /**
    # sdkOpts
    示例 `{"width": 140, "height": 140}`

    注: 只在移动端原生 webview 调用时传入，为设置的验证码元素 loading 弹框大小
  */
  sdkOpts?: { width: number; height: number }

  /**
    # ready
    验证码加载完成的回调, 回调参数为验证码实际的宽高。
    手机原生端可根据此值设置弹框大小。
  */
  ready?: (p: { sdkView: { width: number; height: number } }) => any
}

/** 腾讯验证码 */
declare class TencentCaptcha {
  constructor(appId: string, callback: (p: SliderValidatorResult) => any, options?: TencentCaptchaOptions)
  show(...params: any): any
}

// 复刻 Promise 下的 Resolve 和 Reject 类型
type Resolve = (value: SliderValidatorResult | PromiseLike<SliderValidatorResult>) => void
type Reject = (reason?: any) => void

// 返回值方法
export type ApplySlider = () => Promise<SliderValidatorResult>

/**
  腾讯滑块验证器
**/
export function sliderVerification(options?: TencentCaptchaOptions): ApplySlider {
  if (!TencentCaptcha) throw new Error('TencentCaptcha is not defined')

  let promise = {} as { resolve: Resolve; reject: Reject }
  let slider: TencentCaptcha
  onMounted(() => {
    slider = new TencentCaptcha(
      // App Id
      import.meta.env.VITE_TENCENT_CAPTCHA_APP_ID,
      // Callback
      (res: SliderValidatorResult) => {
        promise.resolve(res)
      },
      // Options
      options,
    )
  })

  return () => {
    return new Promise<SliderValidatorResult>((resolve, reject) => {
      slider.show()
      promise = { resolve, reject }
    })
  }
}
```

### 使用方法

```vue
<script lang="ts" setup>
import { sliderVerification, ApplySlider } from '~/util/SliderValidator'
let applySlider: ApplySlider
// 初始化滑块验证器
// 初始化参数，参考 TencentCaptchaOptions
onMounted(() => { applySlider = sliderVerification() })

// 开始验证
async function onVerify() {
  const res = await applySlider()
  console.log('SliderValidatorResult:', res)
}
</script>
<template>
  <button @click="onVerify"> 滑块验证 </button>
</template>
```

这边会用到一个 `import.meta.env.VITE_TENCENT_CAPTCHA_APP_ID` 的参数，可以从从腾讯云的验证码控制台中获取, 验证码控制台页面内【图形验证】>【验证列表】进行查看 。如果未新建验证，请根据业务需求选择适合的验证渠道、验证场景进行新建。

### 使用方法

```vue
<script lang="ts" setup>
import { sliderVerification } from '~/util/sliderValidator'
// 初始化验证器实例
const applySlider = sliderVerification({
  // Options
  bizState: 'hello, slider!',
  enableDarkMode: true,
})
// 触发验证器
async function onVerify() {
  const res = await applySlider()
  console.log('SliderValidatorResult:', res)
}
</script>
<template>
  <!-- 将方法绑定到一个按钮 -->
  <button @click="onVerify">
    滑块验证
  </button>
</template>

```

#### Options 提供以下配置参数

| 配置名 | 值类型 | 说明 |
| --- | --- | --- |
| bizState | Any | 自定义透传参数，业务可用该字段传递少量数据，该字段的内容会被带入callback回调的对象中 |
| enableDarkMode | Boolean | 开启自适应深夜模式 |
| sdkOpts | Object | 示例 `{"width": 140, "height": 140}` 注: 只在移动端原生webview调用时传入，为设置的验证码元素loading弹框大小 |
| ready | Function | 验证码加载完成的回调, 回调参数为验证码实际的宽高。手机原生端可根据此值设置弹框大小 |
