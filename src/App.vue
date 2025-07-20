<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import {
  createModuleTrees,
  extractHeadingsFromHTML,
  findLabelByFile,
  type MarkdownHeading,
  type ModuleTree,
} from './module-tree'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { renderMarkdown } from './marked-renderer'

import SidebarModule from './components/SidebarModule.vue'
import TocSidebar from './components/TocSidebar.vue'

const content = ref('')
const currentFile = ref('')
const sidebarOpen = ref(false)
const moduleTrees = ref<ModuleTree[]>([])
const currentHeadings = ref<MarkdownHeading[]>([])
const activeHeading = ref<string | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const handleLoadMarkdown = async (file: string) => {
  const res = await fetch(`${import.meta.env.BASE_URL}modules/${file}`)
  const rawMarkdown = await res.text()
  const rendered = await renderMarkdown(rawMarkdown)

  content.value = rendered
  currentHeadings.value = extractHeadingsFromHTML(rendered)

  currentFile.value = file
  sidebarOpen.value = false

  const label = findLabelByFile(moduleTrees.value, file)
  if (label) document.title = `E-Module | ${label}`

  nextTick(() => {
    observeHeadings()
    scrollToHash()
  })
}

const observeHeadings = () => {
  observer.value?.disconnect()

  const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4')).filter(
    (el) => el.id,
  )

  observer.value = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id
          activeHeading.value = id
          history.replaceState(null, '', `#${id}`)
          break
        }
      }
    },
    {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0.1,
    },
  )

  headingElements.forEach((el) => observer.value?.observe(el))
}

const scrollToHash = () => {
  const hash = decodeURIComponent(window.location.hash)
  if (hash && hash.startsWith('#')) {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView()
  }
}

onMounted(async () => {
  const indexRes = await fetch(`${import.meta.env.BASE_URL}modules/index.json`)
  const paths: string[] = await indexRes.json()

  const fullPaths = paths.map((p) => `${import.meta.env.BASE_URL}modules/${p}`)
  moduleTrees.value = createModuleTrees(paths)
  currentFile.value = paths[0]

  if (fullPaths.length) {
    const res = await fetch(fullPaths[0])
    const rawMarkdown = await res.text()
    content.value = await renderMarkdown(rawMarkdown)
    currentHeadings.value = extractHeadingsFromHTML(content.value)

    const label = findLabelByFile(moduleTrees.value, paths[0])
    if (label) {
      document.title = `E-Module | ${label}`
    }

    nextTick(() => {
      observeHeadings()
      scrollToHash()
    })
  }
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})

watch(content, () => {
  nextTick(() => {
    observeHeadings()
  })
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar Toggle Button -->
    <button @click="sidebarOpen = true"
      class="lg:hidden fixed top-4 left-4 z-2 bg-white border-0 p-2 rounded-md shadow-md">
      <bars3-icon class="w-6 h-6 text-gray-700" />
    </button>

    <!-- Sidebar -->
    <sidebar-module :module-trees="moduleTrees" :current-file="currentFile" :open="sidebarOpen"
      @close="sidebarOpen = false" @load-markdown="handleLoadMarkdown" />

    <!-- Main content with ToC on the right -->
    <main class="flex flex-1 overflow-y-auto pt-16 lg:pt-6">
      <!-- Markdown content -->
      <div class="markdown prose max-w-none flex-1 px-6 pb-8" v-html="content"></div>

      <!-- Table of Contents -->
      <toc-sidebar :headings="currentHeadings" :active-id="activeHeading" />
    </main>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
