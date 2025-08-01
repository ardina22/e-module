<script setup lang="ts">
import { XMarkIcon, RectangleStackIcon } from '@heroicons/vue/24/outline'
import SidebarItem from './SidebarItem.vue'
import type { ModuleTree } from '@/module-tree'

type Props = {
  open: boolean
  moduleTrees: ModuleTree[]
  currentFile?: string
}

type Emits = {
  (e: 'close'): void
  (e: 'load-markdown', file: string): void
  (e: 'add-module'): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()
</script>

<template>
  <aside
    :class="[
      'bg-white w-72 fixed lg:static z-3 h-screen shadow-md transition-transform duration-200 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <!-- Scrollable content area -->
    <div class="h-[calc(100%-4rem)] overflow-y-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">📚 E-Module</h2>
        <XMarkIcon @click="emit('close')" class="lg:hidden w-6 h-6 text-gray-700" />
      </div>

      <ul class="space-y-1 text-sm">
        <SidebarItem
          v-for="(module, index) in moduleTrees"
          :key="`module-${index}`"
          :label="module.label"
          :file="module.file"
          :children="module.children"
          :current-file="currentFile"
          @load-markdown="emit('load-markdown', $event)"
        />
      </ul>
    </div>

    <!-- Fixed bottom button -->
    <div class="px-4 py-3 border-t border-gray-200 flex justify-center">
      <button
        @click="emit('add-module')"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition duration-200"
      >
        <RectangleStackIcon class="w-5 h-5" />
        <span>Manajemen Module</span>
      </button>
    </div>
  </aside>
</template>
