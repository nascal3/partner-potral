<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('role.roles') }}
          </h1>
          <app-crumbs
            :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
        <roles-create
          v-if="auth.can('roles.index')"
          @stored="loadRoles"
        ></roles-create>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-0">
        <v-data-table
          fixed-header
          disable-sort
          class="title"
          hide-default-footer
          disable-pagination
          :headers="headers"
          :items="filteredRoles"
          :loading="loading"
          :loading-text="$t('core.system_loading')"
          style="overflow-x: scroll; width: 100%"
        >
          <template v-slot:item.permissions="{ item }">
            <v-btn
              dark
              text
              small
              color="deep-orange"
              class="ttn body-2"
              :class="{disabled: systemRole(item.name)}"
              :disabled="systemRole(item.name)"
              :to="`roles/${item.id}/permissions`"
            >
              {{ $t('role.manage_permissions') }}
            </v-btn>

          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              dark
              small
              color="secondary"
              class="ttn caption mr-2"
              @click="role = item"
            >
              {{ $t('role.edit') }}
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <roles-edit
        :role="role"
        @close="role = null"
        @updated="loadRoles()"
      ></roles-edit>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'roles-create': () => import('./Create.vue'),
    'roles-edit': () => import('./Edit.vue')
  },

  data () {
    return {
      role: null,
      loading: true,
      crumbs: [
        { text: this.$t('role.crumb_roles'), disabled: true },
      ],
      headers: [
        { text: this.$t('role.table_display_name'), value: 'display_name' },
        { text: this.$t('role.table_access_control'), value: 'permissions' },
        { text: this.$t('role.actions'), value: 'actions' },
      ],
      systemRoles: [
        'driver',
        'admin'
      ]
    }
  },

  computed: {
    ...mapGetters({
      roles: 'getRoles'
    }),

    filteredRoles() {
      if (this.roles.data) {
        return  this.roles.data.filter(role => {
          return !role.name.includes('driver') && !role.name.includes('admin')
        })
      }
    },

    auth: () => auth,
  },

  methods: {
    ...mapActions([
      'setRoles'
    ]),

    systemRole(role) {
      const roleName = role.split('::').at(-1)
      return this.systemRoles.includes(roleName)
    },

    loadRoles () {
      const { id } = auth.retrieve('partner')
      this.setRoles({
        routes: {
          partner: id
        }
      }).then(() => {
        this.loading = false
      }).catch((error) => {
        this.loading = false
        flash({
          message: error.response.data.message,
          color: '#e74c3c'
        })
      })
    }
  },

  mounted () {
    this.loadRoles()
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  background-color: #ebecf0;
  color: white !important;
  cursor: not-allowed;
}
</style>
