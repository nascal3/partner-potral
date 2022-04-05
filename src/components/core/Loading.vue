<template>
  <v-container fill-height style="height: 65vh">
    <v-row class="justify-center" align="center">
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
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>
