<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('finance.payments_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <div v-if="!allowWithdraw" class="withdraw-text">
          {{ $t('finance.next_withdrawal_date') }} {{ friendlyDateFormat }}
        </div>
        <withdraw-modal v-else :accountBalance="{currency, balance}" />

      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
        </v-col>
        <v-col md="6" cols="12" class="top-account-balance">
          <div class="d-flex flex-column justify-end align-end mr-4">
            <div class="small-text">{{ $t('finance.account_balance') }}</div>

            <div v-if="initialised" class="d-flex currency-text" v-animate-css.click="'rubberBand'">
              <span class="mr-2 mt-2">{{ currency }}</span>
                {{ thousandSeparator(balance) }}
            </div>
            <div v-else class="d-flex currency-text" v-animate-css.click="'rubberBand'">
              0
            </div>

          </div>
        </v-col>
      </v-row>

      <v-card-text class="px-0 pt-0">
        <v-tabs
            id="statement-tabs"
            color="#324BA8"
            left
        >
          <v-tab>{{ $t('finance.tab_withdrawals') }}</v-tab>
<!--          <v-tab>{{ $t('finance.tab_savings') }}</v-tab>-->
<!--          <v-tab>{{ $t('finance.tab_repayments') }}</v-tab>-->
          <v-tab>{{ $t('finance.tab_uncleared_earnings') }}</v-tab>
          <v-tab>{{ $t('finance.tab_transactions') }}</v-tab>

          <div class="account-balance">
            <div class="d-flex flex-column justify-end align-end mr-4">
              <div class="small-text">{{ $t('finance.account_balance') }}</div>

              <div v-if="initialised" class="d-flex currency-text" v-animate-css.click="'rubberBand'">
                <span class="mr-2">{{ currency }}</span>
                {{ thousandSeparator(balance) }}
              </div>
              <div v-else class="d-flex currency-text" v-animate-css.click="'rubberBand'">
                0
              </div>

            </div>
          </div>

          <!--      withdrawals summary tab-->
          <v-tab-item>
            <v-container fluid>
              <withdrawal-table/>
            </v-container>
          </v-tab-item>
          <!--      savings tab-->
<!--          <v-tab-item>-->
<!--            <v-container fluid>-->
<!--              <withdrawal-table/>-->
<!--            </v-container>-->
<!--          </v-tab-item>-->
          <!--      repayments summary tab-->
<!--          <v-tab-item>-->
<!--            <v-container fluid>-->
<!--              <withdrawal-table/>-->
<!--            </v-container>-->
<!--          </v-tab-item>-->
          <!--      uncleared earnings summary tab-->
          <v-tab-item>
            <v-container fluid>
              <uncleared-earnings/>
            </v-container>
          </v-tab-item>
          <!--      transactions summary tab-->
          <v-tab-item>
            <v-container fluid>
              <transactions-table/>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import dateFormat from "@/mixins/dateFormat"
import {mapGetters, mapActions} from "vuex"

export default {
  mixins: [segmentMixin, formatNumbers, dateFormat],

  components: {
    'withdraw-modal': () => import('./Withdraw.vue'),
    'withdrawal-table': () => import('./withdrawals/Show.vue'),
    'transactions-table': () => import('./transactions/Show.vue'),
    'uncleared-earnings': () => import('./unclearedEarnings/Show.vue'),
    'savings-table': () => import('./savings/Show.vue')
  },

  data() {
    return {
      loading: true
    }
  },

  computed: {
    ...mapGetters({
      accountBalance: 'getAccountBalance'
    }),

    initialised () {
      let account = []
      if (this.accountBalance && this.accountBalance.primary_account) {
        account = Object.keys(this.accountBalance.primary_account)
      }
      return account.includes('current_balance')
    },

    allowWithdraw() {
      return this.accountBalance.withdrawal_day
    },

    currency() {
      if (!this.initialised) return 'KES'
      const { currency } = auth.retrieve('country')
      return this.accountBalance.primary_account.currency || currency
    },

    friendlyDateFormat() {
      return this.withdrawalDateFormat(this.accountBalance.next_withdrawal_day, this.$t('finance.from'))
    },

    balance() {
      if (!this.initialised) return 0
      return this.accountBalance.primary_account.current_balance
    }
  },

  methods: {
    ...mapActions([
      'setAccountBalance'
    ]),

    loadAccountBalance () {
      const { id } = auth.retrieve('partner')
      this.setAccountBalance({
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
    }
  },


  mounted () {
    this.loadAccountBalance()
    this.setSegmentEvent('Opened Payments feature')
  }
}
</script>

<style lang="scss">
#statement-tabs {
  .v-tabs-slider-wrapper {
    .v-tabs-slider {
      background-color: transparent;
    }
  }
  .v-tab.v-tab {
    color: #909399;
    height: 38px;
    &--active {
      color: inherit;
    }
  }
  .v-item-group {
    margin-bottom: 30px;
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
<style lang="scss" scoped>
.v-tabs {
  //margin-top: 20px;
}
.v-tab {
  text-transform: none !important;
  font-weight: 700;
  &--active {
    background: #F0F3F7;
    border-radius: 6px;
  }
}
.top-account-balance {
  display: none;

  @media (max-width: 768px) {
    display: inline-block;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    display: inline-block;
  }
}
.account-balance {
  position: absolute;
  right: 0;
  color: black;
  display: inline-block;

  @media (max-width: 768px) {
    display: none;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    display: none;
  }
}
.small-text {
  font-weight: 700;
  font-size: 10px;
}
.currency-text {
  font-weight: 700;
  font-size: 26px;
  span {
    font-size: 12px;
  }
}
.withdraw-text {
  font-weight: 700;
  font-size: 15px;
}
</style>
