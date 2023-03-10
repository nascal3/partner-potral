<template>
  <div>
    <app-loading v-if="loading"/>

    <v-list
      v-if="initialised"
      two-line
    >
      <template v-for="(vd, index) in vehicleDocuments.data">
        <v-list-item
          :key="`document-${index}`"
          class="elevation-1 mb-5"
          ripple
          :disabled="disabledUpload(vd.status)"
          @click="vehicleDocument = vd, setSegmentEvent(`Select ${vd.document.label}`)"
        >
          <!-- <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar> -->
          <v-list-item-content>
            <v-list-item-title>
              <v-row>
                <v-col cols="8">
                  <span class="body-1 font-weight-bold">
                    {{ vd.document.label }}
                  </span>
                </v-col>
                <v-col
                  cols="4"
                  class="text-right"
                >
                  <span class="caption">
                    {{ vd.status }}
                  </span>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <vehicle-documents-edit
      :vehicle="vehicle"
      :vehicle-document="vehicleDocument"
      @close="vehicleDocument = null"
      @updated="updated()"
    ></vehicle-documents-edit>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import segmentMixin from "@/mixins/segmentEvents";

export default {
  props: [
    'vehicle'
  ],

  components: {
    'vehicle-documents-edit': () => import('./Edit.vue')
  },

  mixins: [segmentMixin],

  data () {
    return {
      loading: true,
      vehicleDocument: null,
      metadata: {
        title: this.$t('vehicles.legal_Documents'),
      }
    }
  },

  computed: {
    ...mapGetters({
      vehicleDocuments: 'getVehicleDocuments'
    }),

    initialised () {
      return this.vehicleDocuments.data
    }
  },

  watch: {
    vehicleDocuments(documents) {
      this.loading = false
    }
  },

  methods: {
    ...mapActions([
      'setVehicleDocuments'
    ]),

    disabledUpload(documentStatus) {
      const status = ['submitted', 'approved']
      return status.includes(documentStatus)
    },

    loadVehicleDocuments () {
      this.setVehicleDocuments({
        routes: {
          partner: auth.retrieve('partner').id
        },
        params: {
          document_resources: 'vehicle',
          vehicle_id: this.vehicle.id
        }
      }).catch(error => {
        this.loading = false
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    },

    updated () {
      this.loadVehicleDocuments()
      this.vehicleDocument = null
    }
  },

  mounted () {
    this.loadVehicleDocuments()
    this.$emit('meta', this.metadata)
  }
}
</script>
