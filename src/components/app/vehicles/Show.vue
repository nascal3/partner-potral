<template>
  <div v-if="initialised">
    <v-card 
      flat 
      class="ma-0 pa-0"
    >
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ title }}
          </h1>
          <app-crumbs
            :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-alert
              v-if="!vehicle.is_valid"
              text
              dense
              type="error"
              border="left"
              class="body-2 mb-0"
            >
              The vehicle is unverified. Ensure you provide all the required documents
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <!-- <v-col 
            md="3"
            class="hidden-sm-and-down"
          >
            
          </v-col> -->

          <v-col
            sm="12"
            md="4"
          >
            <v-container fluid>
              <router-view
                :vehicle="vehicle"
                @meta="meta"
              ></router-view>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-bottom-navigation 
      absolute
      class="body-2 d-md-none"
    >
      <v-btn
        v-for="(link, index) in navigation"
        :key="`link-${index}`"
        :to="`/vehicles/${vehicle.id}/${link.to}`"
        active-class="active"
      >
        <span>{{ link.name }}</span>
        <v-icon>mdi-{{ link.icon }}</v-icon>
      </v-btn>
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
      title: '',
      vehicle: null,
      vehicleObj: new Vehicle(),
      crumbs: [
        { text: 'Vehicles', to: 'vehicles' },
      ],
      navigation: [
        { name: 'Documents', icon: 'card-account-details', to: 'documents' },
        { name: 'Drivers', icon: 'car', to: 'drivers' },
      ]
    }
  },

  computed: {
    initialised () {
      return this.vehicle
    }
  },

  methods: {
    meta (info) {
      this.title = info.title
      this.crumbs.push(info.crumbs)
    }
  },

  mounted () {
    const vehicleId = this.$route.params.vehicleId
    this.vehicleObj.show(vehicleId).then(({ data }) => {
      this.vehicle = data
    })
  }
}
</script>

<style lang="scss">
  a.active {
    color: #4136A9 !important
  }
</style>