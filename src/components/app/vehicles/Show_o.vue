<template>
  <div v-if="initialised"
  
  style="background-color: red">
    <v-card
      outlined
      tile
      class="mx-0"
    >
      <v-card-text class="pb-0">
        <v-card
          color="transparent"
          class="mb-5"
          flat
        >
          <div class="d-flex flex-no-wrap">
            <div class="flex-grow-1 pl-2">
              <v-row>
                <v-col cols="8">
                  <h1 class="title mt-n1">Vehicle Management</h1>
                  <h2 class="subtitle-2 deep-orange--text">
                    <v-icon 
                      small
                      class="mt-n1"
                      color="deep-orange"
                    >
                      <!-- mdi-{{ farmer.organisation_type == 'Individual' ? 'account' : 'account-group' }} -->
                    </v-icon> 
                    {{ vehicle.registration_number }}
                  </h2>
                </v-col>
                <v-col cols="4" class="text-right">
                  <router-link
                    class="body-1 deep-orange--text"
                    :to="`/farmers`"
                  >
                    <v-icon color="deep-orange">mdi-arrow-left</v-icon> Back to farmers
                  </router-link>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card>
        <v-tabs
          slider-color="#3e8ef7"
          :slider-size="0"
          color="#3e8ef7"
        >
          <v-tab
            v-for="link in links"
            class="body-2"
            :key="link.name"
            style="text-transform: none"
          >
            <v-menu 
              bottom
              offset-y 
              open-on-hover
            >
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ link.name }}
                  <v-icon>mdi-menu-down</v-icon>
                </span>
              </template>
              <v-list width="200" dense>
                <v-list-item
                  v-for="(child, childIndex) in link.children"
                  :key="`child-${childIndex}`"
                  :to="`/farmers/${vehicle.id}/${child.to}`"
                >
                  <v-list-item-title class="caption">
                    {{ child.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tab>
        </v-tabs>
      </v-card-text>
    </v-card>

    <v-container fluid>
      <!-- <router-view
        :farmer="farmer"
      ></router-view> -->
    </v-container>
  </div>
</template>

<script>
import Vehicle from '@/libs/app/vehicles/Vehicle'

export default {
  data () {
    return {
      vehicle: null,
      vehicleObj: new Vehicle(),
      links: [
        { 
          name: 'Documents',
          children: [
            { name: 'Primary Information', to: 'primary-information' },
            { name: 'Legal Documents', to: 'documents' },
            // { name: 'Relationships', to: 'relationships' },
          ]
        },

        { 
          name: 'Drivers',
          children: [
            { name: 'Farms', to: 'farms' },
            { name: 'Value chains', to: 'value-chains' },
            { name: 'Farm Outputs', to: 'outputs' },
          ]
        },

        { 
          name: 'External services',
          children: [
            { name: 'Orders', to: 'orders' },
            // { name: 'Technical Services', to: 'services' },
          ]
        },

        { 
          name: 'Finance & banking',
          children: [
            // { name: 'Input Financing', to: 'financing' },
            { name: 'Incomes', to: 'incomes' },
            { name: 'Expenses', to: 'expenses' },
            { name: 'Bank accounts', to: 'bank-accounts' },
          ]
        },
      ], 
    }
  },

  computed: {
    initialised () {
      return this.vehicle;
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