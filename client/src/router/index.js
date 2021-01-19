import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import Admin from '../views/Admin.vue';
import Events from '../views/Events.vue';
import Event from '../views/Event.vue';
import Documents from '../views/Documents.vue';
import store from '../store/index.js';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Profile,
    meta: {
      requiresAuth: true,
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
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/event/:id',
    name: 'Event',
    component: Event,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/document/:id',
    name: 'Documents',
    component: Documents,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  store.state.alert.alerts.length = 0;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.auth.status.loggedIn) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
  // if (to.name !== ('Login' || 'Register') && !store.state.auth.status.loggedIn)
  //   next({ name: 'Login' });
  // else next();
});
export default router;
