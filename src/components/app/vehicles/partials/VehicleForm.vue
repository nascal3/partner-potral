<template>
  <v-dialog
    v-if="initialised"
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ vehicle ? `Update` :`Record` }} vehicle details
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
          <v-select
            v-if="country.jurisdictions.length != 0"
            dense
            outlined
            multiple
            persistent-hint
            item-value="id"
            item-text="name"
            :items="country.jurisdictions"
            label="Select jurisdiction(s) of operation *"
            v-model="vehicleObj.jurisdiction_ids"
            :hint="errors.get('jurisdiction_ids')"
            :error="errors.has('jurisdiction_ids')"
            @input="errors.clear('jurisdiction_ids')"
          ></v-select>

          <v-text-field
            dense
            outlined
            persistent-hint
            label="Vehicle registration number *"
            v-model="vehicleObj.registration_number"
            :hint="errors.get('registration_number')"
            :error="errors.has('registration_number')"
            @input="errors.clear('registration_number')"
          ></v-text-field>

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
          ></v-select>
        </v-card-text>
        <v-card-actions class="px-4 pb-5">
          <v-btn
            block
            large
            type="submit"
            color="primary"
            class="caption"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
          >
            {{ vehicle ? 'Update' : 'Save' }} Details
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
  props: [
    'dialogLaunch', 'vehicle'
  ],

  data () {
    return {
      loading: false,
      country: null,
      vehicleObj: new Vehicle(),
    }
  },

  watch: {
    countries ({ data }) {
      this.country = data[0]
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries',
      vendorTypes: 'getVendorTypes'
    }),

    errors () {
      return this.vehicleObj.form.errors
    },

    initialised () {
      return this.country
    }
  },

  methods: {
    ...mapActions([
      'setCountries',
      'setVendorTypes'
    ]),

    submit () {
      if (!this.loading) {
        this.loading = true
        !this.vehicle ? this.store() : this.update()
      }
    },

    store () {
      this.vehicleObj.store()
        .then(response => {
          flash(response)
          this.$emit('stored')
        })
        .finally(() => {
          this.loading = false
        })
    },
  },

  mounted () {
    const partner = auth.retrieve('partner')

    this.setVendorTypes({
      routes: {
        partner: partner.id
      },
      params: {
        country_id: partner.country_id
      },
    })

    this.setCountries({
      params: {
        id: partner.country_id,
        relationships: 'jurisdictions'
      }
    })
  }
}
</script>