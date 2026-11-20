import { defineStore } from 'pinia'
import type {
  AuthErrors,
  LoginCredentials,
  RegistrationData,
  User
} from '../types/user'
import { usersSerializer } from '../utils/storage'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface UserState {
  users: User[]
  currentUserId: number | null
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUserId: null
  }),

  getters: {
    currentUser: (state): User | null =>
      state.users.find((user) => user.id === state.currentUserId) ?? null,
    isAuthenticated(): boolean {
      return this.currentUser !== null
    }
  },

  actions: {
    findByEmail(email: string): User | undefined {
      const normalizedEmail = normalizeEmail(email)
      return this.users.find((user) => user.email === normalizedEmail)
    },

    generateId(): number {
      return this.users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1
    },

    register({
      email,
      password,
      confirmPassword
    }: RegistrationData): AuthErrors {
      const errors: AuthErrors = {}

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
        this.users.push({
          id: this.generateId(),
          email: normalizeEmail(email),
          password
        })
      }

      return errors
    },

    login({ email, password }: LoginCredentials): AuthErrors {
      const errors: AuthErrors = {}

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

    logout(): void {
      this.currentUserId = null
    }
  },

  persist: {
    key: 'todo-list:users',
    pick: ['users', 'currentUserId'],
    serializer: usersSerializer
  }
})
