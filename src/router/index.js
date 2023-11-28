import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../layout/MainLayout.vue'),
      children: [
        {
          path: '/table_3',
          name: 'table_3',
          component: () => import('../views/TABLE_3/TABLE_3.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/table_5',
          name: 'table_5',
          component: () => import('../views/TABLE_5/TABLE_5.vue'),
          meta: {
            requiresAuth: true
          },

          path: '/profile',
          name: 'profile',
          component: () => import('../views/profile/index.vue'),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/',
      name: 'authLayout',
      component: () => import('../layout/AuthLayout.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/Login.vue')
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  if (to.name !== 'login' && !loggedIn) {
    // next('/login')
    return;
  } else if (to.name === 'login' && loggedIn) {
    next(from.path);
    return;
  }
  next();
});

export default router;
