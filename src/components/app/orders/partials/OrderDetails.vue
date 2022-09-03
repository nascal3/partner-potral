<template>
  <v-card flat>
    <app-loading v-if="!showDetails"/>
    <div v-if="showError">
      {{ orderDetailsError.data.message }}
    </div>
    <v-tabs
        v-if="showDetails && !showError"
        id="order-tabs"
        color="#324BA8"
        left
    >
      <v-tab>{{ $t('orders.tab_summary') }}</v-tab>
<!--      <v-tab>{{ $t('orders.tab_order') }}</v-tab>-->
<!--      order summary tab-->
      <v-tab-item>
        <v-container fluid>
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
                    {{ $t('orders.first_destination') }}
                  </div>
                  <div v-if="lastLocation(index)" class="grey-text bold-text line-height">
                    {{ $t('orders.last_destination') }}
                  </div>
                  <div
                      class="destination-text grey-text mb-4"
                      :class="{ 'main-location-text': isTitle(index) }"
                      @click="showDetailsLocations(index)"
                  >
                    {{ location.name }}
                  </div>
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
                    <div class="grey-text bold-text">{{ $t('orders.vehicle_assigned') }}</div>
                    <div class="bold-text dark-grey-text upper-case">
                      {{ orderDetails.vehicle_details.registration_no }}
                    </div>
                  </section>
                </v-col>
                <v-col cols="12" md="4">
                  <section class="info-section">
                    <div class="grey-text bold-text">{{ $t('orders.order_status') }}</div>
                    <v-chip
                        :color="setChipColor(orderDetails.status)"
                        :text-color="setChipTextColor (orderDetails.status)"
                        light
                        small
                    >
                      {{ orderDetails.status }}
                    </v-chip>
                  </section>
                </v-col>
                <v-col cols="12" md="4">
                  <section class="info-section">
                    <div class="grey-text bold-text">{{ $t('orders.name_of_driver') }}</div>
                    <div class="bold-text blue-text">{{ orderDetails.rider_details.name }}</div>
                  </section>
                </v-col>
              </v-row>
              <v-row >
                <v-col class="pt-0" cols="12" md="12">
                  <div class="grey-text bold-text">{{ $t('orders.order_items') }}</div>
                  <v-expansion-panels focusable>
                    <v-expansion-panel v-for="(item, index) in orderItems" :key="index">
                      <v-expansion-panel-header>{{item.name}} - {{item.waypoint_type}}</v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-4" v-if="item.order_items && item.order_items.length">
                        <div v-for="item in getAllItems(item.order_items)" :key="item.id">

                          <v-row>
                            <v-col cols="12" md="2">
                              <v-img
                                  max-width="40"
                                  :src="item.display_img_link"
                              ></v-img>
                            </v-col>
                            <v-col cols="12" md="6">{{item.display_name}}</v-col>
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
        </v-container>
      </v-tab-item>
<!--      orders tab-->
<!--      <v-tab-item>-->
<!--        <v-container fluid>-->
<!--          <v-row>-->
<!--            <v-col cols="12" md="2">-->
<!--              <div class="grey-text bold-text">{{ $t('orders.price_per_order') }}</div>-->
<!--              <div class="bold-text dark-grey-text">KES 139</div>-->
<!--            </v-col>-->
<!--            <v-col cols="12" md="10">-->
<!--              <div class="grey-text bold-text">{{ $t('orders.total_orders') }}</div>-->
<!--              <div class="bold-text dark-grey-text">KES 13,609</div>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--        </v-container>-->
<!--      </v-tab-item>-->
    </v-tabs>
  </v-card>
</template>

<script>
import formatNumbers from "@/mixins/formatNumbers"

export default {
  name: "OrderDetails",

  props: {
    orderDetails: {
      type: Object,
      default: () => {}
    },
    orderDetailsError: {
      type: Object,
      default: () => {}
    }
  },

  mixins: [formatNumbers],

  components: {
    'location-map': () => import('@/views/layouts/LocationMap'),
  },

  data() {
    return {
      showDetails: false,
      showError: false,
      locations: [],
      selectedLocationIndex: null,
      orderItems: []
    }
  },

  computed: {
    hiddenLocationsCount () {
      return this.locations.length - 5
    },
  },

  watch: {
    orderDetails(newDetails) {
      this.setOrderItemsDetails(newDetails.path)
      this.setLocationsDisplay()
    },

    orderDetailsError(error) {
      this.showError = Object.keys(error).length
      this.showDetails = true
    }
  },

  methods: {
    setChipColor (orderStatus) {
      const colorMap = {
        'pending': '#FBDECF',
        'failed': '#FBDECF',
        'confirmed': '#CCEFFF',
        'delivered': '#DEFAD2',
        'in transit': '#FDDB97'
      }
      return colorMap[orderStatus]
    },

    setChipTextColor (orderStatus) {
      const colorMap = {
        'pending': '#9B101C',
        'failed': '#9B101C',
        'confirmed': '#006492',
        'delivered': '#116F28',
        'in transit': '#9D5004'
      }
      return colorMap[orderStatus]
    },

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

    setOrderItemsDetails(orderItems) {
      this.orderItems = orderItems
    },

    getAllItems(itemsArray) {
      if (!itemsArray.length) return
      const newItemArray = itemsArray.map(item => {
        return item.checklist_items
      })
      return newItemArray.flat()
    },

    setLocationsDisplay () {
      if (!Object.keys(this.orderDetails).length) return
      this.orderDetails.path.map(detail => {
        const coordinates = detail.coordinates.split(',')
        const location = {
          coordinates: {
            lat: parseFloat(coordinates[0]),
            lng: parseFloat(coordinates[1])
          },
          waypoint_type: detail.waypoint_type,
          name: detail.name
        }
        this.locations.push(location)
      })
      this.showDetails = true
    }
  }
}
</script>

<style lang="scss">
  #order-tabs {
    .v-tabs-slider-wrapper {
      .v-tabs-slider {
        background-color: transparent;
      }
    }
    .v-tab.v-tab {
      color: #909399;
      height: 38px;
      &--active {
        color: inherit;
      }
    }
    .v-item-group {
      margin-bottom: 30px;
    }
    .v-chip {
      .v-chip__content {
        padding-top: 2px;
        display: inline-block !important;
        &:first-letter {
          text-transform: uppercase;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .v-tabs {
    margin-top: 20px;
  }
  .v-tab {
    text-transform: none !important;
    font-weight: 700;
    &--active {
      background: #F0F3F7;
      border-radius: 6px;
    }
  }
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
