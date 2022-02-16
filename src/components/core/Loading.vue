<template>
  <div class="d-flex align-center">
    <v-card flat>
      <v-card-text class="text-center title">
        <p>{{ $t('core.system_loading') }}.</p>
        <v-progress-circular
          :size="40"
          :width="5"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {}
</script>
