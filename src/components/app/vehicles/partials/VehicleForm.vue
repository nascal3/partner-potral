<template>
  <v-dialog
    v-if="initialised"
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    
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
  }
}
</script>