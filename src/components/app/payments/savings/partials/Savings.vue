<template>
 <div>
   <v-data-table
       id="savings-table"
       fixed-header
       disable-sort
       class="title"
       hide-default-footer
       disable-pagination
       :no-data-text="$t('finance.no_records_found')"
       :no-results-text="$t('finance.no_results_found')"
       :headers="headers"
       :items="savings"
       item-key="txn_no"
       :loading-text="$t('core.system_loading')"
   >
   </v-data-table>

   <app-pagination
       v-if="savings.length"
       id="savings-pagination"
       :meta="meta"
       @pageChanged="pageChanged"
   />
 </div>
</template>

<script>
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
      savings: [],
      orderDetails: {},
      orderDetailsError: {},
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

  methods: {
    pageChanged (page) {
      this.page = page
      this.loadSavings()
    },

    loadSavings() {

    }
  },
}
</script>

<style lang="scss">
#savings-table {
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
}
#savings-pagination {
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
<style scoped>

</style>
