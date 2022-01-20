<template>
  <v-card v-if="initialised" flat class="ma-0 pa-0">
    <v-card-title>
      <div>
        <h1 class="title font-weight-bold">
          {{ vehicle.registration_number }}
          <p class="body-2">
            {{ vehicle.vendor_type.name }}
          </p>
        </h1>
        <v-spacer></v-spacer>

      </div>
    </v-card-title>
    <v-card-text>
      <v-list
        class="mx-auto"
        loading
        outlined
        
      >
        <v-list-item @click="allocateDriver()">
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">
              Allocate Driver
            </v-list-item-title>
            <!-- <v-list-item-subtitle class="deep-orange--text body-2">
              {{ partner.legal_entity_type }}
            </v-list-item-subtitle> -->
          </v-list-item-content>
          <!-- <v-list-item-action>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-list-item-action> -->
        </v-list-item>
      </v-list>
    </v-card-text>

    <transporters-create
      :vehicle="vehicle"
      :allocate="allocate"
      @allocated="allocated"
      @close="allocate = false"
    ></transporters-create>
  </v-card>
</template>

<script>
import Vehicle from '@/libs/app/vehicles/Vehicle'

export default {
  components: {
    'transporters-create': () => import('@/components/app/transporters/Create.vue'),
  },

  data () {
    return {
      vehicle: null,
      allocate: false,
      vehicleObj: new Vehicle()
    }
  },

  computed: {
    initialised () {
      return this.vehicle
    }
  },

  methods: {
    allocateDriver () {
      this.allocate = true
    },

    allocated () {

    }
  },

  mounted () {
    const vehicleId = this.$route.params.vehicleId
    this.vehicleObj.show(vehicleId)
      .then(({ data }) => {
        this.vehicle = data
      })
  }
}
</script>