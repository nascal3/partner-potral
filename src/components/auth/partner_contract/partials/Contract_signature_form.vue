<template>
  <section v-animate-css="animationObject">
    <form @submit.prevent="submit()">
      <v-card-text class="pt-6 pl-0 pr-0 pb-0">
        <v-text-field
            outlined
            persistent-hint
            class="body-2"
            :label="$t('auth.identification_number')"
            v-model="legalObj.identification_number"
            :hint="errors.get('identification_number')"
            :error="errors.has('identification_number')"
            @input="errors.clear('identification_number')"
            @change="setSegmentEvent('Enter identification number for contract')"
        ></v-text-field>

        <v-text-field
            outlined
            persistent-hint
            class="body-2"
            :label="$t('auth.signature_name')"
            v-model="legalObj.name"
            :hint="errors.get('name')"
            :error="errors.has('name')"
            @input="errors.clear('name')"
            @change="setSegmentEvent('Enter full name for contract')"
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
  </section>
</template>

<script>
import LegalDoc from "@/libs/app/legal_documents/LegalDocument"
import segmentMixin from "@/mixins/segmentEvents"
import dateMixin from "@/mixins/dateFormat"

export default {
  props: {
    contractId: {
      type: Number,
      default: null
    },
  },

  mixins: [segmentMixin, dateMixin],

  data() {
    return {
      loading: false,
      legalObj: new LegalDoc(),
      animationObject:{
        classes: 'slideInLeft',
        delay: 0,
        duration: 300
      }
    }
  },

  computed: {
    valid () {
      return this.legalObj.identification_number && this.legalObj.name
    },

    errors () {
      return this.legalObj.form.errors
    }
  },

  methods: {
    submit () {
      this.loading = true
      this.$emit('isLoading', true)
      this.setSegmentEvent('Submit contract signature')
      this.legalObj.signed_at = new Date()
      this.legalObj.sign()
          .then(response => {
            this.setSegmentEvent('Contract signature successfully')
            flash({
              ...response,
              color: '#38c172'
            })
            this.$emit('showMessage', true)
          })
          .catch((error) => {
            this.setSegmentEvent('Contract signature failed')
            flash({
              ...error,
              color: '#e74c3c',
            })
          })
          .finally(() => {
            this.$emit('isLoading', false)
            this.loading = false
          })
    }
  },

  mounted () {
    this.legalObj.viewed_at = new Date()
    this.legalObj.contract_id = this.contractId
  }
}
</script>

<style scoped>

</style>
