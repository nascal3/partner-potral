<template>
  <form @submit.prevent="submit()">
    <v-card-text class="pt-6 pl-0 pr-0 pb-0">
      <v-text-field
          outlined
          persistent-hint
          class="body-2"
          :label="$t('auth.identification_number')"
          v-model="authObj.identification_no"
          :hint="errors.get('identification_no')"
          :error="errors.has('identification_no')"
          @input="errors.clear('identification_no')"
          @change="setSegmentEvent('Enter identification number as signature')"
      ></v-text-field>

      <v-text-field
          outlined
          persistent-hint
          class="body-2"
          :label="$t('auth.signature_name')"
          v-model="authObj.signature_name"
          :hint="errors.get('signature_name')"
          :error="errors.has('signature_name')"
          @input="errors.clear('signature_name')"
          @change="setSegmentEvent('Enter full name as signature')"
      ></v-text-field>

    </v-card-text>

    <v-card-actions class="pa-0">
      <v-btn
          large
          type="submit"
          color="primary"
          class="caption font-weight-bold"
          :loading="loading"
          :disabled="loading || !valid"
      >
        {{ $t('auth.sign_contract_submit') }}
      </v-btn>
    </v-card-actions>
  </form>
</template>

<script>
import Auth from "@/libs/auth/Auth"
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

  data() {
    return {
      loading: false,
      authObj: new Auth()
    }
  },

  computed: {
    valid () {
      return this.authObj.identification_no && this.authObj.signature_name
    },

    errors () {
      return this.authObj.form.errors
    }
  },

  methods: {
    submit () {
      this.loading = true
      this.setSegmentEvent('Submit contract signature')
      this.authObj.sign()
          .then(response => {
            this.setSegmentEvent('Submit contract signature successfully')
            flash({
              ...response,
              color: '#38c172'
            })
            this.$emit('showMessage', true)
          })
          .catch((error) => {
            this.setSegmentEvent('Submit contract signature failed')
            flash({
              message: error.data.message,
              color: '#e74c3c',
            })
          })
          .finally(() => {
            this.loading = false
          })
    }
  }
}
</script>

<style scoped>

</style>
