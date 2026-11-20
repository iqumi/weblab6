<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    class="icon-button icon-button--bordered"
    :aria-pressed="isDark"
    @click="emit('toggle')"
  >
    <span class="visually-hidden">Тёмная тема</span>
    <AppIcon :name="isDark ? 'moon' : 'sun'" />
  </button>
</template>
