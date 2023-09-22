<script setup>
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
</script>

<template>
  <div flex items-center justify-center>
    <Menu as="div" class="relative inline-block">
      <div>
        <MenuButton
          w-fit flex select-none items-center justify-center rounded-full transition-all
          hover="bg-zinc-300 dark:bg-zinc-800"
          active="bg-zinc-400 dark:bg-zinc-900"
        >
          <div flex items-center opacity="50" class="i-octicon:chevron-down-16" />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          bg="white dark:zinc-800"
          text="dark:zinc-200"
          ring="1 opacity-5 black dark:zinc-700"
          absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-md shadow-lg divide-y divide-zinc-700 focus:outline-none
        >
          <slot name="items" />
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
