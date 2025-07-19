import { fileURLToPath, URL } from 'node:url'

import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import typography from '@tailwindcss/typography'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Read custom CLI argument: --repo=my-repo
  const repoArg = process.argv.find((arg) => arg.startsWith('--repo='))
  const repoName = repoArg ? repoArg.split('=')[1] : ''

  const isProd = mode === 'production'
  const base = isProd && repoName ? `https://ardina22.github.io/e-module` : '/'

  return {
    base,
    plugins: [vue(), vueDevTools(), tailwindcss(), typography as unknown as PluginOption],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
