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
        :items="transactions.data"
        item-key="txn_no"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="setColor(item.status)" outlined small>
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
import mockResponse from '@/libs/app/payments/mockResponce.json'
import {mapGetters, mapActions} from "vuex"

export default {
  mixins: [dateFormat, formatNumbers],

  data () {
    return {
      loading: true,
      page: 1,
      headers: [
        { text: this.$t('finance.txn'), value: 'transaction_no' },
        { text: this.$t('finance.txn_date'), value: 'date' },
        { text: this.$t('finance.txn_amount'), value: 'amount' },
        { text: this.$t('finance.txn_payment_method'), value: 'method' },
        { text: this.$t('finance.txn_type'), value: 'txn_type' },
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
      transactions: 'getPartnerTransactions'
    }),

    initialised () {
      return this.transactions
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

    loadAccountBalance () {
      const { id } = auth.retrieve('partner')
      this.setPartnerTransactions({
        routes: {
          partner: id
        }
      }).then(() => {
        this.loading = false
      }).catch((error) => {
        console.error('>>>', error)
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
    this.loadAccountBalance()
  }

}
</script>
