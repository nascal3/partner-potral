<template>
    <div class="info-window">
        <div class="info-window-title">{{ $t('map.location_name') }}:</div>
        <div class="info-window-text">{{locationName}}</div>
    </div>
</template>

<script>
export default {
  name: 'MapInfoWindow',
  props: {
    locationName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .info-window {
    &-title {
      color: green;
      font-weight: 500;
      margin-bottom: 3px;
    }
    &-text {
      color: orange;
    }
  }
</style>
