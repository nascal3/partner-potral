<template>
  <div class="d-flex align-center">
    <v-card flat>
      <v-card-text class="text-center title d-flex">
        <v-progress-circular
            :size="40"
            :width="5"
            color="primary"
            indeterminate
        ></v-progress-circular>
        <p class="ml-2 mb-0">{{ $t('core.system_loading') }}.</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {}
</script>
