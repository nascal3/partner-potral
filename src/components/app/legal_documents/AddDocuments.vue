<template>
  <app-loading v-if="loading"/>
  <v-card v-else flat class="ma-0 pa-0">
    <v-card-title>
      <div>
        <h1 class="title font-weight-bold">
          {{ $t('documents.required_documents') }}
        </h1>
      </div>
    </v-card-title>
    <div class="ml-4">
      <app-crumbs
          :crumbs="crumbs"
      ></app-crumbs>
    </div>
    <v-card-text>
      <v-alert
          text
          dense
          type="error"
          border="left"
          class="body-2 mb-0"
          v-if="documentInvalid"
      >
        {{ $t('documents.document_is_unverified') }}
      </v-alert>
      <v-spacer></v-spacer>

      <div class="col-sm-12 col-md-4 col pl-0">

        <v-list v-if="legalDocuments.data.length">
          <template v-for="(vd, index) in legalDocuments.data">
            <v-list-item
                :key="`document-${index}`"
                class="elevation-1 mb-5"
                ripple
                @click="documentData = vd, setSegmentEvent(`Select ${vd.document.label}`)"
            >
              <!-- <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar> -->
              <v-list-item-content>
                <v-list-item-title>
                  <v-row>
                    <v-col cols="8">
                <span class="body-1 font-weight-bold">
                  {{ vd.document.label }}
                </span>
                    </v-col>
                    <v-col
                        cols="4"
                        class="text-right"
                    >
                <span class="caption">
                  {{ vd.status }}
                </span>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <div v-else>
          {{ $t('documents.no_required_documents') }}
        </div>
      </div>
    </v-card-text>

    <document-edit
        :vehicle-document="documentData"
        @close="documentData = null"
        @updated="updated()"
    ></document-edit>


  </v-card>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";
import {mapActions, mapGetters} from "vuex";


export default {
  mixins: [segmentMixin],

  components: {
    'document-edit': () => import('@/components/app/vehicle_documents/Edit')
  },

  data() {
    return {
      loading: false,
      documentData: null,
      documentInvalid: false,
      crumbs: [
        { text: this.$t('documents.legal_documents'), to: 'legal-documents' },
        { text: this.$t('documents.required_documents') , disabled: true }
      ]
    }
  },

  computed: {
    ...mapGetters({
      legalDocuments: 'getLegalDocuments'
    }),

    initialised () {
      return this.legalDocuments.data && this.legalDocuments.data.length >= 1
    },
  },

  watch: {
    legalDocuments(documents) {
      this.checkDocumentsValidity(documents.data)
    }
  },

  methods: {
    ...mapActions([
      'setLegalDocuments'
    ]),

    updated () {
      this.loadDocuments()
      this.documentData = null
    },

    checkDocumentsValidity(documents) {
      documents.forEach(document => {
        if (!document.is_valid) return this.documentInvalid = !document.is_valid
      })
    },

    loadDocuments () {
      this.loading = true
      const { id } = auth.retrieve('partner')
      this.setLegalDocuments({
        routes: {
          partner: id
        },
        params: {
          document_resource:  'business|driver'
        }
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

  mounted () {
    this.loadDocuments()
  }

}
</script>

<style scoped>

</style>
