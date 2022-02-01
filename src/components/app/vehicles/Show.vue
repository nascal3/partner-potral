<template>
  <div>
    <v-card v-if="initialised" flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('vehicles.vehicle_management') }}
          </h1>
          <app-crumbs
            :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            md="3"
            class="hidden-sm-and-down"
          >
            {{ $t('vehicles.sum') }}
          </v-col>

          <v-col
            sm="12"
            md="9"
          >
            <v-container fluid>
              <router-view
                :vehicle="vehicle"
              ></router-view>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-bottom-navigation
      absolute
      class="body-2"
      v-model="value"
    >
      <v-btn value="recent">
        <span>{{ $t('vehicles.documents') }}</span>

        <v-icon>mdi-card-account-details</v-icon>
      </v-btn>

      <v-btn value="favorites">
        <span>{{ $t('vehicles.drivers') }}</span>

        <v-icon>mdi-car</v-icon>
      </v-btn>
<!--
      <v-btn value="nearby">
        <span>Orders</span>

        <v-icon>mdi-package-variant</v-icon>
      </v-btn>

      <v-btn value="nearby">
        <span>Mileage</span>

        <v-icon>mdi-speedometer</v-icon>
      </v-btn> -->
    </v-bottom-navigation>
  </div>
</template>

<script>
import Vehicle from '@/libs/app/vehicles/Vehicle'

export default {
  components: {
    // 'transporters-create': () => import('@/components/app/transporters/Create.vue'),
  },

  data () {
    return {
      value: true,
      vehicle: null,
      vehicleObj: new Vehicle(),
      crumbs: [
        { text: 'Vehicles', to: 'vehicles' },
      ],
    }
  },

  computed: {
    initialised () {
      return this.vehicle
    }
  },

  methods: {

  },

  mounted () {
    const vehicleId = this.$route.params.vehicleId
    this.vehicleObj.show(vehicleId)
      .then(({ data }) => {
        this.crumbs.push({
          text: data.registration_number,
          disabled: true,
        })
        this.vehicle = data
      })
  }
}
</script>
