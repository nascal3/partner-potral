<template>
  <div>
    <v-data-table
        id="withdrawal-table"
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
        :expanded.sync="expanded"
        show-expand
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
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <withdrawal-details :payment-id="item.payment_id"/>
        </td>
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

  components: {
    'withdrawal-details': () => import('./partials/WithdrawalDetails')
  },

  data () {
    return {
      loading: true,
      page: 1,
      expanded: [],
      headers: [
        { text: this.$t('finance.txn_date'), value: 'created_at' },
        { text: this.$t('finance.txn_amount'), value: 'amount' },
        { text: this.$t('finance.txn_payment_method'), value: 'payment_method' },
        { text: this.$t('finance.txn_status'), value: 'status' },
        { text: '', value: 'data-table-expand' }
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
        'pending': '#FDDB97',
        'new': '#CCEFFF'
      }
      return colorMap[status.toLowerCase()] || '#DEFAD2'
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'failed': 'error',
        'pending': 'warning',
        'new': 'info'
      }
      return colorMap[orderStatus.toLowerCase()] || 'success'
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
    this.setSegmentEvent('Select Withdrawal Transactions Tab')
  }

}
</script>

<style lang="scss">
#withdrawal-table {
  .v-data-table__wrapper {
    max-height: 90vh;
    overflow-x: hidden;
    overflow-y: auto;

    table {
      color: #909399;
      thead {
        tr {
          th:first-letter {
            text-transform: uppercase;
          }
        }
      }
      tbody {
        tr.v-data-table__expanded__content {
          background-color: #FFFFFF !important;
          box-shadow: none;
        }
        tr:nth-of-type(odd) {
          //background-color: #F7F9FC;
        }
        tr {
          td.text-start:first-child {
            color: #606266;
            font-weight: 700;
          }
        }
      }
    }
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
