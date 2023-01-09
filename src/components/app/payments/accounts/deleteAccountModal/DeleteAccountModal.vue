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
import { mapGetters, mapActions } from 'vuex'
import segmentMixin from "@/mixins/segmentEvents"

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
    }
  },

  watch: {

  },

  methods: {
    deleteAccount () {
      this.setSegmentEvent(`Confirm delete account: ${this.selectedAccount.operator_name}`)
      // TODO add code to delete account using account ID in prop data
      this.loading = true
      setTimeout (() => {
        this.reloadAccountList()
        this.loading = false
      }, 2000)

    },

    reloadAccountList () {
      // TODO fetch all partners saved accounts

      flash({
        message: this.$t('finance.successful_delete_account'),
        color: 'green',
      })

      this.dialogLaunch = false
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
