<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('vehicles.vehicles') }}
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
            {{ item.vendor_type.display_name }}
          </template>
          <template v-slot:item.is_valid="{ item }">
            {{ item.is_valid ? $t('vehicles.yes') : $t('vehicles.no') }}
          </template>
          <template v-slot:item.driver="{ item }">
            <v-btn
              dark
              small
              color="secondary"
              class="ttn caption"
              @click="forAllocation = item"
            >
              {{ $t('vehicles.allocate') }}
            </v-btn>
          </template>
          <template v-slot:item.documents="{ item }">
            <v-btn
              dark
              small
              color="secondary"
              class="ttn caption"
              @click="forDocument = item"
            >
              {{ $t('vehicles.documents') }}
            </v-btn>
          </template>
          <template v-slot:item.manage="{ item }">
            <v-btn
              dark
              text
              small
              color="deep-orange"
              class="ttn body-2"
              :to="`vehicles/${item.id}/documents`"
            >
              {{ $t('vehicles.manage_vehicle') }}
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'vehicles-create': () => import('./Create.vue'),
  },

  data () {
    return {
      vehicle: null,
      forDocument: null,
      forAllocation: null,
      headers: [
        { text: 'Registration number', value: 'registration_number' },
        { text: 'Vendor type', value: 'vendor_type' },
        { text: 'Verified', value: 'is_valid' },
        { text: 'Vehicle management', value: 'manage' },
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
    },

    stored () {
      this.forDocument = null
      this.loadVehicles()
    },

    allocated () {

    }
  },

  mounted () {
    this.loadVehicles()
  }
}
</script>
