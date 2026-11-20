import { computed, ref, watch } from 'vue'
import type { Theme } from '../types/theme'
import { loadTheme, saveTheme } from '../utils/storage'

function detectInitialTheme(): Theme {
  const savedTheme = loadTheme()
  if (savedTheme) {
    return savedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const theme = ref<Theme>(detectInitialTheme())
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme(): void {
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
