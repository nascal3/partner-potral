<template>
  <section>
    <app-loading v-if="loading"/>
    <div v-else class="d-flex flex-row">
      <div class="mr-4">
        <div><span>{{ $t('finance.payment_method') }}: </span>{{ details.pay_mode }}</div>
        <div><span>{{ $t('finance.funds_sent_to') }}:</span>{{ details.sent_to }}</div>
        <div><span>{{ $t('finance.txn_amount') }}:</span>{{details.currency}} {{ thousandSeparator(details.amount) }}</div>
      </div>
      <div>
        <div><span>{{ $t('finance.txn_step') }}: </span>{{ details.step.toLowerCase() }}</div>
        <div><span>{{ $t('finance.txn_status') }}:</span>
          <v-chip :color="setColor(details.state)" :text-color="setChipTextColor(details.state)" light small>
            {{ details.state.toLowerCase() }}
          </v-chip>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import formatNumbers from "@/mixins/formatNumbers"
import Payment from '@/libs/app/payments/Payment'

export default {
  mixins: [ formatNumbers],

  props: {
    paymentId: {
      type: String,
      default: () => ''
    },
  },

  data() {
    return {
      loading: true,
      details: {},
      paymentObj: new Payment()
    }
  },

  methods: {
    setColor(status) {
      const colorMap = {
        'failed': '#FBDECF',
        'processing': '#FDDB97',
        'sent': '#CCEFFF'
      }
      return colorMap[status.toLowerCase()] || '#DEFAD2'
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'failed': 'error',
        'processing': 'warning',
        'sent': 'info'
      }
      return colorMap[orderStatus.toLowerCase()] || 'success'
    },

    fetchWithdrawalDetails() {
      this.paymentObj.show(this.paymentId)
          .then(response => {
            this.datails = response
          })
          .catch(error => {
            flash({
              message: error.data.message,
              color: '#e74c3c',
            })
            throw error
          })
          .finally(() => {
            this.loading = false
          })
    }
  },

  mounted () {
    this.fetchWithdrawalDetails()
  }

}
</script>

<style lang="scss" scoped>
section {
  div:last-child{
    color: #606266;
    font-weight: 700;
  }

  .v-chip {
    .v-chip__content {
      padding-top: 2px;
      display: inline-block !important;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>
