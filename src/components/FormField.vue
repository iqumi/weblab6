<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'off' },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
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
      :aria-invalid="error ? 'true' : null"
      :aria-describedby="error ? `${id}-error` : null"
      @input="handleInput"
    />
    <p v-if="error" :id="`${id}-error`" class="form-field__error">{{ error }}</p>
  </div>
</template>
