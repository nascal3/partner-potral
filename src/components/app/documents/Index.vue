<template>
  <v-row 
    justify="center"
  >
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(vehicleDocument,i) in vehicleDocuments.data"
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
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="px-0">
            <v-btn
              block
              class="caption font-weight-bold"
              color="primary"
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
export default {
  data () {
    return {

    }
  },

  computed: {
    ...mapGetters({
      vehicleDocuments: 'getVehicleDocuments'
    })
  },

  methods: {
    ...mapActions([
      'setVehicleDocuments'
    ])
  },

  mounted () {
    this.setVehicleDocuments({
      routes: {
        partner: auth.retrieve('partner').id
      }
    })
  }
}
</script>