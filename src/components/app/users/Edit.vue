<template>
  <div>
    <user-form
      :user="user"
      :dialogLaunch="dialogLaunch"
      @close="close()"
      @updated="updated()"
    ></user-form>
  </div>
</template>

<script>
export default {
  props: [
    'user'
  ],
  
  components: {
    'user-form': () => import('./partials/UserForm.vue'),
  },

  data () {
    return {
      dialogLaunch: false,
    }
  },

  // watch: {
  //   role (role) {
  //     if (role) {
  //       this.dialogLaunch = true
  //     }
  //   }
  // },

  methods: {
    close () {
      this.dialogLaunch = false
      this.$emit('close')
    },

    updated () {
      this.dialogLaunch = false
      this.$emit('updated')
    }
  }
}
</script>