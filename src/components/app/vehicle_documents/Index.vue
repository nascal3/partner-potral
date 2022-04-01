<template>
  <div>
    <v-list
      v-if="initialised"
      two-line
    >
      <template v-for="(vd, index) in vehicleDocuments.data">
        <v-list-item
          :key="`document-${index}`"
          class="elevation-1 mb-5"
          ripple
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

  methods: {
    ...mapActions([
      'setVehicleDocuments'
    ]),

    loadVehicleDocuments () {
      this.setVehicleDocuments({
        routes: {
          partner: auth.retrieve('partner').id
        },
        params: {
          vehicle_id: this.vehicle.id
        }
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
