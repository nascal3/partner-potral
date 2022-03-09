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
      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
          <v-text-field
              class="search-tenant-table"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              outlined
              dense
          ></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-row>
            <v-col cols="12" md="4" class="pt-0">
              <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dateFrom"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateFrom"
                      label="From Date"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateFrom" :max="maximumDate">
                  <v-spacer></v-spacer>
                  <v-btn class="btn-text" text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn class="btn-text" color="primary" @click="$refs.menu.save(dateFrom)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4" class="pt-0">
              <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="dateTo"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateTo"
                      label="To Date"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateTo" :min="minimumDate">
                  <v-spacer></v-spacer>
                  <v-btn class="btn-text" text color="primary" @click="menu2 = false">Cancel</v-btn>
                  <v-btn class="btn-text" color="primary" @click="$refs.menu2.save(dateTo)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex align-center pt-0" cols="12" md="1">
              <v-btn icon color="primary" @click="loadOrders">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <v-card-text class="px-0">
        <v-data-table
          id="orders-table"
          fixed-header
          disable-sort
          class="title"
          hide-default-footer
          disable-pagination
          :headers="headers"
          :items="data"
          :search="search"
          item-key="order_num"
          :expanded.sync="expanded"
          show-expand
          @item-expanded="getOrderDetails"
          style="overflow-x: scroll; width: 100%"
        >
          <template v-slot:item.table_action="{ item }">
            {{ setChipColor(item.table_action) }}
            <v-chip :color="chipColor" :text-color="chipTextColor" light small>
              {{ item.table_action }}
            </v-chip>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <order-details :order-details="orderDetails"/>
            </td>
          </template>
        </v-data-table>

        <app-pagination
          :meta="meta"
          @pageChanged="pageChanged"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Order from '@/libs/app/orders/Order'
import OrderDetails from '@/libs/app/order_details/OrderDetails'

export default {
  components: {
    'order-details': () => import('./partials/OrderDetails'),
  },

  data () {
    return {
      expanded: [],
      orderObj: new Order(),
      orderDetailsObj: new OrderDetails(),
      orders: {},
      orderDetails: {},
      chipColor: 'error',
      chipTextColor: '#FFFFFF',
      menu: false,
      menu2: false,
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
      minimumDate: '',
      maximumDate: '',
      page: 1,
      search: '',
      headers: [
        { text: this.$t('orders.table_order_num'), value: 'order_num' },
        { text: this.$t('orders.table_pickup_location'), value: 'pickup_location' },
        { text: this.$t('orders.table_destination'), value: 'table_destination' },
        { text: this.$t('orders.table_distance'), value: 'table_distance' },
        { text: this.$t('orders.table_pickup_date'), value: 'pickup_date' },
        { text: this.$t('orders.table_price'), value: 'table_price' },
        { text: this.$t('orders.table_status'), value: 'table_action' },
        { text: '', value: 'data-table-expand' },
      ],
      data: [
        {
          order_num: 'ET68W9725-2PQ',
          pickup_location: 'Marsabit Plaza',
          table_destination: 'Rosslyn Ridge',
          table_distance: '19 KM',
          pickup_date: 'Wed, 17th Nov',
          table_price: 'KES 139',
          table_action: 'delivered'
        },
        {
          order_num: 'ET68W9725-3PQ',
          pickup_location: 'Marsabit Plaza',
          table_destination: 'Rosslyn Ridge',
          table_distance: '19 KM',
          pickup_date: 'Wed, 18th Nov',
          table_price: 'KES 139',
          table_action: 'Delivered'
        },
        {
          order_num: 'ET68W9725-4PQ',
          pickup_location: 'Marsabit Plaza',
          table_destination: 'Rosslyn Ridge',
          table_distance: '19 KM',
          pickup_date: 'Wed, 19th Nov',
          table_price: 'KES 139',
          table_action: 'Delivered'
        }
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
        total: 30
      }
    }
  },
  watch: {
    dateFrom (newDate) {
      this.minimumDate = newDate
    },

    dateTo (newDate) {
      this.maximumDate = newDate
    }
  },

  methods: {
    getOrderDetails ({item, value}) {
      if (!value) return
      // TODO user order_num and remove hard coded value
      const { order_num } = item
      this.orderDetailsObj.show('AG93A7418-FQD').then( data => {
        this.orderDetails = data.data
      }).catch(error => {
        throw error.data
      })
    },

    getDriverIds () {
      const drivers = auth.retrieve('partners')
      return drivers.map(driver => {
        return driver.id
      })
    },

    setChipColor (orderStatus) {
      if (orderStatus === 'pending') {
        this.chipColor = 'error'
        this.chipTextColor= '#FFFFFF'
      }
      if (orderStatus === 'confirmed') {
        this.chipColor = 'warning'
        this.chipTextColor= '#FFFFFF'
      }
      if (orderStatus === 'delivered') {
        this.chipColor = 'info'
        this.chipTextColor= '#FFFFFF'
      }
      if (orderStatus === 'in transit') {
        this.chipColor = '#DEFAD2'
        this.chipTextColor= '#116F28'
      }
    },

    pageChanged (page) {
      this.page = page
      this.loadOrders()
    },

    loadOrders () {
      const driverIds = this.getDriverIds()
      // const currentDate = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
      // const dateFrom = currentDate
      // const dateTo = currentDate
      this.orderObj.show(this.dateFrom, this.dateTo, this.page, driverIds).then(({ data }) => {
        this.orders = data
      }).catch(error => {
        throw error.data
      })
    },

  },

  mounted () {
    this.loadOrders()
  }

}
</script>

<style lang="scss">
  #orders-table {
    table {
      color: #909399;
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
