<template>
  <v-row class="mt-5">
    <!-- <v-col
      cols="12"
      class="mb-n4"
    >
      <p class="mb-n2 body-1">
        Send authentication code to
      </p>

      <v-radio-group
        row
        mandatory
        persistent-hint
        v-model="authObj.identifier"
      >
        <v-radio
          v-for="(identifier, index) in ['Email', 'Phone']"
          :key="`identifier-${index}`"
          :label="identifier"
          :value="identifier"
          class="body-1"
        ></v-radio>
      </v-radio-group>
    </v-col> -->

    <v-col cols="12">
      <p class="mb-1 body-1">
        {{ $t('generate.enter_your_email_address') }}
      </p>
      <v-text-field
        v-if="authObj.identifier == 'Email'"
        outlined
        persistent-hint
        class="body-1"
        placeholder="johndoe@knowhere.com"
        v-model="authObj.email"
        :hint="errors.get('email')"
        :error="errors.has('email')"
        @input="errors.clear('email')"
      ></v-text-field>

      <!-- <v-text-field
        v-if="authObj.identifier == 'Phone'"
        outlined
        persistent-hint
        class="body-2"
        label="Phone number"
        v-model="authObj.phone"
        :hint="errors.get('phone')"
        :error="errors.has('phone')"
        @input="errors.clear('phone')"
      ></v-text-field> -->
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
      <p class="body-1 text-center">
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
      <language-selector />
    </v-col>
  </v-row>
</template>

<script>
import Auth from "@/libs/auth/Auth"

export default {
  data () {
    return {
      loading: false,
      authObj: new Auth()
    }
  },

  components: {
    'language-selector': () => import('@/views/layouts/LanguageSelector.vue')
  },

  computed: {
    errors () {
      return this.authObj.form.errors
    },
  },

  methods: {
    generateCode () {
      if (!this.loading) {
        this.loading = true
        this.authObj.generate().then(() => {
          this.$router.push({ name: 'verify' })
        }).catch((error) => {
          flash({
            message: error.data.message,
            color: '#e74c3c',
          })
        }).finally(() => {
          this.loading = false
        })
      }
    },
  },

  mounted () {
    let identification = localStorage.getItem('sendy:identification')
    if (identification) {
      const { value } = JSON.parse(identification)
      this.authObj.email = value
    }
  }
}
</script>
