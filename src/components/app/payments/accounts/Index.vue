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
            :items="accounts"
            item-key="txn_no"
            :loading="loading"
            :loading-text="$t('core.system_loading')"
        >
          <template v-slot:item.isactive="{ item }">
            <v-chip :color="setChipColor(item.isactive)" :text-color="setChipTextColor(item.isactive)" outlined small>
              {{ item.isactive }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
                color="primary"
                class="ttn caption my-3"
                @click="sanction = item, openDialog('edit')"
                outlined
                block
            >
              {{ $t('finance.edit_details') }}
            </v-btn>

            <delete-account-modal :selected-account="item" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers";
import mockData from '../../../../../tests/e2e/fixtures/savePayoutMethods.json'

export default {
  mixins: [segmentMixin, formatNumbers],

  components: {
    'add-account-modal': () => import('./addAccountModal/AccountModal.vue'),
    'delete-account-modal': () => import('./deleteAccountModal/DeleteAccountModal.vue')
  },

  data() {
    return {
      accounts: mockData,
      loading: true,
      headers: [
        { text: this.$t('finance.tbl_account'), value: 'operator_name' },
        { text: this.$t('finance.tbl_account_name'), value: 'account_name' },
        { text: this.$t('finance.tbl_account_number'), value: 'user_account_no' },
        { text: this.$t('finance.tbl_active'), value: 'isactive' },
        { text: this.$t('finance.tbl_action'), value: 'actions' }
      ]
    }
  },

  methods: {
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
