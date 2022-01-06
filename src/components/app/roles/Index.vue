<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            Roles
          </h1>
        </div>
        <v-spacer></v-spacer>
        <roles-create
          @reload="setRoles"
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
          :items="users.data"
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
              Manage permissions
            </v-btn>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn 
              dark
              small
              color="secondary"
              class="ttn caption"
              @click="role = item"
            >
              Edit
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <roles-edit
        :role="role"
        @updated="setRoles"
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
      headers: [
        { text: 'Display name', value: 'display_name' },
        { text: 'Description', value: 'description' },
        { text: 'Permissions', value: 'permissions' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      users: 'getRoles'
    })
  },
  
  methods: {
    ...mapActions([
      'setRoles'
    ]),
  },
  
  mounted () {
    this.setRoles()
  }
}
</script>