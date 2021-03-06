import { createRouter, createWebHistory } from 'vue-router';

//import store from '@/store';
import firebase from 'firebase';

import Login from '@/views/Auth/Login';
import Register from '@/views/Auth/Register';
import Home from '@/views/Home';
import Profile from '@/views/Profile';
import Activity from '@/views/Activity.vue';
import Calendar from '@/views/Calendar.vue';
import EditActivity from '@/views/EditActivity';
import Stats from '@/views/Stats';
import Activities from '@/views/Activities';
import User_Information from '@/views/User_Information';
import Today_Activities from '@/views/Today_Activities';

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
      path: '/activities',
      name: 'Activities',
      component: Activities,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/today_activities',
      name: 'Today Activities',
      component: Today_Activities,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/edit-activity',
      name: 'Edit Activity',
      component: EditActivity,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats,
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
    {
      path: '/user_information',
      name: 'User Information',
      component: User_Information,
      meta: {
        requiresAuth: true,
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
});

export default router;
