<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  todo: { type: Object, required: true }
})

const emit = defineEmits(['toggle', 'edit', 'remove'])

const ids = computed(() => {
  const prefix = `task-${props.todo.id}`
  return {
    checkbox: `${prefix}-done`,
    title: `${prefix}-title`,
    edit: `${prefix}-edit`,
    remove: `${prefix}-remove`
  }
})
</script>

<template>
  <li class="task" :class="{ 'task--done': todo.done }">
    <input
      :id="ids.checkbox"
      class="task__checkbox"
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
    />
    <label :id="ids.title" :for="ids.checkbox" class="task__title">{{ todo.title }}</label>

    <div class="task__actions">
      <button
        :id="ids.edit"
        type="button"
        class="icon-button"
        :aria-labelledby="`${ids.edit} ${ids.title}`"
        @click="emit('edit', todo.id)"
      >
        <span class="visually-hidden">Редактировать задачу</span>
        <AppIcon name="edit" />
      </button>
      <button
        :id="ids.remove"
        type="button"
        class="icon-button icon-button--danger"
        :aria-labelledby="`${ids.remove} ${ids.title}`"
        @click="emit('remove', todo.id)"
      >
        <span class="visually-hidden">Удалить задачу</span>
        <AppIcon name="trash" />
      </button>
    </div>
  </li>
</template>
