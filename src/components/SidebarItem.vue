<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import type { ModuleTree } from '@/module-tree'

type Props = ModuleTree & { currentFile?: string }

type Emits = {
  (e: 'load-markdown', file: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)

const hasChildren = computed(() => props.children && props.children.length > 0)
const isActive = computed(() => props.file === props.currentFile)

const handleClick = () => {
  if (props.file) {
    emit('load-markdown', props.file)
  }
}

const toggle = () => {
  if (hasChildren.value) {
    isOpen.value = !isOpen.value
  } else {
    handleClick()
  }
}

const emitMarkdown = (file: string) => emit('load-markdown', file)
</script>

<template>
  <li>
    <div
      class="cursor-pointer px-3 py-2 rounded-md transition"
      :class="[
        isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-800',
      ]"
      @click="toggle"
    >
      <div class="flex w-full gap-3">
        <!-- Label -->
        <span class="flex-1 text-sm font-medium leading-snug text-gray-800">
          {{ props.label }}
        </span>

        <!-- Chevron aligned to top -->
        <ChevronRightIcon
          v-if="hasChildren"
          :class="[
            'w-4 h-4 text-gray-500 flex-shrink-0 self-start mt-0.5 transition-transform duration-200 ease-in-out',
            isOpen ? 'rotate-90' : 'rotate-0',
          ]"
        />
      </div>
    </div>

    <!-- Children -->
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
