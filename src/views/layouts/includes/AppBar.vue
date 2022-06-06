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
      <span class="subtitle-1 mt-3 ml-3 pr-3">{{ partner.business_name }}</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="mr-3 d-flex align-center">
      <notification-icon/>
      <profile-switcher
      ></profile-switcher>

      <!-- <app-switcher></app-switcher> -->
    </div>
  </v-app-bar>
</template>

<script>
export default {
  components: {
    'app-switcher': () => import('./app_bar/AppSwitcher.vue'),
    'notification-icon': () => import('./app_bar/NotificationIcon.vue'),
    'profile-switcher': () => import('./app_bar/ProfileSwitcher.vue')
  },

  computed: {
    partner () {
      return auth.retrieve('partner')
    }
  }
}
</script>
