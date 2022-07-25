<template>
  <div>
    <v-data-table
        id="earnings-table"
        fixed-header
        disable-sort
        class="title"
        hide-default-footer
        disable-pagination
        :no-data-text="$t('finance.txn_no_statement_found')"
        :no-results-text="$t('finance.txn_no_results_found')"
        :headers="headers"
        :items="earnings.disputed_orders"
        item-key="order_no"
        :expanded.sync="expanded"
        show-expand
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="setColor('in_review')" :text-color="setChipTextColor('in_review')" light small>
        <!-- {{ item.status }}--> In Review
        </v-chip>
      </template>
      <template v-slot:item.date="{ item }">
        {{ notificationsDateFormat(item.date) }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{ thousandSeparator(item.earnings) }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <earnings-details :details="item"/>
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
import dateFormat from "@/mixins/dateFormat"
import formatNumbers from "@/mixins/formatNumbers"
import mockResponse from '@/libs/app/payments/mockEarningsResponce.json'
import {mapGetters, mapActions} from "vuex"

export default {
  mixins: [dateFormat, formatNumbers],

  components: {
    'earnings-details': () => import('./partials/EarningsDetails')
  },

  data () {
    return {
      loading: true,
      expanded: [],
      earnings: [],
      page: 1,
      headers: [
        { text: this.$t('finance.txn'), value: 'order_no' },
        { text: this.$t('finance.txn_date'), value: 'date' },
        { text: this.$t('finance.tbl_from'), value: 'pick_up_location' },
        { text: this.$t('finance.tbl_to'), value: 'drop_off_location' },
        { text: this.$t('finance.tbl_earnings'), value: 'earnings' },
        { text: this.$t('finance.tbl_status'), value: 'status' },
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
      unclearedEarnings: 'getUnclearedEarnings'
    }),

    initialised () {
      return this.unclearedEarnings.disputed_orders && this.unclearedEarnings.disputed_orders.length
    },

    // earnings() {
    //   if (!this.initialised) return []
    //   return this.unclearedEarnings.disputed_orders
    // }
  },

  methods: {
    ...mapActions([
      'setUnclearedEarnings'
    ]),

    setColor(status) {
      const colorMap = {
        'failed': '#FDDB97',
        'in_review': '#FDDB97',
        'sent': '#CCEFFF',
        'other': '#DEFAD2'
      }
      return colorMap[status]
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'pending': '#9B101C',
        'confirmed': '#006492',
        'delivered': '#116F28',
        'in_review': '#9D5004'
      }
      return colorMap[orderStatus]
    },

    pageChanged (page) {
      this.page = page
      this.loadTransactions()
    },

    loadEarnings () {
      const { id } = auth.retrieve('partner')
      this.setUnclearedEarnings({
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
    this.loadEarnings()
    this.earnings = mockResponse
  }

}
</script>

<style lang="scss">
#earnings-table {
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
#orders-pagination {
  .v-pagination {
    justify-content: flex-end;
    padding-right: 20px;
    .v-pagination__navigation {
      box-shadow: none;
    }
    .v-pagination__item--active {
      color: #324BA8;
      background-color: transparent !important;
    }
    .v-pagination__item {
      background: transparent;
      font-weight: 700;
      box-shadow: none;
    }
  }
}
</style>
