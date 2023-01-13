<template>
  <v-app id="app">
    <!-- Global flash component -->
    <app-flash details=""></app-flash>

    <v-container fluid class="app-content">
      <router-view></router-view>
      <div class="clip"></div>
    </v-container>
  </v-app>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.clip {
  position: absolute;
  width: 100%;
  height: 40%;
  left: 0;
  bottom: 0;
  background: #FFFFFF;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}
</style>
