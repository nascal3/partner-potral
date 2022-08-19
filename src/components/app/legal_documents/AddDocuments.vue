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
    <v-spacer></v-spacer>

    <div class="col-sm-12 col-md-4 col">
      <v-list>
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
    </div>


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
      documentData: null
    }
  },

  computed: {
    ...mapGetters({
      legalDocuments: 'getLegalDocuments'
    }),

    crumbs () {
      return [
        { text: this.$t('documents.legal_documents'), to: 'legal-documents' },
        { text: this.$t('documents.required_documents') , disabled: true }
      ]
    },

    initialised () {
      return this.Document
    },
  },

  methods: {
    ...mapActions([
      'setLegalDocuments'
    ]),

    updated () {
      this.loadDocuments()
      this.documentData = null
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
