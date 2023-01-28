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
    <app-loading v-if="!initialised"/>

    <v-card-text class="py-0">
      <v-radio-group v-model="selectedPaymentMethod">
        <section v-if="paymentOptions?.length">
          <v-radio
              v-for="method in paymentOptions"
              :key="method.operator_id"
              :value="method"
              class="rounded-lg"
              :class="{ active: selectedPaymentMethod?.operator_id === method.operator_id }"
              @click="setSegmentEvent(`Select ${method.operator_name} payment method`)"
          >
            <template v-slot:label>
              <div class="d-flex">
                <div class="d-flex justify-center method-icon rounded pa-1 mr-2" style="width: 55px;">
                  <v-img
                      v-if="method.category.trim().toLowerCase() === 'mobile money'"
                      max-width="45"
                      :src="method.operator_name.trim().toLowerCase() === 'm-pesa' ? mpesaLogo :mobileMoneyLogo"
                  ></v-img>
                  <v-icon v-if="method.category.trim().toLowerCase() === 'bank'">mdi-bank</v-icon>
                </div>
                <div class="d-flex flex-column method-text">
                  <div>{{ method.operator_name }}</div>
                  <div>{{ selectDisplayText(method.category) }} | {{ hideSensitiveData(method.user_account_no) }}</div>
                </div>
              </div>
            </template>
          </v-radio>
        </section>
        <section v-if="initialised && !paymentOptions?.length" class="missing-method">
          <div>No accounts found!</div>
          <div>Please add payout accounts <span @click="goToAccounts">here</span>.</div>
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
import Payment from '@/libs/app/payments/Payment'
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import {mapActions, mapGetters} from 'vuex'
// import mockData from '../../../../../tests/e2e/fixtures/savePayoutMethods.json'

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
      paymentObj: new Payment(),
      mpesaLogo: require('@/assets/mpesa-logo.png'),
      mobileMoneyLogo: require('@/assets/mobile-money-logo.jpeg'),
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
      const { pay_method_id, operator_name, operator_id, user_account_no } = value
      const paymentData = {
        payment_method: pay_method_id,
        operator_name,
        operator_id,
        user_account_no
      }
      this.$emit('selectedPaymentMethod', paymentData)
    }
  },

  computed: {
    ...mapGetters({
      savedPayoutAccounts: 'getSavedPayoutAccounts'
    }),

    initialised() {
      return this.savedPayoutAccounts?.data
    },

    paymentOptions() {
      if (this.initialised) return this.savedPayoutAccounts.data
      return []
    },

    errors() {
      return this.inputErrors
    }
  },

  methods: {
    ...mapActions([
      "setSavedPayoutAccounts"
    ]),

    hideSensitiveData (value) {
      if (!value) return '****'
      const valueArr = value.split('')
      return `**** ${valueArr.slice(-4).join('')}`
    },

    selectDisplayText (value) {
      if (!value) return ''
      try {
        const nameObj = JSON.parse(value)
        return nameObj[this.locale]
      } catch (e) {
        return value
      }
    },

    goToAccounts () {
      this.$router.push({ name: 'accounts.index' })
    },

    navigateBack () {
      this.setSegmentEvent('Navigate back to payment amount')
      this.$emit('proceed', false)
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
      })
    }
  },

  mounted() {
    this.loadPayoutAccounts()
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
.missing-method {
  div:first-child {
    font-size: 16px;
    font-weight: 700;
    color: #e74c3c;
  }

  div span {
    color: #314BAB;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
