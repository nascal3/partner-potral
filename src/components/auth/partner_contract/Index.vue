<template>
  <section>
    <v-card :loading="rendering" min-height="800" outlined flat>
      <v-card-title class="mb-6 pa-0"> {{ $t('auth.partner_contract') }}</v-card-title>
      <v-card-subtitle v-if="rendering" class="mt -6 mb-10 pa-0"> {{ $t('auth.contract_loading') }}</v-card-subtitle>
      <v-card-subtitle v-else class="mt-6 mb-10 pa-0"> {{ $t('auth.contract_subtitle') }}</v-card-subtitle>

      <v-card-text v-if="hasPendingContract">
        <vue-pdf-embed
            ref="pdfRef"
            :source="contractUrl"
            :page="page"
            @rendered="handleDocumentRender"
            @rendering-failed="documentRenderFail"
        />
      </v-card-text>

      <v-card-actions v-if="hasPendingContract">
        <v-checkbox
            v-if="!rendering && initialised"
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
              v-if="showForm && !loading"
              icon
              small
              @click="closeDialog"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <signature-form v-if="showForm" :contract-id="contractId" @showMessage="showMessage" @isLoading="isLoading" />
        <signature-message v-else @closeDialog="closeDialog" />
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"
import LegalDoc from "@/libs/app/legal_documents/LegalDocument"
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import {mapActions, mapGetters} from "vuex"

export default {
  mixins: [segmentMixin],

  data() {
    return {
      loading: false,
      legalObj: new LegalDoc(),
      rendering: true,
      showForm: true,
      page: null,
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
    ...mapGetters({
      pendingContracts: 'getPendingContractDocuments',
      signedContract: 'getPartnerContractDocuments',
    }),

    initialised () {
      return this.pendingContracts && this.pendingContracts.data && Object.keys(this.pendingContracts.data).length > 0
    },

    hasPendingContract () {
      if (!this.initialised) return false
      const { has_pending } = this.pendingContracts.data
      if (!has_pending) this.$router.push({name: 'partner-contract.index'})
      return has_pending
    },

    contractId () {
      if (!this.initialised) return null
      const dataKeys = Object.keys(this.pendingContracts.data)
      if(!dataKeys.includes('contracts')) return null
      const { contracts } = this.pendingContracts.data
      return contracts[contracts.length - 1].id
    },

    contractUrl () {
      if (!this.initialised) return 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf'
      if (!this.hasPendingContract) return this.$router.push({name: 'partner-contract.index'})

      const { contracts } = this.pendingContracts.data
      return contracts[contracts.length - 1].contract
    }
  },

  watch: {
    accept(value) {
      this.dialogLaunch = value
    }
  },

  methods: {
    ...mapActions([
      'setPendingContractDocuments',
      'setPartnerContractDocuments'
    ]),

    handleDocumentRender () {
      this.rendering = false
    },

    documentRenderFail (value) {
      flash({
        ...value.message,
        color: '#e74c3c',
      })
    },

    showMessage () {
      this.showForm = false
    },

    isLoading (value) {
      this.loading = value
    },

    closeDialog() {
      this.dialogLaunch = false
      this.accept = false
    },

    loadDocuments () {
      this.loading = true
      const { id } = auth.retrieve('partner')
      this.setPendingContractDocuments({
        routes: {
          partner: id
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

  mounted() {
    this.setSegmentEvent('Opened partner contract')
    this.loadDocuments()
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

    &__text {
      padding: 24px 16px;
      background-color: #959595;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 600px;
      border-radius: 0;
    }

    &__actions {
      justify-content: center;
    }
  }
</style>
