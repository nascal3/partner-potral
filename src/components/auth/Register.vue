<template>
  <v-card flat>
    <v-card-text class="px-0">
      <div>
        <p class="mb-n4 mt-5 body-1">
          Business model *
        </p>
        <v-radio-group 
          row
          v-model="authObj.legal_entity_type"
        >
          <v-radio 
            v-for="(ofType, index) in ['Company', 'Individual']"
            :key="`entity-${index}`"
            :label="ofType" 
            :value="ofType"
            class="body-1"
          ></v-radio>
        </v-radio-group> 
      </div>

      <div>
        <p class="mb-1 body-1">
          Country of operation *
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
        ></v-select>
      </div>

      <div v-if="authObj.legal_entity_type == 'Company'">
        <p class="mb-1 body-1">
          Business name *
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
        ></v-text-field>
      </div>

      <div>
        <p class="mb-1 body-1">
          Your full name *
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
        ></v-text-field>
      </div>

      <div>
        <p class="mb-1 body-1">
          Phone number *
        </p>
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
      </div>

      <div>
        <p class="mb-1 body-1">
          Email address *
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
        Register Account
      </v-btn>
    </v-card-actions>
  </v-card>
  <!-- 

    

    <v-col cols="12">
      
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
  </v-row> -->
</template>

<script>
import Auth from "@/libs/auth/Auth"
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      country: null,
      loading: false,
      authObj: new Auth()
    }
  },

  watch: {
    countries ({ data }) {
      this.country = data[0] || null
      this.authObj.country_id = this.country?.id
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

    submit () {
      if (!this.loading) {
        this.loading = true
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