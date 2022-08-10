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
            <v-col cols="12" md="4">
              <v-select
                  v-model="country"
                  :items="countries.data"
                  :label="$t('documents.document_country')"
                  item-text="name"
                  item-value="code"
                  dense
                  outlined
                  clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                  v-model="resource"
                  :items="vendorTypes.data"
                  :label="$t('documents.resource_type')"
                  item-text="display_name"
                  item-value="name"
                  dense
                  outlined
                  clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                  v-model="selectedExpirationStatus"
                  :items=" expirationStatus"
                  :label="$t('documents.expiration_status')"
                  item-text="expirationStatusLabel"
                  item-value="expirationStatusValue"
                  dense
                  outlined
                  clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <legal-documents
          :country-code="country"
          :resource="resource"
          :expiration-status="selectedExpirationStatus"
      />
    </v-card>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  components: {
    'legal-documents': () => import('./Show.vue')
  },

  data () {
    return {
      loading: true,
      documentObj: new Document(),
      documents: [],
      country: null,
      resource: null,
      selectedExpirationStatus: null,
      expirationStatus: [
        {expirationStatusLabel: this.$t('documents.expiration_status_true'), expirationStatusValue: true},
        {expirationStatusLabel: this.$t('documents.expiration_status_false'), expirationStatusValue: false},
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

  computed: {
    ...mapGetters({
      countries: "getCountries",
      vendorTypes: "getVendorTypes",
    })
  },

  methods: {
    ...mapActions([
      "setCountries",
      "setVendorTypes"
    ]),

    fetchCountries() {
      this.setCountries()
    },

    setVendors() {
      this.setVendorTypes()
    },
  },

  mounted () {
    this.fetchCountries()
    this.setVendors()
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

