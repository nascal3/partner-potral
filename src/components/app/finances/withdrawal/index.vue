<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('finance.withdrawals_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <v-btn
            color="primary"
            class="caption ttn"
            @click="setSegmentEvent('Withdraw funds')"
        >
          {{ $t('finance.withdraw') }}: KES 1,500
        </v-btn>

      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
          <v-row class="date-filters">
            <v-col cols="12" md="4">
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
                      :label="$t('orders.from_date')"
                      prepend-inner-icon="event"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @blur="loadStatement"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateFrom" :locale="locale" :show-current="dateTo" :max="maximumDate">
                  <v-spacer></v-spacer>
                  <v-btn class="btn-text" text color="primary" @click="menu = false">{{ $t('orders.cancel') }}</v-btn>
                  <v-btn class="btn-text" color="primary" @click="$refs.menu.save(dateFrom)">{{ $t('orders.ok') }}</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
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
                      :label="$t('orders.to_date')"
                      prepend-inner-icon="event"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @blur="loadStatement"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateTo" :locale="locale" :show-current="dateFrom" :min="minimumDate">
                  <v-spacer></v-spacer>
                  <v-btn class="btn-text" text color="primary" @click="menu2 = false">{{ $t('orders.cancel') }}</v-btn>
                  <v-btn class="btn-text" color="primary" @click="$refs.menu2.save(dateTo)">{{ $t('orders.ok') }}</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                  v-model="selectedWithdrawalState"
                  :items="withdrawalState"
                  :label="$t('finance.withdrawal_state')"
                  item-text="withdrawalLabel"
                  item-value="withdrawalValue"
                  dense
                  outlined
                  @change="loadStatement"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <v-card-text class="px-0">
        <v-data-table
            id="statement-table"
            fixed-header
            disable-sort
            class="title"
            hide-default-footer
            disable-pagination
            :no-data-text="$t('finance.withdrawal_record_found')"
            :no-results-text="$t('finance.withdrawal_results_found')"
            :headers="headers"
            :items="withdrawals"
            item-key="txn_no"
            :loading-text="$t('core.system_loading')"
        >
        </v-data-table>

        <app-pagination
            v-if="withdrawals.length"
            id="statement-pagination"
            :meta="meta"
            @pageChanged="pageChanged"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { format } from 'date-fns'
import Order from '@/libs/app/orders/Order'
import OrderDetails from '@/libs/app/order_details/OrderDetails'
import User from '@/libs/app/users/User'

export default {
  data () {
    return {
      loading: true,
      orderObj: new Order(),
      orderDetailsObj: new OrderDetails(),
      usersObj: new User(),
      withdrawals: [],
      orderDetails: {},
      orderDetailsError: {},
      selectedWithdrawalState: {withdrawalLabel: this.$t('finance.in_progress'), withdrawalValue: 'in_progress'},
      withdrawalState: [
        {withdrawalLabel: this.$t('finance.in_progress'), withdrawalValue: 'in_progress'},
        {withdrawalLabel: this.$t('finance.failed'), withdrawalValue: 'failed'},
        {withdrawalLabel: this.$t('finance.completed'), withdrawalValue: 'completed'}
      ],
      menu: false,
      menu2: false,
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
      minimumDate: '',
      maximumDate: '',
      locale: localStorage.getItem('setLanguage'),
      page: 1,
      headers: [
        { text: this.$t('finance.txn'), value: 'order_no' },
        { text: this.$t('finance.txn_date'), value: 'pickup_location' },
        { text: this.$t('finance.txn_amount'), value: 'destinations' },
        { text: this.$t('finance.txn_balance'), value: 'distance' },
        { text: this.$t('finance.txn_driver'), value: 'updated_at' }
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
      const { order_no } = item
      this.orderDetailsObj.show(order_no).then( data => {
        this.orderDetails = data.data
      }).catch(error => {
        this.orderDetailsError = error
        throw error.data
      })
    },

    getDriverIds () {
      return this.usersObj.show('?roles=driver').then(data => {
        const drivers = data.data
        return drivers.map(driver => {
          return driver.id
        })
      }).catch(error => {
        this.loading = false
        throw error.data
      })
    },

    formatDate(date) {
      if (!date) return
      return format(new Date(date), 'iii, do LLL')
    },

    pageChanged (page) {
      this.page = page
      this.loadStatement()
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

    loadStatement () {
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
  },

  mounted () {
    this.loadStatement()
  }

}
</script>

<style lang="scss">
#statement-table {
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
#statement-pagination {
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
.search-tenant-table {
  width: 240px;
}
</style>
