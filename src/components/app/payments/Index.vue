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

        <withdraw-modal v-if="allowWithdraw" :accountBalance="{currency, balance}" />
        <div v-else class="withdraw-text" v-animate-css.click="'rubberBand'">
          {{ $t('finance.next_withdrawal_date') }} {{ friendlyDateFormat }}
        </div>

      </v-card-title>

      <v-divider></v-divider>

        <v-alert
            v-if="pendingContracts"
            text
            prominent
            type="warning"
            class="mt-5"
            border="left"
        >
          <v-row align="center">
            <v-col class="grow">
              {{ $t('finance.unsigned_contract_warning') }}
            </v-col>
            <v-col class="shrink">
              <v-btn color="warning" @click="signContract">
                {{ $t('finance.sign_contract') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
        </v-col>
        <v-col md="6" cols="12" class="top-account-balance">
          <div class="d-flex flex-column justify-end align-end mr-4">
            <div class="small-text">{{ $t('finance.account_balance') }}</div>

            <div v-if="initialised" class="d-flex currency-text" v-animate-css.click="'rubberBand'">
              <span class="mr-2 mt-2">{{ currency }}</span> {{ thousandSeparator(balance) }}
            </div>
            <div v-else class="d-flex currency-text" v-animate-css.click="'rubberBand'">
              <v-progress-circular
                  :width="3"
                  :size="20"
                  indeterminate
                  color="primary"
              ></v-progress-circular>
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
          <v-tab>{{ $t('finance.tab_transactions') }}</v-tab>
          <v-tab>{{ $t('finance.tab_withdrawals') }}</v-tab>
<!--          <v-tab>{{ $t('finance.tab_savings') }}</v-tab>-->
<!--          <v-tab>{{ $t('finance.tab_repayments') }}</v-tab>-->
          <v-tab>{{ $t('finance.tab_uncleared_earnings') }}</v-tab>

          <div class="account-balance">
            <div class="d-flex flex-column justify-end align-end mr-4">
              <div class="small-text">{{ $t('finance.account_balance') }}</div>

              <div v-if="initialised" class="d-flex currency-text" v-animate-css.click="'rubberBand'">
                <span class="mr-2">{{ currency }}</span> {{ thousandSeparator(balance) }}
              </div>
              <div v-else class="d-flex currency-text" v-animate-css.click="'rubberBand'">
                <v-progress-circular
                    :width="3"
                    :size="20"
                    indeterminate
                    color="primary"
                ></v-progress-circular>
              </div>

            </div>
          </div>

          <!--      #####transactions summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <transactions-table/>
            </v-container>
          </v-tab-item>

          <!--      #####withdrawals summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <withdrawal-table/>
            </v-container>
          </v-tab-item>

          <!--      #####savings tab####-->
<!--          <v-tab-item>-->
<!--            <v-container fluid>-->
<!--              <withdrawal-table/>-->
<!--            </v-container>-->
<!--          </v-tab-item>-->

          <!--      #####repayments summary tab#####-->
<!--          <v-tab-item>-->
<!--            <v-container fluid>-->
<!--              <withdrawal-table/>-->
<!--            </v-container>-->
<!--          </v-tab-item>-->

          <!--      #####uncleared earnings summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <uncleared-earnings/>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import compareAsc from 'date-fns/compareAsc'
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import dateFormat from "@/mixins/dateFormat"
import {mapGetters, mapActions} from "vuex"
// import mockResponse from "../../../../tests/e2e/fixtures/accountBalance.json"

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
      accountBalance: 'getAccountBalance',
      partnerContracts: 'getPartnerContractDocuments',
    }),

    contractsDataInitialised () {
      return this.partnerContracts && this.partnerContracts.data && Object.keys(this.partnerContracts.data).length > 0
    },

    pendingContracts () {
      if (!this.contractsDataInitialised) return true
      return this.partnerContracts.data.has_pending
    },

    initialised () {
      let account = []
      if (this.accountBalance && this.accountBalance.primary_account) {
        account = Object.keys(this.accountBalance.primary_account)
      }
      return account.includes('current_balance')
    },

    isWithdrawalDate() {
      if (!this.initialised) return false
      // Compare the two dates and return 1 if the first date is after the second,
      // -1 if the first date is before the second or 0 if dates are equal.
      const currentTimeZone =  Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { next_withdrawal_day, time_zone } = this.accountBalance

      //Correctly format dates to be compared
      const withdrawalZonedTime = zonedTimeToUtc(next_withdrawal_day, time_zone)
      const currentZonedTime = utcToZonedTime(new Date(), currentTimeZone)

      // Compare the two dates
      const result = compareAsc(currentZonedTime, withdrawalZonedTime)
      return result === 0 || result === 1
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
      if (!this.initialised) return '...'
      const { next_withdrawal_day, time_zone } = this.accountBalance
      const withdrawalTime = `${next_withdrawal_day}, ${time_zone}`
      //Correctly format date
      const withdrawalZonedTime = zonedTimeToUtc(withdrawalTime, time_zone)

      return this.withdrawalDateFormat(withdrawalZonedTime, this.$t('finance.from'))
    },

    balance() {
      if (!this.initialised) return 0
      return this.accountBalance.primary_account.current_balance
    }
  },

  methods: {
    ...mapActions([
      'setAccountBalance',
      'setPartnerContractDocuments'
    ]),

    signContract() {
      this.setSegmentEvent('Redirected to sign partner contract')
      this.$router.push({ name: 'contract' })
    },

    loadContractDocument () {
      const { id } = auth.retrieve('partner')
      this.setPartnerContractDocuments({
        routes: {
          partner: id
        }
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },

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
    this.setSegmentEvent('Select Payments')
    this.loadAccountBalance()
    this.loadContractDocument()
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
