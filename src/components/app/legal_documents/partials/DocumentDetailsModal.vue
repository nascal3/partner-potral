<template>
  <v-dialog
      v-model="dialogLaunch"
      width="600"
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

    <v-card>
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

      <div class="pa-5" id="details">
        <section v-if="images.length" class="mb-3">
          <div class="subtitle">{{ $t('documents.submitted_image') }}:</div>
          <v-carousel
              cycle
              height="300"
              show-arrows-on-hover
          >
            <v-carousel-item
                v-for="(image,i) in images"
                :key="i"
                :src="image.url"
            ></v-carousel-item>
          </v-carousel>
        </section>

        <section class="details d-flex flex-row justify-space-between mb-3">
          <div>
            <div><span class="subtitle">{{ $t('documents.document_value') }}:</span> {{ documentDetails.value }}</div>
            <div><span class="subtitle">{{ $t('documents.document_status') }}: </span>
              <v-chip :color="setChipColor(documentDetails.status)" :text-color="setChipTextColor(documentDetails.status)" light small>
                {{ documentDetails.status.toLowerCase() }}
              </v-chip>
            </div>
            <div><span class="subtitle">{{ $t('documents.resource_type') }}:</span> {{ documentDetails.document.resource }}</div>
          </div>

          <div>
            <div><span class="subtitle">{{ $t('documents.document_created') }}:</span> {{ documentsDateFormat(documentDetails.created_at) }}</div>
            <div><span class="subtitle">{{ $t('documents.document_updated') }}:</span> {{ documentsDateFormat(documentDetails.updated_at) }}</div>
            <div v-if="expirable" >
              <span class="subtitle">{{ $t('documents.expiry_date') }}:</span> {{ documentsDateFormat(Document.expires_at) }}
            </div>
          </div>
        </section>

        <section v-if="driver && Object.keys(driver).length" class="mb-4">
          <div class="subtitle">{{ $t('documents.driver_details') }}:</div>
          <div><span class="subtitle">{{ $t('documents.driver_name') }}:</span> {{ driver.name }}</div>
          <div><span class="subtitle">{{ $t('documents.email') }}:</span> {{ driver.email }}</div>
          <div><span class="subtitle">{{ $t('documents.phone') }}:</span> {{ driver.phone }}</div>
        </section>

        <section v-if="showReviews" class="mb-4">
          <div class="subtitle">{{ $t('documents.comments') }}:</div>
          <div>{{ reviews[0].comments }}</div>
        </section>

        <section v-if="documentDetails.status === 'rejected'">
          <v-btn
              dark
              block
              color="primary"
              class="ttn body-2"
              @click="documentData = documentDetails, setSegmentEvent(`Select re-upload document`)"
          >
            {{ $t('documents.reupload_document') }}
          </v-btn>
          <document-edit
              :vehicle-document="documentData"
              @close="documentData = null"
              @updated="updated()"
          ></document-edit>
        </section>
      </div>

    </v-card>
  </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import LegalDocument from '@/libs/app/legal_documents/LegalDocument'
import segmentMixin from "@/mixins/segmentEvents"
import dateFormat from "@/mixins/dateFormat"

export default {
  mixins: [segmentMixin, dateFormat],

  props: {
    documentDetails: {
      type: Object,
      default: () => {}
    },
  },

  components: {
    'document-edit': () => import('@/components/app/vehicle_documents/Edit')
  },

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      LegalDocumentObj: new LegalDocument(),
      Document: null,
      title: this.documentDetails.document.label,
      images: [],
      documentData: null
    }
  },

  computed: {
    ...mapGetters({
      paymentMethods: 'getPaymentMethods',
      legalDocuments: 'getLegalDocuments',
    }),

    initialised () {
      return this.Document
    },

    expirable () {
      if (this.initialised) return this.Document.document.is_expirable
    },

    reviews () {
      if (this.initialised) return this.Document.reviews
    },

    showReviews () {
      return this.reviews && this.reviews.length && this.documentDetails.status === 'rejected'
    },

    driver () {
      if (this.initialised) {
        const driverDetails = this.Document.driver_details
        return JSON.parse(driverDetails)
      }
    },
  },

  methods: {
    ...mapActions([
      'setLegalDocuments'
    ]),

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

    updated () {
      this.loadDocuments()
      this.documentData = null
    },

    fetchAllDocumentImages() {
      const imageArray = this.Document.uploads
      if (!imageArray || !imageArray.length) return
      Promise.all(
          imageArray.map(image => {
            this.loadDocumentImages(this.documentDetails.id, image)
          })
      ).then(() => {
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
    },

    loadDocumentImages(documentId, imageFiles) {
      this.LegalDocumentObj.show(documentId, imageFiles).then(data => {
        this.images.push(data.data)
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },

    loadDocumentDetails(documentId) {
      this.LegalDocumentObj.fetch(documentId).then(data => {
        this.Document = data.data
        this.fetchAllDocumentImages()
      }).catch(error => {
        flash({
          message: error,
          color: '#e74c3c',
        })
        throw error
      }).finally(() => {
        this.loading = false
      })
    },

    loadDocuments () {
      this.loading = true
      const { id } = auth.retrieve('partner')
      this.setLegalDocuments({
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

  mounted () {
    this.loadDocumentDetails(this.documentDetails.id)
  }
}
</script>

<style lang="scss">
  .subtitle {
    font-weight: 700;
  }
  #details {
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
