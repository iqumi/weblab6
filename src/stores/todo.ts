import { defineStore } from 'pinia'
import type { Todo } from '../types/todo'
import { todosSerializer } from '../utils/storage'
import { useUserStore } from './user'

interface TodoState {
  todos: Todo[]
  query: string
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    query: ''
  }),

  getters: {
    userTodos(state): Todo[] {
      const { currentUser } = useUserStore()
      if (!currentUser) {
        return []
      }
      return state.todos.filter((todo) => todo.ownerId === currentUser.id)
    },

    filteredTodos(state): Todo[] {
      const normalizedQuery = state.query.trim().toLowerCase()
      return this.userTodos.filter((todo) =>
        todo.title.toLowerCase().includes(normalizedQuery)
      )
    },

    activeTodos(): Todo[] {
      return this.filteredTodos.filter((todo) => !todo.done)
    },

    doneTodos(): Todo[] {
      return this.filteredTodos.filter((todo) => todo.done)
    },

    visibleTodos(): Todo[] {
      return [...this.activeTodos, ...this.doneTodos]
    },

    hasQuery: (state): boolean => state.query.trim() !== ''
  },

  actions: {
    generateId(): number {
      return this.todos.reduce((maxId, todo) => Math.max(maxId, todo.id), 0) + 1
    },

    findTodo(id: number): Todo | undefined {
      return this.userTodos.find((todo) => todo.id === id)
    },

    addTodo(title: string): void {
      const { currentUser } = useUserStore()
      if (!currentUser) {
        return
      }
      this.todos.push({
        id: this.generateId(),
        ownerId: currentUser.id,
        title,
        done: false
      })
    },

    renameTodo(id: number, title: string): void {
      const todo = this.findTodo(id)
      if (todo) {
        todo.title = title
      }
    },

    toggleTodo(id: number): void {
      const todo = this.findTodo(id)
      if (todo) {
        todo.done = !todo.done
      }
    },

    removeTodo(id: number): void {
      const todo = this.findTodo(id)
      if (todo) {
        this.todos = this.todos.filter((item) => item !== todo)
      }
    },

    resetQuery(): void {
      this.query = ''
    }
  },

  persist: {
    key: 'todo-list:todos',
    pick: ['todos'],
    serializer: todosSerializer
  }
})
