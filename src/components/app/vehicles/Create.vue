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
        {{ $t('vehicles.add_vehicle') }}
      </v-btn>
    </template>

    <v-card v-if="initialised">
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ $t('vehicles.subtitle') }}
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
          <v-text-field
            dense
            outlined
            persistent-hint
            class="body-2"
            :label="$t('vehicles.registration_number')"
            v-model="vehicleObj.registration_number"
            :hint="errors.get('registration_number')"
            :error="errors.has('registration_number')"
            @input="errors.clear('registration_number')"
          ></v-text-field>

          <v-select
            dense
            outlined
            class="body-2"
            persistent-hint
            item-value="id"
            item-text="display_name"
            :items="vendorTypes.data"
            :label="$t('vehicles.select_vendor_type')"
            v-model="vehicleObj.vendor_type_id"
            :hint="errors.get('vendor_type_id')"
            :error="errors.has('vendor_type_id')"
            @input="errors.clear('vendor_type_id')"
          ></v-select>
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
            {{ $t('vehicles.save_details') }}
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
  data () {
    return {
      loading: false,
      dialogLaunch: false,
      vehicleObj: new Vehicle(),
    }
  },

  watch: {
    country ({ data }) {
      this.loadVendorTypes()
    }
  },

  computed: {
    ...mapGetters({
      country: 'getCountry',
      vendorTypes: 'getVendorTypes',
    }),

    partner () {
      return auth.retrieve('partner')
    },

    initialised () {
      return this.vendorTypes.data && this.country
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
      'setCountry',
      'setVendorTypes'
    ]),

    loadVendorTypes () {
      this.setVendorTypes({
        routes: {
          partner: this.partner.id
        },
        params: {
          country_id: this.partner.country_id,
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
            this.dialogLaunch = false
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },

  mounted () {
    this.setCountry({
      routes: {
        id: this.partner.country_id
      },
    })
  }
}
</script>
