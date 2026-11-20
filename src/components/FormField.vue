<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    label: string
    modelValue: string
    type?: string
    autocomplete?: string
    error?: string
  }>(),
  { type: 'text', autocomplete: 'off', error: '' }
)

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
  <div class="form-field">
    <label class="form-field__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="field"
      :name="id"
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="handleInput"
    />
    <p v-if="error" :id="`${id}-error`" class="form-field__error">
      {{ error }}
    </p>
  </div>
</template>
