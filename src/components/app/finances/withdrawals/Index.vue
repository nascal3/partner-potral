<template>
  <div>
    <v-data-table
        id="statement-table"
        fixed-header
        disable-sort
        class="title"
        hide-default-footer
        disable-pagination
        :no-data-text="$t('finance.txn_no_statement_found')"
        :no-results-text="$t('finance.txn_no_results_found')"
        :headers="headers"
        :items="withdrawals"
        item-key="txn_no"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
    </v-data-table>

    <app-pagination
        v-if="withdrawals.length"
        id="statement-pagination"
        :meta="meta"
        @pageChanged="pageChanged"
    />
  </div>
</template>

<script>
import { format } from 'date-fns'
import Order from '@/libs/app/orders/Order'
import OrderDetails from '@/libs/app/order_details/OrderDetails'
import User from '@/libs/app/users/User'

export default {
  data () {
    return {
      loading: true,
      withdrawals: [],
      page: 1,
      headers: [
        { text: this.$t('finance.txn_date'), value: 'pickup_location' },
        { text: this.$t('finance.txn_amount'), value: 'destinations' },
        { text: this.$t('finance.txn_payment_type'), value: 'updated_at' },
        { text: this.$t('finance.txn_status'), value: 'distance' },
      ],
      meta: {
        current_page: 1,
        first_page: 1,
        first_page_url: "/?page=1",
        last_page: 1,
        last_page_url: "/?page=1",
        next_page_url: null,
        per_page: 30,
        previous_page_url: null,
        total: 0
      }
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return
      return format(new Date(date), 'iii, do LLL')
    },

    pageChanged (page) {
      this.page = page
      this.loadWithdrawals()
    },

    loadWithdrawals () {
    },
  },

  mounted () {
    this.loadWithdrawals()
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
  margin-top: 20px;
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
