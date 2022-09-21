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
        :items="legalDocuments.data"
        item-key="id"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="setChipColor(item.status)" :text-color="setChipTextColor(item.status)" light small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.document.country_id="{ item }">
        {{ getCountryName(item.document.country_id) }}
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ documentsDateFormat(item.created_at) }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
            v-if="item.status === 'pending'"
            small
            color="primary"
            class="ttn body-2"
            @click="documentData = item, setSegmentEvent(`Select submit document`)"
        >
          {{ $t('documents.submit_document') }}
        </v-btn>
        <document-details
            v-else
            @click="setSegmentEvent('Select view driver document details')"
            :document-details = item
        />

        <document-edit
            :vehicle-document="documentData"
            @close="documentData = null"
            @updated="updated()"
        ></document-edit>
      </template>
    </v-data-table>

    <app-pagination
        v-if="initialised"
        :meta="meta"
        @pageChanged="pageChanged"
    />
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import dateFormat from "@/mixins/dateFormat"
import {mapActions, mapGetters} from "vuex"

export default {

  props: {
    status: {
      type: String,
      default: () => null
    }
  },

  mixins: [segmentMixin, dateFormat],

  components: {
    'document-details': () => import('./DocumentDetailsModal.vue'),
    'document-edit': () => import('@/components/app/vehicle_documents/Edit')

  },

  data () {
    return {
      loading: true,
      resourcesQuery: null,
      queryParams: {},
      page: 1,
      headers: [
        { text: this.$t('documents.document_active_status'), value: 'status' },
        { text: this.$t('documents.document_name'), value: 'document.label' },
        { text: this.$t('documents.document_country'), value: 'document.country_id' },
        { text: this.$t('documents.document_resource'), value: 'document.resource' },
        { text: this.$t('documents.document_updated_on'), value: 'created_at' },
        { text: this.$t('documents.document_expires'), value: 'document.is_expirable' },
        { text: this.$t('documents.document_action'), value: 'action' }
      ],
      meta: {},
      documentData: null
    }
  },

  watch: {
    status() {
      this.setQueryParams()
      this.loadDocuments()
    }
  },

  computed: {
    ...mapGetters({
      legalDocuments: 'getBusinessLegalDocuments',
      countries: 'getCountries'
    }),

    initialised () {
      if (this.legalDocuments.data) {
       this.meta = this.legalDocuments.meta
      }
      return this.legalDocuments.data
    },
  },

  methods: {
    ...mapActions([
      'setBusinessLegalDocuments'
    ]),

    updated () {
      this.loadDocuments()
      this.documentData = null
    },

    setQueryParams () {
      const params = {
        status: this.status,
        document_resource:  'business'
      }
      Object.keys(params).forEach((k) => params[k] == null && delete params[k]);
      this.queryParams = params
    },

    setChipColor (status) {
      const colorMap = {
        'expired': '#FBDECF',
        'rejected': '#FBDECF',
        'confirmed': '#CCEFFF',
        'approved': '#DEFAD2',
        'pending': '#FDDB97',
        'submitted': '#9F5FB9'
      }
      return colorMap[status]
    },

    setChipTextColor (status) {
      const colorMap = {
        'expired': '#9B101C',
        'rejected': '#9B101C',
        'confirmed': '#006492',
        'approved': '#116F28',
        'pending': '#9D5004',
        'submitted': '#FFFFFF'
      }
      return colorMap[status]
    },

    getCountryName (countryId) {
      const country = this.countries.data.find(country => country.id === countryId)
      return country.name
    },

    pageChanged (page) {
      this.page = page
      this.loadDocuments()
    },

    loadDocuments () {
      this.loading = true
      const { id } = auth.retrieve('partner')
      this.setBusinessLegalDocuments({
        routes: {
          partner: id
        },
        params: this.queryParams
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      }).finally(() => {
        this.loading = false
      })
    },
  },

  mounted() {
    this.setQueryParams()
    this.loadDocuments()
    this.setSegmentEvent('View business documents')
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
