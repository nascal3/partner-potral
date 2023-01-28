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
            id="#accounts-table"
            fixed-header
            disable-sort
            class="title"
            hide-default-footer
            disable-pagination
            :no-data-text="$t('finance.txn_no_statement_found')"
            :no-results-text="$t('finance.txn_no_results_found')"
            :headers="headers"
            :items="savedPayoutAccounts.data"
            item-key="txn_no"
            :loading="loading"
            :loading-text="$t('core.system_loading')"
        >
          <template v-slot:item.isactive="{ item }">
            <v-chip :color="setChipColor(item.isactive)" :text-color="setChipTextColor(item.isactive)" small>
              {{ item.isactive }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <edit-account-modal :selected-account="item" />

            <delete-account-modal :selected-account="item" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import  { mapActions, mapGetters } from "vuex"
// import mockData from '../../../../../tests/e2e/fixtures/savePayoutMethods.json'

export default {
  mixins: [segmentMixin, formatNumbers],

  components: {
    'add-account-modal': () => import('./partials/addAccountModal/AccountModal.vue'),
    'delete-account-modal': () => import('./partials/deleteAccountModal/DeleteAccountModal.vue'),
    'edit-account-modal': () => import('./partials/editAccountModal/EditAccountModal.vue')
  },

  data() {
    return {
      loading: true,
      headers: [
        { text: this.$t('finance.tbl_account_type'), value: 'category' },
        { text: this.$t('finance.tbl_account'), value: 'operator_name' },
        { text: this.$t('finance.tbl_account_name'), value: 'account_name' },
        { text: this.$t('finance.tbl_account_number'), value: 'user_account_no' },
        { text: this.$t('finance.tbl_active'), value: 'isactive' },
        { text: this.$t('finance.tbl_action'), value: 'actions' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      savedPayoutAccounts: 'getSavedPayoutAccounts'
    })
  },

  methods: {
    ...mapActions([
      "setSavedPayoutAccounts",
      "setPayoutBanks"
    ]),

    setChipColor (orderStatus) {
      const colorMap = {
        'false': '#FBDECF',
        'true': '#DEFAD2'
      }
      return colorMap[orderStatus]
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'false': '#9B101C',
        'true': '#116F28'
      }
      return colorMap[orderStatus]
    },

    loadPayoutAccounts() {
      const {id} = auth.retrieve("partner")
      this.setSavedPayoutAccounts({
        routes: {
          partner: id,
        }
      }).catch((error) => {
        flash({
          message: error.response.data.message,
          color: "#e74c3c",
        });
      }).finally(() => {
        this.loading = false
      })
    },

    loadPayoutBanks() {
      const {id} = auth.retrieve("partner")
      const {code} = auth.retrieve("country")
      this.loading = true
      this.setPayoutBanks({
        routes: {
          partner: id,
          countryCode: code
        }
      }).catch((error) => {
        flash({
          message: error.response.data.message,
          color: "#e74c3c",
        });
      }).finally(() => {
        this.loading = false
      })
    }
  },

  mounted() {
    this.loadPayoutAccounts()
    this.loadPayoutBanks()
  }
}
</script>

<style lang="scss">
#accounts-table {
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
