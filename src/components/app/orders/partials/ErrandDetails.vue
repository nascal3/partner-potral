<template>
  <section>
    <app-loading v-if="!showDetails"/>
    <div v-else>
      <div v-if="showError">
        Error: {{ errandDetailsError.data.message }}
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12" md="3" class="pl-0">
            <location-map :selected-location="selectedLocationIndex" :locations="locations" class="map" />
          </v-col>
          <v-col cols="12" md="3" class="pl-0">
            <section
                v-for="(location, index) in locations"
                class="d-flex destination"
                :key="index"
            >
              <div>
                <div v-if="firstLocation(index)" class="start-icon">
                  <v-icon>trip_origin</v-icon>
                </div>
                <div v-if="midLocation(index)" class="location-icon">
                  <v-icon>trip_origin</v-icon>
                </div>
                <div v-if="lastLocation(index)" class="end-icon">
                  <v-icon>trip_origin</v-icon>
                </div>
              </div>
              <div>
                <div v-if="firstLocation(index)" class="grey-text bold-text line-height">
                  {{ $t('orders.errand_start') }}
                </div>
                <div v-if="lastLocation(index)" class="grey-text bold-text line-height">
                  {{ $t('orders.errand_stop') }}
                </div>
                <div
                    class="destination-text grey-text mb-4"
                    :class="{ 'main-location-text': isTitle(index) }"
                    @click="showDetailsLocations(index)"
                >
                  {{ location.name }}
                </div>
                <!--##### Show more stops #####-->
                <div v-if="showMoreLocations(index)" class="show-pickups">
                  + {{ hiddenLocationsCount }} {{ $t('orders.other_destinations') }}
                  <v-icon color="#324BA8">chevron_right</v-icon>
                </div>
              </div>
            </section>
          </v-col>
          <v-col cols="12" md="6" class="pl-0">
            <v-row>
              <v-col cols="12" md="4">
                <section class="info-section">
                  <div class="grey-text bold-text">{{ $t('orders.pricing_type') }}</div>
                  <div class="bold-text dark-grey-text upper-case">
                    {{ formatText(errandDetails.pricing.pricingType) }}
                  </div>
                </section>
              </v-col>
              <v-col cols="12" md="4">
                <section class="info-section">
                  <div class="grey-text bold-text">{{ $t('orders.order_status') }}</div>
                  <v-chip
                      :color="setChipColor(errandDetails.status)"
                      :text-color="setChipTextColor (errandDetails.status)"
                      light
                      small
                  >
                    {{ errandDetails.status.toLowerCase() }}
                  </v-chip>
                </section>
              </v-col>
              <v-col cols="12" md="4">
                <section class="info-section">
                  <div class="grey-text bold-text">{{ $t('orders.driver_delivery_cost') }}</div>
                  <div class="bold-text blue-text">{{ errandDetails.pricing.currency }} {{ errandDetails.pricing.driverDeliveryCost }}</div>
                </section>
              </v-col>
            </v-row>
            <v-row >
              <v-col class="pt-0" cols="12" md="12">
                <div class="grey-text bold-text">{{ $t('orders.order_items') }}</div>
                <v-expansion-panels focusable>
                  <v-expansion-panel v-for="(location, index) in locations" :key="index">
                    <v-expansion-panel-header>{{location.name}}</v-expansion-panel-header>
                    <v-expansion-panel-content class="pt-4" v-if="location.itemDetails && location.itemDetails.length">
                      <div v-for="item in location.itemDetails" :key="item.itemId">
                        <v-row>
                          <v-col cols="12" md="2">
                            <v-img
                                max-width="40"
                                :src="item.metadata.displayImageLink"
                            ></v-img>
                          </v-col>
                          <v-col cols="12" md="6">{{item.metadata.description}}</v-col>
                          <v-col cols="12" md="4" class="grey-text bold-text">
                            {{ $t('orders.quantity') }}: {{item.quantity}}
                          </v-col>
                        </v-row>
                      </div>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content v-else>
                      {{ $t('orders.no_order_items') }}
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
  </section>
</template>

<script>
// import mockErrandsDetailsResponse from "../../../../../tests/e2e/fixtures/errandsDetails.json"

export default {
  props: {
    errandDetails: {
      type: Object,
      default: () => {}
    },
    errandDetailsError: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      showDetails: false,
      showError: false,
      locations: [],
      selectedLocationIndex: null,
      // errandDetails: mockErrandsDetailsResponse.data
    }
  },

  components: {
    'location-map': () => import('@/views/layouts/LocationMap'),
  },

  watch: {
    errandDetails(newDetails) {
      this.setOrderItemsDetails(newDetails.path)
      this.setLocationsDisplay()
    },

    errandDetailsError(error) {
      this.showError = Object.keys(error).length
      this.showDetails = true
    }
  },

  methods: {
    firstLocation(index) {
      return index === 0
    },

    midLocation(index) {
      return index !== 0 && index !== this.locations.length - 1
    },

    lastLocation(index) {
      return index === this.locations.length - 1
    },

    isTitle(index) {
      return index === 0 || index === this.locations.length - 1
    },

    showMoreLocations(index) {
      return this.locations.length > 5 && index === 0
    },

    showDetailsLocations(index) {
      this.selectedLocationIndex = index
    },

    findWaypointItems (details) {
      const items = []
      details.forEach( (detail, index) => {
        const isIt = Object.keys(detail).includes('items')
        if (isIt) items.push(details[index].items)
      })
      return items[0]
    },

    formatText(text) {
      return text.split('_').join(' ')
    },

    setChipColor (orderStatus) {
      const colorMap = {
        'pending': '#FBDECF',
        'failed': '#FBDECF',
        'confirmed': '#CCEFFF',
        'complete': '#DEFAD2',
        'in transit': '#FDDB97'
      }
      return colorMap[orderStatus.toLowerCase()]
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'pending': '#9B101C',
        'failed': '#9B101C',
        'confirmed': '#006492',
        'complete': '#116F28',
        'in transit': '#9D5004'
      }
      return colorMap[orderStatus.toLowerCase()]
    },

    setLocationsDisplay () {
      if (!Object.keys(this.errandDetails).length) return
      this.errandDetails.instructions.map(detail => {
        const coordinates = detail.location.coordinates.split(',')
        const location = {
          coordinates: {
            lat: parseFloat(coordinates[0]),
            lng: parseFloat(coordinates[1])
          },
          status: detail.status,
          name: detail.location.name,
          note: detail.location.note,
          itemDetails: this.findWaypointItems(detail.actions)
        }
        this.locations.push(location)

      })
      this.showDetails = true
    }
  },

  mounted () {
    this.setLocationsDisplay()
  }
}
</script>

<style lang="scss" scoped>
.grey-text {
  color: #909399;
}
.dark-grey-text {
  color: #606266;
}
.bold-text {
  font-weight: 700;
  font-size: 15px;
}
.blue-text {
  color: #324BA8;
}
.info-section {
  margin-bottom: 20px;
}
.first-location {
  line-height: 20px;
}
.destination {
  position: relative;
  &-text {
    font-weight: 700;
    cursor: pointer;
  }
}
.start-icon {
  position: relative;
  padding-top: 9px;
  margin-right: 10px;
  &::after {
    content: "";
    position: absolute;
    border-left: 3px dashed #EE7D00;
    left: 7px;
    bottom: -13px;
    height: 21px;
  }
  .v-icon{
    color: #EE7D00;
    font-size: 18px;
  }
}
.main-location-text {
  font-size: 15px;
  color: #606266;
  line-height: 14px;
  margin-bottom: 8px;
}
.line-height {
  line-height: 20px;
}
.upper-case {
  text-transform: uppercase;
}
.location-icon {
  position: relative;
  margin-right: 10px;
  &::after {
    content: "";
    position: absolute;
    border-left: 3px solid #EE7D00;
    left: 7px;
    top: 24px;
    height: 8px;
  }
  &::before {
    content: "";
    position: absolute;
    border-left: 3px solid #EE7D00;
    left: 7px;
    top: 3px;
    height: 7px;
  }
  .v-icon{
    color: #EE7D00;
    font-size: 18px;
  }
}
.last-location {
  line-height: 20px;
}
.end-icon {
  position: relative;
  padding-top: 9px;
  margin-right: 10px;
  &::after {
    content: "";
    position: absolute;
    border-left: 3px dashed #324BA8;
    left: 7px;
    top: -7px;
    height: 26px;
  }
  .v-icon{
    color: #324BA8;
    font-size: 18px;
  }
}
.show-pickups {
  color: #324BA8;
  font-weight: 700;
  cursor: pointer;
  padding-left: 20px;
  margin-bottom: 7px;
  border-left: 3px dashed #EE7D00;
  position: relative;
  left: -21px;
}
.map {
  height: 245px !important;
}
</style>
