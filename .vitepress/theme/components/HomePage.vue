<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'
import { creators } from '../../creators'
import { siteName } from '../../../metadata'
</script>

<template>
  <div class="content">
    <div class="content-container">
      <main class="main">
        <div class="vp-doc" mt-10 flex flex-col items-center>
          <h2 id="meet-the-team" font-normal op50 p="t-10 b-2">
            {{ siteName }} 的创作者
          </h2>
          <div w-full p-10>
            <VPTeamMembers size="small" :members="creators" flex justify-center />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
