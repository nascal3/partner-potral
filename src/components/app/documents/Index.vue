<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('documents.documents_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
          <v-row class="date-filters">
            <v-col cols="12" md="7">
              <date-range @getDateRange="setDateRange"/>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                  v-model="selectedDocumentStatus"
                  :items="documentStatus"
                  :label="$t('documents.document_status')"
                  item-text="paymentLabel"
                  item-value="paymentValue"
                  dense
                  outlined
                  @change="loadDocuments"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <v-card-text class="px-0">
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { format } from 'date-fns'
import Document from '@/libs/app/documents/Document'

export default {
  components: {
    'date-range': () => import('@/components/core/DateRange.vue'),
  },

  data () {
    return {
      loading: true,
      documentObj: new Document(),
      documents: [],
      selectedDocumentStatus: {paymentLabel: this.$t('documents.status_all'), paymentValue: 'all'},
      documentStatus: [
        {paymentLabel: this.$t('documents.status_all'), paymentValue: 'all'},
        {paymentLabel: this.$t('documents.status_pending'), paymentValue: 'pending'},
        {paymentLabel: this.$t('documents.status_approved'), paymentValue: 'approved'}
      ],
      page: 1,
      headers: [
        { text: this.$t('documents.document_name'), value: 'order_no' },
        { text: this.$t('documents.submission_date'), value: 'pickup_location' },
        { text: this.$t('documents.document_status'), value: 'destinations' }
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

  methods: {
    formatDate(date) {
      if (!date) return
      return format(new Date(date), 'iii, do LLL')
    },

    setDateRange({dateFrom, dateTo}) {
      this.dateFrom = dateFrom
      this.dateTo = dateTo
      this.loadDocuments()
    },

    pageChanged (page) {
      this.page = page
      this.loadDocuments()
    },

    loadDocuments () {
      this.loading = true
      this.documentObj.show(this.dateFrom, this.dateTo, this.page, this.selectedDocumentStatus.paymentValue).then(({ data }) => {
        this.documents = data
        this.meta.total = this.documents.length
        this.loading = false
      }).catch(error => {
        this.loading = false
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },
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
