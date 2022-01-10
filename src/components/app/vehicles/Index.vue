<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            Vehicles
          </h1>
        </div>
        <v-spacer></v-spacer>
        <vehicles-create
          @stored="loadVehicles"
        ></vehicles-create>
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
          :items="vehicles.data"
          style="overflow-x: scroll; width: 100%"
        >
          <!-- <template v-slot:item.permissions="{ item }">
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
              class="ttn caption mr-2"
              @click="role = item"
            >
              Edit
            </v-btn>

            <v-btn 
              dark
              small
              color="#e74c3c"
              class="ttn caption"
              @click="role = item"
            >
              Deactivate
            </v-btn>
          </template> -->
        </v-data-table>
      </v-card-text>

      <!-- <roles-edit
        :role="role"
        @close="role = null"
        @updated="loadRoles()"
      ></roles-edit> -->
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'vehicles-create': () => import('./Create.vue'),
    // 'roles-edit': () => import('./Edit.vue')
  },

  data () {
    return {
      vehicle: null,
      headers: [
        { text: 'Display name', value: 'display_name' },
        { text: 'Description', value: 'description' },
        { text: 'Access control', value: 'permissions' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      vehicles: 'getVehicles'
    })
  },
  
  methods: {
    ...mapActions([
      'setVehicles'
    ]),

    loadVehicles () {
      this.setVehicles({
        routes: {
          partner: (auth.retrieve('partner')).id
        }
      })
    }
  },
  
  mounted () {
    this.loadVehicles()
  }
}
</script>