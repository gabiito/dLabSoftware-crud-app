import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/IndexPage.vue'), name: 'Home' }],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue'), name: 'Login' }],
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('layouts/EmptyLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/LogoutPage.vue'), name: 'Logout' }],
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/ProductPage.vue'), name: 'Product' }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
