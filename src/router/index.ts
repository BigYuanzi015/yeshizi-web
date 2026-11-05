import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const HOME_TITLE = '夜十字工作室 · Noctu Crucis Studio'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomeView.vue'),
    meta: {
      title: HOME_TITLE,
      description:
        '夜十字工作室 Noctu Crucis Studio 官方网站：30 张 Minecraft 解密/闯关地图、工作室发展年表、投喂榜与加入方式。',
    },
  },
  {
    path: '/maps',
    name: 'maps',
    component: () => import('@/pages/MapsView.vue'),
    meta: {
      title: '地图汇总',
      description: '夜十字工作室 2017 年至今的全部 Minecraft 地图作品，支持搜索、系列筛选与一键下载。',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutView.vue'),
    meta: {
      title: '关于我们',
      description: '从 2017 年的四人小队到今天的夜十字工作室：完整发展年表、元老会与地图作者。',
    },
  },
  {
    path: '/supporters',
    name: 'supporters',
    component: () => import('@/pages/SupportersView.vue'),
    meta: {
      title: '投喂榜',
      description: '感谢每一位为夜十字工作室投喂过的小伙伴，这里记录着你们的支持。',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/AuthView.vue'),
    meta: { title: '登录', authMode: 'login' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/AuthView.vue'),
    meta: { title: '注册', authMode: 'register' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundView.vue'),
    meta: { title: '页面走丢了' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 90 }
    }
    return { top: 0 }
  },
})

export default router
