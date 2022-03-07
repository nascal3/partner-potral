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
            <v-chip color="#DEFAD2" text-color="#116F28" light small>
              {{ item.table_action }}
            </v-chip>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <order-details :order-details="orderDetails"/>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      headers: [
        { text: this.$t('orders.table_order_num'), value: 'order_num' },
        { text: this.$t('orders.table_pickup_location'), value: 'pickup_location' },
        { text: this.$t('orders.table_destination'), value: 'table_destination' },
        { text: this.$t('orders.table_distance'), value: 'table_distance' },
        { text: this.$t('orders.table_pickup_date'), value: 'pickup_date' },
        { text: this.$t('orders.table_price'), value: 'table_price' },
        { text: this.$t('orders.table_action'), value: 'table_action' },
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
          table_action: 'Delivered'
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
      ]
    }
  },

  computed: {
    ...mapGetters({
      vehicles: 'getVehicles'
    }),
  },

  methods: {
    ...mapActions([
      'setVehicles'
    ]),

    loadVehicles () {
      this.setVehicles({
        routes: {
          partner: (auth.retrieve('partner')).id
        }
      })
    },

    getOrderDetails ({item, value}) {
      if (!value) return
      const { order_num } = item
      this.orderDetailsObj.show('AG86HX347-BA5').then( data => {
        this.orderDetails = data.data
      }).catch(error => {
        console.error(error.data)
      })
    },

    getDriverIds () {
      const drivers = auth.retrieve('partners')
      return drivers.map(driver => {
        return driver.id
      })
    },

    loadOrders () {
      const driverIds = this.getDriverIds()
      this.orderObj.show(driverIds).then(({ data }) => {
        this.orders = data
      }).catch(error => {
        console.error(error.data)
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
  }
</style>
