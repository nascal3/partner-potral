<template>
  <v-dialog
    v-if="roles.data"
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ user ? $t('users.update') : $t('users.record') }} {{ $t('users.user_details') }}
          </h2>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            color="red"
            @click="$emit('close')"
          >
            <v-icon small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-5">
          <v-text-field
            dense
            outlined
            persistent-hint
            :label="$t('users.name')"
            v-model="userObj.name"
            :hint="errors.get('name')"
            :error="errors.has('name')"
            @input="errors.clear('name')"
            @change="setSegmentEvent('Enter new user name')"
          ></v-text-field>

          <v-text-field
            dense
            outlined
            type="email"
            persistent-hint
            :label="$t('users.email')"
            v-model="userObj.email"
            :hint="errors.get('email')"
            :error="errors.has('email')"
            @input="errors.clear('email')"
            @change="setSegmentEvent('Enter new user email')"
          ></v-text-field>

          <vue-tel-input
              v-model="userObj.phone"
              @input="errors.clear('phone')"
              @blur="setSegmentEvent('Register new user Phone Number')"
              :onlyCountries="validCountries"
              :inputOptions="placeholder"
              styleClasses="userPhoneInput"
          ></vue-tel-input>
          <span class="error-message" v-if="errors.has('phone')">
            {{errors.get('phone')}}
          </span>

          <v-select
            dense
            outlined
            persistent-hint
            item-value="id"
            item-text="display_name"
            :items="roles.data"
            :label="$t('users.roles')"
            v-model="userObj.role_id"
            :hint="errors.get('role_id')"
            :error="errors.has('role_id')"
            @input="errors.clear('role_id')"
            @change="setSegmentEvent('Assigned new user role')"
          ></v-select>
        </v-card-text>
        <v-card-actions class="px-4 pb-5">
          <v-btn
            block
            large
            type="submit"
            color="primary"
            class="caption font-weight-bold"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
          >
            {{ user ? $t('users.update') : $t('users.save') }} {{ $t('users.user_details') }}
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import User from "@/libs/app/users/User"
import segmentMixin from "@/mixins/segmentEvents"

export default {
  props: [
    'dialogLaunch', 'user'
  ],

  mixins: [segmentMixin],

  data () {
    return {
      loading: false,
      validCountries: [],
      userObj: new User(),
      placeholder: {
        placeholder: this.$t('users.phone'),
      }
    }
  },

  watch: {
    user (user) {
      if (user) {
        this.userObj.role_ids = _.map(user.roles, 'id')
        Object.keys(user).forEach(key => {
          this.userObj[key] = user[key]
        })
      }
    },

    countries() {
      this.setValidCountries()
    },
  },

  computed: {
    ...mapGetters({
      roles: 'getRoles',
      countries: 'getCountries'
    }),

    errors () {
      return this.userObj.form.errors
    },
  },

  methods: {
    ...mapActions([
      'setRoles',
      'setCountries'
    ]),

    setValidCountries() {
      this.countries.data.map(country => {
        this.validCountries.push(country.code)
      })
    },

    submit () {
      if (!this.loading) {
        this.loading = true
        if (this.userObj.phone !== null) this.userObj.phone = this.userObj.phone.replace(/\s/g,'')
        !this.user ? this.store() : this.update()
      }
    },

    store () {
      this.setSegmentEvent('Submit new user details')
      this.userObj.store().then(response => {
        flash(response)
        this.$emit('stored')
      }).catch((error) => {
        this.loading = false
        flash({
          message: error.data.errors[0].message,
          color: '#e74c3c',
        })
      }).finally(() => {
        this.loading = false
      })
    },

    update () {
      this.setSegmentEvent('Submit updated user details')
    }
  },

  mounted () {
    this.setCountries()
    this.setRoles({
      routes: {
        partner: (auth.retrieve('partner')).id
      }
    })
  }
}
</script>

<style lang="scss">
.userPhoneInput {
  border: solid 1px rgba(0, 0, 0, 0.38);
  padding: 2px 0;
  margin-bottom: 23px;

  ::placeholder {
    font-size: 16px;
    opacity: .6;
  }
}
.error-message {
  color: #EE551A;
}
</style>

