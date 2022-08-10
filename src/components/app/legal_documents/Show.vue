<template>
  <div class="px-0">
    <v-data-table
        id="documents-table"
        fixed-header
        disable-sort
        class="title"
        hide-default-footer
        disable-pagination
        :no-data-text="$t('documents.no_documents_found')"
        :no-results-text="$t('documents.no_results_found')"
        :headers="headers"
        :items="documents"
        item-key="txn_no"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="setChipColor(item.status)" :text-color="setChipTextColor(item.status)" light small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
            dark
            small
            color="primary"
            class="ttn body-2"
            :to="`legal-documents/${item.id}`"
            @click="setSegmentEvent('Select View legal document')"
        >
          {{ $t('documents.view_document') }}
        </v-btn>
      </template>
    </v-data-table>

    <app-pagination
        v-if="documents.length"
        :meta="meta"
        @pageChanged="pageChanged"
    />
  </div>
</template>

<script>
import mockResponse from '@/libs/app/documents/mockResponce.json'
import Document from '@/libs/app/documents/Document'
import segmentMixin from "@/mixins/segmentEvents";

export default {

  props: {
    countryCode: {
      type: String,
      default: null
    },
    resource: {
      type: String,
      default: null
    },
    expirationStatus: {
      type: Boolean,
      default: null
    }
  },

  mixins: [segmentMixin],
  data () {
    return {
      loading: true,
      documentObj: new Document(),
      documents: [],
      page: 1,
      headers: [
        { text: this.$t('documents.document_active_status'), value: 'status' },
        { text: this.$t('documents.document_name'), value: 'label' },
        { text: this.$t('documents.document_country'), value: 'country' },
        { text: this.$t('documents.document_resource'), value: 'resource' },
        { text: this.$t('documents.document_expires'), value: 'expires' },
        { text: this.$t('documents.document_action'), value: 'action' }
      ],
      meta: {
        current_page: 1,
        first_page: 1,
        first_page_url: "/?page=1",
        last_page: 1,
        last_page_url: "/?page=1",
        next_page_url: null,
        per_page: 30,
        previous_page_url: null,
        total: 0
      }
    }
  },

  watch: {
    countryCode() {
      this.loadDocuments()
    },

    resource() {
      this.loadDocuments()
    },

    expirationStatus() {
      this.loadDocuments()
    }
  },

  methods: {
    setChipColor (status) {
      const colorMap = {
        'expired': '#FBDECF',
        'rejected': '#FBDECF',
        'confirmed': '#CCEFFF',
        'active': '#DEFAD2',
        'pending': '#FDDB97'
      }
      return colorMap[status]
    },

    setChipTextColor (status) {
      const colorMap = {
        'expired': '#9B101C',
        'rejected': '#9B101C',
        'confirmed': '#006492',
        'active': '#116F28',
        'pending': '#9D5004'
      }
      return colorMap[status]
    },

    pageChanged (page) {
      this.page = page
      this.loadDocuments()
    },

    loadDocuments () {
      this.loading = true
      this.documentObj.show(this.countryCode, this.resource, this.expirationStatus, this.page)
          .then(({ data }) => {
            // this.documents = data
            this.documents = mockResponse
            this.meta.total = this.documents.length
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            flash({
              message: error.data.message,
              color: '#e74c3c',
            })
            throw error
          })
    },
  },

  mounted() {
    this.loadDocuments()
  }

}
</script>

<style lang="scss">
#documents-table {
  .v-data-table__wrapper {
    max-height: 90vh;
    overflow-x: hidden;
    overflow-y: auto;

    table {
      thead {
        tr {
          th:first-letter {
            text-transform: uppercase;
          }
        }
      }
      tbody {
        tr:nth-of-type(odd) {
          background-color: #F7F9FC;
        }
      }
    }
  }
  .v-chip {
    .v-chip__content {
      padding-top: 2px;
      display: inline-block !important;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>
