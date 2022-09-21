<template>
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
        <v-row class="data-filters">
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
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-card-text class="px-0 pt-0">
      <v-tabs
          id="documents-tabs"
          color="#324BA8"
          left
      >
        <v-tab>{{ $t('documents.tab_vehicle') }}</v-tab>
        <v-tab>{{ $t('documents.tab_driver') }}</v-tab>
        <v-tab v-if="showIndividualTab">{{ $t('documents.tab_individual') }}</v-tab>
        <v-tab v-if="showBusinessTab">{{ $t('documents.tab_business') }}</v-tab>

        <!--      vehicle documents tab-->
        <v-tab-item>
          <v-container fluid>
            <vehicles-documents :status="status"/>
          </v-container>
        </v-tab-item>
        <!--      driver documents tab-->
        <v-tab-item>
          <v-container fluid>
            <drivers-documents :status="status"/>
          </v-container>
        </v-tab-item>
        <!--      individual documents tab-->
        <v-tab-item v-if="showIndividualTab">
          <v-container fluid>
            <individual-documents :status="status"/>
          </v-container>
        </v-tab-item>
        <!--      business documents tab-->
        <v-tab-item v-if="showBusinessTab">
          <v-container fluid>
            <business-documents :status="status"/>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";
import {mapActions, mapGetters} from 'vuex'

export default {
  components: {
    'vehicles-documents': () => import('./partials/VehiclesDocuments.vue'),
    'drivers-documents': () => import('./partials/DriversDocuments'),
    'individual-documents': () => import('./partials/IndividualDocuments.vue'),
    'business-documents': () => import('./partials/BusinessDocuments.vue')
  },

  mixins: [segmentMixin],

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
    }),

    entityType () {
      return auth.retrieve('partner').legal_entity_type
    },

    showIndividualTab() {
      return this.entityType === 'individual'
    },

    showBusinessTab() {
      return this.entityType === 'business' || this.entityType === 'company'
    }
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
  .v-tabs-slider-wrapper {
    .v-tabs-slider {
      background-color: transparent;
    }
  }
  .v-tab.v-tab {
    color: #909399;
    height: 38px;
    &--active {
      color: inherit;
    }
  }
  .v-item-group {
    margin-bottom: 30px;
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
<style lang="scss" scoped>
.v-tabs {
  //margin-top: 20px;
}
.v-tab {
  text-transform: none !important;
  font-weight: 700;
  &--active {
    background: #F0F3F7;
    border-radius: 6px;
  }
}
</style>

