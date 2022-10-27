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
        :items="transactions"
        item-key="transaction_id"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.completed_on="{ item }">
        {{ notificationsDateFormat(item.completed_on) }}
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
import segmentMixin from "@/mixins/segmentEvents"
import dateFormat from "@/mixins/dateFormat"
import formatNumbers from "@/mixins/formatNumbers"
import {mapGetters, mapActions} from "vuex"

export default {
  mixins: [segmentMixin, dateFormat, formatNumbers],

  data () {
    return {
      loading: true,
      page: 1,
      headers: [
        { text: this.$t('finance.txn_id'), value: 'transaction_id' },
        { text: this.$t('finance.txn_date'), value: 'completed_on' },
        { text: this.$t('finance.txn_amount'), value: 'amount' },
        { text: this.$t('finance.txn_type'), value: 'transaction_type' },
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
      transactionsData: 'getPartnerTransactions'
    }),

    initialised () {
      return this.transactionsData.transactions && this.transactionsData.transactions.length
    },

    transactions () {
      if (!this.initialised) return
      return this.transactionsData.transactions
    }
  },

  methods: {
    ...mapActions([
      'setPartnerTransactions'
    ]),

    setColor(status) {
      if (status === 'failed') return 'error'
      if (status === 'processing') return 'warning'
      if (status === 'sent') return 'info'
      return 'success'
    },

    pageChanged (page) {
      this.page = page
      this.loadTransactions()
    },

    loadTransactions () {
      const { id } = auth.retrieve('partner')
      this.setPartnerTransactions({
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
      }).finally(() => {
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadTransactions()
    this.setSegmentEvent('Select All Transactions Tab')
  }

}
</script>
