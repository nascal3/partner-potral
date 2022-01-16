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
          v-if="auth.can('vehicles.store')"
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
          <template v-slot:item.vendor_type="{ item }">
            {{ item.vendor_type.name }}
          </template>
          <template v-slot:item.is_valid="{ item }">
            {{ item.is_valid ? 'Yes' : 'No' }}
          </template>
          <template v-slot:item.documents="{ item }">
            <v-btn 
              dark
              small
              color="secondary"
              class="ttn caption"
              @click="forDocument = item"
            >
              Manage documents
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
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <documents-create
        :vehicle="forDocument"
      ></documents-create>

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
    'documents-create': () => import('@/components/app/documents/Create.vue')
  },

  data () {
    return {
      vehicle: null,
      forDocument: null,
      headers: [
        { text: 'Registration number', value: 'registration_number' },
        { text: 'Vendor type', value: 'vendor_type' },
        { text: 'Verified', value: 'is_valid' },
        { text: 'Operational documents', value: 'documents' },
        // { text: 'Jurisdictions', value: 'documents' },
        { text: 'Assigned driver', value: 'driver' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      vehicles: 'getVehicles'
    }),

    auth: () => auth
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