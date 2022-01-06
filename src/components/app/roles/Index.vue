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
              small
              color="primary"
              class="ttn caption"
              @click="user = item"
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

      <!-- <users-edit
        :user="user"
        @updated="updated()"
      ></users-edit> -->

      
    </v-card>

    <!-- <users-create
      @reload="loadTable()"
    ></users-create> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  // components: {
  //   'users-create': () => import('./Create.vue')
  // },

  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Roles', value: 'roles' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      users: 'getUsers'
    })
  },
  
  methods: {
    ...mapActions([
      'setUsers'
    ])
  },

  
  mounted () {
    this.setUsers()
  }
}
</script>