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
          @click="setSegmentEvent('Add bank account')"
      >
        {{ $t('finance.add_bank') }}
      </v-btn>
    </template>

    <v-card v-if="initialised">
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ $t('finance.add_bank') }}
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

        <bank-details
            v-if="!proceed"
            :input-errors="errors"
            @amount="amount"
            @proceed="proceedToWithdraw"
        />

        <get-otp
            v-if="proceed"
            :input-errors="errors"
            :amount="withdrawAmount"
            @paymentMethod="paymentMethod"
            @proceed="proceedToWithdraw"
        />

      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Vehicle from '@/libs/app/vehicles/Vehicle'
import segmentMixin from "@/mixins/segmentEvents";
import formatNumbers from "@/mixins/formatNumbers";

export default {
  mixins: [segmentMixin, formatNumbers],
  components: {
    'bank-details': () => import('./BankDetails.vue'),
    'get-otp': () => import('./GetOTP.vue'),
  },

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      proceed: false,
      withdrawAmount: null,
      withdrawalMethod: null,
      vehicleObj: new Vehicle(),
    }
  },

  watch: {

  },

  computed: {
    initialised () {
      return true
    },

    errors () {
      return this.vehicleObj.form.errors
    }
  },

  methods: {
    amount (value) {
      this.withdrawAmount = value
    },

    paymentMethod(method) {
      this.withdrawalMethod = method
    },

    loadPartnerBalance () {
      // this.setVendorTypes({
      //   routes: {
      //     partner: this.partner.id
      //   },
      //   params: {
      //     country_id: this.partner.country_id,
      //   },
      // })
    },

    proceedToWithdraw (proceedStatus) {
      this.proceed = proceedStatus
    },

    submit () {
      this.setSegmentEvent('Withdraw amount -- Submit')
      console.log(this.withdrawAmount, this.withdrawalMethod)
      // if (!this.loading) {
      //   this.loading = true
      //   this.vehicleObj.store()
      //       .then(response => {
      //         flash(response)
      //         this.$emit('stored')
      //         this.dialogLaunch = false
      //       })
      //       .finally(() => {
      //         this.loading = false
      //       })
      // }
    },
  },

  mounted () {

  }
}
</script>

<style scoped>
</style>
