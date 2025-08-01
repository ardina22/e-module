<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Dragable from 'vuedraggable'
import {
  FolderIcon,
  DocumentIcon,
  Bars3Icon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import type { ModuleTree } from '@/module-tree'
import StringUtils from '@/string-utils'

/* ───── Props & Emits ───── */
const { module, root } = defineProps<{
  module: ModuleTree
  root: ModuleTree[]
}>()

const emit = defineEmits<{
  (e: 'update', trees: ModuleTree[]): void
  (e: 'request-remove', node: ModuleTree): void
}>()

/* ───── State ───── */
const expanded = ref(true)
const adding = ref(false)
const localModule = ref(module)
const localRoot = ref(root)

const childForm = reactive({
  label: '',
  file: '',
  isFile: true,
})

/* ───── Computed ───── */
const isRootModule = computed(
  () => localModule.value.file && localRoot.value.find((m) => m.file === localModule.value.file),
)

const parentClass = computed(() =>
  localModule.value.children || isRootModule.value ? 'rounded-lg' : 'pl-6 last:rounded-b-lg',
)

/* ───── Methods ───── */
const toggle = () => {
  expanded.value = !expanded.value
}

const startAddChild = () => {
  adding.value = true
  childForm.label = ''
  childForm.file = ''
  childForm.isFile = true
}

const cancelAdd = () => {
  adding.value = false
}

const confirmAdd = () => {
  if (!childForm.label.trim()) return

  const newChild: ModuleTree = {
    label: childForm.label.trim(),
    ...(childForm.isFile
      ? { file: childForm.file || `${StringUtils.slugify(childForm.label)}.md` }
      : { children: [] }),
  }

  const insertChild = (nodes: ModuleTree[]): boolean => {
    for (const node of nodes) {
      if (node.label === localModule.value.label && node.file === localModule.value.file) {
        node.children = node.children || []
        node.children.push(newChild)
        return true
      }
      if (node.children && insertChild(node.children)) return true
    }
    return false
  }

  insertChild(localRoot.value)
  emit('update', localRoot.value)
  adding.value = false
}

const requestRemove = () => {
  const isFolder = !!localModule.value.children?.length
  const ok = confirm(
    isFolder
      ? `Remove folder "${localModule.value.label}" and all of its children?`
      : `Remove "${localModule.value.label}"?`,
  )
  if (ok) emit('request-remove', localModule.value)
}
</script>

<template>
  <div
    class="border border-gray-200 bg-white shadow-sm hover:shadow-md transition drag-handle cursor-move"
    :class="parentClass"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 p-2">
      <Bars3Icon class="w-4 h-4 text-gray-400" />

      <!-- Expand/collapse -->
      <button v-if="module.children" @click="toggle" class="text-gray-500 hover:text-gray-700">
        <component :is="expanded ? ChevronDownIcon : ChevronRightIcon" class="w-4 h-4" />
      </button>

      <!-- Icon -->
      <component
        :is="module.children ? FolderIcon : DocumentIcon"
        class="w-5 h-5"
        :class="module.children ? 'text-yellow-500' : 'text-gray-500'"
      />

      <!-- Label -->
      <span class="text-sm font-medium text-gray-800 truncate">
        {{ module.label }}
      </span>

      <!-- Actions -->
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="module.children"
          @click="startAddChild"
          class="text-blue-600 hover:text-blue-800"
          title="Add child"
        >
          <PlusCircleIcon class="w-5 h-5" />
        </button>

        <button @click="requestRemove" class="text-red-600 hover:text-red-700" title="Remove">
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Add Child Form -->
    <div v-if="adding" class="ml-7 mr-2 mb-3 border-l border-gray-200 pl-3 space-y-2">
      <input
        v-model="childForm.label"
        placeholder="Child title"
        class="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-100"
      />

      <label class="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="childForm.isFile" class="form-checkbox text-blue-600" />
        <span>Is file</span>
      </label>

      <input
        v-if="childForm.isFile"
        v-model="childForm.file"
        placeholder="Filename (optional)"
        class="w-full border rounded px-2 py-1 text-sm"
      />

      <div class="flex gap-2">
        <button
          @click="confirmAdd"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
        <button @click="cancelAdd" class="px-3 py-1 text-sm text-gray-600 hover:text-black">
          Cancel
        </button>
      </div>
    </div>

    <!-- Children (Draggable) -->
    <div v-if="localModule.children && expanded">
      <Dragable
        v-model="localModule.children"
        item-key="label"
        group="modules"
        handle=".drag-handle"
        @end="emit('update', localRoot)"
      >
        <template #item="{ element }">
          <TreeItem
            :module="element"
            :root="localRoot"
            @request-remove="emit('request-remove', $event)"
            @update="emit('update', $event)"
          />
        </template>
      </Dragable>
    </div>
  </div>
</template>
