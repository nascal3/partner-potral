<template>
  <v-data-table
      id="errands-table"
      fixed-header
      disable-sort
      class="title"
      hide-default-footer
      disable-pagination
      :no-data-text="$t('orders.no_orders_found')"
      :no-results-text="$t('orders.no_results_found')"
      :headers="headers"
      :items="errands"
      :search="searchPhrase"
      item-key="errandId"
      :expanded.sync="expanded"
      show-expand
      @item-expanded="getErrandDetails"
      :loading="loading"
      :loading-text="$t('core.system_loading')"
  >
    <template v-slot:item.destinations="{ item }">
      {{ getLastStop(item.destinations) }}
    </template>
    <template v-slot:item.updated_at="{ item }">
      {{ ordersDateFormat(item.updated_at) }}
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="setChipColor(item.status)" :text-color="setChipTextColor(item.status)" light small>
        {{ item.status }}
      </v-chip>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <errand-details :order-details-error="errandDetailsError" :errand-details="initialised"/>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
import segmentMixin from "@/mixins/segmentEvents"
import Order from '@/libs/app/orders/Order'
import OrderDetails from '@/libs/app/order_details/OrderDetails'

export default {
  mixins: [segmentMixin],

  props: {
    errands: {
      type: Array,
      default: () => []
    },

    searchPhrase: {
      type: String,
      default: () => ''
    },

    loading: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      expanded: [],
      errandDetailsError: {},
      chipColor: 'error',
      chipTextColor: '#FFFFFF',
      page: 1,
      search: '',
      headers: [
        { text: this.$t('orders.table_errand_num'), value: 'errandId' },
        { text: this.$t('orders.table_errand_date'), value: 'date' },
        { text: this.$t('orders.table_errand_status'), value: 'status' },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },

  components: {
    'errand-details': () => import('./ErrandDetails'),
  },

  computed: {
    ...mapGetters({
      errandDetails: 'getErrand'
    }),

    initialised() {
      return this.errandDetails.data
    }
  },

  methods: {
    ...mapActions([
      'setErrand'
    ]),

    getErrandDetails ({item, value}) {
      if (!value) return
      this.setSegmentEvent('Expand errand')
      const { errandId } = item
      const { id } = auth.retrieve('partner')
      this.setErrand({
        routes: {
          partner: id,
          errand_id: errandId
        }
      }).then(() => {
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.errandDetailsError = error
        flash({
          message: error.response.data.message,
          color: '#e74c3c'
        })
      })
    },

    setChipColor (orderStatus) {
      const colorMap = {
        'pending': '#FBDECF',
        'failed': '#FBDECF',
        'confirmed': '#CCEFFF',
        'delivered': '#DEFAD2',
        'in transit': '#FDDB97',
        'transit': '#FDDB97'
      }
      return colorMap[orderStatus]
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'pending': '#9B101C',
        'failed': '#9B101C',
        'confirmed': '#006492',
        'delivered': '#116F28',
        'in transit': '#9D5004',
        'transit': '#9D5004'
      }
      return colorMap[orderStatus]
    },
  },

  mounted () {
    this.setSegmentEvent('Visited errands tab')
  }
}
</script>

<style lang="scss">
#errands-table {
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
          background-color: #F7F9FC;
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
