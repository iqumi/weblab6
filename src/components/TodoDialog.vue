<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  todo: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'close'])

const dialogElement = ref(null)
const inputElement = ref(null)
const title = ref('')
const hasError = ref(false)
let openerElement = null

const isEditing = computed(() => props.todo !== null)
const heading = computed(() => (isEditing.value ? 'Редактирование задачи' : 'Новая задача'))
const submitLabel = computed(() => (isEditing.value ? 'Сохранить' : 'Добавить'))

async function openDialog() {
  openerElement = document.activeElement
  title.value = props.todo?.title ?? ''
  hasError.value = false
  await nextTick()
  dialogElement.value.showModal()
  inputElement.value.focus()
  inputElement.value.select()
}

function closeDialog() {
  dialogElement.value.close()
}

function handleClose() {
  emit('close')
  if (openerElement?.isConnected) {
    openerElement.focus()
  }
  openerElement = null
}

function handleSubmit() {
  const trimmedTitle = title.value.trim()
  if (trimmedTitle === '') {
    hasError.value = true
    inputElement.value.focus()
    return
  }
  emit('submit', trimmedTitle)
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && !dialogElement.value.open) {
      openDialog()
    } else if (!isOpen && dialogElement.value.open) {
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
        :aria-invalid="hasError ? 'true' : null"
        :aria-describedby="hasError ? 'todo-dialog-error' : null"
      />
      <p v-if="hasError" id="todo-dialog-error" class="modal__error" role="alert">
        Введите название задачи
      </p>

      <div class="modal__actions">
        <button type="button" class="button button--secondary" @click="emit('close')">
          Отмена
        </button>
        <button type="submit" class="button button--primary">{{ submitLabel }}</button>
      </div>
    </form>
  </dialog>
</template>
