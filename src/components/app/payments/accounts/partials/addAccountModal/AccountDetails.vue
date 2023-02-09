<template>
  <div>
    <app-loading v-if="!initialised" />
    <section v-else v-animate-css="animationObject">
      <div class="px-4 pt-2">
        {{ $t('finance.insert_account_details') }}
      </div>

      <v-card-text class="pt-5">

        <div v-if="bankMethod">
          <section v-if="!banksAvailability" class="bank-availability__error">
            {{ $t('finance.no_banks_available') }}
          </section>

          <section v-else>
            <div>
              <p class="mb-1 body-1">
                {{ $t('finance.select_bank') }}
              </p>
              <v-select
                  v-model="paymentObj.operator_id"
                  :error="errors.has('operator_id')"
                  :items="banks.data"
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
          </section>
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
import {mapActions, mapGetters} from "vuex"
// import mockBankData from '../../../../../../../tests/e2e/fixtures/payOutBanks.json'

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
      countries: 'getCountries',
      banks: 'getPayoutBanks'
    }),

    initialised () {
      return this.countries.data
    },

    banksAvailability() {
      return this.banks?.data?.length > 0
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
      return id
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
      const bankDetails = this.banks.data.filter(bank => bank.operator_id === this.paymentObj.operator_id)
      this.setSegmentEvent(`Set payout bank name to ${bankDetails[0].name} `)
      this.paymentObj.operator_name = bankDetails[0].name
    },

    setVariableValues() {
      this.setSegmentEvent('Proceed to insert "Add verification OTP"')
      this.paymentObj.user_id = this.userId
      this.paymentObj.country_code = this.countryCode

      if (!this.bankMethod) {
        // TODO make this value for mobile payments (operator_id) dynamic in the future
        this.paymentObj.operator_id = 1

        const { name } = this.paymentMethod
        this.paymentObj.operator_name = name
        this.paymentObj.account_name = 'N/A'
        return this.proceedToOTP()
      }
      this.proceedToOTP()
    },

    generateOTP() {
      this.paymentObj.country_code = this.countryCode
      this.paymentObj.email = this.userEmail
      return this.paymentObj.generateOTP().then(result => {
        flash({
          message: `${this.$t('finance.otp_sent')} ${this.userEmail}`,
          color: '#38c172',
        })
        return result.data.status
      }).catch( error => {
        flash({
          message: this.$t('finance.process_failed'),
          color: '#e74c3c',
        })
        return false
      })
    },

    proceedToOTP() {
      const status = this.generateOTP()
      if (!status) {
        return flash({
          message: this.$t('finance.process_failed'),
          color: '#e74c3c',
        })
      }

      const payload = {
        operator_id: this.paymentObj.operator_id ,
        operator_name: this.paymentObj.operator_name,
        user_account_no: this.paymentObj.user_account_no,
        account_name: this.paymentObj.account_name,
        user_id: this.userId,
        country_code: this.countryCode
      }

      this.$emit('accountValues', payload)
      this.$emit('proceed', true)
    }
  },

  mounted () {
    this.setCountries()
  }
}
</script>

<style lang="scss" scoped>
.bank-availability {
  &__error {
    color: #EE551A;
    font-weight: bold;
    text-align: center;
  }
}
.error-message {
  position: relative;
  color: #EE551A;
  bottom: 25px;
}
</style>
