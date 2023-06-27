<script setup lang="ts">
const props = defineProps<{
  tag: { content: string }
  editing?: boolean
}>()

const emits = defineEmits<{
  (e: "deleteTag", value: { content: string }): void
}>()

const deleteTag = () => {
  emits("deleteTag", props.tag)
}
</script>

<template>
  <div v-if="props.editing" inline>
    <div
      w-fit h-fit
      mr-2 my-1 py-1 px-2
      inline-block
      rounded-lg
      select-none
      bg-gray-200 dark:bg-gray-700
    >
      <div flex items-center justify-center>
        <button
          w-fit mr-1
          select-none
          rounded-full
          flex items-center justify-center
          title="删除"
          transition-all
          hover="bg-gray-300 dark:bg-gray-800"
          active="bg-gray-400 dark:bg-gray-900"
          @click="deleteTag"
        >
          <div flex items-center opacity="50" class="i-octicon:x-16" />
        </button>
        <span>{{ tag.content }}</span>
      </div>
    </div>
  </div>
  <div
    v-else
    w-fit h-fit
    mr-2 my-2 py-1 px-2
    inline-block
    rounded-lg
    select-none
    bg-gray-200 dark:bg-gray-700
    transition-all
    hover="bg-gray-300 dark:bg-gray-800"
    active="bg-gray-400 dark:bg-gray-900"
  >
    <span>{{ tag.content }}</span>
  </div>
</template>
