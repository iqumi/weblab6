import { computed, ref, watch } from 'vue'
import { loadTodos, saveTodos } from '../utils/storage'

export function useTodos() {
  const todos = ref(loadTodos())
  const query = ref('')

  const normalizedQuery = computed(() => query.value.trim().toLowerCase())

  const filteredTodos = computed(() =>
    todos.value.filter((todo) => todo.title.toLowerCase().includes(normalizedQuery.value))
  )

  const activeTodos = computed(() => filteredTodos.value.filter((todo) => !todo.done))
  const doneTodos = computed(() => filteredTodos.value.filter((todo) => todo.done))
  const visibleTodos = computed(() => [...activeTodos.value, ...doneTodos.value])

  function generateId() {
    return todos.value.reduce((maxId, todo) => Math.max(maxId, todo.id), 0) + 1
  }

  function findTodo(id) {
    return todos.value.find((todo) => todo.id === id)
  }

  function addTodo(title) {
    todos.value.push({ id: generateId(), title, done: false })
  }

  function renameTodo(id, title) {
    const todo = findTodo(id)
    if (todo) {
      todo.title = title
    }
  }

  function toggleTodo(id) {
    const todo = findTodo(id)
    if (todo) {
      todo.done = !todo.done
    }
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  watch(todos, saveTodos, { deep: true })

  return {
    todos,
    query,
    activeTodos,
    doneTodos,
    visibleTodos,
    findTodo,
    addTodo,
    renameTodo,
    toggleTodo,
    removeTodo
  }
}
