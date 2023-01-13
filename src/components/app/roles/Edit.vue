<template>
  <div>
    <role-form
      :role="role"
      :dialogLaunch="dialogLaunch"
      @close="close()"
      @updated="updated()"
    ></role-form>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

  props: [
    "role"
  ],

  components: {
    'role-form': () => import('./partials/RoleForm'),
  },

  data () {
    return {
      dialogLaunch: false,
    }
  },

  watch: {
    role (role) {
      if (role) {
        this.dialogLaunch = true
      }
    }
  },

  methods: {
    close () {
      this.dialogLaunch = false
      this.$emit('close')
    },

    stored () {
      this.dialogLaunch = false
      this.$emit('stored')
    },

    updated () {
      this.dialogLaunch = false
      this.$emit('updated')
    }
  },

  mounted () {
    this.setSegmentEvent('Select Edit Role')
  }
}
</script>
