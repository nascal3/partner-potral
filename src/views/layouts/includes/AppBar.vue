<template>
  <v-app-bar 
    app
    color="#fff"
    elevation="0"
    style="border-bottom: 1px solid #ddd"
  >
    <v-toolbar-title>
      <v-btn 
        icon
        small
        class="mr-2 hidden-md-and-up"
        @click="$emit('drawer')"
      >
        <v-icon small>mdi-menu</v-icon>
      </v-btn>
      <span class="subtitle-1 mt-3 ml-3 pr-3">{{ group.name }}</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="mr-3">
      <profile-switcher
      ></profile-switcher>

      <!-- <app-switcher></app-switcher> -->
    </div>
  </v-app-bar>
</template>

<script>
export default {
  components: {
    // 'app-switcher': () => import('./app_bar/AppSwitcher'),
    'profile-switcher': () => import('./app_bar/ProfileSwitcher.vue')
  },

  computed: {
    group () {
      return auth.retrieve('partner')
    }
  }
}
</script>