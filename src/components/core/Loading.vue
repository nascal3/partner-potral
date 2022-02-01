<template>
  <div class="d-flex align-center justify-center" style="height: 60vh;">
    <v-card flat>
      <v-card-text class="text-center title">
        <p>System is loading! Please wait.</p>
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
export default {

}
</script>