import { defineStore } from 'pinia'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUserId: null
  }),

  getters: {
    currentUser: (state) => state.users.find((user) => user.id === state.currentUserId) ?? null,
    isAuthenticated() {
      return this.currentUser !== null
    }
  },

  actions: {
    findByEmail(email) {
      const normalizedEmail = normalizeEmail(email)
      return this.users.find((user) => user.email === normalizedEmail)
    },

    generateId() {
      return this.users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1
    },

    register({ email, password, confirmPassword }) {
      const errors = {}

      if (email.trim() === '') {
        errors.email = 'Введите email'
      } else if (!EMAIL_PATTERN.test(normalizeEmail(email))) {
        errors.email = 'Введите email в формате name@example.com'
      } else if (this.findByEmail(email)) {
        errors.email = 'Пользователь с таким email уже зарегистрирован'
      }

      if (password === '') {
        errors.password = 'Введите пароль'
      }

      if (confirmPassword === '') {
        errors.confirmPassword = 'Повторите пароль'
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают'
      }

      if (Object.keys(errors).length === 0) {
        this.users.push({ id: this.generateId(), email: normalizeEmail(email), password })
      }

      return errors
    },

    login({ email, password }) {
      const errors = {}

      if (email.trim() === '') {
        errors.email = 'Введите email'
      }

      if (password === '') {
        errors.password = 'Введите пароль'
      }

      if (Object.keys(errors).length > 0) {
        return errors
      }

      const user = this.findByEmail(email)
      if (!user || user.password !== password) {
        return { form: 'Неверный email или пароль' }
      }

      this.currentUserId = user.id
      return errors
    },

    logout() {
      this.currentUserId = null
    }
  },

  persist: {
    key: 'todo-list:users',
    pick: ['users', 'currentUserId']
  }
})
