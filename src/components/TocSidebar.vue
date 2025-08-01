<script setup lang="ts">
type Props = {
  headings: Array<{ id: string; text: string; content: string; level: number }>
  activeId: string | null
}

defineProps<Props>()
</script>

<template>
  <aside
    class="hidden xl:block w-64 shrink-0 h-full sticky top-0 overflow-y-auto shadow-md bg-white"
  >
    <div class="p-6 animate-in fade-in slide-in-from-right duration-300">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">📑 Daftar Isi</h2>
      <ul class="space-y-2 text-sm">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="{
            'pl-0 font-semibold text-gray-900': heading.level === 1,
            'pl-4 text-gray-700': heading.level === 2,
            'pl-6 text-gray-600': heading.level === 3,
            'pl-8 text-gray-500': heading.level === 4,
          }"
        >
          <a
            :href="`#${heading.id}`"
            class="block px-2 py-1 rounded transition-colors duration-200"
            :class="{
              'bg-blue-50 text-blue-600 font-medium': activeId === heading.id,
              'hover:bg-blue-50 hover:text-blue-600': activeId !== heading.id,
            }"
            v-html="heading.content"
          >
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
