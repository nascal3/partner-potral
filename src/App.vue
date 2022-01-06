<template>
  <v-app id="app"> 
    <!-- Global flash component -->
    <app-flash details=""></app-flash>
    
    <v-container fluid class="app-content">
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
export default {
}
</script>