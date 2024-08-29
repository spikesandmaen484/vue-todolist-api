import { createRouter, createWebHashHistory } from 'vue-router'
import SignIn from '../pages/SignIn.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SignIn
    },
    {
      path: '/todolist',
      component: () => import('../pages/TodoList.vue')
    },
    {
      path: '/signUp',
      component: () => import('../pages/SignUp.vue')
    }
  ]
})

export default router
