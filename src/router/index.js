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
        if (!auth.retrieve('partner')) {
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
      if (!auth.retrieve('user')) {
        next('/auth/generate')
      } else {
        if (!auth.retrieve('abilities')) {
          next('/auth/accounts')
        } else {
          next()
        }
      }
    },
    children: [
      // {
      //   path: '/',
      //   name: 'dashboard',
      //   component: () => import('@/components/app/dashboard/Index.vue'),
      // },

      {
        path: '/',
        name: 'orders.index',
        component: () => import('@/components/app/orders/Index.vue'),
      },

      {
        path: 'dashboard',
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
        name: 'roles.show',
        component: () => import('@/components/app/roles/Show.vue'),
        children: [
          {
            path: 'permissions',
            name: 'roles.permissions',
            component: () => import('@/components/app/roles/show/Permissions.vue')
          }
        ]
      },

      {
        path: 'vehicles',
        name: 'vehicles.index',
        component: () => import('@/components/app/vehicles/Index.vue'),
      },

      {
        path: 'orders',
        name: 'orders.index',
        component: () => import('@/components/app/orders/Index.vue'),
      },

      {
        path: 'vehicles/:vehicleId',
        name: 'vehicles.show',
        component: () => import('@/components/app/vehicles/Show.vue'),
        children: [
          {
            path: 'documents',
            name: 'vehicle-documents.index',
            component: () => import('@/components/app/vehicle_documents/Index.vue')
          },

          {
            path: 'drivers',
            name: 'vehicle-drivers.index',
            component: () => import('@/components/app/vehicles/show/Drivers.vue')
          }
        ]
      },

      {
        path: 'driver',
        name: 'driver-profile',
        component: () => import('@/components/app/driver/Index.vue'),
        children: [
          {
            path: 'home',
            name: 'driver-home',
            component: () => import('@/components/app/driver/Home.vue')
          },
        ]
      },

      {
        path: 'profile',
        name: 'doe-profile',
        component: () => import('@/components/app/profile/Index.vue'),
        children: [
          {
            path: 'personal',
            name: 'doe-personal',
            component: () => import('@/components/app/profile/Personal.vue')
          },

          {
            path: 'security',
            name: 'doe-security',
            component: () => import('@/components/app/profile/Security.vue')
          },
        ]
      },

      {
        path: 'finances/statement',
        name: 'statement.index',
        component: () => import('@/components/app/finances/statement/index.vue')
      },

      {
        path: 'finances/bank',
        name: 'bank.index',
        component: () => import('@/components/app/finances/bank/index.vue')
      },

      {
        path: 'finances/loans_savings',
        name: 'loans_savings.index',
        component: () => import('@/components/app/finances/loans_savings/index.vue')
      }
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
