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
          class="ttn body-2"
          small
          @click="setSegmentEvent('Select view legal document')"
      >
        {{ $t('documents.view_document') }}
      </v-btn>
    </template>

    <v-card v-if="initialised">
      <v-card-title>
        <h2 class="subtitle-1">
          {{ title }}
        </h2>
        <v-spacer></v-spacer>
        <v-btn
            icon
            small
            color="red"
            @click="dialogLaunch = false"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div>
        {{ documentDetails }}
      </div>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import LegalDocument from '@/libs/app/legal_documents/LegalDocument'
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

  props: {
    documentDetails: {
      type: Object,
      default: () => {}
    },
  },

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      LegalDocumentObj: new LegalDocument(),
      Document: null,
      title: null
    }
  },

  computed: {
    ...mapGetters({
      paymentMethods: 'getPaymentMethods'
    }),

    initialised () {
      return this.Document
    },
  },

  methods: {
    loadDocumentDetails(documentId) {
      this.LegalDocumentObj.show(documentId).then(data => {
        this.Document = data.data
        this.title = this.Document.document.label
        this.loading = false
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      }).finally(() => {
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadDocumentDetails(this.documentDetails.id)
  }
}
</script>

<style scoped>
</style>
