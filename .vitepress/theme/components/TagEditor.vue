<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useData } from "vitepress"
import { tagsCanBeGenerated, saveTags, generateNewTagsFromGPT } from '../api/internal/tags'

const pageData = useData();

const tags = ref<{ content: string }[]>([])

const suggestToGenerate = ref(false)
const canBeGenerated = ref(false)
const generated = ref(false)
const generatedError = ref('')

const initLoading = ref(false)
const loading = ref(false)

const editingTags = ref(false)
const newTag = ref('')

async function getCanBeGenerated() {
  return await tagsCanBeGenerated(window.location.pathname)
}

async function generateTags() {
  loading.value = true

  try {
    const tagsRes = await generateNewTagsFromGPT(window.location.pathname, tags.value)
    generated.value = true;
    editingTags.value = true
    tags.value = tagsRes
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

  tags.value.push({ content: newTag.value.trim() })
  newTag.value = ""
}

function deleteTag(index: number) {
  tags.value.splice(index, 1)
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
    tags.value = pageData.frontmatter.value.tags.map((tag: string) => { return { content: tag } })
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
    <h5>标签</h5>
      <div
        v-if="!initLoading && suggestToGenerate && canBeGenerated"
        my-4 p-4
        rounded-lg
        bg-gray-50 dark="bg-[#252529]"
        flex
      >
      <div flex="~ 1 grow col">
        <span flex="~ 1" items-center v-if="!generated">
          <div class="i-octicon:star-fill-16" mr-2 text-yellow-400 />
          可以通过 GPT 自动生成标签哦 (ゝ∀･)
        </span>
        <span flex="~ 1" items-center py-1 v-else>
          <div class="i-octicon:check-circle-fill-16" mr-2 text-green-500 />
          生成完成！
        </span>
        <span flex="~ 1" items-start v-if="!generated && generatedError" mt-2>
          <div class="i-octicon:alert" mr-2 text-red-400 />
          {{ generatedError }}
        </span>
      </div>
      <div v-if="!generated">
      <BasicButton
        bg-yellow-500
        hover="cursor-pointer bg-yellow-400 dark:bg-yellow-400"
        active="cursor-pointer bg-yellow-600 dark:bg-yellow-600"
        :loading="loading"
        @click="generateTags"
      >
        <span px-3 py-1 dark="text-gray-800">生成</span>
      </BasicButton>
    </div>
    <div v-if="editingTags" flex flex-row items-center justify-center>
      <BasicButton
        mr-2
        bg-blue-500
        hover="cursor-pointer bg-blue-400 dark:bg-blue-400"
        active="cursor-pointer bg-blue-600 dark:bg-blue-600"
        :loading="loading"
        @click="generateTags"
      >
        <span px-3 py-1 dark="text-gray-800">重新生成</span>
      </BasicButton>
      <BasicButton
        bg-green-500
        flex flex-row items-center justify-center
        hover="bg-green-400 cursor-pointer"
        active="bg-green-600"
        :loading="loading"
        @click="saveGeneratedTags"
      >
        <span px-3 py-1 dark="text-gray-800">保存</span>
      </BasicButton>
    </div>
    </div>
    <div
      v-if="tags && tags.length > 0"
      my-4 p-4
      rounded-lg
      bg-gray-50 dark="bg-[#252529]"
    >
      <Tag
        v-for="(tag, index) in tags"
        :tag="tag"
        :editing="editingTags"
        :key="`${index}`"
        @delete-tag="deleteTag(index)" />
      <TagItem>
        <template #default>
          <form @submit.prevent="addTag" inline flex flex-row items-center justify-center>
          <div opacity="50" text-sm class="i-octicon:plus-16" />
          <input
            v-model="newTag"
            type="text"
            placeholder="新标签"
            px-1
            text-sm
          >
        </form>
        </template>
      </TagItem>
    </div>
  </div>
</template>
