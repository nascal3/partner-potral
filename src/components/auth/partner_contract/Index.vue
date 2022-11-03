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
              icon
              small
              @click="closeDialog"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <form @submit.prevent="submit()">
        <v-card-text class="pt-6 pl-0 pr-0 pb-0">
          <v-text-field
            outlined
            persistent-hint
            class="body-2"
            :label="$t('auth.identification_number')"
            v-model="authObj.identification_no"
            :hint="errors.get('identification_no')"
            :error="errors.has('identification_no')"
            @input="errors.clear('identification_no')"
            @change="setSegmentEvent('Enter identification number as signature')"
          ></v-text-field>

          <v-text-field
            outlined
            persistent-hint
            class="body-2"
            :label="$t('auth.signature_name')"
            v-model="authObj.signature_name"
            :hint="errors.get('signature_name')"
            :error="errors.has('signature_name')"
            @input="errors.clear('signature_name')"
            @change="setSegmentEvent('Enter full name as signature')"
          ></v-text-field>

        </v-card-text>

        <v-card-actions class="pa-0">
          <v-btn
              large
              type="submit"
              color="primary"
              class="caption font-weight-bold"
              :loading="loading"
              :disabled="loading || !valid"
          >
            {{ $t('auth.sign_contract_submit') }}
          </v-btn>
        </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import Auth from "@/libs/auth/Auth"
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
      showAllPages: true,
      accept: false,
      dialogLaunch: false,
      authObj: new Auth()
    }
  },

  components: {
    VuePdfEmbed,
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
    handleDocumentRender() {
      this.rendering = false
      this.pageCount = this.$refs.pdfRef.pageCount
    },

    submit () {
      this.loading = true
      this.setSegmentEvent('Submit contract signature')
      this.authObj.sign()
          .then(response => {
            flash({
              ...response,
              color: '#38c172'
            })
            this.$router.push({ name: 'orders.index' })
          })
          .catch((error) => {
            flash({
              message: error.data.message,
              color: '#e74c3c',
            })
          })
          .finally(() => {
            this.accept = false
            this.loading = false
            this.dialogLaunch = false
          })
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
  //box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
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
