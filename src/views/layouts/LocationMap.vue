<template>
  <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="zoom"
      :options="options"
  >
    <GmapMarker
        v-for="(coordinate, index) in coordinates"
        :position="coordinate"
        :clickable="true"
        @click="toggleInfoWindow(coordinate, index)"
    />
    <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
    >
      <map-info-window :location-name="locationName" />
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
    }
  },

  components: {
    MapInfoWindow
  },

  data: () => ({
    center: mapCoordinates.nairobi,
    zoom: 15,
    coordinates: null,
    locationName: '',
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
    }
  }),

  watch: {
    async locations (newCoordinates) {
      await this.mapInit()
    }
  },

  methods: {
    toggleInfoWindow (marker, index) {
      this.center = marker
      this.infoWindowPos = marker
      this.infoContent = marker
      this.getLocationName(index)
      this.infoWinOpen = !this.infoWinOpen
    },

    getLocationName (index) {
      if (!this.locations.length) return
      this.locationName = this.locations[index].name
      this.$emit('locationName', this.locationName)

    },

    getAllCoordinates () {
      if (!this.locations.length) return
      return  this.locations.map(location => {
        return location.coordinates
      })
    },

    mapInit () {
      const coords = this.getAllCoordinates()
      console.log('MMM', coords)
      this.coordinates = coords || [this.center]
      this.$refs.mapRef.$mapPromise.then(map => {
        // map.panTo(this.propertyLocation)
        const bounds = new google.maps.LatLngBounds()
        coords.forEach(coord => {
          map.fitBounds(bounds.extend(coord))
        })
      }).catch(error => {
        console.log(error)
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
