<template>
  <v-dialog
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        small
        right
        bottom
        absolute
        v-on="on"
        v-bind="attrs"
        color="pink"
        style="margin-bottom: 35px"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <user-form
      :dialogLaunch="dialogLaunch"
      @close="closeDialog()"
      @userStored="userStored()"
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
    closeDialog () {
      this.dialogLaunch = false
    },

  //   userStored () {
  //     this.dialogLaunch = false
  //     this.$emit('reload')
  //   }
  }
}
</script>

<style lang="scss">
.condensed {
  .v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>