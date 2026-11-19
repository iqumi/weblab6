import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    query: ''
  }),

  getters: {
    userTodos(state) {
      const { currentUser } = useUserStore()
      if (!currentUser) {
        return []
      }
      return state.todos.filter((todo) => todo.ownerId === currentUser.id)
    },

    filteredTodos(state) {
      const normalizedQuery = state.query.trim().toLowerCase()
      return this.userTodos.filter((todo) => todo.title.toLowerCase().includes(normalizedQuery))
    },

    activeTodos() {
      return this.filteredTodos.filter((todo) => !todo.done)
    },

    doneTodos() {
      return this.filteredTodos.filter((todo) => todo.done)
    },

    visibleTodos() {
      return [...this.activeTodos, ...this.doneTodos]
    },

    hasQuery: (state) => state.query.trim() !== ''
  },

  actions: {
    generateId() {
      return this.todos.reduce((maxId, todo) => Math.max(maxId, todo.id), 0) + 1
    },

    findTodo(id) {
      return this.userTodos.find((todo) => todo.id === id)
    },

    addTodo(title) {
      const { currentUser } = useUserStore()
      if (!currentUser) {
        return
      }
      this.todos.push({ id: this.generateId(), ownerId: currentUser.id, title, done: false })
    },

    renameTodo(id, title) {
      const todo = this.findTodo(id)
      if (todo) {
        todo.title = title
      }
    },

    toggleTodo(id) {
      const todo = this.findTodo(id)
      if (todo) {
        todo.done = !todo.done
      }
    },

    removeTodo(id) {
      const todo = this.findTodo(id)
      if (todo) {
        this.todos = this.todos.filter((item) => item !== todo)
      }
    },

    resetQuery() {
      this.query = ''
    }
  },

  persist: {
    key: 'todo-list:todos',
    pick: ['todos']
  }
})
