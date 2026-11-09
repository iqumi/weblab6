const TODOS_KEY = 'todo-list:tasks'
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

function isValidTodo(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    Number.isInteger(item.id) &&
    typeof item.title === 'string' &&
    item.title.trim() !== '' &&
    typeof item.done === 'boolean'
  )
}

export function loadTodos() {
  const stored = readJson(TODOS_KEY)
  if (!Array.isArray(stored)) {
    return []
  }

  const knownIds = new Set()
  const todos = []

  for (const item of stored) {
    if (isValidTodo(item) && !knownIds.has(item.id)) {
      knownIds.add(item.id)
      todos.push({ id: item.id, title: item.title, done: item.done })
    }
  }

  return todos
}

export function saveTodos(todos) {
  writeJson(TODOS_KEY, todos)
}

export function loadTheme() {
  const stored = readJson(THEME_KEY)
  return VALID_THEMES.includes(stored) ? stored : null
}

export function saveTheme(theme) {
  writeJson(THEME_KEY, theme)
}
