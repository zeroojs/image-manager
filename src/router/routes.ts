import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/group'
  },
  {
    path: '/group',
    component: () => import('../page/group.vue'),
  },
  {
    path: '/group/:id',
    component: () => import('../page/group-details.vue')
  },
  {
    path: '/image/:id',
    component: () => import('../page/image-details.vue')
  }
]

export default routes