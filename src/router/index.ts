import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView/index.vue')
    },
    // {
    //   path: '/vuePratice',
    //   name: 'vuePratice',
    //   component: () => import('../views/VuePratice/index.vue')
    // },
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
    }
  ]
})

export default router
