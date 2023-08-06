<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useData } from "vitepress"
import Draggable from 'vuedraggable'
import { tagsCanBeGenerated, saveTags, generateNewTagsFromGPT } from '../../plugins/vitepress-plugin-docsmd-easytag/src/api/client/tags'
import { v4 as uuidv4 } from 'uuid'
import BasicButton from './BasicButton.vue'

type Tag = { id: string; content: string }

const pageData = useData();

const suggestToGenerate = ref(false)
const canBeGenerated = ref(false)
const generated = ref(false)
const generatedError = ref('')

const initLoading = ref(false)
const loading = ref(false)

const editingTags = ref(false)
const newTag = ref('')
const tags = ref<Tag[]>([])

const drag = ref(false)

async function getCanBeGenerated() {
  return await tagsCanBeGenerated(window.location.pathname)
}

async function generateTags() {
  loading.value = true

  try {
    const tagsRes = await generateNewTagsFromGPT(window.location.pathname, tags.value)
    generated.value = true;
    editingTags.value = true
    tags.value = tagsRes.map((tag) => {
      return { id: String(uuidv4()), content: tag.content }
    })
  } catch (err) {
    console.error(err)
    generatedError.value = err.message
  }

  loading.value = false
}

async function saveGeneratedTags() {
  loading.value = true

  try {
    await saveTags(window.location.pathname, tags.value)
    setTimeout(() => {
      // reload window
      window.location.reload()
    }, 2000)
    suggestToGenerate.value = false
    editingTags.value = false
  } catch (err) {
    console.error(err)
  }

  loading.value = false
}

function addTag() {
  if (newTag.value.trim() === "") return

  tags.value.push({ id: String(uuidv4()), content: newTag.value.trim() })
  newTag.value = ""
}

function deleteTag(id: string) {
  tags.value = tags.value.filter((tag) => tag.id !== id)
}

onMounted(async () => {
  initLoading.value = true

  if (
    !("tags" in pageData.frontmatter.value) ||
    !Array.isArray(pageData.frontmatter.value.tags) ||
    pageData.frontmatter.value.tags.length === 0
  ) {
    tags.value = []
    suggestToGenerate.value = true
  } else {
    tags.value = pageData.frontmatter.value.tags.map((tag: string) => { return { id: String(uuidv4()), content: tag } })
    suggestToGenerate.value = false
  }

  try {
    const canBeGeneratedRes = await getCanBeGenerated()
    if (canBeGeneratedRes.canBeGenerated) canBeGenerated.value = true
  } catch (err) {
    console.error(err)
  }

  initLoading.value = false
})
</script>

<template>
  <div v-if="!initLoading && ((suggestToGenerate && canBeGenerated) || (tags && tags.length > 0))">
    <div flex="~ row" items-center>
      <h5 flex="1">标签</h5>
      <BasicButton v-if="tags && tags.length > 0 && (!editingTags || (!editingTags && generated))" title="编辑" flex="~ row"
        items-center justify-center text="dark:white" bg="zinc-600 dark:zinc-700"
        hover="cursor-pointer bg-zinc-500 dark:bg-zinc-600" active="cursor-pointer bg-zinc-700 dark:bg-zinc-800"
        @click="() => editingTags = !editingTags">
        <span px-3 py-1>编辑</span>
      </BasicButton>
      <BasicButton v-if="editingTags" title="取消" flex="~ row" items-center justify-center text="dark:white"
        bg="zinc-500 dark:zinc-600" hover="cursor-pointer bg-zinc-400 dark:bg-zinc-500"
        active="cursor-pointer bg-zinc-600 dark:bg-zinc-700" :loading="loading" @click="() => editingTags = !editingTags">
        <span px-3 py-1>取消</span>
      </BasicButton>
      <BasicButton v-if="editingTags" title="保存" flex="~ row" items-center justify-center ml-2 text="dark:white"
        bg="green-500 dark:green-600" hover="cursor-pointer bg-green-400 dark:bg-green-500"
        active="cursor-pointer bg-green-600 dark:bg-green-700" :loading="loading" @click="saveGeneratedTags">
        <span px-3 py-1>保存</span>
      </BasicButton>
    </div>
    <section>
      <div v-if="!initLoading && suggestToGenerate && canBeGenerated" my-4 p-4 rounded-lg bg-zinc-50 dark="bg-zinc-900"
        flex>
        <div flex="~ 1 grow col">
          <span v-if="!generated" flex="~ 1" items-center>
            <div class="i-octicon:star-fill-16" mr-2 text-yellow-400 />
            <span>可以通过 GPT 自动生成标签哦 (ゝ∀･)</span>
          </span>
          <span v-else flex="~ 1" items-center py-1>
            <div class="i-octicon:check-circle-fill-16" mr-2 text-green-500 />
            <span>生成完成！</span>
          </span>
          <span v-if="!generated && generatedError" flex="~ 1" items-center mt-2>
            <div class="i-octicon:alert" mr-2 text-red-400 />
            {{ generatedError }}
          </span>
        </div>
        <div v-if="!generated">
          <BasicButton title="生成" text="dark:white" bg="yellow-500 dark:yellow-600"
            hover="cursor-pointer bg-yellow-400 dark:bg-yellow-500"
            active="cursor-pointer bg-yellow-600 dark:bg-yellow-700" :loading="loading" @click="generateTags">
            <span px-3 py-1>生成</span>
          </BasicButton>
        </div>
        <div v-if="generated && editingTags" flex flex-row items-center justify-center>
          <BasicButton mr-2 title="重新生成" text="dark:white" bg="blue-500 dark:blue-600"
            hover="cursor-pointer bg-blue-400 dark:bg-blue-500" active="cursor-pointer bg-blue-600 dark:bg-blue-700"
            :loading="loading" @click="generateTags">
            <span px-3 py-1>重新生成</span>
          </BasicButton>
        </div>
      </div>
      <div v-if="tags && tags.length > 0" my-4 p-4 rounded-lg bg-zinc-50 dark="bg-zinc-900">
        <transition-group>
          <Draggable v-model="tags" key="draggable" animation="200" group="tags" ghostClass="tags-ghost" item-key="id"
            handle=".tags-draggable-handle" @start="drag = true" @end="drag = false">
            <template #item="{ element }">
              <Tag :tag="(element as Tag)" :editing="editingTags" @delete-tag="deleteTag((element as Tag).id)" />
            </template>
          </Draggable>
        </transition-group>
        <TagItem v-if="editingTags">
          <template #default>
            <form @submit.prevent="addTag" inline flex flex-row items-center justify-center>
              <div opacity="50" text-sm class="i-octicon:plus-16" />
              <input v-model="newTag" type="text" label="新标签" placeholder="新标签" px-1 text-sm>
            </form>
          </template>
        </TagItem>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tags-ghost {
  opacity: 0.3;
}
</style>
