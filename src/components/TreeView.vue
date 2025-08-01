<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import TreeItem from './TreeItem.vue'
import type { ModuleTree } from '@/module-tree'

type Props = {
  modules: ModuleTree[]
}

type Emits = {
  (e: 'update', value: ModuleTree[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// keep a local copy so we never mutate props directly
const local = ref<ModuleTree[]>(props.modules)

const emitUpdate = (data: ModuleTree[]): void => {
  emit('update', data)
}

// recursively remove a node by reference (object identity) or by deep compare (fallback)
const removeNode = (list: ModuleTree[], target: ModuleTree): boolean => {
  for (let i = 0; i < list.length; i++) {
    const n = list[i]
    if (n === target || (n.label === target.label && n.file === target.file)) {
      list.splice(i, 1)
      return true
    }
    if (n.children && removeNode(n.children, target)) return true
  }
  return false
}

const handleRemove = (target: ModuleTree): void => {
  const cloned = JSON.parse(JSON.stringify(local.value)) as ModuleTree[]
  removeNode(cloned, target)
  local.value = cloned
  emitUpdate(local.value)
}
</script>

<template>
  <Draggable
    v-model="local"
    item-key="label"
    group="modules"
    handle=".drag-handle"
    @update="emitUpdate(local)"
    tag="ul"
    class="space-y-2"
  >
    <template #item="{ element }">
      <li>
        <TreeItem
          :module="element"
          :root="local"
          @request-remove="handleRemove"
          @update="emitUpdate"
        />
      </li>
    </template>
  </Draggable>
</template>
