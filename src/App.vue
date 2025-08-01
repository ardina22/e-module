<script setup lang="ts">
/* ───── Imports ───── */
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import {
  createModuleTrees,
  extractHeadingsFromHTML,
  findLabelByFile,
  type ModuleTree,
  type MarkdownHeading,
} from './module-tree'
import { renderMarkdown } from './marked-renderer'

import SidebarModule from './components/SidebarModule.vue'
import TocSidebar from './components/TocSidebar.vue'
import AddModuleModal from './components/AddModuleModal.vue'

/* ───── Refs / State ───── */
const content = ref('')
const currentFile = ref<string>()
const sidebarOpen = ref(false)
const moduleTrees = ref<ModuleTree[]>([])
const currentHeadings = ref<MarkdownHeading[]>([])
const activeHeading = ref<string | null>(null)
const observer = ref<IntersectionObserver | null>(null)
const showModal = ref(false)

/* ───── Handlers ───── */

// Load and render markdown file
const handleLoadMarkdown = async (file: string) => {
  const res = await fetch(`${import.meta.env.BASE_URL}modules/${file}`)
  const rawMarkdown = await res.text()
  const rendered = await renderMarkdown(rawMarkdown)

  content.value = rendered
  currentHeadings.value = extractHeadingsFromHTML(rendered)
  currentFile.value = file
  sidebarOpen.value = false

  updatePageTitle(file)

  nextTick(() => {
    setupHeadingsObserver()
    scrollToHash()
  })
}

// Show modal to add module
const handleAddModule = () => {
  showModal.value = true
}

// Save updated module tree to server
const handleUpdateModuleTree = async (data: ModuleTree[]) => {
  moduleTrees.value = data

  const response = await fetch(`${import.meta.env.VITE_API_URL}/modules/update`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const json = await response.json()
  console.log('Module tree saved:', json)
}

/* ───── Utilities ───── */

// Sets the document title based on the loaded file
const updatePageTitle = (file: string) => {
  const label = findLabelByFile(moduleTrees.value, file)
  if (label) {
    document.title = `E-Module | ${label}`
  }
}

// Automatically scroll to the anchor in URL hash
const scrollToHash = () => {
  const hash = decodeURIComponent(window.location.hash)
  if (hash && hash.startsWith('#')) {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView()
  }
}

// Setup heading observer for scrollspy
const setupHeadingsObserver = () => {
  observer.value?.disconnect()

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).filter(el => el.id)

  observer.value = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.id
        activeHeading.value = id
        history.replaceState(null, '', `#${id}`)
        break
      }
    }
  }, {
    rootMargin: '0px 0px -80% 0px',
    threshold: 0.1,
  })

  headings.forEach(el => observer.value?.observe(el))
}

/* ───── Lifecycle ───── */

onMounted(async () => {
  const indexRes = await fetch(`${import.meta.env.BASE_URL}modules/index.json`)
  const paths: string[] = await indexRes.json()

  moduleTrees.value = createModuleTrees(paths)
  const firstFile = paths[0]
  currentFile.value = firstFile

  if (firstFile) {
    const filePath = `${import.meta.env.BASE_URL}modules/${firstFile}`
    const res = await fetch(filePath)
    const rawMarkdown = await res.text()
    content.value = await renderMarkdown(rawMarkdown)
    currentHeadings.value = extractHeadingsFromHTML(content.value)

    updatePageTitle(firstFile)

    nextTick(() => {
      setupHeadingsObserver()
      scrollToHash()
    })
  }
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})

// Re-observe headings when content changes
watch(content, () => {
  nextTick(() => {
    setupHeadingsObserver()
  })
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar Toggle Button -->
    <button
      @click="sidebarOpen = true"
      class="lg:hidden fixed top-4 left-4 z-2 bg-white border-0 p-2 rounded-md shadow-md"
    >
      <Bars3Icon class="w-6 h-6 text-gray-700" />
    </button>

    <!-- Sidebar -->
    <SidebarModule
      :module-trees="moduleTrees"
      :current-file="currentFile"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
      @load-markdown="handleLoadMarkdown"
      @add-module="handleAddModule"
    />

    <!-- Main content with ToC on the right -->
    <main class="flex flex-1 overflow-y-auto pt-16 lg:pt-6 mb-4">
      <!-- Markdown content -->
      <div class="markdown prose max-w-none flex-1 px-6" v-html="content"></div>
    </main>
    <!-- Table of Contents -->
    <TocSidebar :headings="currentHeadings" :active-id="activeHeading" />

    <!-- Add Module Modal -->
    <AddModuleModal
      v-if="showModal"
      :initial-modules="moduleTrees"
      @close="showModal = false"
      @update="handleUpdateModuleTree"
    />
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
