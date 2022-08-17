<template>
  <div>
    <v-card
        flat
        class="ma-0 pa-0"
    >
      <app-loading v-if="loading"/>
      <v-card-title v-else>
        <div>
          <h1 class="title font-weight-bold">
            {{ title }}
          </h1>
          <app-crumbs
              :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import LegalDocument from '@/libs/app/legal_documents/LegalDocument'
import segmentMixin from "@/mixins/segmentEvents";
import {mapGetters} from "vuex";


export default {
  mixins: [segmentMixin],

  data() {
    return {
      loading: true,
      LegalDocumentObj: new LegalDocument(),
      Document: null,
      title: null
    }
  },

  computed: {
    ...mapGetters({
      legalDocuments: 'getLegalDocuments',
      countries: 'getCountries'
    }),

    crumbs () {
      if (this.initialised) {
        return [
          { text: this.$t('documents.legal_documents'), to: 'legal-documents' },
          { text: this.title , disabled: true }
        ]
      }
      return [{ text: this.$t('documents.legal_documents'), to: 'legal-documents' }]
    },

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

  mounted() {
    const documentId = this.$route.params.documentId
    this.loadDocumentDetails(documentId)
  }

}
</script>

<style scoped>

</style>
