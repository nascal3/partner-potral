import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    component: () => import('@/views/layouts/Authentication.vue'),
    beforeEnter: (to, from, next) => {
      const { partner, user } = auth.decrypt()
      if (!user) {
        const authRoutes = ['register', 'generate', 'verify']
        if (authRoutes.includes(to.name)) {
          next()
        } else {
          next('/auth/generate')
        }
      } else {
        if (!partner) {
          if (to.name == 'accounts') {
            next()
          } else {
            next('/auth/accounts')
          }
        } else {
          next('/')
        }
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
          if (!identification) next('/auth/generate')
          else next()
        }
      },
      {
        path: 'accounts',
        name: 'accounts',
        component: () => import('@/components/auth/Accounts.vue'),
      },
    ]
  },

  {
    path: '',
    component: () => import('@/views/layouts/Application.vue'),
    beforeEnter: (to, from, next) => {
      const { partner, user } = auth.decrypt()
      if (!user) {
        next('/auth/generate')
      } else {
        if (!partner) {
          next('/auth/accounts')
        } else {
          next()
        }
      }
    },
    children: [
      {
        path: '/',
        name: 'dashboard',
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
