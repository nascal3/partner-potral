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
        :loading-text="$t('core.system_loading')"
    >
    </v-data-table>

    <app-pagination
        v-if="documents.length"
        :meta="meta"
        @pageChanged="pageChanged"
    />
  </div>
</template>

<script>
import {format} from "date-fns";
import Document from '@/libs/app/documents/Document'

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

  data () {
    return {
      loading: true,
      documentObj: new Document(),
      documents: [],
      page: 1,
      headers: [
        { text: this.$t('documents.document_active_status'), value: 'destinations' },
        { text: this.$t('documents.document_name'), value: 'order_no' },
        { text: this.$t('documents.document_country'), value: 'pickup_location' },
        { text: this.$t('documents.document_resource'), value: 'pickup_location' },
        { text: this.$t('documents.document_expires'), value: 'destinations' },
        { text: this.$t('documents.document_action'), value: '' }
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
    pageChanged (page) {
      this.page = page
      this.loadDocuments()
    },

    loadDocuments () {
      this.loading = true
      this.documentObj.show(this.countryCode, this.resource, this.expirationStatus, this.page)
          .then(({ data }) => {
            this.documents = data
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
      color: #909399;
      thead {
        tr {
          th:first-letter {
            text-transform: uppercase;
          }
        }
      }
      tbody {
        tr.v-data-table__expanded__content {
          background-color: #FFFFFF !important;
          box-shadow: none;
        }
        tr:nth-of-type(odd) {
          background-color: #F7F9FC;
        }
        tr {
          td.text-start:first-child {
            color: #606266;
            font-weight: 700;
          }
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
