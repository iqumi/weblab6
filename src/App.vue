<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import { useTheme } from './composables/useTheme'
import { useUserStore } from './stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { isDark, toggleTheme } = useTheme()

const mainElement = ref<HTMLElement | null>(null)

async function handleLogout(): Promise<void> {
  userStore.logout()
  await router.push({ name: 'login' })
}

watch(
  () => route.name,
  async () => {
    await nextTick()
    mainElement.value?.focus()
  }
)
</script>

<template>
  <div class="app">
    <header class="site-header">
      <p class="site-header__brand">Список задач</p>

      <nav class="site-header__nav" aria-label="Основная навигация">
        <ul class="site-nav">
          <li v-if="userStore.isAuthenticated">
            <RouterLink class="site-nav__link" :to="{ name: 'todo' }"
              >Задачи</RouterLink
            >
          </li>
          <li v-else>
            <RouterLink class="site-nav__link" :to="{ name: 'login' }"
              >Вход</RouterLink
            >
          </li>
          <li v-if="!userStore.isAuthenticated">
            <RouterLink class="site-nav__link" :to="{ name: 'register' }"
              >Регистрация</RouterLink
            >
          </li>
          <li>
            <RouterLink class="site-nav__link" :to="{ name: 'about' }"
              >О приложении</RouterLink
            >
          </li>
        </ul>
      </nav>

      <div class="site-header__actions">
        <template v-if="userStore.currentUser">
          <span class="site-header__user">{{
            userStore.currentUser.email
          }}</span>
          <button
            type="button"
            class="button button--secondary"
            @click="handleLogout"
          >
            Выйти
          </button>
        </template>
        <ThemeToggle :is-dark="isDark" @toggle="toggleTheme" />
      </div>
    </header>

    <main ref="mainElement" class="page" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
