<template>
  <div>
    <v-card-title
      class="body-1 font-weight-bold px-0 py-0"
    >
      {{ $t('vehicles.available_drivers') }}
    </v-card-title>
    <v-list>
      <template v-for="(user, index) in users.data">
        <v-list-item
          class="px-0"
          :key="`driver-${index}`"
          @click="allocate(user)"
        >
          <v-list-item-avatar
            color="primary"
            size="40"
            class="body-1 white--text font-weight-bold"
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
            <v-btn icon>
              <v-icon
                color="success"
              >
                mdi-steering
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider
          :key="`divider-${index}`"
          v-if="index < users.data.length - 1"
        ></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  props: [
    'users',
    'vehicle'
  ],

  data () {
    return {
      transporterObj: new Transporter()
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
    errors () {
      return this.transporterObj.form.errors
    }
  },

  methods: {
    allocate (user) {
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
    }
  }
}
</script>
