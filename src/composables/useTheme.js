import { computed, ref, watch } from 'vue'
import { loadTheme, saveTheme } from '../utils/storage'

function detectInitialTheme() {
  const savedTheme = loadTheme()
  if (savedTheme) {
    return savedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const theme = ref(detectInitialTheme())
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value
      saveTheme(value)
    },
    { immediate: true }
  )

  return { theme, isDark, toggleTheme }
}
