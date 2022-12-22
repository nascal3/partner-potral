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
            <span :class="{'successful': success }">{{ $t('finance.account_success') }}</span>
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

export default {
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

    verifyCode () {
      this.loading = true
      this.paymentObj.verify().then(data => {
        this.setSegmentEvent('Successfully added a payout account ')
        this.success = true
        // TODO: run method to fetch payout account in order to refresh table data

        setTimeout(() =>{
          this.emit('closeDialog', true)
        }, 2500)
      }).catch(error => {
        this.setSegmentEvent('Failed to add a payout account ')
        console.log(error)
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
