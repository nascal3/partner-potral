<template>
  <v-navigation-drawer
      app
      fixed
      width="250"
      color="#fff"
      :value="showDrawer"
      @input="input"
  >
    <template v-slot:prepend>
      <v-toolbar-title>
        <router-link to="/">
          <v-img
              max-width="120"
              class="ml-3 mt-2"
              src="https://assets.website-files.com/5be92ce6e4a547dcc61b976c/60253f92874eabf1a8ecf88f_Logo_SendyMain_Colored_Normal_SVG.svg"
          ></v-img>
        </router-link>
      </v-toolbar-title>
    </template>

    <v-list dense class="pl-2">
      <template
          v-for="(group, name) in sidebar"
      >
        <v-subheader
            class="caption font-weight-bold"
            :key="name"
            v-text="translateText(name)"
            :class="name !== 'ANALYTICS' ? 'mt-5' : ''"
        ></v-subheader>

        <template
            v-for="(item) in group"
        >
          <v-list-item
              v-if="!item.children && permitted(item)"
              :key="item.name"
              :to="item.to"
              @click="showCashAdvance(item.to)"
              active-class="active-route"
          >
            <v-list-item-icon>
              <v-icon small>
                {{ `mdi-${item.icon}` }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-title class="body-2">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>

          <v-menu
              offset-x
              max-width="200"
              :key="item.name"
              v-if="item.children"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                  v-bind="attrs"
                  v-on="on"
                  active-class="active-route"
                  class="pr-0"
              >
                <v-list-item-icon>
                  <v-icon small>
                    {{ `mdi-${item.icon}` }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-title class="body-2">
                  {{ item.name }}
                </v-list-item-title>

                <v-list-item-action
                >
                  <v-icon small>
                    mdi-chevron-right
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list dense>
              <v-list-item
                  v-for="(child, index) in item.children"
                  :to="child.to"
                  :key="index"
              >
                <v-list-item-title class="body-2">
                  {{ child.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </template>
    </v-list>

    <!--    TODO: remove after the cash advancement feature is implemented-->
    <v-dialog
        v-model="dialogLaunch"
        width="400"
    >
      <v-card width="400">
        <v-card-text class="d-flex justify-center flex-column pt-3">
          <v-icon>mdi-cash</v-icon>
          <div class="title mb-3">{{ $t('navigation.cash_advancements') }}</div>
          <div class="message">
            <p>{{ name }},</p>
            <p>{{ $t('navigation.cash_advancements_message') }}</p>
            {{ $t('navigation.cash_advancements_instruction') }}
          </div>
        </v-card-text>

        <v-card-actions class="d-flex justify-center pb-6">
          <v-btn
              large
              color="primary"
              class="caption font-weight-bold px-6"
              @click="navigateAway"
          >
            {{ $t('navigation.cash_advancements_btn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: [
    'showDrawer'
  ],

  data () {
    return {
      sidebar: {
        // 'ANALYTICS': [
        //   { name: 'Dashboard', icon: 'poll', to: '/' },
        //   {
        //     name: 'Reports',
        //     icon: 'file-chart',
        //     children: [
        //       { name: 'User Accounts', icon: '', to: '/reports/users' },
        //       { name: 'Access Roles', icon: '', to: '/reports/roles' },
        //     ]
        //   },
        // ],

        'APPLICATION': [
          { name: this.$t('navigation.orders'), icon: 'package-variant', to: '/orders', permission: 'orders.index' },
          { name: this.$t('finance.payments'), icon: 'cash-multiple', to: '/payments', permission: 'payments.index' },
          { name: this.$t('finance.accounts'), icon: 'bank', to: '/accounts', permission: 'payments.index' },
          { name: this.$t('navigation.cash_advancements'), icon: 'currency-usd', to: '/payments/#', permission: 'payments.index' },
          { name: this.$t('navigation.vehicles'), icon: 'truck', to: '/vehicles', permission: 'vehicles.index' },
          {
            name: this.$t('navigation.legal_documents'),
            icon: 'file-document-multiple-outline',
            children: [
              { name: this.$t('navigation.legal_documents'), icon: 'file-document-multiple-outline', to: '/legal-documents', permission: 'legal-documents.index' },
              { name: this.$t('navigation.partner_contract'), icon: 'mdi-text', to: '/partner-contract', permission: 'legal-documents.index' },
            ]

          },
          // { name: this.$t('navigation.notifications'), icon: 'bell-outline', to: '/notifications', permission: 'notifications.index' }
        ],

        'ACCESS CONTROL': [
          { name: this.$t('navigation.roles'), icon: 'lock', to: '/roles', permission: 'roles.index' },
          { name: this.$t('navigation.users'), icon: 'account-group', to: '/users', permission: 'users.index' },
        ],

        // 'CONFIGURATIONS': [
        // //   { name: 'Product Groups', icon: 'apps', to: '/product-groups', permission: 'product-groups.index' },
        //   { name: 'Settings', icon: 'cogs', to: 'settings', },
        // ],
      },
      dialogLaunch: false
    }
  },

  computed: {
    name() {
      const { name } = auth.retrieve("user");
      return name
    },
  },

  methods: {
    input (input) {
      if (!input) {
        this.$emit('closed')
      }
    },

    translateText(text) {
      if (text === 'APPLICATION') return this.$t('navigation.nav_application')
      if (text === 'ACCESS CONTROL') return this.$t('navigation.nav_access_control')
      if (text === 'ANALYTICS') return this.$t('navigation.nav_analytics')
      if (text === 'CONFIGURATIONS') return this.$t('navigation.nav_configurations')
    },

    permitted (link) {
      return auth.can(link.permission)
    },

    navigateAway() {
      window.open("https://docs.google.com/forms/d/e/1FAIpQLSe9iGZacrC5RbBb71_kyW1mPNRBC90c7WE6nJh0wjeBVd4jsg/viewform", "_blank")
    },

    showCashAdvance (itemName) {
      if (itemName === '/payments/#') this.dialogLaunch = true
    }
  },
}
</script>

<style lang="scss">
.app-toolbar {
  margin-top: 48px;
}
</style>
<style lang="scss" scoped>
.v-dialog {
  overflow-x: hidden !important;
}
 .v-card {
   &__text {
    .title {
      font-size: 20px !important;
      font-weight: 700;
      text-align: center;
    }
    .v-icon {
      color: #324BAB;
      font-size: 80px;
    }
   }
   &__actions {
     button {
       text-transform: none;
     }
   }
 }
</style>
