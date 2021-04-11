import { createRouter, createWebHistory } from 'vue-router';

import store from '@/store';

import Login from '@/views/Auth/Login';
import Register from '@/views/Auth/Register';
import Home from '@/views/Home';
import Profile from '@/views/Profile';
import Activity from '@/views/Activity.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/activity',
      name: 'Activity',
      component: Activity,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!store.getters.authToken) {
      return next({ path: '/login' });
    } else {
      return next();
    }
  } else {
    return next();
  }
});

export default router;
