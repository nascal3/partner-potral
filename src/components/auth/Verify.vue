<template>
  <section class="d-flex justify-center">
    <v-card
        max-width="500"
        outlined
        flat
    >
      <v-row>
        <v-col cols="12">
          <p class="body-1 pb-0">
            {{ $t('verify.title') }} {{ preferredLoginMethod }}
          </p>
        </v-col>

        <v-col
            cols="12"
        >
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
              length="4"
              class="body-2"
              persistent-hint
              v-model="authObj.code"
              :hint="errors.get('code')"
              :error="errors.has('code')"
              @input="errors.clear('code')"
              @finish="verifyCode()"
          ></v-otp-input>
          <div v-if="counter > 0">
            {{ $t('verify.time_to_expired') }}
            <span class="count-text">{{counter}} sec</span>
          </div>
        </v-col>

        <v-col cols="12">
          <p class="body-1">
            {{ $t('verify.passcode_expired') }}
            <router-link
                class="deep-orange--text"
                to="/auth/generate"
            >
              {{ $t('verify.request_another_one') }}
            </router-link>
          </p>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>

<script>
import Auth from "@/libs/auth/Auth"
import segmentMixin from "@/mixins/segmentEvents";
import timeCountDown from "@/mixins/timeCountDown";

export default {
  mixins: [segmentMixin, timeCountDown],

  data () {
    return {
      loading: false,
      authObj: new Auth()
    }
  },

  computed: {
    errors () {
      return this.authObj.form.errors
    },

    contactMethod() {
      if (localStorage.getItem('sendy:contacts') === null) return null
      return JSON.parse(localStorage.getItem('sendy:contacts'))
    },

    identification () {
      return JSON.parse(localStorage.getItem('sendy:identification'))
    },

    hasPendingContract() {
      return JSON.parse(localStorage.getItem('sendy:partner')).partner.has_pending_contracts
    },

    preferredLoginMethod () {
      let loginMethod = null
      loginMethod = this.contactMethod
          ? this.contactMethod.identification_method
          : this.identification.identifier

      return loginMethod === 'phone'
          ? this.$t('verify.preferred_login_phone')
          : this.$t('verify.preferred_login_email')
    }
  },

  methods: {
    setCountDown () {
      const ExpiryTime = JSON.parse(localStorage.getItem('otpExpiry'))
      this.timeCountDown(ExpiryTime)
    },

    verifyCode () {
      this.setSegmentEvent('Enter Log In OTP')
      this.loading = true
      const { identifier, value } = this.identification
      this.authObj[identifier] = value
      this.authObj.identification_method = identifier

      this.authObj.verify().then(({ data }) => {
        localStorage.removeItem('sendy:identification')
        localStorage.removeItem('sendy:contacts')

        this.authObj.encrypt({
          ..._.omit(data, ['type']),
          ...({ partner: data.partner })
        })
        this.setSegmentIdentity(data)

        this.authObj.abilities().then(() => {
          this.removeCounterStorage()
          if (this.hasPendingContract) return this.$router.push({ name: 'contract' })
          this.$router.push({ name: 'orders.index' })
        })
      }).catch(({ data, status }) => {
        const codes = [400, 404, 409, 500]
        if (codes.includes(status)) {
          flash({
            message: data.message,
            timeout: 5000,
            color: '#e74c3c',
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
  },

  mounted () {
    this.setCountDown()
  }
}
</script>

<style lang="scss" scoped>
.count-text {
  color: #324BAB;
}

section {
  .v-card {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 40px 40px 40px;
  }
}
</style>
