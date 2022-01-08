<template>
  <v-row>
    <v-col cols="12">
      <p class="body-1 pb-0">
        For secure authentication, please enter the verification code we have sent to your {{ identification.identifier }}
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
        Passcode expired? 
        <router-link
          class="deep-orange--text"
          to="/auth/generate"
        >
          Request another one
        </router-link>
      </p>
    </v-col>
  </v-row>
</template>

<script>
import Auth from "@/libs/auth/Auth"

export default {
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
      const { identifier, value } = this.identification
      this.authObj[identifier] = value
      this.authObj.verify().then(({ data }) => {
        localStorage.removeItem('sendy:identification')
        const isSolo = data.partners.length == 1
        this.authObj.encrypt({
          ..._.omit(data, ['type']),
          ...(isSolo && { 
            partner: data.partners[0]
          })
        })
        const redirectTo = isSolo ? 'app-dashboard' : 'accounts'
        this.$router.push({ name: redirectTo })
      }).catch(({ data, status }) => {
        const codes = [400, 404, 409, 500]
        if (codes.includes(status)) {
          flash({
            message: data.message,
            color: '#e74c3c',
          })
        }
      }).finally()
    },
  },
}
</script>