<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import SidebarItem from './SidebarItem.vue'
import type { ModuleTree } from '@/module-tree'

defineProps<{
  open: boolean
  moduleTrees: ModuleTree[]
  currentFile: string
}>()

defineEmits(['close', 'load-markdown'])
</script>

<template>
  <aside
    :class="[
      'bg-white w-72 fixed lg:static z-3 h-full overflow-y-auto shadow-md transition-transform duration-200 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">📚 E-Module</h2>
        <XMarkIcon @click="$emit('close')" class="lg:hidden w-6 h-6 text-gray-700" />
      </div>
      <ul class="space-y-1 text-sm">
        <SidebarItem
          v-for="(module, index) in moduleTrees"
          :key="`module-${index}`"
          :label="module.label"
          :file="module.file"
          :children="module.children"
          :current-file="currentFile"
          @load-markdown="$emit('load-markdown', $event)"
        />
      </ul>
    </div>
  </aside>
</template>
