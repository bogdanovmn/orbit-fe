import { createRouter, createWebHistory } from 'vue-router'
import { tokenStorage } from '@bogdanovmn/ssofw'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory('/orbit/'),
  routes: [
    { path: '/', component: HomeView },
    {
      path: '/login',
      redirect: () => {
        const ssoUrl = import.meta.env.VITE_SSO_FRONT_URL
        const redirectUri = `${window.location.origin}/orbit/sso-callback`
        window.location.href = `${ssoUrl}/login?from=${encodeURIComponent(redirectUri)}`
        return '/'
      }
    },
    { path: '/sso-callback', component: () => import('@/views/SsoCallbackView.vue') },
    { path: '/tracks', component: () => import('@/views/TracksView.vue'), meta: { private: true } },
    { path: '/tracks/:id', component: () => import('@/views/TrackDetailView.vue'), meta: { private: true }, props: true },
    { path: '/activities', component: () => import('@/views/ActivitiesView.vue'), meta: { private: true } },
    { path: '/activities/:id', component: () => import('@/views/ActivityDetailView.vue'), meta: { private: true }, props: true },
  ]
})

router.beforeEach((to) => {
  const isAuthenticated = tokenStorage.defined()
  if (to.meta.private && !isAuthenticated) {
    return { path: '/' }
  }
  if (to.path === '/' && isAuthenticated) {
    return { path: '/tracks' }
  }
})

export default router