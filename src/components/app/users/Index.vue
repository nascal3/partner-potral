<template>
  <v-card flat class="ma-0 pa-0">
    <v-card-title>
      <div>
        <h1 class="title font-weight-bold">
          {{ $t('users.users') }}
        </h1>
      </div>
      <v-spacer></v-spacer>
      <users-create
        v-if="auth.can('users.store')"
        @stored="loadUsers()"
      ></users-create>
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
        :items="users.data"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
        style="overflow-x: scroll; width: 100%"
      >
        <template v-slot:item.phone="{ item }">
          {{ item.phone || 'n/a' }}
        </template>
        <template v-slot:item.roles="{ item }">
          {{ item.roles.map(({display_name}) => display_name).join(", ") }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            small
            color="secondary"
            class="ttn caption"
            @click="user = item"
            v-if="auth.can('users.update')"
          >
            Edit
          </v-btn>
        </template>
      </v-data-table>

      <!-- <app-pagination
        :meta="users.meta"
        @pageChanged="pageChanged"
      ></app-pagination> -->
    </v-card-text>

    <users-edit
      v-if="auth.can('users.update')"
      :user="user"
      @close="user = null"
      @updated="updated()"
    ></users-edit>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'users-create': () => import('./Create.vue'),
    'users-edit': () => import('./Edit.vue')
  },

  data () {
    return {
      user: null,
      loading: true,
      headers: [
        { text: this.$t('users.table_name'), value: 'name' },
        { text: this.$t('users.table_email'), value: 'email' },
        { text: this.$t('users.table_phone'), value: 'phone' },
        { text: this.$t('users.table_role'), value: 'roles' },
        // { text: 'Actions', value: 'actions' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      users: 'getUsers'
    }),

    auth: () => auth
  },

  methods: {
    ...mapActions([
      'setUsers'
    ]),

    loadUsers () {
      this.setUsers({
        routes: {
          partner: (auth.retrieve('partner')).id
        }
      }).then(() => {
        this.loading = false
      })
    }
  },


  mounted () {
    this.loadUsers()
  }
}
</script>
