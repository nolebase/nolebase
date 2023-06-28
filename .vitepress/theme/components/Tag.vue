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
  <TagItem>
    <template #pre v-if="props.editing">
      <button
        w-fit mr-1
        select-none
        rounded-full
        flex items-center justify-center
        title="删除"
        transition-all
        @click="deleteTag"
        hover="bg-gray-300 dark:bg-gray-800"
        active="bg-gray-400 dark:bg-gray-900"
      >
        <div flex items-center opacity="50" class="i-octicon:x-16" />
      </button>
    </template>
    <template #default>
      <span text-sm>{{ props.tag.content }}</span>
    </template>
  </TagItem>
</template>
