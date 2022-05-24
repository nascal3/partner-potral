<template>
  <section>
    <div class="d-flex justify-space-between pa-4">
      <div>Amount</div>
      <div>
        <span>KES</span>
        {{ amount }}
      </div>
    </div>

    <v-divider class="mx-4"></v-divider>

    <div class="px-4 pt-4">
      {{ $t('finance.withdraw_method_question') }}
    </div>

    <v-card-text class="pt-0">
      <v-radio-group v-model="paymentMethod">
        <v-radio value="mpesa">
          <template v-slot:label>
            <div class="d-flex">
              <div class="method-icon pa-1 mr-2">
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
        <v-radio value="bank">
          <template v-slot:label>
            <div class="d-flex">
              <div class="d-flex justify-center method-icon pa-1 mr-2" style="width: 55px;">
                <v-icon
                >
                  mdi-bank
                </v-icon>
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
    <v-card-actions class="px-4 pb-5">
      <v-btn
          block
          large
          type="submit"
          color="primary"
          class="caption font-weight-bold"
          :dark="!disabled"
          :disabled="disabled"
      >
        {{ $t('finance.withdraw') }}
      </v-btn>
    </v-card-actions>
  </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";
import formatNumbers from "@/mixins/formatNumbers";

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
      paymentMethod: null
    }
  },

  watch: {
    amount (value) {
      this.withdrawAmount = this.formatAmountToNumber(value)
    },

    paymentMethod (value) {
      this.disabled = !value
    }
  },

  computed: {
    errors() {
      return this.inputErrors
    }
  },

  methods: {

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
  border-radius: 5px;
}
.v-radio {
  border: 1px solid #E2E7ED;
  padding: 16px;
  border-radius: 5px;
  margin-bottom: 16px !important;
}
</style>
