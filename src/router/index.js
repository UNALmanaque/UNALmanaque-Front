import { createRouter, createWebHistory } from 'vue-router';

//import store from '@/store';
import firebase from 'firebase';

import Login from '@/views/Auth/Login';
import Register from '@/views/Auth/Register';
import Home from '@/views/Home';
import Profile from '@/views/Profile';
import Activity from '@/views/Activity.vue';
import Calendar from '@/views/Calendar.vue';

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
      path: '/home',
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
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
      meta: {
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    const user = firebase.auth().currentUser;
    if (user) {
      return next();
    } else {
      return next({
        path: '/login',
      });
    }
  } else {
    return next();
  }
  /* if (to.meta.requiresAuth) {
    if (!store.getters.authToken) {
      return next({ path: '/login' });
    } else {
      return next();
    }
  } else {
    return next();
  }*/
});

export default router;
