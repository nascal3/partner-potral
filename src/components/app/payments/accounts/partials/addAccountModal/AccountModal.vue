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
          @click="setSegmentEvent('Add financial account')"
      >
        {{ $t('finance.add_account') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <h2 class="subtitle-1">
          {{ $t('finance.add_account') }}
        </h2>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          color="red"
          @click="closeDialog"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>
      <!--      #### Modal with account types that can be selected ###-->
      <select-account v-if="!selectedPaymentMethod" @selectedPaymentMethod="paymentMethod"/>

      <!--      #### Modal to add account details needed ###-->
      <account-details
          v-if="selectedPaymentMethod && !proceed"
          :payment-method="selectedPaymentMethod"
          @navigateBack="navigateBack"
          @proceed="proceedToOTP"
      />

      <!--      #### Modal to insert OTP needed to save details ###-->
      <get-otp v-if="proceed" @proceed="proceedToOTP" @closeDialog="closeDialog" />
    </v-card>
  </v-dialog>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],
  components: {
    'account-details': () => import('./AccountDetails.vue'),
    'select-account': () => import('./SelectAccount.vue'),
    'get-otp': () => import('./GetOTP.vue'),
  },

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      selectedAccount: null,
      selectedPaymentMethod: null,
      proceed: false
    }
  },

  watch: {

  },

  methods: {
    navigateBack () {
      this.selectedPaymentMethod = null
    },

    paymentMethod(method) {
      this.selectedPaymentMethod = method
    },

    proceedToOTP (proceedStatus) {
      this.proceed = proceedStatus
    },

    closeDialog() {
      this.selectedPaymentMethod = null
      this.proceed = false
      this.dialogLaunch = false
    }
  }
}
</script>

<style lang="scss" scoped>
.method-text {
  & div:first-child {
    color: black;
  }
  & div {
    color: #83868C;
  }
}
.method-icon {
  border: 1px solid #D9D9D9;
  max-height: 50px;
  margin: auto;
  .v-icon {
    color: #314BAB;
  }
}
.v-radio {
  border: 1px solid #E2E7ED;
  padding: 16px;
  margin-bottom: 16px !important;
}
.v-card__actions {
  button {

  }
}
.active {
  border: 2px solid #314BAB;
}
</style>
