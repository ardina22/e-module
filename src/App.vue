<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SidebarItem from '@/components/SidebarItem.vue'
import { createModuleTrees, findLabelByFile, type ModuleTree } from './module-tree'
import { marked } from 'marked'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const content = ref('')
const sidebarOpen = ref(false)
const moduleTrees = ref<ModuleTree[]>([])

const handleLoadMarkdown = async (file: string) => {
  const res = await fetch(`${import.meta.env.BASE_URL}modules/${file}`)
  const rawMarkdown = await res.text()
  content.value = await marked(rawMarkdown)
  sidebarOpen.value = false

  const label = findLabelByFile(moduleTrees.value, file)
  if (label) {
    document.title = `:: E-Module | ${label} ::`
  }
}

onMounted(async () => {
  const indexRes = await fetch(`${import.meta.env.BASE_URL}modules/index.json`)
  const paths: string[] = await indexRes.json()

  const fullPaths = paths.map((p) => `${import.meta.env.BASE_URL}modules/${p}`)
  moduleTrees.value = createModuleTrees(paths)

  if (fullPaths.length) {
    const res = await fetch(fullPaths[0])
    const rawMarkdown = await res.text()
    content.value = await marked(rawMarkdown)

    const label = findLabelByFile(moduleTrees.value, paths[0])
    if (label) {
      document.title = `:: E-Module | ${label} ::`
    }
  }
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar Toggle Button -->
    <button
      @click="sidebarOpen = true"
      class="lg:hidden fixed top-4 left-4 z-2 bg-white border-0 p-2 rounded-md shadow-md"
    >
      <bars3-icon class="w-6 h-6 text-gray-700" />
    </button>

    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white w-72 fixed lg:static z-3 h-full overflow-y-auto shadow-md transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      ]"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">📚 E-Module</h2>
          <x-mark-icon @click="sidebarOpen = false" class="lg:hidden w-6 h-6 text-gray-700" />
        </div>
        <ul class="space-y-1 text-sm">
          <sidebar-item
            v-for="(module, index) in moduleTrees"
            :key="`module-${index}`"
            :label="module.label"
            :file="module.file"
            :children="module.children"
            @load-markdown="handleLoadMarkdown"
          />
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-6 pt-16 lg:pt-6">
      <div class="markdown prose max-w-none" v-html="content"></div>
    </main>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
