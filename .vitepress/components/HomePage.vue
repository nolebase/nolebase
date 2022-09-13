<script setup lang="ts">
import { VPTeamMembers } from "vitepress/theme";
import { creators } from '../creators'
</script>

<template>
  <div class="content">
    <div class="content-container">
      <main class="main">
        <div class="vp-doc" flex flex-col items-center mt-10>
          <h2 id="meet-the-team" op50 font-normal p="t-10 b-2">
            知识库的创作者
          </h2>
          <div w-full p-10>
            <VPTeamMembers size="small" :members="creators" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
