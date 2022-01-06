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
          @reload="setRoles()"
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
          <template v-slot:item.actions="{ item }">
            <v-btn 
              dark
              small
              color="secondary"
              class="ttn caption"
              @click="user = item"
            >
              Edit
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- <users-edit
        :user="user"
        @updated="updated()"
      ></users-edit> -->

      
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'roles-create': () => import('./Create.vue')
  },

  data () {
    return {
      headers: [
        { text: 'Display name', value: 'display_name' },
        { text: 'Description', value: 'description' },
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