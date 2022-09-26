<template>
  <section>
    <app-loading v-if="loading"/>
    <div v-else class="d-flex flex-row">
      <div class="mr-4">
        <div>{{ $t('finance.payment_method') }}: <span class="small-text">{{ details.pay_mode }}</span></div>
        <div>{{ $t('finance.funds_sent_to') }}: <span class="small-text">{{ details.sent_to }}</span></div>
        <div>{{ $t('finance.txn_amount') }}: <span class="small-text">{{details.currency}} {{ thousandSeparator(details.amount) }}</span></div>
      </div>
      <div>
        <div>{{ $t('finance.txn_step') }}: <span class="small-text">{{ details.step.toLowerCase() }}</span></div>
        <div>
          {{ $t('finance.txn_status') }}:
          <v-chip :color="setColor(details.state)" :text-color="setChipTextColor(details.state)" light small>
            <span class="small-text">{{ details.state.toLowerCase() }}</span>
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

  // computed: {
  //   details() {
  //     return this.data;
  //   }
  // },

  methods: {
    setColor(status) {
      const colorMap = {
        'fail': '#FBDECF',
        'pending': '#FDDB97',
        'new': '#CCEFFF'
      }
      return colorMap[status.toLowerCase()] || '#DEFAD2'
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'fail': 'error',
        'pending': 'warning',
        'new': 'info'
      }
      return colorMap[orderStatus.toLowerCase()] || 'success'
    },

    fetchWithdrawalDetails() {
      this.paymentObj.show(this.paymentId)
          .then(response => {
            this.details = response
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

  .small-text {
    font-weight: normal;
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
