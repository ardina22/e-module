<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import type { ModuleTree } from '@/module-tree'

const props = defineProps<ModuleTree & { currentFile: string }>()
const emit = defineEmits<{
  (e: 'loadMarkdown', file: string): void
}>()

const isOpen = ref(false)
const hasChildren = props.children && props.children.length > 0
const isActive = computed(() => props.file === props.currentFile)

const handleClick = () => {
  if (props.file) {
    emit('loadMarkdown', props.file)
  }
}

const toggle = () => {
  if (hasChildren) {
    isOpen.value = !isOpen.value
  } else {
    handleClick()
  }
}

const emitMarkdown = (file: string) => emit('loadMarkdown', file)
</script>

<template>
  <li>
    <div
      class="flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition"
      :class="[
        isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-800',
      ]"
      @click="toggle"
    >
      <span class="text-sm font-medium text-gray-800">
        {{ props.label }}
      </span>

      <ChevronRightIcon
        v-if="hasChildren"
        :class="['h-4 w-4 text-gray-500 transition-transform', isOpen ? 'rotate-90' : 'rotate-0']"
      />
    </div>

    <transition name="fade">
      <ul v-if="hasChildren && isOpen" class="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
        <SidebarItem
          v-for="(child, index) in props.children"
          :key="child.file || child.label + index"
          :current-file="props.currentFile"
          v-bind="child"
          @loadMarkdown="emitMarkdown"
        />
      </ul>
    </transition>
  </li>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
