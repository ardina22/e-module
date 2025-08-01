<script setup lang="ts">
/* ───── Imports ───── */
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Bars3Icon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import {
  createModuleTrees,
  extractHeadingsFromHTML,
  findLabelByFile,
  type ModuleTree,
  type MarkdownHeading,
} from './module-tree'
import { renderMarkdown } from './marked-renderer'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

import SidebarModule from './components/SidebarModule.vue'
import TocSidebar from './components/TocSidebar.vue'
import AddModuleModal from './components/AddModuleModal.vue'

// Meta
const isProd = import.meta.env.PROD

/* ───── Refs / State ───── */
const originalContent = ref('')
const renderedContent = ref('')
const currentFile = ref<string>()
const sidebarOpen = ref(false)
const moduleTrees = ref<ModuleTree[]>([])
const currentHeadings = ref<MarkdownHeading[]>([])
const activeHeading = ref<string | null>(null)
const observer = ref<IntersectionObserver | null>(null)
const showModal = ref(false)
const edited = ref(false)
const editedContent = ref('')

/* ───── Handlers ───── */

const handleLoadMarkdown = async (file: string) => {
  if (!isProd) handleCancelEditor()

  const res = await fetch(`${import.meta.env.BASE_URL}modules/${file}`)
  const rawMarkdown = await res.text()
  const rendered = await renderMarkdown(rawMarkdown)

  originalContent.value = rawMarkdown
  renderedContent.value = rendered
  currentHeadings.value = extractHeadingsFromHTML(rendered)
  currentFile.value = file
  sidebarOpen.value = false

  updatePageTitle(file)

  nextTick(() => {
    setupHeadingsObserver()
    scrollToHash()
  })
}

const handleAddModule = () => {
  showModal.value = true
}

const handleUpdateModuleTree = async (data: ModuleTree[]) => {
  if (isProd) return

  moduleTrees.value = data

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/modules/structure/update`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      const textResponse = await response.text()
      throw new Error(textResponse)
    }

    alert('Sukses Mengedit Struktur E-Module')
  } catch (error) {
    console.error(error)
    alert('Gagal mengupdate E-Module!')
  }
}

const handleSyncModule = async () => {
  if (isProd) return

  const accepted = confirm(
    'Apakah anda yakin ingin mempublikasi E-Module ? \nJika terdapat perubahan pada E-Module dan belum terpublish, maka perubahan akan hilang.',
  )
  if (!accepted) return

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/modules/sync`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      const textResponse = await response.text()
      throw new Error(textResponse)
    }

    alert('Sukses Sinkronisasi E-Module')
  } catch (error) {
    console.error(error)
    alert('Gagal Sinkronisasi E-Module!')
  }
}

const handlePublishModule = async () => {
  if (isProd) return

  const accepted = confirm('Apakah anda yakin ingin mempublikasi E-Module ?')
  if (!accepted) return

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/modules/publish`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      const textResponse = await response.text()
      throw new Error(textResponse)
    }

    alert('Sukses Publikasi E-Module')
  } catch (error) {
    console.error(error)
    alert('Gagal mempublikasi E-Module!')
  }
}

const setEditContent = () => {
  if (isProd || edited.value) return

  edited.value = true
  editedContent.value = originalContent.value
}

const handleSaveEditor = async () => {
  if (isProd) return

  if (!currentFile.value) {
    alert('Silahkan pilih file yang akan diedit terlebih dahulu!')
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/modules/content/update`, {
      method: 'POST',
      body: JSON.stringify({
        entry: currentFile.value,
        content: editedContent.value,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      const textResponse = await response.text()
      throw new Error(textResponse)
    }

    await handleLoadMarkdown(currentFile.value)

    alert('Sukses mengubah E-module')
  } catch (error) {
    console.error(error)
    alert('Gagal mengedit file!')
  }
}

const handleCancelEditor = () => {
  if (isProd) return
  edited.value = false
  editedContent.value = ''
}

/* ───── Utilities ───── */

const updatePageTitle = (file: string) => {
  if (isProd) return

  const label = findLabelByFile(moduleTrees.value, file)
  if (label) {
    document.title = `E-Module | ${label}`
  }
}

const scrollToHash = () => {
  const hash = decodeURIComponent(window.location.hash)
  if (hash && hash.startsWith('#')) {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView()
  }
}

const setupHeadingsObserver = () => {
  observer.value?.disconnect()

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).filter((el) => el.id)

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

  headings.forEach((el) => observer.value?.observe(el))
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

    originalContent.value = rawMarkdown
    renderedContent.value = await renderMarkdown(rawMarkdown)
    currentHeadings.value = extractHeadingsFromHTML(renderedContent.value)

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

watch(renderedContent, () => {
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
      :is-prod="isProd"
      @close="sidebarOpen = false"
      @load-markdown="handleLoadMarkdown"
      @add-module="handleAddModule"
    />

    <!-- Main content with ToC on the right -->
    <main class="relative flex flex-col flex-1 overflow-y-auto">
      <div
        class="pt-16 lg:pt-6 mb-4"
        :class="{
          'px-4': edited,
        }"
      >
        <div
          v-if="!edited"
          class="markdown prose max-w-none flex-1 px-6"
          :class="{
            'cursor-pointer': !isProd,
          }"
          v-html="renderedContent"
          @dblclick="!isProd && setEditContent()"
        ></div>
        <MdEditor
          v-else-if="!isProd"
          v-model="editedContent"
          class="flex-1 px-6 min-h-[80vh]"
          language="en"
        />
        <div class="mt-6 flex justify-end gap-2" v-if="edited && !isProd">
          <button
            @click="handleSaveEditor"
            class="editor-action-btn bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckIcon class="h-5 w-5" />
            <span>Simpan</span>
          </button>

          <button
            @click="handleCancelEditor"
            class="editor-action-btn bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
          >
            <XMarkIcon class="h-5 w-5" />
            <span>Batal</span>
          </button>
        </div>
      </div>
    </main>
    <!-- Table of Contents -->
    <TocSidebar v-if="!edited" :headings="currentHeadings" :active-id="activeHeading" />

    <!-- Add Module Modal -->
    <AddModuleModal
      v-if="showModal && !isProd"
      :initial-modules="moduleTrees"
      @close="showModal = false"
      @update="handleUpdateModuleTree"
      @sync="handleSyncModule"
      @publish="handlePublishModule"
    />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

body {
  font-family: 'Inter', sans-serif;
}

.editor-action-btn {
  @apply inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500;
}
</style>
