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
        :items="earnings"
        item-key="order_no"
        :expanded.sync="expanded"
        show-expand
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.date="{ item }">
        {{ notificationsDateFormat(item.date) }}
      </template>
      <template v-slot:item.earnings="{ item }">
        {{ currency || item.currency }} {{ thousandSeparator(item.earnings) }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <earnings-details :details="item" :currency="currency"/>
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
// import mockResponse from '@/libs/app/payments/mockEarningsResponce.json'

export default {
  mixins: [segmentMixin, dateFormat, formatNumbers],

  components: {
    'earnings-details': () => import('./partials/EarningsDetails')
  },

  data () {
    return {
      loading: true,
      expanded: [],
      page: 1,
      headers: [
        { text: this.$t('finance.tbl_order_id'), value: 'order_no' },
        { text: this.$t('finance.tbl_order_completed_on'), value: 'date' },
        { text: this.$t('finance.tbl_from'), value: 'pick_up_location' },
        { text: this.$t('finance.tbl_to'), value: 'drop_off_location' },
        { text: this.$t('finance.tbl_earnings'), value: 'earnings' },
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

    currency() {
      const { currency } = auth.retrieve('country')
      return currency
    },

    initialised () {
      return this.unclearedEarnings.disputed_orders && this.unclearedEarnings.disputed_orders.length
    },

    earnings() {
      if (!this.initialised) return []
      return this.unclearedEarnings.disputed_orders
    }
  },

  methods: {
    ...mapActions([
      'setUnclearedEarnings'
    ]),

    pageChanged (page) {
      this.page = page
      this.loadEarnings()
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
    this.setSegmentEvent('Select Unclear Earnings Tab')
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
