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
      redirect: { name: 'williamIndex' },
      children: [
        {
          path: '',
          name: 'williamIndex',
          component: () => import('@/views/William/index.vue')
        },
        {
          path: 'air-quality',
          name: 'williamAirQuality',
          component: () => import('@/views/William/airQuality/index.vue')
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
    },
    {
      path: '/Sandy',
      name: 'Sandy',
      children: [
        {
          path: '/Sandy',
          name: 'SandyIndex',
          component: () => import('@/views/Sandy/index.vue')
        }
      ]
    }
  ]
})

export default router
