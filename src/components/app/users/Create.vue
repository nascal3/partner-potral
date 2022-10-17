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
        {{ $t('users.add_user') }}
      </v-btn>
    </template>

    <user-form
      :dialogLaunch="dialogLaunch"
      @close="dialogLaunch = false"
      @stored="stored()"
    ></user-form>
  </v-dialog>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import { mapActions, mapGetters } from 'vuex';

export default {
  mixins: [segmentMixin],

  components: {
    'user-form': () => import('./partials/UserForm.vue'),
  },

  data () {
    return {
      dialogLaunch: false,
    }
  },

  methods: {
    stored () {
      this.dialogLaunch = false
      this.setSegmentEvent('Close Add User')
      this.$emit('stored')
    }
  },

  mounted () {
    this.setSegmentEvent('Select Add User')
  }
}
</script>
