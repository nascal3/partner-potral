<template>
  <section v-animate-css="animationObject">

    <div v-if="!success" class="px-4 pt-4 mb-4">
      {{ $t('finance.insert_otp') }}
    </div>

    <v-spacer></v-spacer>

    <v-card-text class="py-0">
      <section v-if="!success">
        <div v-if="loading" class="d-flex align-center">
          <v-progress-circular
              indeterminate
              size="15"
              width="2"
              color="deep-orange"
              class="mr-2"
          ></v-progress-circular>
          <div class="deep-orange--text">
            {{ $t('verify.verifying_code') }}
          </div>
        </div>
        <v-otp-input
            length="6"
            class="body-2"
            persistent-hint
            v-model="paymentObj.code"
            :disabled="loading"
            :hint="errors.get('code')"
            :error="errors.has('code')"
            @input="errors.clear('code')"
            @finish="verifyCode()"
        ></v-otp-input>
        <div v-if="counter > 0">
          {{ $t('verify.time_to_expired') }}
          <span class="count-text">{{counter}} sec</span>
        </div>
      </section>

      <section v-else>
        <div class="message-container pa-4" :class="{'border-success': success }">
          <div class="message-container__text">
            <v-icon color="#116F28">mdi-check-circle</v-icon>
            <span :class="{'successful': success }">
              {{ create ? $t('finance.account_success') : $t('finance.account_update_success') }}
            </span>
          </div>
        </div>
      </section>
    </v-card-text>

    <v-card-actions v-if="!success" class="px-4">
      <p class="body-1">
        {{ $t('finance.passcode_expired') }}
        <span class="deep-orange--text" @click="navigateBack">
          {{ $t('verify.request_another_one') }}
        </span>
      </p>
    </v-card-actions>
  </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import timeCountDown from "@/mixins/timeCountDown";
import Payment from '@/libs/app/payments/Payment'
import {mapGetters} from "vuex";

export default {
  props: {
    accountDetails: {
      type: Object,
      default: () => {}
    },
    processType: {
      type: String,
      default: () => 'create'
    },
  },

  mixins: [segmentMixin, timeCountDown],

  data() {
    return {
      loading: false,
      disabled: true,
      success: false,
      paymentObj: new Payment(),
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
    ...mapGetters({
      savedPayoutAccounts: 'getSavedPayoutAccounts'
    }),

    create () {
      return this.processType === 'create'
    },

    errors() {
      return this.paymentObj.form.errors
    }
  },

  methods: {
    setCountDown () {
      const ExpiryTime = 5 * 60
      this.timeCountDown(ExpiryTime)
    },

    navigateBack () {
      this.setSegmentEvent('Navigate back to set payment details')
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
      }).finally(() => {
        this.loading = false
      })
    },

    verifyCode () {
      this.loading = true
      const {code} = auth.retrieve("country")
      const {email} = auth.retrieve("user")
      const action = this.create ? "adding" : "updating"
      this.paymentObj.countryCode = code
      this.paymentObj.email = email

      this.paymentObj.validateOTP().then(response => {
        this.setSegmentEvent(`Successful OTP validation for ${action} payout account`)
        const status = response.data.status
        flash({
          message: status ? this.$t('finance.otp_code_valid') : this.$t('finance.otp_code_invalid'),
          color: status ? 'green' : '#e74c3c'
        })
        if (status) this.create ? this.createAccount() : this.editAccount()
      }).catch(error => {
        this.setSegmentEvent(`Failed OTP validation for ${action} payout account`)
        flash({
          message: error.data.message,
          color: '#e74c3c'
        })
      }).finally(() => {
        this.loading = false
      })
    },

    setupNewAccountValues () {
      const {
        operator_id,
        operator_name,
        user_account_no,
        account_name,
        user_id,
        country_code
      } = this.accountDetails

      this.paymentObj.operator_id = operator_id
      this.paymentObj.operator_name = operator_name
      this.paymentObj.user_account_no = user_account_no
      this.paymentObj.operator_name = account_name
      this.paymentObj.userId = user_id
      this.paymentObj.countryCode = country_code
    },

    createAccount () {
      this.setupNewAccountValues()
      this.paymentObj.createPayoutAccount().then(response => {
        this.success = response.data.status
        this.setSegmentEvent('Successfully added a payout account ')
        this.loadPayoutAccounts()
        this.emit('closeDialog', true)
      }).catch(error => {
        this.setSegmentEvent('Failed to add a payout account ')
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    },

    editAccount () {
      this.setupNewAccountValues()
      const { account_id } = this.accountDetails
      this.paymentObj.editPayoutAccount(account_id).then(response => {
        this.success = response.data.status
        this.setSegmentEvent('Successfully updated a payout account ')
        this.loadPayoutAccounts()
        this.emit('closeDialog', true)
      }).catch(error => {
        this.setSegmentEvent('Failed to updated a payout account ')
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    }
  },

  mounted () {
    this.setCountDown()
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  &.border-success {
    //border: 1px solid #116F28;
  }

  &.border-fail {
    //border: 1px solid #9B101C;
  }

  &__text {
    text-align: center;
    .v-icon {
      margin-right: 5px;
      font-size: 25px;
    }
    span {
      &.successful {
        color: #116F28;
      }
      &.fail {
        color: #9B101C;
      }
    }
    font-size: 18px;
    font-weight: 700;
  }

  &__subtext {
    font-weight: 400;
    color: #909399;
    text-align: center;
  }
}
.v-card__actions {
  span {
    cursor: pointer;
  }
}
</style>
