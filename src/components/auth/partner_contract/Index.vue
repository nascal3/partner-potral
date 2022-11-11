<template>
  <section>
    <v-card :loading="rendering" max-height="800" outlined flat>
      <v-card-title class="mb-6 pa-0"> {{ $t('auth.partner_contract') }}</v-card-title>
      <v-card-subtitle v-if="rendering" class="mt-6 mb-10 pa-0"> {{ $t('auth.contract_loading') }}</v-card-subtitle>
      <v-card-subtitle v-else class="mt-6 mb-10 pa-0"> {{ $t('auth.contract_subtitle') }}</v-card-subtitle>
      <v-card-text :class="{ height : !rendering }">
        <vue-pdf-embed
            ref="pdfRef"
            :source="pdfSource"
            :page="page"
            @rendered="handleDocumentRender"
        />
      </v-card-text>
      <v-card-actions>
        <v-checkbox
            v-if="!rendering"
            v-model="accept"
            :label="$t('auth.contract_confirm')"
        >
        </v-checkbox>

      </v-card-actions>
    </v-card>

    <v-dialog
        v-model="dialogLaunch"
        max-width="376"
        persistent
    >
      <v-card id="sign-contract" class="pa-5">
        <v-card-title class="pa-0 mt-0">
          <div>
            {{ $t('auth.sign_contract_title') }}
          </div>
          <v-spacer></v-spacer>
          <v-btn
              v-if="showForm"
              icon
              small
              @click="closeDialog"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <signature-form v-if="showForm" @showMessage="showMessage" />
        <signature-message v-else @closeDialog="closeDialog" />
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

export default {
  mixins: [segmentMixin],

  data() {
    return {
      rendering: true,
      showForm: true,
      page: null,
      pdfSource: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      accept: false,
      dialogLaunch: false
    }
  },

  components: {
    VuePdfEmbed,
    'signature-form': () => import('./partials/Contract_signature_form'),
    'signature-message': () => import('./partials/Signature_message'),
  },

  computed: {
    valid () {
      return this.authObj.identification_no && this.authObj.signature_name
    },

    errors () {
      return this.authObj.form.errors
    }
  },

  watch: {
    accept(value) {
      this.dialogLaunch = value
    }
  },

  methods: {
    handleDocumentRender () {
      this.rendering = false
    },

    showMessage (value) {
      this.showForm = false
    },

    closeDialog() {
      this.dialogLaunch = false
      this.accept = false
    }
  }
}
</script>

<style lang="scss">
.vue-pdf-embed > div {
  margin-bottom: 10px;
}
#sign-contract {
  .v-card {

    &__title {
      color: #303133;
      font-size: 18px;
      font-weight: 700;
      .v-btn {
        .v-icon {
          font-size: 20px !important;
        }
      }
    }

    &__text {
      max-height: 380px;
    }

    &__actions {
      justify-content: end;
      .v-btn {
        min-width: 130px;
      }
    }
  }
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
