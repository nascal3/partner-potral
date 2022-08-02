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
        <v-radio
            v-if="paymentOptions('mobile_money')"
            :value="paymentMethods.mobile_money.payment_method"
            class="rounded-lg"
            :class="{ active: selectedPaymentMethod === paymentMethods.mobile_money.paymentMethod }"
        >
          <template v-slot:label>
            <div class="d-flex" @click="setSegmentEvent('Select mpesa payment method')">
              <div class="method-icon rounded pa-1 mr-2">
                <v-img
                    max-width="45"
                    :src="require('@/assets/mpesa-logo.png')"
                ></v-img>
              </div>
              <div class="d-flex flex-column method-text">
                <div>M-PESA</div>
                <!--            TODO fetch partner mobile number-->
                <div>{{ hideSensitiveData(phoneNumber) }}</div>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio
            v-if="paymentOptions('banks')"
            :value="paymentMethods.banks.payment_method"
            class="rounded-lg"
            :class="{ active: selectedPaymentMethod === paymentMethods.banks.paymentMethod }"
        >
          <template v-slot:label>
            <div class="d-flex" @click="setSegmentEvent('Select bank payment method')">
              <div class="d-flex justify-center method-icon rounded pa-1 mr-2" style="width: 55px;">
                <v-icon>mdi-bank</v-icon>
              </div>
              <div class="d-flex flex-column method-text">
                <div>Bank Transfer</div>
                <div>
                  {{ bankName }} | {{ hideSensitiveData(bankAccountNumber) }}
                </div>
              </div>
            </div>
          </template>
        </v-radio>
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
import split from "split";

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
      paymentReference: null,
      phoneNumber: this.getUserPhoneNumber() || this.paymentMethods.mobile_money.phone_number,
      bankName: this.paymentMethods.banks.bankAccounts[0].bank.name,
      bankAccountNumber: this.paymentMethods.banks.bankAccounts[0].account_no,
      bankPaybill: this.paymentMethods.banks.bankAccounts[0].bank.paybill,
      animationObject:{
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
      this.disabled = !value
      const paymentData = {
        payment_method: value,
        bankPaybill: this.bankPaybill,
        paymentReference: this.setPaymentReference(value)
      }
      this.$emit('selectedPaymentMethod', paymentData)
    }
  },

  computed: {
    errors() {
      return this.inputErrors
    }
  },

  methods: {
    paymentOptions (paymentType) {
      const paymentOptions = Object.keys(this.paymentMethods)
      return paymentOptions.includes(paymentType)
    },

    setPaymentReference (paymentType) {
      if (!paymentType) return null
      if (paymentType === 1) return this.phoneNumber
      else if (paymentType === 2) return this.bankAccountNumber
      else return null
    },

    getUserPhoneNumber () {
      const { phone } = auth.retrieve('user')
      return phone
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
