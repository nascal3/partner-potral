<template>
  <v-dialog
      v-model="dialogLaunch"
      width="400"
      persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          v-on="on"
          v-bind="attrs"
          color="primary"
          class="ttn caption my-3"
          @click="setSegmentEvent(`Select delete account: ${selectedAccount.operator_name}`)"
          block
      >
        {{ $t('finance.delete_account') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <h2 class="subtitle-1">
          {{ $t('finance.delete_account') }}
        </h2>
        <v-spacer></v-spacer>
        <v-btn
            icon
            small
            color="red"
            @click="dialogLaunch = false"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-5">
        <div>
          {{ $t('finance.delete_warning', {account: selectedAccount.operator_name, accountNo: selectedAccount.user_account_no} ) }}
          <p>{{ $t('finance.delete_danger') }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex flex-column px-4 pb-5">
        <v-btn
            color="red"
            class="caption my-3"
            :disabled="loading"
            :loading="loading"
            :dark="!loading"
            @click="deleteAccount"
            large
            block
        >
          {{ $t('finance.delete_account') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Payment from '@/libs/app/payments/Payment'
import segmentMixin from "@/mixins/segmentEvents"
import { mapActions } from "vuex"

export default {
  props: {
    selectedAccount: {
      type: Object,
      default: () => {}
    },
  },

  mixins: [segmentMixin],

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      paymentObj: new Payment()
    }
  },



  methods: {
    ...mapActions([
      "setSavedPayoutAccounts"
    ]),

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

    deleteAccount () {
      this.setSegmentEvent(`Confirm delete account: ${this.selectedAccount.operator_name}`)
      this.loading = true
      const id = this.selectedAccount.id
      this.paymentObj.deletePayoutAccount(id).then(result => {
        this.reloadAccountList()
        flash({
          message: this.$t('finance.successful_delete_account'),
          color: 'green',
        })
      }).catch( error => {
        flash({
          message: 'An error occurred. Please try again',
          color: '#e74c3c',
        })
        return false
      }).finally(() => {
        this.loading = false
      })
    },

    reloadAccountList () {
      this.loadPayoutAccounts()

      setTimeout (() => {
        this.dialogLaunch = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  &__text {
    div {
      color: red;
      font-size: 15px;

      p {
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
      };
    }
  }
  &__actions {
    button {

    }
  }
}

</style>
