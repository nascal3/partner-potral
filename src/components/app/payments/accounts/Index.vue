<template>
  <div>
    <v-card flat className="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('finance.accounts_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <add-account-modal/>

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
    'add-account-modal': () => import('./addAccountModal/accountModal.vue')
  },

  data() {
    return {
      banks: [],
      loading: true,
      headers: [
        { text: this.$t('finance.tbl_account_type'), value: 'bank_branch' },
        { text: this.$t('finance.tbl_account_name'), value: 'account_name' },
        { text: this.$t('finance.tbl_account_number'), value: 'account_number' },
        { text: this.$t('finance.tbl_status'), value: 'status' },
        { text: this.$t('finance.tbl_action'), value: '' }
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
