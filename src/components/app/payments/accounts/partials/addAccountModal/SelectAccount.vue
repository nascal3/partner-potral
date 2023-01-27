<template>
  <section v-animate-css="animationObject">

    <div class="px-4 pt-4">
      {{ $t('finance.select_payout_method') }}
    </div>

    <app-loading v-if="loading"/>
    <v-card-text class="py-0">
      <v-radio-group v-model="selectedPaymentMethod">
        <section v-if="paymentMethods && paymentMethods.length">
          <v-radio
              v-for="(method, index) in paymentMethods"
              :key="index"
              :value="method"
              class="rounded-lg"
              :class="{ active: selectedPaymentMethod?.payment_method_id === method.payment_method_id }"
              @click="setSegmentEvent(`Select ${method.name} payout method`)"
          >
            <template v-slot:label>
              <div class="d-flex">
                <div class="d-flex justify-center method-icon rounded pa-1 mr-2" style="width: 55px;">
                  <v-img
                      v-if="method.category.toLowerCase() === 'mobile'"
                      max-width="45"
                      :src=" method.localised_names === 'M-PESA' ? mpesaLogo :mobileMoneyLogo"
                  ></v-img>
                  <v-icon v-if="method.name === 'Bank'">mdi-bank</v-icon>
                </div>
                <div class="d-flex flex-column method-text">
                  <div>{{ method.category }}</div>
                  <div>{{ selectDisplayText(method.localised_names) }}</div>
                </div>
              </div>
            </template>
          </v-radio>
        </section>
      </v-radio-group>
    </v-card-text>
  </section>
</template>

<script>
import Payment from '@/libs/app/payments/Payment'
import segmentMixin from "@/mixins/segmentEvents"
// import mockData from '../../../../../../../tests/e2e/fixtures/payOutMethods.json'

export default {
  mixins: [segmentMixin],

  data() {
    return {
      disabled: true,
      loading: true,
      paymentObj: new Payment(),
      mpesaLogo: require('@/assets/mpesa-logo.png'),
      mobileMoneyLogo: require('@/assets/mobile-money-logo.jpeg'),
      selectedPaymentMethod: null,
      locale: localStorage.getItem('setLanguage'),
      paymentMethods: [],
      animationObject:{
        classes: 'slideInRight',
        delay: 0,
        duration: 300
      }
    }
  },

  watch: {
    selectedPaymentMethod (value) {
      this.$emit('selectedPaymentMethod', value)
    }
  },

  methods: {
    loadPayoutMethods() {
      const {code} = auth.retrieve("country")
      this.paymentObj.showPaymentMethods(code)
          .then(response =>{
            this.paymentMethods = response.data.payment_methods
          })
          .catch((error) => {
            flash({
              message: error.response.data.message,
              color: "#e74c3c",
            });
          })
          .finally(() => {
            this.loading = false
          })
    },

    selectDisplayText (value) {
      if (!value) return ''
      try {
        const nameObj = JSON.parse(value)
        return nameObj[this.locale]
      } catch (e) {
        return value
      }
    }
  },

  mounted() {
    this.loadPayoutMethods()
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
