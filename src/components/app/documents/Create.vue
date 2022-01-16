<template>
  <v-dialog
    v-if="initialised"
    v-model="dialogLaunch"
    width="500"
    persistent
  >
    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            Provide documents for verification
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

        <v-card-text class="pt-4">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(document, index) in documents.data"
              :key="`document-${index}`"
            >
              <v-expansion-panel-header class="body-1 font-weight-bold">
                <div>
                  {{ document.label }}
                </div>
                <template v-slot:actions>
                  <v-icon class="mr-2">
                    mdi-{{ isProvided(document) ? 'text-box-check' : 'text-box-remove' }}
                  </v-icon>

                  <v-icon color="error">
                    mdi-alert-circle
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <!-- <v-card-actions class="px-4 pb-5">
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
            {{ role ? 'Update' : 'Save' }} Role Details
          </v-btn>
        </v-card-actions> -->
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: [
    'vehicle'
  ],

  data () {
    return {
      dialogLaunch: false,
    }
  },

  watch: {
    vehicle (value) {
      this.dialogLaunch = Boolean(value)
      if (value) {
        this.loadDocuments()
        this.loadVehicleDocuments()
      }
    },

    vehicleDocuments ({ data }) {
      console.log(data)
    }
  },

  computed: {
    ...mapGetters({
      documents: 'getDocuments',
      vehicleDocuments: 'getVehicleDocuments'
    }),
    
    partner () {
      return auth.retrieve('partner')
    },

    initialised () {
      return this.documents.data
    }
  },

  methods: {
    ...mapActions([
      'setDocuments',
      'setVehicleDocuments'
    ]),

    loadDocuments () {
      this.setDocuments({
        params: {
          country_id: this.partner.country_id,
          vendor_type_ids: this.vehicle.vendor_type_id,
        }
      })
    },

    loadVehicleDocuments () {
      this.setVehicleDocuments({
        routes: {
          partner: this.partner.id
        },
        params: {
          vehicle_id: this.vehicle.id,
        }
      })
    },

    isProvided (document) {
      console.log(document)
    }
  },

  mounted () {
    
  }
}
</script>