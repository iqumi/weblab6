<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import FormField from '../components/FormField.vue'
import { useUserStore } from '../stores/user'
import { focusFirstInvalidField } from '../utils/focus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formElement = ref(null)
const form = reactive({ email: '', password: '' })
const errors = ref({})

const isJustRegistered = computed(() => route.query.registered === '1')

async function handleSubmit() {
  errors.value = userStore.login(form)

  if (Object.keys(errors.value).length > 0) {
    await nextTick()
    focusFirstInvalidField(formElement.value)
    return
  }

  router.push({ name: 'todo' })
}
</script>

<template>
  <div class="page__content page__content--narrow">
    <h1 class="page__title">Вход</h1>

    <p v-if="isJustRegistered" class="notice notice--success" role="status">
      Аккаунт создан. Теперь можно войти.
    </p>

    <form ref="formElement" class="card form" novalidate @submit.prevent="handleSubmit">
      <p v-if="errors.form" class="notice notice--error" role="alert">{{ errors.form }}</p>

      <FormField
        id="login-email"
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <FormField
        id="login-password"
        v-model="form.password"
        label="Пароль"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
      />

      <button type="submit" class="button button--primary">Войти</button>
    </form>

    <p class="page__hint">
      Нет аккаунта?
      <RouterLink class="link" :to="{ name: 'register' }">Зарегистрируйтесь</RouterLink>
    </p>
  </div>
</template>
