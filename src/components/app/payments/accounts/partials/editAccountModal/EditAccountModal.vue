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
          @click="setSegmentEvent(`Select update account: ${selectedAccount.operator_name} - ${selectedAccount.user_account_no}`)"
          outlined
          block
      >
        {{ $t('finance.edit_details') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <h2 class="subtitle-1">
          {{ $t('finance.edit_details') }}
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

      <v-card-text v-if="!proceed" class="pt-5" v-animate-css="animationObject">
        <div v-if="bankMethod">
          <div>
            <p class="mb-1 body-1">
              {{ $t('finance.select_bank') }}
            </p>
            <v-text-field
                v-model="paymentObj.operator_name"
                class="body-2"
                :placeholder="$t('finance.account_name')"
                disabled
                dense
                outlined
            ></v-text-field>
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
                @change="setSegmentEvent('Enter updated account name')"
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
                @change="setSegmentEvent('Enter updated payout account number')"
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
              @blur="setSegmentEvent('Enter updated payout phone Number')"
              :onlyCountries="validCountries"
              :inputOptions="placeholder"
              styleClasses="registerPhoneInput"
              :class="{ 'input-error': errors.get('user_account_no') }"
          ></vue-tel-input>
          <span class="input-error-message" v-if="errors.has('user_account_no')">
          {{errors.get('user_account_no')}}
        </span>
        </div>
      </v-card-text>

      <!--      #### Modal to insert OTP needed to save details ###-->
      <get-otp
          v-if="proceed"
          :process-type="'update'"
          :account-details="updatedAccountValues"
          @proceed="proceedToOTP"
          @closeDialog="closeDialog"
      />

      <v-card-actions v-if="!proceed" class="d-flex flex-column px-4 pb-5">
        <v-btn
            color="primary"
            class="caption my-3"
            :disabled="loading"
            :loading="loading"
            :dark="!loading"
            @click="updateAccount"
            large
            block
        >
          {{ $t('finance.update_account') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Payment from '@/libs/app/payments/Payment'
import segmentMixin from "@/mixins/segmentEvents"

export default {
  props: {
    selectedAccount: {
      type: Object,
      default: () => {}
    },
  },

  mixins: [segmentMixin],

  components: {
    'get-otp': () => import('../../partials/GetOTP.vue')
  },

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      validCountries: [],
      proceed: false,
      updatedAccountValues: {},
      paymentObj: new Payment(),
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

  watch: {
    countries() {
      this.setValidCountries()
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries'
    }),

    initialised () {
      return Object.keys(this.selectedAccount).length > 0
    },

    onlyCountries () {
      return this.countries.data.map(({ code }) => code)
    },

    bankMethod () {
      return this.selectedAccount.category.toLowerCase() === 'bank'
    },

    countryCode() {
      const { code } = auth.retrieve('country')
      return code.toUpperCase()
    },

    userEmail() {
      const { email } = auth.retrieve('user')
      return email
    },

    disabled () {
      if (this.bankMethod) return !this.paymentObj.user_account_no || !this.paymentObj.account_name
      return !this.paymentObj.user_account_no
    },

    errors() {
      return this.paymentObj.form.errors
    }
  },

  methods: {
    setValidCountries() {
      this.countries.data.map(country => {
        this.validCountries.push(country.code)
      })
    },

    fillCurrentValues () {
      const { operator_name, account_name, user_account_no } = this.selectedAccount
      this.paymentObj.user_account_no = user_account_no
      this.paymentObj.operator_name = operator_name
      if (this.bankMethod) this.paymentObj.account_name = account_name
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

    updateAccount () {
      const status = this.generateOTP()
      if (!status) {
        return flash({
          message: this.$t('finance.process_failed'),
          color: '#e74c3c',
        })
      }

      this.proceed = true
      this.updatedAccountValues = {
        account_id: this.selectedAccount.id,
        user_account_no: this.paymentObj.user_account_no,
        account_name: this.paymentObj.account_name,
        operator_name: this.paymentObj.operator_name
      }
    },

    proceedToOTP (proceedStatus) {
      this.proceed = proceedStatus
    },

    closeDialog() {
      this.proceed = false
      this.dialogLaunch = false
    }
  },

  mounted () {
    this.fillCurrentValues()
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  &__text {
    div {
      //font-size: 15px;
    }
  }
  &__actions {
    button {

    }
  }
}

</style>
