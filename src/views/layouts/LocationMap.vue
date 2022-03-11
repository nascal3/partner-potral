<template>
  <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="zoom"
      :options="options"
  >
    <GmapMarker
        v-for="(coordinate, index) in coordinates"
        :key="index"
        :position="coordinate"
        :clickable="true"
        @click="toggleInfoWindow(coordinate, index)"
        :icon="setMarkerType(index)"
    />
    <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
    >
      <map-info-window :location-details="locationDetails" />
    </gmap-info-window>
  </GmapMap>
</template>

<script>
import { mapCoordinates } from '../../../config/mapConfigs'
import MapInfoWindow from './MapInfoWindow'

export default {
  name: 'LocationMap',
  props: {
    locations: {
      type: Array,
      default: () => [],
      required: false
    },
    selectedLocation: {
      type: Number,
      required: false
    }
  },

  components: {
    MapInfoWindow
  },

  data: () => ({
    center: mapCoordinates.nairobi,
    zoom: 15,
    coordinates: null,
    locationDetails: {},
    infoContent: '',
    infoWindowPos: { lat: 0, lng: 0 },
    infoWinOpen: false,
    infoOptions: {
      pixelOffset: {
        width: 0,
        height: -35
      }
    },
    error: false,
    noCoordinates: mapCoordinates.noCoordinates,
    options: {
      'zoomControl': false,
      'mapTypeControl': false,
      'scaleControl': false,
      'streetViewControl': false,
      'rotateControl': false,
      'fullscreenControl': false,
      'disableDefaultUi': true
    },
    iconURL: require('@/assets/map-pin-fill.svg')
  }),

  watch: {
    async locations (newCoordinates) {
      await this.mapInit()
    },

    selectedLocation(index) {
      this.fetchLocationDetails(index)
    }
  },

  methods: {
    setMarkerType (index) {
      const firstDestination = index === 0
      const lastDestination = this.locations.length - 1 === index

      const markers = {
        firstDestination: 'map-pin-fill.svg',
        lastDestination: 'map-pin-fill2.svg',
        midDestination: 'map-pin-stroke.svg'
      }

      if (firstDestination) return require(`@/assets/${markers['firstDestination']}`)
      if (lastDestination) return require(`@/assets/${markers['lastDestination']}`)
      return require(`@/assets/${markers['midDestination']}`)
    },

    fetchLocationDetails(index) {
      const { coordinates } = this.locations[index]
      this.toggleInfoWindow(coordinates, index)
      this.infoWinOpen = true
    },

    toggleInfoWindow (marker, index) {
      this.center = marker
      this.infoWindowPos = marker
      this.infoContent = marker
      this.getLocationName(index)
      this.infoWinOpen = !this.infoWinOpen
    },

    getLocationName (index) {
      if (!this.locations.length) return
      const { name, waypoint_type } = this.locations[index]
      this.locationDetails = { name, waypoint_type }
      this.$emit('locationName', this.locationDetails)
    },

    getAllCoordinates () {
      if (!this.locations.length) return
      return  this.locations.map(location => {
        return location.coordinates
      })
    },

    mapInit () {
      const coords = this.getAllCoordinates()
      this.coordinates = coords || [this.center]
      this.$refs.mapRef.$mapPromise.then(map => {
        const bounds = new google.maps.LatLngBounds()
        coords.forEach(coord => {
          map.fitBounds(bounds.extend(coord))
        })
      }).catch(error => {
        throw error
      })
    }
  },

  mounted () {
    this.mapInit()
  }
}
</script>

<style lang="scss" scoped>
.vue-map-container {
  width: 100%;
  height: 100%;
}
</style>
