import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw
} from 'vue-router'
import { useUserStore } from '../stores/user'
import AboutPage from '../pages/AboutPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import TodoPage from '../pages/TodoPage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const APP_TITLE = 'Список задач'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'todo' } },
  {
    path: '/todo',
    name: 'todo',
    component: TodoPage,
    meta: { title: 'Задачи', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Вход', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { title: 'Регистрация', guestOnly: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: 'О приложении' }
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'todo' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: 'todo' }
  }

  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title} — ${APP_TITLE}`
})

export default router
