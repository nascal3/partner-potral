<template>
  <div>
    <v-card-title
        class="body-1 font-weight-bold px-0 py-0 black--text"
    >
      {{ $t('vehicles.available_drivers') }}
    </v-card-title>
    <v-list>
      <template v-for="(user, index) in availableDrivers">
        <v-list-item
            :key="`driver-${index}`"
            class="px-0"
            @click="allocate(user)"
        >
          <v-list-item-avatar
              class="body-1 white--text font-weight-bold"
              color="primary"
              size="40"
          >
            {{ user.name.charAt(0) }}
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="deep-orange--text body-2">
              {{ user.email || 'n/a' }}
            </v-list-item-subtitle>
          </v-list-item-content>


          <v-list-item-action>
            <v-btn
                class="white--text ml-6 text-capitalize"
                color="indigo"
                small
            > {{ $t('vehicles.assign_driver') }}
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider
            v-if="index < availableDrivers.length - 1"
            :key="`divider-${index}`"
        ></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  mixins: [segmentMixin],

  props: [
    'users',
    'vehicle',
    'transporter',
    'availableDrivers'
  ],

  data() {
    return {
      transporterObj: new Transporter(),
    }
  },

  watch: {
    errors: {
      deep: true,
      handler: (errorBag) => {
        ['vehicle_id', 'driver_id'].forEach(field => {
          if (errorBag.has(field)) {
            flash({
              color: 'error',
              message: errorBag.get(field)
            })
          }
        })
      },
    },
  },

  computed: {
    errors() {
      return this.transporterObj.form.errors

    },
  },

  methods: {
    allocate(user) {
      this.setSegmentEvent('Allocate driver a vehicle')
      this.transporterObj.driver_id = user.id
      this.transporterObj.vehicle_id = this.vehicle.id
      this.transporterObj.store()
          .then(response => {
            flash({
              color: 'success',
              message: response.message
            })
            this.$emit('allocated')
          })
    },

  },
}
</script>
