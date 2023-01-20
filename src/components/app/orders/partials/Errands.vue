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
      :items="errands.data"
      :search="searchPhrase"
      item-key="errands[0].errandId"
      :expanded.sync="expanded"
      show-expand
      @item-expanded="getErrandDetails"
      :loading="loading"
      :loading-text="$t('core.system_loading')"
  >

    <template v-slot:item.errandId="{ item }">
      {{ item.errands[0].errandId }}
    </template>
    <template v-slot:item.date="{ item }">
      {{ notificationsDateFormat(item.errands[0].date) }}
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip
          :color="setChipColor(item.errands[0].status)"
          :text-color="setChipTextColor(item.errands[0].status)"
          small
      >
        {{ item.errands[0].status }}
      </v-chip>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <errand-details
            :errand-details-error="errandDetailsError"
            :errand-details="errandDetailsData"
            :loading="loadingDetails"
        />
      </td>
    </template>
  </v-data-table>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
import segmentMixin from "@/mixins/segmentEvents"
import dateFormat from "@/mixins/dateFormat"
// import mockErrandsResponse from "../../../../../tests/e2e/fixtures/errands.json"

export default {
  mixins: [segmentMixin, dateFormat],

  props: {
    errands: {
      type: Object,
      default: () => {}
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
      loadingDetails: true,
      errandDetailsError: {},
      errandDetailsData: {},
      chipColor: 'error',
      chipTextColor: '#FFFFFF',
      page: 1,
      search: '',
      headers: [
        { text: this.$t('orders.table_errand_num'), value: 'errandId' },
        { text: this.$t('orders.table_errand_date'), value: 'date' },
        { text: this.$t('orders.table_errand_status'), value: 'status' },
        { text: '', value: 'data-table-expand' }
      ],
      // errands: mockErrandsResponse
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
      this.errandDetailsData = this.errandDetails.data
      return this.errandDetails.data
    }
  },

  methods: {
    ...mapActions([
      'setErrand'
    ]),

    getErrandDetails ({item, value}) {
      if (!value) return
      this.setSegmentEvent('View errand details')
      this.loadingDetails = true
      const { errandId } = item.errands[0]
      const { id } = auth.retrieve('partner')
      this.setErrand({
        routes: {
          partner: id,
          errand_id: errandId
        }
      }).then(() => {
        this.loadingDetails = false
      }).catch((error) => {
        this.loadingDetails = false
        this.errandDetailsError = {
          status: error.response.status,
          data: error.response.data
        }
        flash({
          message: error.response,
          color: '#e74c3c'
        })
      })
    },

    setChipColor (orderStatus) {
      const colorMap = {
        'pending': '#FBDECF',
        'failed': '#FBDECF',
        'confirmed': '#CCEFFF',
        'complete': '#DEFAD2',
        'in transit': '#FDDB97',
        'transit': '#FDDB97'
      }
      return colorMap[orderStatus.toLowerCase()]
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'pending': '#9B101C',
        'failed': '#9B101C',
        'confirmed': '#006492',
        'complete': '#116F28',
        'in transit': '#9D5004',
        'transit': '#9D5004'
      }
      return colorMap[orderStatus.toLowerCase()]
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
