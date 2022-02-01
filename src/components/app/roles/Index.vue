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
        <app-loading
          v-if="processing"
        ></app-loading>

        <v-data-table
          v-if="!processing"
          fixed-header
          disable-sort
          class="title"
          hide-default-footer
          disable-pagination
          :headers="headers"
          :items="roles.data"
          style="overflow-x: scroll; width: 100%"
        >
          <template v-slot:item.permissions="{ item }">
            <v-btn
              dark
              text
              small
              color="deep-orange"
              class="ttn body-2"
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
      processing: true,
      crumbs: [
        { text: 'Roles', disabled: true },
      ],
      headers: [
        { text: 'Display name', value: 'display_name' },
        { text: 'Access control', value: 'permissions' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      roles: 'getRoles'
    }),

    auth: () => auth,
  },

  methods: {
    ...mapActions([
      'setRoles'
    ]),

    loadRoles () {
      const { id } = auth.retrieve('partner')
      this.setRoles({
        routes: {
          partner: id
        }
      }).then(() => {
        this.processing = false
      })
    }
  },

  mounted () {
    this.loadRoles()
  }
}
</script>
