import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  ignores: [
    '**/*.md',
    '**/*.yaml',
    '**/*.yml',
  ],
})
