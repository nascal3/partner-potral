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
        Add Role
      </v-btn>
    </template>

    <role-form
      :dialogLaunch="dialogLaunch"
      @close="dialogLaunch = false"
      @stored="stored()"
    ></role-form>
  </v-dialog>
</template>

<script>
export default {
  components: {
    'role-form': () => import('./partials/RoleForm'),
  },

  data () {
    return {
      dialogLaunch: false,
    }
  },

  methods: {
    stored () {
      this.dialogLaunch = false
      this.$emit('stored')
    }
  }
}
</script>