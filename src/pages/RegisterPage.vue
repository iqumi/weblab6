<script setup>
import { nextTick, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import FormField from '../components/FormField.vue'
import { useUserStore } from '../stores/user'
import { focusFirstInvalidField } from '../utils/focus'

const router = useRouter()
const userStore = useUserStore()

const formElement = ref(null)
const form = reactive({ email: '', password: '', confirmPassword: '' })
const errors = ref({})

async function handleSubmit() {
  errors.value = userStore.register(form)

  if (Object.keys(errors.value).length > 0) {
    await nextTick()
    focusFirstInvalidField(formElement.value)
    return
  }

  router.push({ name: 'login', query: { registered: '1' } })
}
</script>

<template>
  <div class="page__content page__content--narrow">
    <h1 class="page__title">Регистрация</h1>

    <p class="notice">
      Авторизация учебная: данные хранятся только в этом браузере. Используйте вымышленный email и
      пароль, который нигде больше не применяется.
    </p>

    <form ref="formElement" class="card form" novalidate @submit.prevent="handleSubmit">
      <FormField
        id="register-email"
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <FormField
        id="register-password"
        v-model="form.password"
        label="Пароль"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <FormField
        id="register-confirm-password"
        v-model="form.confirmPassword"
        label="Подтверждение пароля"
        type="password"
        autocomplete="new-password"
        :error="errors.confirmPassword"
      />

      <button type="submit" class="button button--primary">Зарегистрироваться</button>
    </form>

    <p class="page__hint">
      Уже есть аккаунт?
      <RouterLink class="link" :to="{ name: 'login' }">Войдите</RouterLink>
    </p>
  </div>
</template>
