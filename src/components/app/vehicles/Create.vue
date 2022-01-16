<template>
  <v-dialog
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="caption ttn"
      >
        Add Vehicle
      </v-btn>
    </template>

    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            Record vehicle details
          </h2>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            color="red"
            @click="dialogLaunch = false"
          >
            <v-icon small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-5">
          <v-alert
            text
            dense
            border="left"
            color="warning"
            class="body-2 mb-6"
          >
            <b>WARNING!!!</b> Once saved, vehicle details cannot be changed later
          </v-alert>

          <v-text-field
            dense
            outlined
            persistent-hint
            class="body-2"
            label="Vehicle registration number *"
            v-model="vehicleObj.registration_number"
            :hint="errors.get('registration_number')"
            :error="errors.has('registration_number')"
            @input="errors.clear('registration_number')"
          ></v-text-field>

          <v-select
            v-if="country.jurisdictions.length != 0"
            dense
            outlined
            multiple
            persistent-hint
            class="body-2"
            item-value="id"
            item-text="name"
            :items="country.jurisdictions"
            label="Select jurisdiction(s) *"
            v-model="vehicleObj.jurisdiction_ids"
            :hint="errors.get('jurisdiction_ids')"
            :error="errors.has('jurisdiction_ids')"
            @input="errors.clear('jurisdiction_ids')"
          >
            <template v-slot:append-outer>
              <v-menu
                dark
                left
                max-width="250"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    icon
                    small
                    class="mt-n1"
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>
                      mdi-information
                    </v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <v-card-text>
                    <p class="secondary--text body-2 font-weight-bold">
                      Operational Jurisdiction
                    </p>
                    <p class="white--text body-2 mb-1">
                      Please select all jurisdictions in which you will be operating in order to ensure quick verification
                    </p>
                  </v-card-text>
                </v-card>
              </v-menu>
            </template>
          </v-select>
          
          <v-select
            dense
            outlined
            persistent-hint
            item-value="id"
            item-text="name"
            :items="vendorTypes.data"
            label="Select a vendor type *"
            v-model="vehicleObj.vendor_type_id"
            :hint="errors.get('vendor_type_id')"
            :error="errors.has('vendor_type_id')"
            @input="errors.clear('vendor_type_id')"
          >
            <template 
              v-if="country.jurisdictions.length != 0"
              v-slot:append-outer
            >
              <v-menu
                dark
                left
                max-width="250"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    icon
                    small
                    class="mt-n1"
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>
                      mdi-information
                    </v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <v-card-text>
                    <p class="secondary--text body-2 font-weight-bold">
                      Jurisdiction Vendor Types
                    </p>
                    <p class="white--text body-2 mb-1">
                      Only vendor types configured under the selected operational jurisdictions above are shown
                    </p>
                  </v-card-text>
                </v-card>
              </v-menu>
            </template>
          </v-select>
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
            Save Details
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Vehicle from '@/libs/app/vehicles/Vehicle'

export default {
  components: {
    'vehicle-form': () => import('./partials/VehicleForm.vue'),
  },

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      vehicleObj: new Vehicle(),
    }
  },

  watch: {
    selectedJurisdictions () {
      this.loadVendorTypes()
    }
  },

  computed: {
    ...mapGetters({
      vendorTypes: 'getVendorTypes',
    }),

    auth: () => auth,

    country () {
      return this.auth.retrieve('country')
    },

    partner () {
      return this.auth.retrieve('partner')
    },

    errors () {
      return this.vehicleObj.form.errors
    },

    selectedJurisdictions () {
      return this.vehicleObj.jurisdiction_ids
    }
  },

  methods: {
    ...mapActions([
      'setVendorTypes'
    ]),

    loadVendorTypes () {
      const jurisdictionIds = this.selectedJurisdictions.join("|")
      this.setVendorTypes({
        routes: {
          partner: this.partner.id
        },
        params: {
          country_id: this.country.id,
          ...(jurisdictionIds && {
            jurisdiction_ids: jurisdictionIds
          })
        },
      })
    },

    submit () {
      if (!this.loading) {
        this.loading = true
        this.vehicleObj.store()
          .then(response => {
            flash(response)
            this.$emit('stored')
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },

  mounted () {
    if (this.country.jurisdictions.length == 0) {
      this.loadVendorTypes()
    }
  }
}
</script>