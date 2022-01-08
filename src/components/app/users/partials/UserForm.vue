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
            {{ user ? `Update` :`Record` }} user details
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
            label="Full name *"
            v-model="userObj.name"
            :hint="errors.get('name')"
            :error="errors.has('name')"
            @input="errors.clear('name')"
          ></v-text-field>

          <v-text-field
            dense
            outlined
            type="email"
            persistent-hint
            label="Email address *"
            v-model="userObj.email"
            :hint="errors.get('email')"
            :error="errors.has('email')"
            @input="errors.clear('email')"
          ></v-text-field>

          <v-text-field
            dense
            outlined
            persistent-hint
            label="Phone number *"
            v-model="userObj.phone"
            :hint="errors.get('phone')"
            :error="errors.has('phone')"
            @input="errors.clear('phone')"
          ></v-text-field>

          <v-select
            dense
            outlined
            multiple
            persistent-hint
            item-value="id"
            item-text="display_name"
            :items="roles.data"
            label="Select user role(s) *"
            v-model="userObj.role_ids"
            :hint="errors.get('role_ids')"
            :error="errors.has('role_ids')"
            @input="errors.clear('role_ids')"
          ></v-select>
        </v-card-text>
        <v-card-actions class="px-4 pb-5">
          <v-btn
            block
            large
            type="submit"
            color="primary"
            class="caption"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
          >
            {{ user ? 'Update' : 'Save' }} Details
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import User from "@/libs/app/users/User"

export default {
  props: [
    'dialogLaunch', 'user'
  ],

  data () {
    return {
      loading: false,
      userObj: new User(),
    }
  },

  computed: {
    ...mapGetters({
      roles: 'getRoles'
    }),

    errors () {
      return this.userObj.form.errors
    },
  },

  methods: {
    ...mapActions([
      'setRoles'
    ]),

    submit () {
      if (!this.loading) {
        this.loading = true
        !this.user ? this.store() : this.update()
      }
    },

    store () {
      this.userObj.store()
        .then(response => {
          flash(response)
          this.$emit('stored')
        })
        .finally(() => {
          this.loading = false
        })
    },

    update () {

    }
  },

  mounted () {
    this.setRoles({
      routes: {
        partner: (auth.retrieve('partner')).id
      }
    })
  }
}
</script>