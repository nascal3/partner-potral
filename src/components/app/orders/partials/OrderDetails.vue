<template>
  <v-card flat>
    <v-tabs
        id="order-tabs"
        color="#324BA8"
        left
    >
      <v-tab>{{ $t('orders.summary') }}</v-tab>
      <v-tab>{{ $t('orders.orders') }}</v-tab>
<!--      summary tab-->
      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="3" class="pl-0">
              <location-map class="map"></location-map>
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
                  <div v-if="firstLocation(index)" class="grey-text bold-text">
                    {{ $t('orders.pick_up_location') }}
                  </div>
                  <div v-if="lastLocation(index)" class="grey-text bold-text">
                    {{ $t('orders.destination') }}
                  </div>
                  <div
                      class="destination-text grey-text"
                      :class="{ 'main-location-text': isTitle(index) }"
                  >
                    {{ location }}
                  </div>
                  <div v-if="moreLocations(index)" class="show-pickups">
                    + {{ hiddenLocationsCount }} {{ $t('orders.other_pickups') }}
                    <v-icon color="#324BA8">chevron_right</v-icon>
                  </div>
                </div>
              </section>
            </v-col>
            <v-col cols="12" md="3" class="pl-md-10">
              <section class="info-section">
                <div class="grey-text bold-text">{{ $t('orders.price_per_order') }}</div>
                <div class="bold-text dark-grey-text">KES 139</div>
              </section>
              <section class="info-section">
                <div class="grey-text bold-text">{{ $t('orders.weight_of_order') }}</div>
                <div class="bold-text dark-grey-text">5kgs</div>
              </section>
              <section class="info-section">
                <div class="grey-text bold-text">{{ $t('orders.name_of_driver') }}</div>
                <div class="bold-text blue-text">Christopher Mutua</div>
              </section>
            </v-col>
            <v-col cols="12" md="3">
              <section class="info-section">
                <div class="grey-text bold-text">{{ $t('orders.order_status') }}</div>
                <v-chip color="#DEFAD2" text-color="#116F28" light small>
                  Delivered
                </v-chip>
              </section>
              <section class="info-section">
                <div class="grey-text bold-text">{{ $t('orders.vehicle_assigned') }}</div>
                <div class="bold-text dark-grey-text">KCS 609N</div>
              </section>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
<!--      orders tab-->
      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="2">
              <div class="grey-text bold-text">{{ $t('orders.price_per_order') }}</div>
              <div class="bold-text dark-grey-text">KES 139</div>
            </v-col>
            <v-col cols="12" md="10">
              <div class="grey-text bold-text">{{ $t('orders.total_orders') }}</div>
              <div class="bold-text dark-grey-text">KES 13,609</div>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import LocationsMap from "./LocationsMap";
export default {
  name: "OrderDetails",
  components: {
    LocationsMap,
    'location-map': () => import('@/views/layouts/Map'),
  },

  data() {
    return {
      locations: [
        'Marsabit Plaza, Ngong Road',
        'Home apartments',
        'Winsor Heights',
        'Mandev Plaza',
        'Gitanaga Place',
        'Legend Valley',
        'Brook Center',
        'Rosslyn Ridge, Nairobi, Kenya'
      ]
    }
  },

  computed: {
    hiddenLocationsCount () {
      return this.locations.length - 5
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

    moreLocations(index) {
      return this.locations.length > 5 && index === 0
    }
  },
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
      bottom: -11px;
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
    line-height: 10px;
    margin-bottom: 8px;
  }
  .destination-text {
    font-weight: 700;
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
      height: 5px;
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
      top: -5px;
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
