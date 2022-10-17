<template>
  <v-row class="mt-5">
    <v-col
      cols="12"
      class="mb-n4"
    >
      <p class="mb-n2 body-1">
        {{ $t('generate.send_authentication_code') }}
      </p>

      <v-radio-group
        row
        mandatory
        persistent-hint
        v-model="authObj.identifier"
        @change="identifierTypeChangedEvent"
      >
        <v-radio
          v-for="(identifier, index) in authType"
          :key="`identifier-${index}`"
          :label="identifier.label"
          :value="identifier.value"
          class="body-1"
        ></v-radio>
      </v-radio-group>
    </v-col>

    <v-col cols="12">
      <div v-if="authObj.identifier == 'Email'">
        <p class="mb-1 body-1">
          {{ $t('generate.enter_your_email_address') }}
        </p>
        <v-text-field
            outlined
            persistent-hint
            class="body-1"
            placeholder="johndoe@knowhere.com"
            v-model="authObj.email"
            :hint="errors.get('email')"
            :error="errors.has('email')"
            @input="errors.clear('email')"
            @change="setSegmentEvent('Enter Login Email')"
        ></v-text-field>
      </div>

      <div class="mb-7" v-if="authObj.identifier == 'Phone'">
        <p class="mb-1 body-1">
          {{ $t('generate.login_phone_number') }}
        </p>
        <vue-tel-input
            v-model="authObj.phone"
            @input="errors.clear('phone')"
            @blur="setSegmentEvent('Enter Login Phone Number')"
            :onlyCountries="validCountries"
            :inputOptions="placeholder"
            styleClasses="loginPhoneInput"
            :class="{ 'input-error': errors.get('phone') }"
        ></vue-tel-input>
        <span class="input-error-message" v-if="errors.has('phone')">
          {{errors.get('phone')}}
        </span>
      </div>
    </v-col>

    <v-col cols="12">
      <v-btn
        block
        x-large
        color="primary"
        class="caption font-weight-bold"
        :dark="!loading"
        :loading="loading"
        :disabled="loading"
        @click="generateCode()"
      >
        {{ $t('generate.request_verification_code') }}
      </v-btn>
    </v-col>

    <v-col cols="12">
      <p class="body-1 text-center" @click="setSegmentEvent('Click Sign Up Link')">
        {{ $t('generate.dont_have_an_account') }}
        <router-link
          class="deep-orange--text"
          to="/auth/register"
        >
          {{ $t('generate.become_a_partner') }}
        </router-link>
      </p>
    </v-col>
    <v-col cols="12">
      <language-selector @setLanguage="setLanguage"/>
    </v-col>
  </v-row>
</template>

<script>
import Auth from "@/libs/auth/Auth"
import segmentMixin from "@/mixins/segmentEvents"
import timeCountDown from "@/mixins/timeCountDown"
import {mapActions, mapGetters} from "vuex";

export default {
  mixins: [segmentMixin, timeCountDown],

  data () {
    return {
      loading: false,
      authObj: new Auth(),
      validCountries: [],
      locale: localStorage.getItem('setLanguage'),
      placeholder: {
        placeholder: this.$t('register.phone_number'),
      },
      authType: [
        { label: 'Email', value: "Email"},
        { label: 'Phone', value: "Phone"}
      ]
    }
  },

  components: {
    'language-selector': () => import('@/views/layouts/LanguageSelector.vue')
  },

  watch: {
    countries() {
      this.setValidCountries()
    },

    locale() {
      this.$nextTick(() => {
        this.placeholder.placeholder = this.$t('register.phone_number')
        this.authType = [
          { label: `${this.$t('generate.email')}`, value: "Email"},
          { label: `${this.$t('generate.phone')}`, value: "Phone"}
        ]
      })
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries'
    }),

    errors () {
      return this.authObj.form.errors
    },

    contactMethod () {
      if (localStorage.getItem('sendy:contacts') === null) return null
      return JSON.parse(localStorage.getItem('sendy:contacts'))
    }
  },

  methods: {
    ...mapActions([
      'setCountries'
    ]),

    setLanguage(languageCode) {
      this.locale = languageCode
    },

    setValidCountries() {
      this.countries.data.map(country => {
        this.validCountries.push(country.code)
      })
    },

    destroyTempStorageValues() {
      localStorage.removeItem('sendy:contacts')
      this.removeCounterStorage()
    },

    identifierTypeChangedEvent() {
      const entity = this.authObj.identifier
      if (entity === 'Email') {
        this.setSegmentEvent('Select get OTP with Email')
      } else {
        this.setSegmentEvent('Select get OTP with Phone')
      }
    },

    generateCode () {
      if (!this.loading) {
        this.setSegmentEvent('Generate OTP')
        this.loading = true
        if (this.contactMethod) {
          const { phone, email } = this.contactMethod
          this.authObj.phone = phone
          this.authObj.email = email
        }
        const identifier = this.authObj.identifier.toLowerCase()
        this.authObj.identification_method = identifier
        if(this.authObj.identification_method === 'phone') this.authObj.phone = this.authObj.phone.replace(/\s/g,'')

        this.authObj.generate().then(() => {
          this.$router.push({ name: 'verify' })
        }).catch((error) => {
          flash({
            message: error.data.message,
            color: '#e74c3c',
          })
          this.loading = false
          this.authObj[identifier] = null
        }).finally(() => {
          this.loading = false
        })
      }
    },
  },

  mounted () {
    this.setCountries()
    this.destroyTempStorageValues()
    let identification = localStorage.getItem('sendy:identification')
    if (identification) {
      const { value, identifier } = JSON.parse(identification)
      this.authObj[identifier] = value
    }
  }
}
</script>

<style lang="scss">
.loginPhoneInput {
  border: solid 1px rgba(0, 0, 0, 0.38);
  padding: 3px 0;
  height: 56px;

  ::placeholder {
    font-size: 16px;
    opacity: .5;
  }
}
</style>
