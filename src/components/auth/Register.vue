<template>
  <v-row>
    <v-col 
      cols="12"
    >
      <v-radio-group v-model="authObj.legal_entity_type" row>
        <v-radio 
          v-for="(ofType, index) in ['Company', 'Individual']"
          :key="`entity-${index}`"
          :label="ofType" 
          :value="ofType"
          class="body-1"
        ></v-radio>
      </v-radio-group> 

      <v-text-field
        v-if="authObj.legal_entity_type == 'Company'"
        dense
        outlined
        persistent-hint
        class="body-2"
        label="Business name *"
        v-model="authObj.name"
        :hint="errors.get('name')"
        :error="errors.has('name')"
        @input="errors.clear('name')"
      ></v-text-field>

      <v-select
        dense
        outlined
        persistent-hint
        item-value="id"
        item-text="name"
        :items="countries.data"
        label="Select country *"
        v-model="authObj.country_id"
        :hint="errors.get('country_id')"
        :error="errors.has('country_id')"
        @input="errors.clear('country_id')"
      ></v-select>

      <v-text-field
        dense
        outlined
        persistent-hint
        class="body-2"
        label="Your full name *"
        v-model="authObj.administrator.name"
        :hint="errors.get('administrator.name')"
        :error="errors.has('administrator.name')"
        @input="errors.clear('administrator.name')"
      ></v-text-field>

      <v-text-field
        dense
        outlined
        persistent-hint
        class="body-2"
        label="Email address *"
        v-model="authObj.administrator.email"
        :hint="errors.get('administrator.email')"
        :error="errors.has('administrator.email')"
        @input="errors.clear('administrator.email')"
      ></v-text-field>

      <v-text-field
        dense
        outlined
        persistent-hint
        class="body-2"
        label="Phone number *"
        v-model="authObj.administrator.phone"
        :hint="errors.get('administrator.phone')"
        :error="errors.has('administrator.phone')"
        @input="errors.clear('administrator.phone')"
      ></v-text-field>
    </v-col>

    <v-col>
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
        Register Account
      </v-btn>
    </v-col>

    <v-col cols="12">
      <p class="body-1">
        Already have an account? 
        <router-link
          class="deep-orange--text"
          to="/auth/generate"
        >
          Login
        </router-link>
      </p>
    </v-col>
  </v-row>
</template>

<script>
import Auth from "@/libs/auth/Auth"
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      authObj: new Auth()
    }
  },

  computed: {
    ...mapGetters({
      countries: 'getCountries'
    }),

    errors () {
      return this.authObj.form.errors
    }
  },

   methods: {
     ...mapActions([
       'setCountries'
     ]),

    submit () {
      if (!this.loading) {
        this.loading = true
        this.authObj.register()
          .then(() => {
            this.$router.push({ name: 'login' })
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