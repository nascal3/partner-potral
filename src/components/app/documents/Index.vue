<template>
  <v-row 
    justify="center"
  >
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(vehicleDocument, i) in vehicleDocuments.data"
        :key="i"
      >
        <v-expansion-panel-header class="body-1">
          <v-row>
            <v-col cols="8">
              <span class="font-weight-bold primary--text">
                {{ vehicleDocument.document.label }}
              </span>
            </v-col>
            <v-col cols="4">
              <span class="caption">
                {{ vehicleDocument.status }}
              </span>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-divider></v-divider>
        <v-expansion-panel-content class="px-0">
          <v-card-title class="px-0 pb-0">
            <span class="body-2">
              Upload documents
            </span>
            <v-spacer></v-spacer>
            <span>
              <v-btn 
                small
                depressed
                color="secondary"
                class="caption ttn"
              >
                <v-icon
                  left
                  dark
                >
                  mdi-cloud-upload
                </v-icon>
                Upload
              </v-btn>
            </span>
          </v-card-title>
          
          <v-card-text class="px-0">
            <v-divider class="mt-4 mb-5"></v-divider>
            <v-text-field
              dense
              outlined
              persistent-hint
              class="body-2"
              :label="vehicleDocument.document.label"
              :placeholder="vehicleDocument.document.placeholder"
              v-model="vehicleDocumentObj.value"
              :hint="errors.get('value')"
              :error="errors.has('value')"
              @input="errors.clear('value')"
            ></v-text-field>

            <v-dialog
              ref="dialog"
              v-model="expiryModal"
              :return-value.sync="vehicleDocumentObj.expires_at"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
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
                  @click="$refs.dialog[0].save(vehicleDocumentObj.expires_at)"
                >
                  Select Expiration Date
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-card-text>
          <v-card-actions class="px-0">
            <v-btn
              block
              color="primary"
              :dark="!loading"
              :loading="loading"
              :disabled="loading"
              class="caption font-weight-bold"
              @click="submit(vehicleDocument)"
            >
              Submit document details
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VehicleDocument from '@/libs/app/vehicle_documents/VehicleDocument'

export default {
  data () {
    return {
      loading: false,
      expiryModal: false,
      vehicleDocumentObj: new VehicleDocument()
    }
  },

  computed: {
    ...mapGetters({
      vehicleDocuments: 'getVehicleDocuments'
    }),

    errors () {
      return this.vehicleDocumentObj.form.errors
    }
  },

  methods: {
    ...mapActions([
      'setVehicleDocuments'
    ]),

    loadVehicleDocuments () {
      this.setVehicleDocuments({
        routes: {
          partner: auth.retrieve('partner').id
        }
      })
    },

    submit (vehicleDocument) {
      if (!this.loading) {
        this.loading = true
        this.vehicleDocumentObj.update(vehicleDocument.id)
          .then(response => {
            flash(response)
            this.loadVehicleDocuments()
          })
          .finally(() => {
            this.loading = false
          })
      }
      console.log(vehicleDocument)
    }
  },

  mounted () {
    this.loadVehicleDocuments()
  }
}
</script>