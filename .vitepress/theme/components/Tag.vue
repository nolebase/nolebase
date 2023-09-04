<script setup lang="ts">
import { ref } from 'vue'
import { MenuItem } from '@headlessui/vue'

const props = defineProps<{
  tag: { content: string }
  editing?: boolean
}>()

const emits = defineEmits<{
  (e: 'deleteTag', value: { content: string }): void
  (e: 'editTag', value: { content: string }): void
}>()

const tag = ref(props.tag)

function deleteTag() {
  emits('deleteTag', props.tag)
}

function editTag() {
  emits('editTag', props.tag)
}
</script>

<template>
  <TagItem>
    <template v-if="props.editing" #pre>
      <div
        class="tags-draggable-handle"

        h-5 w-5 rounded
        hover="bg-zinc-300 dark:bg-zinc-800"
        active="opacity-0"
        transition="all duration-200 ease"
      >
        <div flex items-center opacity="50" class="i-octicon:grabber-16" />
      </div>
    </template>
    <template #default>
      <span text-sm>{{ props.tag.content }}</span>
    </template>
    <template v-if="props.editing" #post>
      <div flex items-center justify-center>
        <button

          title="删除"
          mr-1 h-5 w-5 flex select-none items-center justify-center rounded transition-all
          hover="bg-zinc-300 dark:bg-zinc-800"
          active="bg-zinc-400 dark:bg-zinc-900"
          transition="all duration-200 ease"
          @click="deleteTag"
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
