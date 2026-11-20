<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import { useUserStore } from '../stores/user'

const TECH_STACK = [
  { name: 'Vue 3', role: 'интерфейс и компоненты' },
  { name: 'TypeScript', role: 'весь код приложения, типы проверяет vue-tsc' },
  { name: 'Vite', role: 'сборка и dev-сервер' },
  { name: 'Pinia', role: 'общее состояние: пользователи и задачи' },
  {
    name: 'pinia-plugin-persistedstate',
    role: 'сохранение состояния в localStorage'
  },
  { name: 'Vue Router', role: 'страницы и ограничение доступа' },
  { name: 'Sass', role: 'стили и темы' },
  { name: 'ESLint и Prettier', role: 'проверка и форматирование кода' }
]

const HISTORY = [
  {
    step: 'Лаба 4',
    text: 'Вёрстка и доступность: правила A1–A7 стали основой интерфейса.'
  },
  {
    step: 'Лаба 6',
    text: 'Перенос на Vue 3 и Vite: список разбит на компоненты.'
  },
  {
    step: 'Лаба 7',
    text: 'Pinia, маршруты и учебная авторизация: у каждого пользователя свои задачи.'
  },
  {
    step: 'Лаба 9',
    text: 'Перенос на TypeScript, ESLint и Prettier: типы и проверки перед каждой сборкой.'
  }
]

const FAQ = [
  {
    question: 'Это безопасная авторизация?',
    answer:
      'Нет. Пароли лежат в localStorage открытым текстом, а проверка идёт в браузере. Это тренажёр, а не защита настоящих аккаунтов.'
  },
  {
    question: 'Почему задачи не пропали после выхода?',
    answer:
      'Выход завершает только текущий вход. Аккаунты и задачи остаются в браузере до очистки данных сайта.'
  },
  {
    question: 'Можно ли открыть чужие задачи?',
    answer:
      'Через интерфейс нет. Через DevTools — легко. Именно поэтому настоящая проверка живёт на сервере.'
  }
]

const userStore = useUserStore()
const todoStore = useTodoStore()

const stats = computed(() => {
  const total = todoStore.todos.length
  const done = todoStore.todos.filter((todo) => todo.done).length
  return [
    { label: 'Пользователей', value: userStore.users.length },
    { label: 'Задач создано', value: total },
    { label: 'Задач выполнено', value: done }
  ]
})
</script>

<template>
  <div class="page__content">
    <section class="about-hero">
      <h1 class="page__title">О приложении</h1>
      <p class="about-hero__lead">
        Список задач, который вырос из одной HTML-страницы в приложение на Vue с
        аккаунтами, маршрутами и личными списками дел.
      </p>
    </section>

    <section class="about-section" aria-labelledby="about-stats">
      <h2 id="about-stats" class="about-section__title">Приложение в цифрах</h2>
      <dl class="stats">
        <div v-for="item in stats" :key="item.label" class="stats__item">
          <dt class="stats__label">{{ item.label }}</dt>
          <dd class="stats__value">{{ item.value }}</dd>
        </div>
      </dl>
    </section>

    <section class="about-section" aria-labelledby="about-history">
      <h2 id="about-history" class="about-section__title">
        История разработки
      </h2>
      <ol class="timeline">
        <li v-for="item in HISTORY" :key="item.step" class="timeline__item">
          <span class="timeline__step">{{ item.step }}</span>
          <p>{{ item.text }}</p>
        </li>
      </ol>
    </section>

    <section class="about-section" aria-labelledby="about-stack">
      <h2 id="about-stack" class="about-section__title">Из чего сделано</h2>
      <ul class="stack">
        <li v-for="tech in TECH_STACK" :key="tech.name" class="stack__item">
          <strong>{{ tech.name }}</strong>
          <span>{{ tech.role }}</span>
        </li>
      </ul>
    </section>

    <section class="about-section" aria-labelledby="about-faq">
      <h2 id="about-faq" class="about-section__title">
        Вопросы, которые стоит задать
      </h2>
      <details v-for="item in FAQ" :key="item.question" class="faq">
        <summary class="faq__question">{{ item.question }}</summary>
        <p class="faq__answer">{{ item.answer }}</p>
      </details>
    </section>
  </div>
</template>
