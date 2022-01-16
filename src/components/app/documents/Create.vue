<template>
  <v-dialog
    v-if="initialised"
    v-model="dialogLaunch"
    width="650"
    persistent
  >
    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            Provide documents for verification
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

        <v-card-text class="pt-4 pb-10">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(vehicleDocument, index) in vehicleDocuments.data"
              :key="`document-${index}`"
            >
              <v-expansion-panel-header class="body-1 font-weight-bold">
                {{ vehicleDocument.document.label }}
                <!-- <span>
                  <v-chip
                    small
                    class="ml-2"
                    :color="alert(vehicleDocument.status).color"
                  >
                    {{ vehicleDocument.status }}
                  </v-chip>
                </span> -->
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content>
                <v-alert
                  text
                  dense
                  class="mt-4 mb-5 body-2 mx-n1"
                  :color="alert(vehicleDocument.status).color"
                >
                  {{ vehicleDocument.alert }}
                </v-alert>
                <v-row v-if="vehicleDocument.status == 'pending'">
                  <v-col cols="12">
                    <v-text-field
                      dense
                      outlined
                      class="body-2"
                      persistent-hint
                      :label="vehicleDocument.document.label"
                      :value="vehicleDocument.document.value"
                      :disabled="Boolean(vehicleDocument.document.value)"
                      v-model="vehicleDocumentObj.value"
                      :hint="errors.get('value')"
                      :error="errors.has('value')"
                      @input="errors.clear('value')"
                    ></v-text-field>

                    <v-dialog
                      v-if="vehicleDocument.document.is_expirable"
                      ref="dialog"
                      v-model="dateModal"
                      :return-value.sync="vehicleDocumentObj.expires_at"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="vehicleDocumentObj.expires_at"
                          label="Expiration date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          outlined
                          persistent-hint
                          hide-details="auto"
                          class="body-2"
                          :hint="errors.get('expires_at') || errors.get('params.id')"
                          :error="errors.has('expires_at')"
                          @input="errors.clear('expires_at')"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="vehicleDocumentObj.expires_at"
                        scrollable
                        no-title
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="dateModal = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog[0].save(vehicleDocumentObj.expires_at)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>

                  <v-col 
                    cols="12"
                    class="mb-5"
                  >
                    <v-btn
                      :dark="!loading"
                      :loading="loading"
                      :disabled="loading"
                      color="primary"
                      class="ttn caption font-weight-bold"
                      @click="update(vehicleDocument)"
                    >
                      Save
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="12">
                    <p class="body-2">
                      <b>Provided value:</b> {{ vehicleDocument.value }}
                    </p>
                    <p 
                      v-if="vehicleDocument.document.is_expirable"
                      class="body-2"
                    >
                      <b>Renewal date:</b> {{ vehicleDocument.expires_at }}
                    </p>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VehicleDocument from '@/libs/app/vehicle_documents/VehicleDocument'

export default {
  props: [
    'vehicle'
  ],

  data () {
    return {
      loading: false,
      dateModal: false,
      dialogLaunch: false,
      vehicleDocumentObj: new VehicleDocument()
    }
  },

  watch: {
    vehicle (value) {
      this.dialogLaunch = Boolean(value)
      if (value) {
        this.loadVehicleDocuments()
      }
    },
  },

  computed: {
    ...mapGetters({
      vehicleDocuments: 'getVehicleDocuments'
    }),
    
    partner () {
      return auth.retrieve('partner')
    },

    initialised () {
      return this.vehicleDocuments.data
    },

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
          partner: this.partner.id
        },
        params: {
          vehicle_id: this.vehicle.id,
        }
      })
    },

    alert (status) {
      switch (status) {
        case 'pending':
          return {
            icon: 'script-text',
            color: 'primary'
          }
        case 'submitted':
          return {
            icon: 'clock-check',
            color: 'info'
          }
        case 'failed':
          return {
            icon: 'text-box-remove',
            color: 'error'
          }
        case 'passed':
          return {
            icon: 'text-box-check',
            color: 'success'
          }
        case 'expired':
          return {
            icon: 'archive-remove',
            color: 'primary'
          }
      }
    },

    update (vehicleDocument) {
      if (!this.loading) {
        this.loading = true
        this.vehicleDocumentObj.update(vehicleDocument.id)
          .then(response => {
            const index = _.indexOf(this.vehicleDocuments.data, vehicleDocument)
            this.vehicleDocuments.data[index] = response.data
            flash(response)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>