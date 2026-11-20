import type { StateTree } from 'pinia'
import { THEMES, type Theme } from '../types/theme'
import type { Todo } from '../types/todo'
import type { User } from '../types/user'

const THEME_KEY = 'todo-list:theme'

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    isInteger(value.id) &&
    typeof value.email === 'string' &&
    typeof value.password === 'string'
  )
}

function isTodo(value: unknown): value is Todo {
  return (
    isRecord(value) &&
    isInteger(value.id) &&
    isInteger(value.ownerId) &&
    typeof value.title === 'string' &&
    value.title.trim() !== '' &&
    typeof value.done === 'boolean'
  )
}

function isTheme(value: unknown): value is Theme {
  return THEMES.some((theme) => theme === value)
}

function pickUniqueById<T extends { id: number }>(
  items: unknown,
  isValid: (item: unknown) => item is T
): T[] {
  if (!Array.isArray(items)) {
    return []
  }

  const knownIds = new Set<number>()
  const result: T[] = []

  for (const item of items) {
    if (isValid(item) && !knownIds.has(item.id)) {
      knownIds.add(item.id)
      result.push(item)
    }
  }

  return result
}

function parseUsersState(raw: string): StateTree {
  const stored = parseJson(raw)
  if (!isRecord(stored)) {
    return {}
  }

  return {
    users: pickUniqueById(stored.users, isUser),
    currentUserId: isInteger(stored.currentUserId) ? stored.currentUserId : null
  }
}

function parseTodosState(raw: string): StateTree {
  const stored = parseJson(raw)
  if (!isRecord(stored)) {
    return {}
  }

  return { todos: pickUniqueById(stored.todos, isTodo) }
}

export const usersSerializer = {
  serialize: JSON.stringify,
  deserialize: parseUsersState
}

export const todosSerializer = {
  serialize: JSON.stringify,
  deserialize: parseTodosState
}

export function loadTheme(): Theme | null {
  try {
    const stored = parseJson(localStorage.getItem(THEME_KEY) ?? 'null')
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme))
  } catch {
    return
  }
}
