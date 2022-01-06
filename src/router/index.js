import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/components/auth/Login.vue'),
    beforeEnter: (to, from, next) => {
      if (!auth.retrieve('user')) {
        if (to.name == 'login') next()
        else next('/auth/login')
      } else {
        next('/')
      }
    }
  },

  {
    path: '/auth/accounts',
    name: 'accounts',
    component: () => import('@/components/auth/Accounts.vue'),
    // beforeEnter: (to, from, next) => {
      // if (!auth.retrieve('user')) {
      //   if (to.name == 'login') next()
      //   else next('/auth/login')
      // } else {
      //   next('/')
      // }
    // }
  },

  {
    path: '',
    component: () => import('@/views/layouts/Application.vue'),
    beforeEnter: (to, from, next) => {
      // if (!auth.retrieve('permissions')) {
      //   auth.logout()
      // }
      if (!auth.retrieve('user')) {
        next('/auth/login')
      }
      else {
        next()
      }
    },
    children: [
      {
        path: '/',
        name: 'app-dashboard',
        component: () => import('@/components/app/dashboard/Index.vue'),
      },

      {
        path: '/users',
        name: 'users.index',
        component: () => import('@/components/app/users/Index.vue'),
      },

      {
        path: '/roles',
        name: 'roles.index',
        component: () => import('@/components/app/roles/Index.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
