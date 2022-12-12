<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('orders.page_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <div class="search-tenant-table">
          <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('orders.search')"
              @change="setSegmentEvent('Searched an order phrase')"
              single-line
              hide-details
              outlined
              clearable
              dense
          ></v-text-field>
        </div>

      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
          <v-row class="date-filters">
            <v-col cols="12" md="7">
              <date-range @getDateRange="setDateRange"/>
            </v-col>
            <v-col cols="12" md="5">
              <v-select
                  v-model="selectedDrivers"
                  :items="driversData"
                  item-text="name"
                  item-value="id"
                  :label="$t('orders.filter_by_driver')"
                  @change="getSelectedDrivers"
                  multiple
                  outlined
                  dense
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>
                    <span>{{ item.name }}</span>
                  </v-chip>
                  <span
                      v-if="index === 1"
                      class="grey--text text-caption"
                  >
                    +{{ selectedDrivers.length - 1 }} {{ $t('orders.other_drivers') }}
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <orders-summary :currency="currency" :orders="orders" />

      <v-card-text class="px-0">
        <v-tabs
            v-model="tab"
            id="orders-tabs"
            color="#324BA8"
            left
        >
          <v-tab>{{ $t('orders.orders_tab') }}</v-tab>
          <v-tab>{{ $t('orders.errand_tab') }}</v-tab>

          <!--      #####orders summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <v-data-table
                  id="orders-table"
                  fixed-header
                  disable-sort
                  class="title"
                  hide-default-footer
                  disable-pagination
                  :no-data-text="$t('orders.no_orders_found')"
                  :no-results-text="$t('orders.no_results_found')"
                  :headers="headers"
                  :items="orders"
                  :search="search"
                  item-key="order_no"
                  :expanded.sync="expanded"
                  show-expand
                  @item-expanded="getOrderDetails"
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
                    <order-details :order-details-error="orderDetailsError" :order-details="orderDetails"/>
                  </td>
                </template>
              </v-data-table>

              <app-pagination
                  v-if="orders.length"
                  id="orders-pagination"
                  :meta="meta"
                  @pageChanged="pageChanged"
              />
            </v-container>
          </v-tab-item>

          <!--      #####Errands summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <errands-table :errands="errands" :search-phrase="search" :loading="loadingErrands"/>
            </v-container>
          </v-tab-item>
        </v-tabs>

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import Order from '@/libs/app/orders/Order'
import OrderDetails from '@/libs/app/order_details/OrderDetails'
import User from '@/libs/app/users/User'
import dateFormat from "@/mixins/dateFormat"
import {mapActions, mapGetters} from "vuex";

export default {
  mixins: [segmentMixin, dateFormat, formatNumbers],

  components: {
    'order-details': () => import('./partials/OrderDetails'),
    'date-range': () => import('@/components/core/DateRange.vue'),
    'orders-summary': () => import('./partials/OrdersSummary'),
    'errands-table': () => import('./partials/Errands'),
  },

  data () {
    return {
      tab: null,
      loading: true,
      loadingErrands: true,
      expanded: [],
      orderObj: new Order(),
      orderDetailsObj: new OrderDetails(),
      usersObj: new User(),
      orders: [],
      orderDetails: {},
      orderDetailsError: {},
      chipColor: 'error',
      chipTextColor: '#FFFFFF',
      menu: false,
      menu2: false,
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
      minimumDate: '',
      maximumDate: '',
      locale: localStorage.getItem('setLanguage'),
      page: 1,
      search: '',
      driversData: [],
      selectedDrivers: [],
      headers: [
        { text: this.$t('orders.table_order_num'), value: 'order_no' },
        { text: this.$t('orders.table_pickup_location'), value: 'pickup_location' },
        { text: this.$t('orders.table_destination'), value: 'destinations' },
        { text: this.$t('orders.table_distance'), value: 'distance' },
        { text: this.$t('orders.table_pickup_date'), value: 'updated_at' },
        { text: this.$t('orders.table_status'), value: 'status' },
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
      errands: 'getErrands'
    }),

    currency() {
      const { currency } = auth.retrieve('country')
      return currency
    }
  },

  watch: {
    dateFrom (newDate) {
      this.minimumDate = newDate
    },

    dateTo (newDate) {
      this.maximumDate = newDate
    },

    tab (newTab) {
      if (newTab === 1) this.loadErrands()
    }
  },

  methods: {
    ...mapActions([
      'setErrands'
    ]),

    setDateRange({dateFrom, dateTo}) {
      this.setSegmentEvent('Filter Order/Errand Date')
      this.dateFrom = dateFrom
      this.dateTo = dateTo
      this.tab === 1 ? this.loadErrands() : this.loadOrders()
    },

    getOrderDetails ({item, value}) {
      if (!value) return
      this.setSegmentEvent('Expand Order')
      const { order_no } = item
      this.orderDetailsObj.show(order_no).then( data => {
        this.orderDetails = data.data
      }).catch(error => {
        this.orderDetailsError = error
        throw error.data
      })
    },

    getSelectedDrivers () {
      this.setSegmentEvent('Filter Order/Errands Driver')
      if (!this.selectedDrivers.length) return
      if (this.tab === 0) return this.loadOrders()
      return this.loadErrands()
    },

    filterOutDriverIds (driversData) {
      return driversData.map(driver => {
        if (!driver.id) return driver
        return driver.id
      })
    },

    formatDriverIds(driverIds) {
      const IdsText = driverIds.toString()
      return IdsText.replaceAll(',', '|')
    },

    getDriverIds () {
      return this.usersObj.show('?roles=driver').then(data => {

        if (this.selectedDrivers.length) {
          if (typeof this.selectedDrivers === 'object') {
            const driversIdsArray = this.filterOutDriverIds(this.selectedDrivers)
            return this.formatDriverIds(driversIdsArray)
          }
          return this.formatDriverIds(this.selectedDrivers)
        }
        this.driversData = data.data
        this.selectedDrivers = data.data
        const driversIdsArray = this.filterOutDriverIds(this.selectedDrivers)
        return this.formatDriverIds(driversIdsArray)
      }).catch(error => {
        this.loading = false
        flash({
          message: error.data.message,
          color: '#e74c3c'
        })
      })
    },

    getLastStop(destinations) {
      if (!destinations.length) return
      return destinations[destinations.length - 1]
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

    pageChanged (page) {
      this.page = page
      this.loadOrders()
    },

    formatOrders(ordersData) {
      if (!ordersData.length) return []
      let allOrders = []
      ordersData.forEach(order => {
        allOrders = [...allOrders, ...order.transporter_orders]
      })

      return allOrders.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    },

    loadOrders () {
      this.loading = true
      this.getDriverIds().then(driverIds => {
        this.orderObj.show(this.dateFrom, this.dateTo, this.page, driverIds).then(({ data }) => {
          this.orders = this.formatOrders(data)
          this.meta.total = this.orders.length
          this.loading = false
        }).catch(error => {
          this.loading = false
          flash({
            message: error.data.message,
            color: '#e74c3c',
          })
          throw error
        })
      }).catch(error => {
        this.loading = false
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },

    loadErrands () {
      this.loadingErrands = true
      const { id } = auth.retrieve('partner')
      this.getDriverIds().then(driverIds => {
        this.setErrands({
          routes: {
            partner: id
          },
          params: {
            startDate: this.dateFrom,
            endDate: this.dateTo,
            drivers: driverIds
          }
        }).then(() => {
          this.loadingErrands = false
        }).catch((error) => {
          this.loadingErrands = false
          flash({
            message: error.response.data.message,
            color: '#e74c3c'
          })
        })
      }).catch(error => {
        this.loadingErrands = false
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },
  },

  mounted () {
    this.setSegmentEvent('Visited orders page')
    this.loadOrders()
  }

}
</script>

<style lang="scss">
  #orders-tabs {
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
  #orders-table {
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
<style lang="scss" scoped>
.v-tabs {
  //margin-top: 20px;
}
.v-tab {
  text-transform: none !important;
  font-weight: 700;
  &--active {
    background: #F0F3F7;
    border-radius: 6px;
  }
}
.search-tenant-table {
  width: 240px;
}
</style>
