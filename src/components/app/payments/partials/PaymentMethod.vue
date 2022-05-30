<template>
  <section v-animate-css="animationObject">
    <div class="d-flex justify-space-between pa-4">
      <div>{{ $t('finance.amount_label') }}</div>
      <div>
        <span>KES</span>
        {{ amount }}
      </div>
    </div>

    <v-divider class="mx-4"></v-divider>

    <div class="px-4 pt-4">
      {{ $t('finance.withdraw_method_question') }}
    </div>

    <v-card-text class="py-0">
      <v-radio-group v-model="paymentMethod">
        <v-radio value="mpesa" class="rounded-lg" :class="{ active: paymentMethod === 'mpesa' }">
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
                <div>**** 7659</div>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="bank" class="rounded-lg" :class="{ active: paymentMethod === 'bank' }">
          <template v-slot:label>
            <div class="d-flex" @click="setSegmentEvent('Select bank payment method')">
              <div class="d-flex justify-center method-icon rounded pa-1 mr-2" style="width: 55px;">
                <v-icon>mdi-bank</v-icon>
              </div>
              <div class="d-flex flex-column method-text">
                <div>Bank Transfer</div>
                <!--            TODO fetch partner bank number-->
                <div>ABSA | ****9098</div>
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
          :dark="!disabled"
          :disabled="disabled"
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
  },

  data() {
    return {
      disabled: true,
      withdrawAmount: null,
      paymentMethod: null,
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

    paymentMethod (value) {
      this.disabled = !value
      this.$emit('paymentMethod', value)
    }
  },

  computed: {
    errors() {
      return this.inputErrors
    }
  },

  methods: {
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
