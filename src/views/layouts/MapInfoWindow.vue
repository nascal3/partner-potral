<template>
    <div class="info-window">
      <div class="info-window-title">{{ $t('map.location_name') }}:</div>
      <div class="info-window-text">{{locationDetails.name}}</div>
      <div class="info-window-title">{{ $t('map.waypoint-type') }}:</div>
      <div class="info-window-text">{{locationDetails.waypoint_type}}</div>
    </div>
</template>

<script>
export default {
  name: 'MapInfoWindow',
  props: {
    locationDetails: {
      type: Object,
      default: () => {},
      required: true
    }
  }
}
</script>

<style>
.gm-style-iw {
  max-width: 190px !important;
}
</style>
<style lang="scss" scoped>
.info-window {
  &-title {
    color: green;
    font-weight: 500;
    margin-bottom: 2px;
  }
  &-text {
    color: orange;
    margin-bottom: 10px;
  }
}
</style>
