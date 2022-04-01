<template>
  <v-dialog
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ $t('transporters.title') }}
          </h2>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            color="red"
            @click="$emit('close')"
          >
            <v-icon small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-5">
         
        </v-card-text>
        <v-card-actions class="px-4 pb-5">
          <v-btn
            block
            large
            type="submit"
            color="primary"
            class="caption font-weight-bold"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
          >
            {{ $t('transporters.allocate_vehicle_to_driver') }}
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  props: [
    'driver',
    'vehicle',
  ],

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      transporterObj: new Transporter()
    }
  },

  watch: {
    driver (value) {
      this.dialogLaunch = Boolean(value)
    }
  },

  computed: {
    errors () {
      return this.transporterObj.form.errors
    }
  },

  methods: {
    submit () {
      if (!this.loading) {
        this.transporterObj.vehicle_id = this.vehicle.id

        this.loading = true
        this.transporterObj.store()
          .then(response => {
            flash(response)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  },
}
</script>
