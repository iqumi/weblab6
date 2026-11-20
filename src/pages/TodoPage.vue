<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppIcon from '../components/AppIcon.vue'
import SearchBar from '../components/SearchBar.vue'
import TodoDialog from '../components/TodoDialog.vue'
import TodoList from '../components/TodoList.vue'
import { useTodoStore } from '../stores/todo'

interface DialogState {
  isOpen: boolean
  editingId: number | null
}

const todoStore = useTodoStore()
const { query, activeTodos, doneTodos, visibleTodos, hasQuery } =
  storeToRefs(todoStore)

const listComponent = ref<InstanceType<typeof TodoList> | null>(null)
const addButton = ref<HTMLButtonElement | null>(null)
const dialog = reactive<DialogState>({ isOpen: false, editingId: null })

const editingTodo = computed(() =>
  dialog.editingId === null
    ? null
    : (todoStore.findTodo(dialog.editingId) ?? null)
)

const emptyMessage = computed(() =>
  hasQuery.value ? 'Ничего не найдено' : 'Задач пока нет. Добавьте первую!'
)

const statusMessage = computed(() =>
  hasQuery.value ? `Найдено задач: ${visibleTodos.value.length}` : ''
)

function openAddDialog(): void {
  dialog.editingId = null
  dialog.isOpen = true
}

function openEditDialog(id: number): void {
  dialog.editingId = id
  dialog.isOpen = true
}

function closeDialog(): void {
  dialog.isOpen = false
}

async function saveTodo(title: string): Promise<void> {
  const editedId = dialog.editingId

  if (editedId === null) {
    todoStore.addTodo(title)
    closeDialog()
    return
  }

  todoStore.renameTodo(editedId, title)
  closeDialog()
  await nextTick()

  const isStillVisible = visibleTodos.value.some((todo) => todo.id === editedId)
  if (!isStillVisible) {
    addButton.value?.focus()
  }
}

async function handleToggle(id: number): Promise<void> {
  todoStore.toggleTodo(id)
  await nextTick()
  listComponent.value?.focusTask(id)
}

async function handleRemove(id: number): Promise<void> {
  const visible = visibleTodos.value
  const index = visible.findIndex((todo) => todo.id === id)
  const neighbor = visible[index + 1] ?? visible[index - 1]

  todoStore.removeTodo(id)
  await nextTick()

  if (neighbor) {
    listComponent.value?.focusTask(neighbor.id)
  } else {
    addButton.value?.focus()
  }
}

onUnmounted(() => {
  todoStore.resetQuery()
})
</script>

<template>
  <div class="page__content">
    <h1 class="page__title">Список задач</h1>

    <div class="toolbar">
      <SearchBar v-model="query" />
      <button
        ref="addButton"
        type="button"
        class="button button--primary"
        @click="openAddDialog"
      >
        <AppIcon name="plus" />
        Добавить задачу
      </button>
    </div>

    <p class="visually-hidden" role="status">{{ statusMessage }}</p>

    <TodoList
      ref="listComponent"
      :active-todos="activeTodos"
      :done-todos="doneTodos"
      :empty-message="emptyMessage"
      @toggle="handleToggle"
      @edit="openEditDialog"
      @remove="handleRemove"
    />

    <TodoDialog
      :is-open="dialog.isOpen"
      :todo="editingTodo"
      @submit="saveTodo"
      @close="closeDialog"
    />
  </div>
</template>
