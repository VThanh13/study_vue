import { createRouter, createWebHistory } from 'vue-router'
import checkAuth from './auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/layouts/BasicLayout/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home/index.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About/index.vue')
      },
      {
        path: '/pokemon',
        name: 'pokemon',
        component: () => import('@/views/Pokemon/index.vue')
      },
      {
        path: '/pokemon/play',
        name: 'pokemonPlay',
        component: () => import('@/views/Pokemon/GamePage/index.vue')
      },
      {
        path: '/shopping/home',
        name: 'shoppingHome',
        component: () => import('@/views/Shopping/HomePage/index.vue')
      },
      {
        path: '/shopping/cart',
        name: 'shoppingCart',
        component: () => import('@/views/Shopping/CartPage/index.vue')
      },
      {
        path: '/shopping/detail',
        name: 'shoppingDetail',
        component: () => import('@/views/Shopping/DetailPage/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  // Always scroll to top
  scrollBehavior() {
    return { top: 0 }
  }
})

/**
 * Handle check authencation
 */
checkAuth(router)

export default router
