<template>
 <v-card :loading="loading" max-height="800" outlined flat>
   <v-card-title class="mb-6 pa-0"> {{$t('auth.partner_contract')}}</v-card-title>
   <v-card-subtitle v-if="loading" class="mt-6 mb-10 pa-0"> {{$t('auth.contract_loading')}}</v-card-subtitle>
   <v-card-subtitle v-else class="mt-6 mb-10 pa-0"> {{$t('auth.contract_subtitle')}}</v-card-subtitle>
   <v-card-text :class="{ height : !loading }">
     <vue-pdf-embed
         ref="pdfRef"
         :source="pdfSource"
         :page="page"
         @rendered="handleDocumentRender"
     />
   </v-card-text>
   <v-card-actions>
     <v-checkbox
       v-if="!loading"
       v-model="accept"
       :label="$t('auth.contract_confirm')"
     >
     </v-checkbox>

   </v-card-actions>

 </v-card>
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

export default {
  name: "Index",

  data() {
    return {
      loading: true,
      hideDocument: false,
      page: null,
      pageCount: 1,
      pdfSource: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      showAllPages: true,
      accept: null
    }
  },

  components: {
    VuePdfEmbed,
  },

  methods: {
    handleDocumentRender() {
      this.loading = false
      this.pageCount = this.$refs.pdfRef.pageCount
    }
  }
}
</script>

<style lang="scss">
.vue-pdf-embed > div {
  //box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
</style>

<style lang="scss" scoped>
  .v-card {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 0 40px 40px 40px;
    overflow: hidden;

    &__title {
      margin-top: 40px;
      color: #324BA8;
      font-size: 28px;
      font-weight: 700;
    }

    &__subtitle {
      font-size: 22px;
      font-weight: 400;
    }

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
      justify-content: center;
    }
  }
</style>
