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
                  v-model="status"
                  :items="submissionStatus"
                  :label="$t('documents.submission_status')"
                  item-text="label"
                  item-value="value"
                  dense
                  outlined
                  clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                  v-model="resource"
                  :items="resource_type"
                  :label="$t('documents.resource_type')"
                  item-text="resourceLabel"
                  item-value="resourceValue"
                  multiple
                  dense
                  outlined
                  clearable
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip small>
                    <span>{{ item.resourceLabel }}</span>
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <legal-documents
          :status="status"
          :resource="resource"
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
      status: null,
      submissionStatus: [
        {label: this.$t('documents.resource_document_pending'), value: 'pending'},
        {label: this.$t('documents.resource_document_submitted'), value: 'submitted'},
        {label: this.$t('documents.resource_document_rejected'), value: 'rejected'},
        {label: this.$t('documents.resource_document_approved'), value: 'approved'},
        {label: this.$t('documents.resource_document_expired'), value: 'expired'},
      ],
      resource: [],
      resource_type: [
        {resourceLabel: this.$t('documents.resource_business'), resourceValue: 'business'},
        {resourceLabel: this.$t('documents.resource_driver'), resourceValue: 'driver'},
        {resourceLabel: this.$t('documents.resource_vehicle'), resourceValue: 'vehicle'},
      ],
      page: 1,
      headers: [
        { text: this.$t('documents.document_name'), value: 'order_no' },
        { text: this.$t('documents.submission_date'), value: 'pickup_location' },
        { text: this.$t('documents.document_status'), value: 'destinations' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      countries: "getCountries"
    })
  },

  methods: {
    ...mapActions([
      "setCountries"
    ]),

    fetchCountries() {
      this.setCountries()
    }
  },

  mounted () {
    this.fetchCountries()
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

