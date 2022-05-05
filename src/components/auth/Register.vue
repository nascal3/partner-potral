<template>
  <v-card flat>
    <v-card-text class="px-0">
      <div>
        <p class="mb-n4 mt-5 body-1">
          {{ $t('register.business_model') }}
        </p>
        <v-radio-group
          row
          v-model="authObj.legal_entity_type"
          @change="entityTypeChangedEvent"
        >
          <v-radio
            v-for="(ofType, index) in entityType"
            :key="`entity-${index}`"
            :label="ofType.label"
            :value="ofType.value"
            class="body-1"
          ></v-radio>
        </v-radio-group>
      </div>

      <div>
        <p class="mb-1 body-1">
          {{ $t('register.country_of_operation') }}
        </p>
        <v-select
          dense
          outlined
          class="body-1"
          persistent-hint
          item-value="id"
          item-text="name"
          :items="countries.data"
          v-model="authObj.country_id"
          :hint="errors.get('country_id')"
          :error="errors.has('country_id')"
          @input="errors.clear('country_id')"
          @change="setSegmentEvent('Select Country of Operation')"
        ></v-select>
      </div>

      <div v-if="authObj.legal_entity_type == 'Company'">
        <p class="mb-1 body-1">
          {{ $t('register.business_name') }}
        </p>
        <v-text-field
          dense
          outlined
          persistent-hint
          class="body-1"
          placeholder="Knowhere logistics"
          v-model="authObj.business_name"
          :hint="errors.get('business_name')"
          :error="errors.has('business_name')"
          @input="errors.clear('business_name')"
          @change="setSegmentEvent('Enter Business Name')"
        ></v-text-field>
      </div>

      <div>
        <p class="mb-1 body-1">
          {{ $t('register.your_full_name') }}
        </p>
        <v-text-field
          dense
          outlined
          persistent-hint
          class="body-1"
          placeholder="John Doe"
          v-model="authObj.administrator.name"
          :hint="errors.get('administrator.name')"
          :error="errors.has('administrator.name')"
          @input="errors.clear('administrator.name')"
          @change="setSegmentEvent('Enter Full Name')"
        ></v-text-field>
      </div>

      <div class="mb-7">
        <p class="mb-1 body-1">
          {{ $t('register.phone_number') }}
        </p>
        <vue-tel-input
            v-model="authObj.administrator.phone"
            @input="errors.clear('administrator.phone')"
            @blur="setSegmentEvent('Enter Register Phone Number')"
            :onlyCountries="validCountries"
            :inputOptions="placeholder"
            styleClasses="registerPhoneInput"
        ></vue-tel-input>
        <span class="error-message" v-if="errors.has('administrator.phone')">
          {{errors.get('administrator.phone')}}
        </span>
      </div>

      <div>
        <p class="mb-1 body-1">
          {{ $t('register.email_address') }}
        </p>
        <v-text-field
          dense
          outlined
          persistent-hint
          class="body-1"
          placeholder="johndoe@knowhere.com"
          v-model="authObj.administrator.email"
          :hint="errors.get('administrator.email')"
          :error="errors.has('administrator.email')"
          @input="errors.clear('administrator.email')"
          @change="setSegmentEvent('Enter Email Address')"
        ></v-text-field>
      </div>


    </v-card-text>

    <v-card-actions class="px-0">
      <v-btn
        block
        x-large
        color="primary"
        class="caption font-weight-bold"
        type="submit"
        :dark="!loading"
        :loading="loading"
        :disabled="loading"
        @click="submit"
      >
        {{ $t('register.register_account') }}
      </v-btn>
    </v-card-actions>

    <div>
      <p class="body-1 mt-4 text-center">
        {{ $t('register.already_registered') }}
        <router-link
          class="deep-orange--text"
          to="/auth/generate"
        >
          {{ $t('register.sign_in') }}
        </router-link>
      </p>
    </div>

    <v-col cols="12">
      <language-selector @setLanguage="setLanguage" />
    </v-col>
  </v-card>
</template>

<script>
import Auth from "@/libs/auth/Auth"
import { mapActions, mapGetters } from 'vuex'
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

  data () {
    return {
      country: null,
      validCountries: [],
      loading: false,
      locale: localStorage.getItem('setLanguage'),
      placeholder: {
        placeholder: this.$t('register.phone_number'),
      },
      entityType: [
        { label: 'Individual', value: "Individual"},
        { label: 'Company', value: "Company"}
      ],
      authObj: new Auth()
    }
  },

  components: {
    'language-selector': () => import('@/views/layouts/LanguageSelector.vue')
  },

  watch: {
    country (country) {
      this.authObj.country_id = country.id
    },

    countries() {
      this.setValidCountries()
    },

    locale() {
     this.$nextTick(() => {
       this.placeholder.placeholder = this.$t('register.phone_number')
       this.entityType = [
         { label: `${this.$t('register.individual')}`, value: "Individual"},
         { label: `${this.$t('register.company')}`, value: "Company"}
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
  },

   methods: {
     ...mapActions([
       'setCountries'
     ]),

     setLanguage(languageCode) {
       this.locale = languageCode
     },

     entityTypeChangedEvent() {
       const entity = this.authObj.legal_entity_type
       if (entity === 'Company') {
         this.setSegmentEvent('Select Company')
       } else {
         this.setSegmentEvent('Select Individual')
       }
     },

     setValidCountries() {
       this.countries.data.map(country => {
         this.validCountries.push(country.code)
       })
     },

    submit () {
      this.setSegmentEvent('Submit Registration Information')
      if (!this.loading) {
        this.loading = true
        if (this.authObj.administrator.phone !== null) this.authObj.administrator.phone = this.authObj.administrator.phone.replace(/\s/g,'')
        this.authObj.register()
          .then(() => {
            this.authObj.generate().then(() => {
              this.$router.push({ name: 'verify' })
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },

  mounted () {
    this.setCountries()
  }
}
</script>

<style lang="scss">
.registerPhoneInput {
  border: solid 1px rgba(0, 0, 0, 0.38);
  padding: 3px 0;

  ::placeholder {
    font-size: 16px;
    opacity: .5;
  }
}
.error-message {
  color: #EE551A;
}
</style>
