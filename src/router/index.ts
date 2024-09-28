import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView/index.vue')
    },
    {
      path: '/william',
      name: 'william',
      children: [
        {
          path: '/william',
          name: 'williamIndex',
          component: () => import('@/views/William/index.vue')
        }
      ]
    },
    {
      path: '/Emily',
      name: 'Emily',
      children: [
        {
          path: '/Emily',
          name: 'EmilyIndex2',
          component: () => import('@/views/Emily/index2.vue')
        }
      ]
    }
  ]
})

export default router
