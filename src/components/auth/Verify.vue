<template>
  <v-row>
    <v-col cols="12">
      <p class="body-1 pb-0">
        {{ $t('verify.title') }} {{ identification.identifier }}
      </p>
    </v-col>

    <v-col
      cols="12"
    >
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
      <div v-if="counter <= 0">
        {{ $t('verify.time_to_expired') }}
        <span class="primary">{{counter}}</span> sec
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
</template>

<script>
import Auth from "@/libs/auth/Auth"
import segmentMixin from "@/mixins/segmentEvents";
import timeCountDown from "@/mixins/timeCountDown";

export default {
  mixins: [segmentMixin, timeCountDown],
  data () {
    return {
      authObj: new Auth()
    }
  },

  computed: {
    errors () {
      return this.authObj.form.errors
    },

    identification () {
      return JSON.parse(localStorage.getItem('sendy:identification'))
    },

    counter () {
      return JSON.parse(localStorage.getItem('otpExpiry')) || 0
    }
  },

  watch: {
    counter(newValue) {
      console.log('count: ', newValue)
    }
  },

  methods: {
    setCountDown () {
      const ExpiryTime = JSON.parse(localStorage.getItem('otpExpiry'))
      this.timeCountDown(ExpiryTime)
    },

    verifyCode () {
      this.setSegmentEvent('Enter OTP')
      const { identifier, value } = this.identification
      this.authObj[identifier] = value
      this.authObj.verify().then(({ data }) => {
        localStorage.removeItem('sendy:identification')
        localStorage.removeItem('otpExpiry')

        this.authObj.encrypt({
          ..._.omit(data, ['type']),
          ...({ partner: data.partner })
        })
        this.setSegmentIdentity(data)

        this.authObj.abilities().then(() => {
          this.$router.push({ name: 'orders.index' })
        })
      }).catch(({ data, status }) => {
        const codes = [400, 404, 409, 500]
        if (codes.includes(status)) {
          flash({
            message: data.message,
            timeout: 100000,
            color: '#e74c3c',
          })
        }
      }).finally()
    },
  },

  mounted () {
    this.setCountDown()
  }
}
</script>
