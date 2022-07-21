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
      <template v-slot:item.status="{ item }">
        <v-chip :color="setColor(item.status)" :text-color="setChipTextColor(item.status)" light small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.date="{ item }">
        {{ notificationsDateFormat(item.date) }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{ thousandSeparator(item.amount) }}
      </template>
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
import dateFormat from "@/mixins/dateFormat"
import formatNumbers from "@/mixins/formatNumbers"
import mockResponse from '@/libs/app/payments/mockResponce.json'

import Order from '@/libs/app/orders/Order'
import OrderDetails from '@/libs/app/order_details/OrderDetails'
import User from '@/libs/app/users/User'

export default {
  mixins: [dateFormat, formatNumbers],

  data () {
    return {
      loading: true,
      withdrawals: [],
      page: 1,
      headers: [
        { text: this.$t('finance.txn'), value: 'transaction_no' },
        { text: this.$t('finance.txn_date'), value: 'date' },
        { text: this.$t('finance.txn_amount'), value: 'amount' },
        { text: this.$t('finance.txn_payment_method'), value: 'method' },
        { text: this.$t('finance.txn_status'), value: 'status' },
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
    setColor(status) {
      const colorMap = {
        'failed': '#FBDECF',
        'processing': '#FDDB97',
        'sent': '#CCEFFF'
      }
      return colorMap[status] || '#DEFAD2'
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'failed': 'error',
        'processing': 'warning',
        'sent': 'info'
      }
      return colorMap[orderStatus] || 'success'
    },

    pageChanged (page) {
      this.page = page
      this.loadWithdrawals()
    },

    loadWithdrawals () {
      this.withdrawals = mockResponse
      this.loading =  false
    },
  },

  mounted () {
    this.loadWithdrawals()
  }

}
</script>
