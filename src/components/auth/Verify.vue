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

export default {
  mixins: [segmentMixin],
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
    }
  },

  methods: {
    verifyCode () {
      this.setSegmentEvent('Enter OTP')
      const { identifier, value } = this.identification
      this.authObj[identifier] = value
      this.authObj.verify().then(({ data }) => {
        localStorage.removeItem('sendy:identification')
        const isSolo = true

        this.authObj.encrypt({
          ..._.omit(data, ['type']),
          ...(isSolo && {
            partner: data.partner
          })
        })
        this.setSegmentIdentity(data)

        if (isSolo) {
          this.authObj.abilities().then(() => {
            this.$router.push({ name: 'orders.index' })
          })
        } else {
          this.$router.push({ name: 'accounts' })
        }
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
}
</script>
