<template>
  <div>
    <app-loading v-if="!initialised" />
    <section v-else v-animate-css="animationObject">
      <div class="px-4 pt-2">
        {{ $t('finance.insert_account_details') }}
      </div>

      <v-card-text class="pt-5">

        <div v-if="bankMethod">
          <div>
            <p class="mb-1 body-1">
              {{ $t('finance.select_bank') }}
            </p>
            <v-select
                v-model="paymentObj.operator_id"
                :error="errors.has('operator_id')"
                :items="banks"
                :messages="errors.get('operator_id')"
                item-text="name"
                item-value="operator_id"
                :placeholder="$t('finance.select_bank')"
                outlined
                dense
                @input="errors.clear('operator_id')"
                @change="setOperatorName"
            ></v-select>
          </div>

          <div>
            <p class="mb-1 body-1">
              {{ $t('finance.account_name') }}
            </p>
            <v-text-field
                v-model="paymentObj.account_name"
                class="body-2"
                :placeholder="$t('finance.account_name')"
                :hint="errors.get('account_name')"
                :error="errors.has('account_name')"
                @input="errors.clear('account_name')"
                @change="setSegmentEvent('Enter account name')"
                dense
                outlined
                persistent-hint
            ></v-text-field>
          </div>

          <div>
            <p class="mb-1 body-1">
              {{ $t('finance.account_number') }}
            </p>
            <v-text-field
                v-model="paymentObj.user_account_no"
                class="body-2"
                :placeholder="$t('finance.account_number')"
                :hint="errors.get('user_account_no')"
                :error="errors.has('user_account_no')"
                @input="errors.clear('user_account_no')"
                @change="setSegmentEvent('Enter payout account number')"
                dense
                outlined
                persistent-hint
            ></v-text-field>
          </div>
        </div>

        <div v-if="!bankMethod">
          <p class="mb-1 body-1">
            {{ $t('register.phone_number') }}
          </p>
          <vue-tel-input
              v-model="paymentObj.user_account_no"
              @input="errors.clear('user_account_no')"
              @blur="setSegmentEvent('Enter payout phone Number')"
              :onlyCountries="onlyCountries"
              :inputOptions="placeholder"
              styleClasses="registerPhoneInput"
              :class="{ 'input-error': errors.get('user_account_no') }"
          ></vue-tel-input>
          <span class="input-error-message" v-if="errors.has('user_account_no')">
          {{errors.get('user_account_no')}}
        </span>
        </div>

      </v-card-text>
      <v-card-actions class="d-flex flex-column px-4 pb-5">
        <v-btn
            block
            large
            color="primary"
            class="caption font-weight-bold"
            :dark="!disabled"
            :disabled="disabled"
            @click="setVariableValues"
        >
          {{ $t('finance.continue') }}
        </v-btn>
        <v-btn
            block
            large
            text
            class="caption font-weight-bold ml-0 mt-2"
            @click="navigateBack"
        >
          {{ $t('finance.btn_back') }}
        </v-btn>
      </v-card-actions>
    </section>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import formatNumbers from "@/mixins/formatNumbers"
import Payment from '@/libs/app/payments/Payment'
import mockBankData from '../../../../../../../tests/e2e/fixtures/payOutBanks.json'
import {mapActions, mapGetters} from "vuex";

export default {
  mixins: [segmentMixin, formatNumbers],

  props: {
    paymentMethod: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      loading: false,
      validCountries: [],
      paymentObj: new Payment(),
      banks: [],
      locale: localStorage.getItem('setLanguage'),
      placeholder: {
        placeholder: this.$t('register.phone_number'),
      },
      animationObject:{
        classes: 'slideInRight',
        delay: 0,
        duration: 300
      }
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries'
    }),

    initialised () {
      return this.countries.data
    },

    onlyCountries () {
      return this.countries.data.map(({ code }) => code)
    },

    bankMethod () {
      return this.paymentMethod.category.toLowerCase() === 'bank'
    },

    disabled () {
      if (this.bankMethod) return !this.paymentObj.user_account_no || !this.paymentObj.account_name || !this.paymentObj.operator_id
      return !this.paymentObj.user_account_no
    },

    countryCode() {
      const { code } = auth.retrieve('country')
      return code.toUpperCase()
    },

    userId() {
      const { id } = auth.retrieve('partner')
      return `p_${id}`
    },

    userEmail() {
      const { email } = auth.retrieve('user')
      return email
    },

    errors() {
      return this.paymentObj.form.errors
    }
  },

  methods: {
    ...mapActions([
      'setCountries'
    ]),

    navigateBack () {
      this.setSegmentEvent('Navigate back to select account')
      this.$emit('navigateBack', true)
    },

    setOperatorName() {
      const bankDetails = this.banks.filter(bank => bank.operator_id === this.paymentObj.operator_id)
      this.setSegmentEvent(`Set payout bank name to ${bankDetails[0].name} `)
      this.paymentObj.operator_name = bankDetails[0].name
    },

    getBankAccounts() {
      //TODO: Add code to call endpoint with request for banks available
      this.banks = mockBankData
    },

    setVariableValues() {
      this.setSegmentEvent('Proceed to insert add account OTP')
      this.paymentObj.user_id = this.userId
      this.paymentObj.country_code = this.countryCode

      if (!this.bankMethod) {
        const { name } = this.paymentMethod
        this.paymentObj.operator_name = name
        // TODO make this value for mobile payments (operator_id) dynamic in the future
        this.paymentObj.operator_id = 1
        return this.proceedToOTP()
      }
      this.proceedToOTP()
    },

    generateOTP() {
      this.paymentObj.company_code = `FF${this.countryCode}`
      this.paymentObj.email = this.userEmail
      //TODO: Add code to send the OTP request to endpoint

      return true
    },

    proceedToOTP() {
      const status = this.generateOTP()
      if (!status) {
        return flash({
          message: 'An error occurred. Please try again',
          color: '#e74c3c',
        })
      }

      this.$emit('proceed', true)
    }
  },

  mounted () {
    this.getBankAccounts()
    this.setCountries()
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
