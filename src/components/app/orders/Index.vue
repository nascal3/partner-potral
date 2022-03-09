<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('orders.title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-divider></v-divider>

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
      page: 1,
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
      const currentDate = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
      const dateFrom = currentDate
      const dateTo = currentDate
      this.orderObj.show(dateFrom, dateTo, this.page, driverIds).then(({ data }) => {
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
