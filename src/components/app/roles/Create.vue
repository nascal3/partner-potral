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
        {{ $t('role.add_role') }}
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
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

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
      this.setSegmentEvent('Save User Role')
      this.$emit('stored')
    }
  },

  mounted () {
    this.setSegmentEvent('Select Add Role')
  }
}
</script>
