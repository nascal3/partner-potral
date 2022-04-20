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
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <v-tabs id="documents-tabs" left>
        <v-tab>{{ $t('documents.tab_non_expiry') }}</v-tab>
        <v-tab>{{ $t('documents.tab_expiry') }}</v-tab>
        <!--       Non-expiry documents tab -->
        <v-tab-item>
          <non-expiry-documents />
        </v-tab-item>
        <!--     Expiry documents tab-->
        <v-tab-item>
          <expiry-documents
              :date-from="dateFrom"
              :date-to="dateTo"
              :selected-document-status="selectedDocumentStatus"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    'date-range': () => import('@/components/core/DateRange.vue'),
    'expiry-documents': () => import('./partials/ExpirtyDocuments.vue'),
    'non-expiry-documents': () => import('./partials/NonExpirtyDocuments.vue'),
  },

  data () {
    return {
      loading: true,
      documentObj: new Document(),
      documents: [],
      selectedDocumentStatus: 'all',
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
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
    setDateRange({dateFrom, dateTo}) {
      this.dateFrom = dateFrom
      this.dateTo = dateTo
    }
  }
}
</script>

<style lang="scss">
#documents-tabs {
  .v-item-group {
    margin-bottom: 30px;
  }
}
</style>
<style lang="scss" scoped>
.v-tab {
  text-transform: none !important;
  font-weight: 700;
  &--active {
    border-radius: 6px;
  }
}
</style>

