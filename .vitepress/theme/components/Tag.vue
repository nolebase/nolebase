<script setup lang="ts">
import { ref } from 'vue'
import { MenuItem } from '@headlessui/vue'

const props = defineProps<{
  tag: { content: string }
  editing?: boolean
}>()

const tag = ref(props.tag)

const emits = defineEmits<{
  (e: 'deleteTag', value: { content: string }): void
  (e: 'editTag', value: { content: string }): void
}>()

const deleteTag = () => {
  emits("deleteTag", props.tag)
}

const editTag = () => {
  emits("editTag", props.tag)
}
</script>

<template>
  <TagItem>
    <template #pre v-if="props.editing">
      <div
        class="tags-draggable-handle"
        w-5 h-5
        rounded
        hover="bg-zinc-300 dark:bg-zinc-800"
        active="opacity-0">
        <div flex items-center opacity="50" class="i-octicon:grabber-16" />
      </div>
    </template>
    <template #default>
      <span text-sm>{{ props.tag.content }}</span>
    </template>
    <template #post v-if="props.editing">
      <div flex items-center justify-center>
        <button
          w-5 h-5 mr-1
          select-none
          rounded
          flex items-center justify-center
          title="删除"
          transition-all
          @click="deleteTag"
          hover="bg-zinc-300 dark:bg-zinc-800"
          active="bg-zinc-400 dark:bg-zinc-900"
        >
          <div flex items-center opacity="50" class="i-octicon:x-16" />
        </button>
        <!-- <BasicDropdownMenu>
          <template #items>
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-zinc-200 dark:bg-zinc-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  ]"
                >
                  <div flex items-center text-red-500 class="i-octicon:heart-fill-16" />
                  <span ml-2>存档</span>
                </button>
              </MenuItem>
            </div>
          </template>
        </BasicDropdownMenu> -->
      </div>
    </template>
  </TagItem>
</template>
