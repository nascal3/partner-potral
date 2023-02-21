<template>
  <div class="pb-10">
    <v-card-title class="body-1 font-weight-bold black--text px-0 pb-0 pt-0 mt-n2">
      {{ $t('vehicles.current_driver') }}
    </v-card-title>

    <v-list-item
        class="px-0"
        @click="dialog = true"
    >
      <v-list-item-avatar
          class="body-1 white--text font-weight-bold"
          color="primary"
          size="40"
      >
        {{ transporter.driver_details.name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="subtitle-1">
          {{ transporter.driver_details.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="primary--text body-2">
          {{ transporter.driver_details.email }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn class="white--text ml-6 text-capitalize" color="error" small>
          Remove Driver
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-dialog
        v-model="dialog"
        width="500"
    >
      <v-card>
        <v-card-title>
          <h2 class="subtitle-1">
            {{ $t('vehicles.deallocate_driver') }}
          </h2>
          <v-spacer></v-spacer>
          <v-btn
              color="red"
              icon
              small
              @click="dialog = false"
          >
            <v-icon color="red" small>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider class="mb-5"></v-divider>

        <v-card-text>
          <p>
            {{
              $t('vehicles.deallocate_driver_message', {
                name: transporter.driver_details.name,
                registration_number: transporter.vehicle.registration_number
              })
            }}
          </p>
          <p>{{ $t('vehicles.deallocate_driver_warning') }}</p>
        </v-card-text>

        <v-card-actions class="pb-5 px-5">
          <v-btn
              :dark="!loading"
              :disabled="loading"
              :loading="loading"
              block
              class="caption font-weight-bold"
              color="error"
              large
              @click="deallocate()"
          >
            {{ $t('vehicles.deallocate_driver_button') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  mixins: [segmentMixin],
  props: [
    'transporter'
  ],

  data() {
    return {
      dialog: false,
      loading: false,
      transporterObj: new Transporter()
    }
  },

  methods: {
    deallocate() {
      if (!this.loading) {
        this.loading = true
        this.setSegmentEvent('Deallocate driver a vehicle')
        this.transporterObj.destroy(this.transporter.id)
            .then(response => {
              flash(response)
              this.$emit('deallocated')
              this.dialog = false
            })
            .finally(() => {
              this.loading = false
            })
      }
    }
  }
}
</script>
