<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('finance.bank_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <add-bank
            v-if="auth.can('vehicles.store')"
            @stored="loadBanks"
        ></add-bank>

      </v-card-title>

      <v-divider></v-divider>

      <v-spacer></v-spacer>

      <v-card-text class="px-0">
        <v-data-table
            id="banks-table"
            fixed-header
            disable-sort
            class="title"
            hide-default-footer
            disable-pagination
            :no-data-text="$t('finance.no_bank_records_found')"
            :no-results-text="$t('finance.no_results_found')"
            :headers="headers"
            :items="banks.data"
            item-key="txn_no"
            :loading-text="$t('core.system_loading')"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  components: {
    'add-bank': () => import('./partials/Create'),
  },

  data () {
    return {
      loading: true,
      headers: [
        { text: this.$t('finance.tbl_bank'), value: 'order_no' },
        { text: this.$t('finance.tbl_bank_branch'), value: 'pickup_location' },
        { text: this.$t('finance.tbl_account_name'), value: 'destinations' },
        { text: this.$t('finance.tbl_account_number'), value: 'distance' },
        { text: this.$t('finance.tbl_status'), value: 'updated_at' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      banks: 'getBanks'
    }),

    auth: () => auth
  },

  methods: {
    ...mapActions([
      'setBanks'
    ]),

    loadBanks () {
      this.setBanks()
    }

  },

  mounted () {
    this.loadBanks()
  }

}
</script>

<style lang="scss">
#banks-table {
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
  //.v-chip {
  //  .v-chip__content {
  //    padding-top: 2px;
  //    display: inline-block !important;
  //    &:first-letter {
  //      text-transform: uppercase;
  //    }
  //  }
  //}
}
</style>
