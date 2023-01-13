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
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

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

  watch: {
    user (user) {
      this.dialogLaunch = Boolean(user)
    }
  },

  methods: {
    close () {
      this.setSegmentEvent('Close Add User')
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
