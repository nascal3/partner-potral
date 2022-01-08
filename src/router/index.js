import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    component: () => import('@/views/layouts/Authentication.vue'),
    beforeEnter: (to, from, next) => {
      if (!auth.retrieve('user')) {
        const authRoutes = ['register', 'generate', 'verify']
        if (authRoutes.includes(to.name)) {
          next()
        } else {
          next('/auth/generate')
        }
      } else {
        next('/')
      }
    },
    children: [
      {
        path: 'register',
        name: 'register',
        component: () => import('@/components/auth/Register.vue'),
      },
      {
        path: 'generate',
        name: 'generate',
        component: () => import('@/components/auth/Generate.vue'),
      },
      {
        path: 'verify',
        name: 'verify',
        component: () => import('@/components/auth/Verify.vue'),
        beforeEnter: (to, from, next) => {
          const identification = localStorage.getItem('sendy:identification')
          if (!identification) {
            next('/auth/generate')
          }
          else {
            next()
          }
        }
      },
    ]
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
        next('/auth/generate')
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
        path: 'users',
        name: 'users.index',
        component: () => import('@/components/app/users/Index.vue'),
      },

      {
        path: 'roles',
        name: 'roles.index',
        component: () => import('@/components/app/roles/Index.vue'),
      },

      {
        path: 'roles/:roleId',
        name: 'roles-show',
        component: () => import('@/components/app/roles/Show.vue'),
        children: [
          {
            path: 'permissions',
            name: 'roles-permissions',
            component: () => import('@/components/app/roles/show/Permissions.vue')
          }
        ]
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
