import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../modules/Home.vue'
import Register from '../modules/auth/Register'
import Login from '../modules/auth/Login'
import Board from '../modules/board/BoardView'
import Dashboard from '../modules/Dashboard'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board',
    name: 'Board',
    component: Board,
    meta: {
      auth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      auth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, form, next) => {
  const requiresAuth = to.matched.some(x => x.meta.auth)

  if(requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser) {
      next();
    } else {
      alert("you don't have access!");
      next("/");
    }
  } else {
    next();
  }
})

export default router
