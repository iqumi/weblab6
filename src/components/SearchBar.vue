<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
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
