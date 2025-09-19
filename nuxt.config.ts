// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  vite: {
    // Vite config for Tauri
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      strictPort: true
    },
    build: {
      target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      sourcemap: !!process.env.TAURI_DEBUG,
      rollupOptions: {
        external: ['@tauri-apps/plugin-dialog']
      }
    }
  }
})
