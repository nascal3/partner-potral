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

     <v-card-text class="mt-8" :class="{ height : !rendering }">
       <vue-pdf-embed
           ref="pdfRef"
           :source="pdfSource"
           :page="page"
           @rendered="handleDocumentRender"
       />
     </v-card-text>

     <v-card-actions>
       <v-btn
         v-if="!rendering"
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

export default {
  mixins: [segmentMixin],

  data() {
    return {
      loading: false,
      rendering: true,
      hideDocument: false,
      page: null,
      pdfSource: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    }
  },

  components: {
    VuePdfEmbed,
  },

  methods: {
    handleDocumentRender() {
      this.rendering = false
    },

    downloadContract() {
      this.setSegmentEvent('Downloaded signed partner contract')
      window.open(this.pdfSource)
    }
  },

  mounted () {
    this.setSegmentEvent('Viewed signed partner contract')
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
    max-height: 300px;
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
