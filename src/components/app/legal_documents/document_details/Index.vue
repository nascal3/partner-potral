<template>
  <div>
    <v-card
        flat
        class="ma-0 pa-0"
    >
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ title }}
          </h1>
          <app-crumbs
              :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      crumbs: [
        { text: this.$t('documents.legal_documents'), to: 'legal-documents' },
        { text: 'document label', disabled: true },
      ],
    }
  },

}
</script>

<style scoped>

</style>
