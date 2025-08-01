<script setup lang="ts">
import { ref, computed } from 'vue'
import TreeView from '@/components/TreeView.vue'
import {
  PlusIcon,
  DocumentPlusIcon,
  RectangleStackIcon,
  GlobeAltIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/outline'
import type { ModuleTree } from '@/module-tree'
import StringUtils from '@/string-utils'

type Props = {
  initialModules: ModuleTree[]
}

type EmitProps = {
  (e: 'close'): void
  (e: 'update', value: ModuleTree[]): void
  (e: 'sync'): void
  (e: 'publish'): void
}

type Form = {
  label: string
  isFile: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<EmitProps>()

const modules = ref<ModuleTree[]>([...props.initialModules])
const form = ref<Form>({
  label: '',
  isFile: true,
})
const selectedParent = ref<ModuleTree | null>(null)

const allParents = computed(() => {
  const collectParents = (nodes: ModuleTree[], acc: ModuleTree[] = []) => {
    for (const node of nodes) {
      if (node.children) {
        acc.push(node)
        collectParents(node.children, acc)
      }
    }
    return acc
  }
  return collectParents(modules.value)
})

const resetForm = () => {
  form.value = { label: '', isFile: true }
  selectedParent.value = null
}

const addModule = () => {
  if (!form.value.label.trim()) return

  const newModule: ModuleTree = {
    label: form.value.label.trim(),
    ...(form.value.isFile
      ? { file: `${StringUtils.slugify(form.value.label)}.md` }
      : { children: [] }),
  }

  if (selectedParent.value) {
    selectedParent.value.children ||= []
    selectedParent.value.children.push(newModule)
  } else {
    modules.value.push(newModule)
  }

  emit('update', modules.value)
  resetForm()
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto"
  >
    <div
      class="bg-white/90 backdrop-blur-md rounded-lg w-full max-w-3xl shadow-xl relative flex flex-col max-h-[90vh]"
    >
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">📚 Manajemen Module</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-black text-lg transition">
          ✖
        </button>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto px-6 py-4 space-y-6 grow">
        <!-- Form -->
        <form @submit.prevent="addModule" class="space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">📘 Module Title</label>
            <div class="relative">
              <input
                v-model="form.label"
                type="text"
                required
                placeholder="e.g. Introduction"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <DocumentPlusIcon
                class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <!-- Type toggle -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="form.isFile"
              class="form-checkbox text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
            <label class="text-sm font-medium text-gray-700"> This is a file (has content) </label>
          </div>

          <!-- Parent selector -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">📦 Parent Module</label>
            <select
              v-model="selectedParent"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option :value="null">— Add to root —</option>
              <option v-for="parent in allParents" :key="parent.label" :value="parent">
                {{ parent.label }}
              </option>
            </select>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition"
            >
              <PlusIcon class="w-5 h-5" />
              Add Module
            </button>
          </div>
        </form>

        <!-- Module tree preview -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <RectangleStackIcon class="text-yellow-500 w-5 h-5" />
            <h3 class="text-sm font-semibold text-gray-700">Struktur Module</h3>
          </div>
          <TreeView :modules="modules" @update="(moduleTree) => emit('update', moduleTree)" />
        </div>

        <div class="flex gap-2">
          <!-- Sync button -->
          <button
            @click="emit('sync')"
            class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition cursor-pointer"
          >
            <ArrowPathRoundedSquareIcon class="w-5 h-5" />
            Sinkronisasi Module
          </button>

          <!-- Publish button -->
          <button
            @click="emit('publish')"
            class="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition cursor-pointer"
          >
            <GlobeAltIcon class="w-5 h-5" />
            Publikasi Module
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
