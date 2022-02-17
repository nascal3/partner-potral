<template>
  <form @submit.prevent="submit()">
    <v-text-field
      dense
      outlined
      persistent-hint
      :label="$t('users.name')"
      v-model="userObj.name"
      :hint="errors.get('name')"
      :error="errors.has('name')"
      @input="errors.clear('name')"
    ></v-text-field>

    <v-text-field
      dense
      outlined
      persistent-hint
      :label="$t('users.email')"
      v-model="userObj.email"
      :hint="errors.get('email')"
      :error="errors.has('email')"
      @input="errors.clear('email')"
    ></v-text-field>

    <v-text-field
      dense
      outlined
      persistent-hint
      :label="$t('users.phone')"
      v-model="userObj.phone"
      :hint="errors.get('phone')"
      :error="errors.has('phone')"
      @input="errors.clear('phone')"
    ></v-text-field>

    <v-btn
      block
      large
      type="submit"
      color="primary"
      class="caption font-weight-bold"
      :dark="!loading"
      :loading="loading"
      :disabled="loading"
    >{{ $t('users.save_details') }}</v-btn>
  </form>
</template>

<script>
import User from "@/libs/app/users/User"

export default {
  name: "PersonalForm",

  props: {
    userDetails: {
      type: Object,
      default: () => { }
    },
  },

  data() {
    return {
      loading: false,
      userId: null,
      userObj: new User(),
    }
  },

  computed: {
    errors() {
      return this.userObj.form.errors
    },
  },

  methods: {
    submit() {
      try {
        const response = this.userObj.update(this.userId)
        flash(response)
        this.$emit('updated')
        this.loading = false
      } catch (err) {
        throw err.message
      }
    }
  },

  created() {
    const { id, name, phone, email } = this.userDetails
    this.userId = id
    this.userObj.name = name
    this.userObj.phone = phone
    this.userObj.email = email
  }

}
</script>
