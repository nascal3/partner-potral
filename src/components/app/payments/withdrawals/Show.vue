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
        :items="withdrawalRecords"
        item-key="ref_no"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="setColor(item.status)" :text-color="setChipTextColor(item.status)" light small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ notificationsDateFormat(item.created_at) }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{item.currency}} {{ thousandSeparator(item.amount) }}
      </template>
    </v-data-table>

    <app-pagination
        v-if="initialised"
        id="statement-pagination"
        :meta="meta"
        @pageChanged="pageChanged"
    />
  </div>
</template>

<script>
import dateFormat from "@/mixins/dateFormat"
import formatNumbers from "@/mixins/formatNumbers"
// import mockResponse from '@/libs/app/payments/mockWithdrawalResponce.json'
import {mapGetters, mapActions} from "vuex"

export default {
  mixins: [dateFormat, formatNumbers],

  data () {
    return {
      loading: true,
      withdrawals: [],
      page: 1,
      headers: [
        { text: this.$t('finance.txn_date'), value: 'created_at' },
        { text: this.$t('finance.txn_amount'), value: 'amount' },
        { text: this.$t('finance.txn_payment_method'), value: 'payment_method' },
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

  computed: {
    ...mapGetters({
      withdrawals: 'getWithdrawals'
    }),

    initialised () {
      return this.withdrawals.owner_withdrawals && this.withdrawals.owner_withdrawals.length
    },

    withdrawalRecords() {
      if (!this.initialised) return []
      return this.withdrawals.owner_withdrawals
    }
  },

  methods: {
    ...mapActions([
      'setWithdrawals'
    ]),

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
      const { id } = auth.retrieve('partner')
      this.setWithdrawals({
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
  },

  mounted () {
    this.loadWithdrawals()
  }

}
</script>
