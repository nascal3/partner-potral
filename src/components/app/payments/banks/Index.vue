<template>
  <div>
    <v-card flat className="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('finance.bank_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <bank-modal/>

      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-0">
        <v-data-table
            id="statement-table"
            fixed-header
            disable-sort
            class="title"
            hide-default-footer
            disable-pagination
            :no-data-text="$t('finance.txn_no_statement_found')"
            :no-results-text="$t('finance.txn_no_results_found')"
            :headers="headers"
            :items="banks"
            item-key="txn_no"
            :loading="loading"
            :loading-text="$t('core.system_loading')"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="setColor(item.status)" outlined small>
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.date="{ item }">
            {{ notificationsDateFormat(item.date) }}
          </template>
          <template v-slot:item.amount="{ item }">
            {{ thousandSeparator(item.amount) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers";

export default {
  mixins: [segmentMixin, formatNumbers],

  components: {
    'bank-modal': () => import('./bankModal/BankModal.vue')
  },

  data() {
    return {
      banks: [],
      loading: true,
      headers: [
        { text: this.$t('finance.tbl_bank'), value: 'bank_name' },
        { text: this.$t('finance.tbl_bank_branch'), value: 'bank_branch' },
        { text: this.$t('finance.tbl_account_name'), value: 'account_name' },
        { text: this.$t('finance.tbl_account_number'), value: 'account_number' },
      ]
    }
  },
}
</script>

<style lang="scss">
#statement-tabs {

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
<style lang="scss" scoped>


</style>
