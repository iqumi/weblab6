const THEME_KEY = 'todo-list:theme'
const VALID_THEMES = ['light', 'dark']

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function loadTheme() {
  const stored = readJson(THEME_KEY)
  return VALID_THEMES.includes(stored) ? stored : null
}

export function saveTheme(theme) {
  writeJson(THEME_KEY, theme)
}
