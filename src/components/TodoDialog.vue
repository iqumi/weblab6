<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Todo } from '../types/todo'

const props = defineProps<{
  isOpen: boolean
  todo: Todo | null
}>()

const emit = defineEmits<{
  submit: [title: string]
  close: []
}>()

const dialogElement = ref<HTMLDialogElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)
const title = ref('')
const hasError = ref(false)
let openerElement: HTMLElement | null = null

const isEditing = computed(() => props.todo !== null)
const heading = computed(() =>
  isEditing.value ? 'Редактирование задачи' : 'Новая задача'
)
const submitLabel = computed(() => (isEditing.value ? 'Сохранить' : 'Добавить'))

async function openDialog(): Promise<void> {
  openerElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  title.value = props.todo?.title ?? ''
  hasError.value = false
  await nextTick()
  dialogElement.value?.showModal()
  inputElement.value?.focus()
  inputElement.value?.select()
}

function closeDialog(): void {
  dialogElement.value?.close()
}

function handleClose(): void {
  emit('close')
  if (openerElement?.isConnected) {
    openerElement.focus()
  }
  openerElement = null
}

function handleSubmit(): void {
  const trimmedTitle = title.value.trim()
  if (trimmedTitle === '') {
    hasError.value = true
    inputElement.value?.focus()
    return
  }
  emit('submit', trimmedTitle)
}

watch(
  () => props.isOpen,
  (isOpen) => {
    const isDialogOpen = dialogElement.value?.open ?? false
    if (isOpen && !isDialogOpen) {
      openDialog()
    } else if (!isOpen && isDialogOpen) {
      closeDialog()
    }
  }
)

watch(title, () => {
  hasError.value = false
})
</script>

<template>
  <dialog
    ref="dialogElement"
    class="modal"
    aria-labelledby="todo-dialog-title"
    @close="handleClose"
    @click.self="emit('close')"
  >
    <form class="modal__form" @submit.prevent="handleSubmit">
      <h2 id="todo-dialog-title" class="modal__title">{{ heading }}</h2>

      <label class="modal__label" for="todo-dialog-input">Название</label>
      <input
        id="todo-dialog-input"
        ref="inputElement"
        v-model="title"
        class="field"
        name="title"
        type="text"
        maxlength="200"
        autocomplete="off"
        required
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="hasError ? 'todo-dialog-error' : undefined"
      />
      <p
        v-if="hasError"
        id="todo-dialog-error"
        class="modal__error"
        role="alert"
      >
        Введите название задачи
      </p>

      <div class="modal__actions">
        <button
          type="button"
          class="button button--secondary"
          @click="emit('close')"
        >
          Отмена
        </button>
        <button type="submit" class="button button--primary">
          {{ submitLabel }}
        </button>
      </div>
    </form>
  </dialog>
</template>
