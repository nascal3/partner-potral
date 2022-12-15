<template>
  <section v-animate-css="animationObject">
    <div class="px-4 pt-2">
      {{ $t('finance.withdraw_amount_question') }}
    </div>

    <v-card-text class="pt-5">
      <div>
        <v-text-field
            dense
            outlined
            persistent-hint
            class="body-2"
            :label="$t('finance.withdrawal_amount')"
            v-model="amount"
            :hint="errors.get('registration_number')"
            :error="withdrawAmountError || errors.has('registration_number')"
            @input="errors.clear('registration_number')"
            @change="setSegmentEvent('Enter withdrawal amount')"
        ></v-text-field>
        <span class="error-message" v-if="withdrawAmountError">
          {{ $t('finance.withdraw_amount_error') }}
        </span>
      </div>

    </v-card-text>
    <v-card-actions class="px-4 pb-5">
      <v-btn
          block
          large
          color="primary"
          class="caption font-weight-bold"
          :disabled="btnDisabled || withdrawAmountError"
          @click="proceedToWithdraw"
      >
        {{ $t('finance.continue') }}
      </v-btn>
    </v-card-actions>
  </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import {mapActions, mapGetters} from "vuex"

export default {
  mixins: [segmentMixin, formatNumbers],

  props: {
    inputErrors: {
      type: Object,
      default: () => {}
    },
    accountBalance: {
      type: Number,
      default: 0
    },
    paymentMethodsInit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      disabled: true,
      amount: '',
      animationObject:{
        classes: 'slideInLeft',
        delay: 0,
        duration: 300
      }
    }
  },

  watch: {
    async amount (newValue) {
      const result = newValue.replace(/\D/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      await this.$nextTick(() => {
        this.amount = result
        const numValue = this.formatAmountToNumber(this.amount)
        this.disabled = !numValue
        this.$emit('amount', this.amount)
      })
    },
  },

  computed: {
    // TODO ENABLE ONCE READY TO DEPLOY CONTRACTS
    // ...mapGetters({
    //   partnerContracts: 'getPartnerContractDocuments',
    // }),

    // contractsDataInitialised () {
    //   return this.partnerContracts && this.partnerContracts.data && Object.keys(this.partnerContracts.data).length > 0
    // },

    // pendingContracts () {
    //   if (!this.contractsDataInitialised) return true
    //   return this.partnerContracts.data.has_pending
    // },

    btnDisabled() {
      return this.disabled || !this.paymentMethodsInit
    },

    errors() {
      return this.inputErrors
    },

    withdrawAmountError() {
      return this.formatAmountToNumber(this.amount) > this.accountBalance
    }
  },

  methods: {
    ...mapActions([
      'setPartnerContractDocuments'
    ]),

    loadDocument () {
      const { id } = auth.retrieve('partner')
      this.setPartnerContractDocuments({
        routes: {
          partner: id
        }
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },

    proceedToWithdraw() {
      this.setSegmentEvent('Proceed to withdraw amount')
      // TODO ENABLE ONCE READY TO DEPLOY CONTRACTS
      // if (this.pendingContracts) {
      //   this.setSegmentEvent('Redirected to sign partner contract')
      //   return this.$router.push({ name: 'contract' })
      // }
      this.$emit('proceed', true)
    }
  },

  mounted () {
    this.loadDocument()
  }
}
</script>

<style lang="scss" scoped>
.error-message {
  position: relative;
  color: #EE551A;
  bottom: 25px;
}
</style>
