<template>
 <section>
   <v-card flat class="ma-0 pa-0">
     <v-card-title>
       <div>
         <h1 class="title font-weight-bold">
           {{ $t('documents.contract_title') }}
         </h1>
       </div>
       <v-spacer></v-spacer>

     </v-card-title>

     <v-divider></v-divider>

     <v-spacer></v-spacer>

     <app-loading v-if="rendering" />

     <v-alert v-if="!initialised && !rendering" type="warning" class="mt-5" dense>{{ $t('documents.contract_unavailable') }}</v-alert>

     <v-card-text v-else class="mt-8" :class="{ height : !rendering }">
       <vue-pdf-embed
           ref="pdfRef"
           :source="contractSource"
           :page="page"
           @rendered="handleDocumentRender"
           @rendering-failed="documentRenderFail"
       />
     </v-card-text>

     <v-card-actions>
       <v-btn
         v-if="!rendering && initialised"
         large
         type="submit"
         color="primary"
         @click="downloadContract"
       >
         {{ $t('documents.download_contract') }}
       </v-btn>

     </v-card-actions>
   </v-card>
 </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import {mapActions, mapGetters} from "vuex"

export default {
  mixins: [segmentMixin],

  data() {
    return {
      rendering: true,
      page: null
    }
  },

  components: {
    VuePdfEmbed,
  },

  computed: {
    ...mapGetters({
      partnerContracts: 'getPartnerContractDocuments',
    }),

    initialised () {
      return this.partnerContracts && this.partnerContracts.data && this.partnerContracts.data.length > 0
    },

    contractSource () {
      if (!this.initialised) return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      return this.partnerContracts.data.at(-1).contract
    }
  },

  watch: {
    initialised(newValue) {
      this.rendering = newValue
    }
  },

  methods: {
    ...mapActions([
      'setPartnerContractDocuments'
    ]),

    handleDocumentRender() {
      this.rendering = false
    },

    documentRenderFail (value) {
      flash({
        ...value.message,
        color: '#e74c3c',
      })
    },

    loadDocument () {
      const { id } = auth.retrieve('partner')
      this.setPartnerContractDocuments({
        routes: {
          partner: id
        }
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },

    downloadContract() {
      this.setSegmentEvent('Downloaded signed partner contract')
      window.open(this.contractSource)
    }
  },

  mounted () {
    this.setSegmentEvent('Viewed signed partner contract')
    this.loadDocument()
  }
}
</script>

<style lang="scss">
.vue-pdf-embed > div {
  margin-bottom: 10px;
}
</style>

<style lang="scss" scoped>
.v-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 0 40px 40px 40px;
  overflow: hidden;

  .height {
    display: inline-block;
    max-height: 650px;
    padding: 24px 16px;
    background-color: #959595;
  }

  &__text {
    padding-top: 0;
    background-color: #FFFFFF;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 0;
    border-radius: 0;
  }

  &__actions {
    justify-content: end;
    .v-btn {
      text-transform: capitalize;
    }
  }
}
</style>
