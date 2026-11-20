<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Todo } from '../types/todo'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  activeTodos: Todo[]
  doneTodos: Todo[]
  emptyMessage: string
}>()

const emit = defineEmits<{
  toggle: [id: number]
  edit: [id: number]
  remove: [id: number]
}>()

const rootElement = ref<HTMLElement | null>(null)

const sections = computed(() =>
  [
    { id: 'active', title: 'Активные', todos: props.activeTodos },
    { id: 'done', title: 'Выполненные', todos: props.doneTodos }
  ].filter((section) => section.todos.length > 0)
)

const isEmpty = computed(() => sections.value.length === 0)

function focusTask(id: number): void {
  rootElement.value?.querySelector<HTMLElement>(`#task-${id}-done`)?.focus()
}

defineExpose({ focusTask })
</script>

<template>
  <div ref="rootElement" class="todo-list">
    <p v-if="isEmpty" class="todo-list__empty">{{ emptyMessage }}</p>

    <section
      v-for="section in sections"
      :key="section.id"
      class="todo-list__section"
      :aria-labelledby="`todo-section-${section.id}`"
    >
      <h2 :id="`todo-section-${section.id}`" class="todo-list__heading">
        {{ section.title }} · {{ section.todos.length }}
      </h2>
      <ul class="todo-list__items">
        <TodoItem
          v-for="todo in section.todos"
          :key="todo.id"
          :todo="todo"
          @toggle="emit('toggle', $event)"
          @edit="emit('edit', $event)"
          @remove="emit('remove', $event)"
        />
      </ul>
    </section>
  </div>
</template>
