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

        <withdraw-modal />

      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
        </v-col>
        <v-col md="6" cols="12">
          <div class="d-flex flex-column justify-end align-end mr-4">
            <div class="small-text">{{ $t('finance.account_balance') }}</div>
            <div class="d-flex currency-text">
              <span class="mr-2 mt-2">KES</span>
              {{ thousandSeparator(accountBalance) }}
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
          <v-tab>{{ $t('finance.tab_savings') }}</v-tab>
          <v-tab>{{ $t('finance.tab_repayments') }}</v-tab>
          <v-tab>{{ $t('finance.tab_uncleared_earnings') }}</v-tab>
          <v-tab>{{ $t('finance.tab_transactions') }}</v-tab>
          <!--      withdrawals summary tab-->
          <v-tab-item>
            <v-container fluid>
              <withdrawal-table/>
            </v-container>
          </v-tab-item>
          <!--      savings tab-->
          <v-tab-item>
            <v-container fluid>
              <withdrawal-table/>
            </v-container>
          </v-tab-item>
          <!--      repayments summary tab-->
          <v-tab-item>
            <v-container fluid>
              <withdrawal-table/>
            </v-container>
          </v-tab-item>
          <!--      uncleared earnings summary tab-->
          <v-tab-item>
            <v-container fluid>
              <withdrawal-table/>
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
import formatNumbers from "@/mixins/formatNumbers";

export default {
  mixins: [segmentMixin, formatNumbers],

  components: {
    'withdraw-modal': () => import('./Withdraw.vue'),
    'withdrawal-table': () => import('./withdrawals/Index.vue'),
    'transactions-table': () => import('./transactions/Index.vue'),
    'savings-table': () => import('./savings/Index.vue')
  },

  data() {
    return {
      accountBalance: 35450
    }
  },
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
</style>
