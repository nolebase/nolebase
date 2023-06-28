<script setup>
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
</script>

<template>
  <div flex justify-center items-center>
    <Menu as="div" class="relative inline-block">
      <div>
        <MenuButton
          w-fit
          select-none
          rounded-full
          flex items-center justify-center
          transition-all
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
          absolute
          z-20
          left-0 mt-2 w-56
          origin-top-right
          divide-y divide-zinc-700
          rounded-md
          bg="white dark:zinc-800"
          text="dark:zinc-200"
          shadow-lg
          ring="1 opacity-5 black dark:zinc-700"
          focus:outline-none
        >
          <slot name="items" />
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
