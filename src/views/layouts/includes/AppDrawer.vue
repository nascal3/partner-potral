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
          v-text="name"
          :class="name !== 'ANALYTICS' ? 'mt-5' : ''"
        ></v-subheader>

        <template 
          v-for="(item) in group"
        >
          <v-list-item
            v-if="!item.children && permitted(item)"
            :key="item.name"
            :to="item.to"
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

        // 'APPLICATION': [
        //   // { name: 'Vehicles', icon: 'truck', to: '/vehicles', permission: 'vehicles.index' },
        // ],
        
        'ACCESS CONTROL': [
          { name: 'Roles', icon: 'lock', to: '/roles', permission: 'roles.index' },
          { name: 'Users', icon: 'account-group', to: '/users', permission: 'users.index' },
        ],

        // 'CONFIGURATIONS': [
        // //   { name: 'Product Groups', icon: 'apps', to: '/product-groups', permission: 'product-groups.index' },
        //   { name: 'Settings', icon: 'cogs', to: 'settings', },
        // ],
      }
    }
  },

  methods: {
    input (input) {
      if (input == false) {
        this.$emit('closed')
      }
    },
    
    permitted (link) {
      return auth.can(link.permission)
    }
  },
}
</script>

<style lang="scss">
.app-toolbar {
  margin-top: 48px;
}
</style>