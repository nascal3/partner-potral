<template>
  <v-dialog
    v-if="vehicleDocument"
    v-model="dialog"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title>
        <h2 class="subtitle-1">
          {{ vehicleDocument.document.label }}
        </h2>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          color="red"
          @click="$emit('close')"
        >
          <v-icon small color="red">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-file-input
            flat
            solo
            dense
            persistent-hint
            ref="upload"
            class="body-2"
            :prepend-icon="null"
            :placeholder="$t('vehicles.upload_document')"
            v-model="vehicleDocumentObj.file_upload"
            @change="uploadDocument()"
          >
            <template v-slot:prepend-inner>
              <v-icon v-if="!vehicleDocumentObj.file_upload"
                class="ml-n3 mr-2"
              >
                mdi-cloud-upload
              </v-icon>
              <v-progress-circular
                v-else
                :size="20"
                :width="2"
                indeterminate
                class="ml-n3 mr-2"
                color="primary"
              ></v-progress-circular>
            </template>
          </v-file-input>

           <v-text-field
            dense
            outlined
            persistent-hint
            class="body-2"
            :disabled="Boolean(vehicleDocument.value)"
            :label="vehicleDocument.document.label"
            :placeholder="vehicleDocument.document.placeholder"
            v-model="vehicleDocumentObj.value"
            :hint="errors.get('value')"
            :error="errors.has('value')"
            @input="errors.clear('value')"
            @change="setSegmentEvent(`Enter ${vehicleDocument.document.label}`)"
          ></v-text-field>

          <v-dialog
            ref="dialog"
            v-model="expiryDialog"
            :return-value.sync="vehicleDocumentObj.expires_at"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-if="vehicleDocument.document.is_expirable"
                v-model="vehicleDocumentObj.expires_at"
                label="Expiry date"
                readonly
                v-bind="attrs"
                v-on="on"
                dense
                outlined
                persistent-hint
                class="body-2"
                :value="vehicleDocument.expires_at"
                :hint="errors.get('expires_at')"
                :error="errors.has('expires_at')"
                @input="errors.clear('expires_at')"
                @change="setSegmentEvent('Select expiry date')"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="vehicleDocumentObj.expires_at"
              scrollable
              no-title
            >
              <v-btn
                block
                color="secondary"
                class="caption mb-2 font-weight-bold"
                @click="$refs.dialog.save(vehicleDocumentObj.expires_at)"
              >
                {{ $t('vehicles.select_expiration_date') }}
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-btn
            block
            large
            color="primary"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
            class="caption font-weight-bold"
            @click="submit()"
          >
            {{ $t('vehicles.submit_document_details') }}
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VehicleDocument from '@/libs/app/vehicle_documents/VehicleDocument'
import segmentMixin from "@/mixins/segmentEvents";

export default {
  props: [
    'vehicle',
    'vehicleDocument'
  ],

  mixins: [segmentMixin],

  data () {
    return {
      dialog: false,
      loading: false,
      expiryDialog: false,
      vehicleDocumentObj: new VehicleDocument()
    }
  },

  watch: {
    vehicleDocument (vehicleDocument) {
      this.dialog = Boolean(vehicleDocument)
      if (vehicleDocument) {
        this.vehicleDocumentObj.vehicle_document_id = vehicleDocument.id
      }
    }
  },

  computed: {
    errors () {
      return this.vehicleDocumentObj.form.errors
    }
  },

  methods: {
    uploadDocument () {
      this.setSegmentEvent('Select upload')
      this.vehicleDocumentObj.upload()
        .then(() => {

        })

    },

    submit () {
      this.setSegmentEvent(`Submit ${this.vehicleDocument.document.label}`)
      if (!this.loading) {
        this.loading = true
        this.vehicleDocumentObj.update(this.vehicleDocument.id)
          .then(response => {
            flash(response)
            this.$emit('updated')
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
