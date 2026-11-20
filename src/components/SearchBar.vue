<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event): void {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value)
  }
}
</script>

<template>
  <div class="search">
    <label class="visually-hidden" for="task-search">Поиск задач</label>
    <AppIcon name="search" class="search__icon" />
    <input
      id="task-search"
      class="field search__input"
      type="search"
      placeholder="Найти задачу..."
      autocomplete="off"
      :value="modelValue"
      @input="handleInput"
    />
  </div>
</template>
