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
          class="caption ttn font-weight-bold"
          @click="setSegmentEvent('Select Withdrawal')"
      >
        {{ $t('finance.withdraw_btn') }}
      </v-btn>
    </template>

    <v-card v-if="initialised">
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ $t('finance.withdraw_cash') }}
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

        <withdraw-amount
            v-if="!proceed"
            :input-errors="errors"
            :account-balance="accountBalance.balance"
            :payment-methods-init="initialised"
            @amount="amount"
            @proceed="proceedToWithdraw"
        />

        <payment-method
            v-if="proceed"
            :input-errors="errors"
            :amount="withdrawAmount"
            :currency="accountBalance.currency"
            :payment-methods="paymentMethods.data"
            :loading="loading"
            @selectedPaymentMethod="selectedPaymentMethod"
            @proceed="proceedToWithdraw"
        />

      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Payment from '@/libs/app/payments/Payment'
import segmentMixin from "@/mixins/segmentEvents";
import formatNumbers from "@/mixins/formatNumbers";

export default {
  mixins: [segmentMixin, formatNumbers],

  props: {
    accountBalance: {
      type: Object,
      default: () => {}
    },
  },

  components: {
    'withdraw-amount': () => import('./partials/WithdrawAmount.vue'),
    'payment-method': () => import('./partials/PaymentMethod.vue'),
  },

  data() {
    return {
      loading: false,
      dialogLaunch: false,
      proceed: false,
      withdrawAmount: null,
      withdrawalMethod: null,
      paymentObj: new Payment()
    }
  },

  computed: {
    ...mapGetters({
      paymentMethods: 'getPaymentMethods'
    }),

    initialised () {
      return this.paymentMethods.data && Object.keys(this.paymentMethods.data).length > 0
    },

    errors () {
      return this.paymentObj.form.errors
    }
  },

  methods: {
    ...mapActions([
      'setPaymentMethods'
    ]),

    amount (value) {
      this.withdrawAmount = value
    },

    selectedPaymentMethod(method) {
      this.withdrawalMethod = method
    },

    proceedToWithdraw (proceedStatus) {
      this.proceed = proceedStatus
    },

    loadPaymentMethods () {
      const { id } = auth.retrieve('partner')
      this.setPaymentMethods({
        routes: {
          partner: id
        }
      }).then(() => {
        this.loading = false
      }).catch((error) => {
        this.loading = false
        flash({
          message: error.response.data.message,
          color: '#e74c3c'
        })
      })
    },

    submit () {
      this.setSegmentEvent(`Confirm Withdrawal - ${this.withdrawAmount}`)
      if (!this.loading) {
        this.loading = true
        const { payment_method, operator_name, operator_id, user_account_no } = this.withdrawalMethod
        this.paymentObj.operator_name = operator_name
        this.paymentObj.payment_method = payment_method
        this.paymentObj.operator_id = operator_id
        this.paymentObj.user_account_no = user_account_no
        this.paymentObj.amount = this.formatAmountToNumber(this.withdrawAmount)
        const params = {
          operator_name,
          payment_method,
          user_account_no,
          operator_id,
          amount: this.withdrawAmount
        }

        this.paymentObj.store()
            .then(response => {
              this.setSegmentEvent(`Withdrawal Success - ${this.withdrawAmount}`, params)
              flash({...response, color: '#38c172'})
              this.dialogLaunch = false
            })
            .catch(error => {
              this.setSegmentEvent(`Withdrawal Failed - ${this.withdrawAmount}`, {...params, message: error.data.message})
              this.loading = false
              flash({
                message: error.data.message,
                color: '#e74c3c',
              })
              throw error
            })
            .finally(() => {
              this.$emit('reloadAccountBalance', true)
              this.loading = false
            })
      }
    },
  },

  mounted () {
    this.loadPaymentMethods()
  }
}
</script>

<style scoped>
</style>
