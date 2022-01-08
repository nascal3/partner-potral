<template>
  <v-dialog
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="caption ttn"
      >
        Add User
      </v-btn>
    </template>

    <user-form
      :dialogLaunch="dialogLaunch"
      @close="dialogLaunch = false"
      @stored="userStored()"
    ></user-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import User from "@/libs/app/access/users/User"

export default {
  components: {
    'user-form': () => import('./partials/UserForm'),
  },

  data () {
    return {
      dialogLaunch: false,
    }
  },

  methods: {
    userStored () {
      this.dialogLaunch = false
      this.$emit('stored')
    }
  }
}
</script>