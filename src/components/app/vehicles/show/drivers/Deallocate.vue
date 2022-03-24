<template>
  <div class="pb-10">
    <v-card-title class="body-1 font-weight-bold px-0 pb-0 pt-0 mt-n2">
      {{ $t('vehicles.current_driver') }}
    </v-card-title>

    <v-list-item
      class="px-0"
      @click="dialog = true"
    >
      <v-list-item-avatar
        color="primary"
        size="40"
        class="body-1 white--text font-weight-bold"
      >
        {{ transporter.driver.name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="subtitle-1">
          {{ transporter.driver.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="primary--text body-2">
          {{ transporter.driver.email }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn icon>
          <v-icon color="error">
            mdi-trash-can
          </v-icon>
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
            icon
            small
            color="red"
            @click="dialog = false"
          >
            <v-icon small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider class="mb-5"></v-divider>

        <v-card-text>
          <p>
            {{
              $t('vehicles.deallocate_driver_message', {
                name:transporter.driver.name,
                registration_number: transporter.vehicle.registration_number
              })
            }}
          </p>
          <p>{{ $t('vehicles.deallocate_driver_warning') }}</p>
        </v-card-text>

        <v-card-actions class="pb-5 px-5">
          <v-btn
            block
            large
            color="error"
            class="caption font-weight-bold"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
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
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  props: [
    'transporter'
  ],

  data () {
    return {
      dialog: false,
      loading: false,
      transporterObj: new Transporter()
    }
  },

  methods: {
    deallocate () {
      if (!this.loading) {
        this.loading = true
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
