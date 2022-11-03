<template>
  <section v-animate-css="animationObject">
    <div class="d-flex justify-space-between pa-4">
      <div>{{ $t('finance.amount_label') }}</div>
      <div><span>{{currency}}</span> {{ amount }}</div>
    </div>

    <v-divider class="mx-4"></v-divider>

    <div class="px-4 pt-4">
      {{ $t('finance.withdraw_method_question') }}
    </div>

    <v-card-text class="py-0">
      <v-radio-group v-model="selectedPaymentMethod">
        <section v-if="paymentOptions && paymentOptions.length">
          <v-radio
              v-for="(account, index) in paymentOptions"
              :key="index"
              v-if="account.status"
              :value="account"
              class="rounded-lg"
              :class="{ active: selectedPaymentMethod && selectedPaymentMethod.paymentReference === account.paymentReference }"
          >
            <template v-slot:label>
              <div class="d-flex" @click="setSegmentEvent(`Select ${account.method_name} payment method`)">
                <div class="d-flex justify-center method-icon rounded pa-1 mr-2" style="width: 55px;">
                  <v-img
                      v-if="account.method_name === 'Mobile Money'"
                      max-width="45"
                      :src="require('@/assets/mpesa-logo.png')"
                  ></v-img>
                  <v-icon v-if="account.method_name === 'Bank Transfer'">mdi-bank</v-icon>
                </div>
                <div class="d-flex flex-column method-text">
                  <div>{{ account.method_name }}</div>
                  <div>{{ account.bank_name }} | {{ hideSensitiveData(account.paymentReference) }}</div>
                </div>
              </div>
            </template>
          </v-radio>
        </section>
      </v-radio-group>
    </v-card-text>
    <v-card-actions class="d-flex flex-column px-4 pb-5">
      <v-btn
          block
          large
          type="submit"
          color="primary"
          class="caption font-weight-bold mb-4"
          :loading="loading"
          :disabled="disabled || loading"
      >
        {{ $t('finance.withdraw') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
          block
          large
          text
          class="caption font-weight-bold"
          @click="navigateBack"
      >
        {{ $t('finance.btn_back') }}
      </v-btn>
    </v-card-actions>
  </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"

export default {
  mixins: [segmentMixin, formatNumbers],

  props: {
    inputErrors: {
      type: Object,
      default: () => {}
    },
    amount: {
      type: String,
      default: () => '0'
    },
    currency: {
      type: String,
      default: () => ''
    },
    paymentMethods: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: () => false
    },
  },

  data() {
    return {
      disabled: true,
      withdrawAmount: null,
      selectedPaymentMethod: null,
      paymentOptions: [],
      phoneNumber: this.getUserPhoneNumber() || this.paymentMethods.mobile_money.phone_number,
      animationObject: {
        classes: 'slideInRight',
        delay: 0,
        duration: 300
      }
    }
  },

  watch: {
    amount (value) {
      this.withdrawAmount = this.formatAmountToNumber(value)
    },

    selectedPaymentMethod (value) {
      this.disabled = false
      const { payment_method, bankPaybill, paymentReference } = value
      const paymentData = {
        payment_method,
        bankPaybill,
        paymentReference
      }
      this.$emit('selectedPaymentMethod', paymentData)
    }
  },

  computed: {
    errors() {
      return this.inputErrors
    },

    mobileMoney() {
      return Object.keys(this.paymentMethods.mobile_money)
    },

    bankAccounts() {
      return this.paymentMethods.banks.bankAccounts
    }
  },

  methods: {
    getUserPhoneNumber () {
      const { phone } = auth.retrieve('partner')
      return phone
    },

    setPaymentOptions () {
       if (this.mobileMoney.length) {
         this.paymentOptions.push({
           payment_method: this.paymentMethods.mobile_money.payment_method,
           paymentReference: this.phoneNumber,
           status: true,
           method_name: 'Mobile Money'
         })
       }

       if (this.bankAccounts.length) {
         this.bankAccounts.forEach( bankAccount => {
           const { account_no, bank, status } = bankAccount
           this.paymentOptions.push({
             payment_method: this.paymentMethods.banks.payment_method,
             bankPaybill: bank.paybill,
             paymentReference: account_no,
             status,
             method_name: 'Bank Transfer',
             bank_name: bank.name
           })
         })
       }
    },

    hideSensitiveData (value) {
      if (!value) return '****'
      const valueArr = value.split('')
      return `**** ${valueArr.slice(-4).join('')}`
    },

    navigateBack () {
      this.setSegmentEvent('Navigate back to payment amount')
      this.$emit('proceed', false)
    }
  },

  mounted() {
    this.setPaymentOptions()
  }
}
</script>

<style lang="scss" scoped>
.method-text {
  & div:first-child {
    color: black;
  }
  & div {
    color: #83868C;
  }
}
.method-icon {
  border: 1px solid #D9D9D9;
  max-height: 50px;
  margin: auto;
  .v-icon {
    color: #314BAB;
  }
}
.v-radio {
  border: 1px solid #E2E7ED;
  padding: 16px;
  margin-bottom: 16px !important;
}
.v-card__actions {
  button {

  }
}
.active {
  border: 2px solid #314BAB;
}
</style>
