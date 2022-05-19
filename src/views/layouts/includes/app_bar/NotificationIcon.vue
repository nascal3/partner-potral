<template>
  <div class="mr-4 pt-2">
    <v-menu
        open-on-hover
        transition="slide-y-transition"
        offset-y
        bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-badge
              color="pink"
              :content="notifications.length"
              :value="notifications.length"
              overlap
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

      </template>

      <v-card
          class="mx-auto"
          min-width="300"
          max-width="300"
          tile
      >
        <v-list flat>
          <v-subheader>
            {{ $t('navigation.notifications') }}
            <v-spacer></v-spacer>
            <v-icon>mdi-email-open</v-icon>
          </v-subheader>
          <v-divider></v-divider>
          <v-list-item-group
              v-if="notifications.length"
              v-model="selectedItem"
              color="primary"
          >
            <v-list-item
                v-for="(notification, index) in notifications"
                :key="index"
            >
              <v-list-item-content @click="setSegmentEvent('Clicked nav notification message')">
                <v-list-item-title v-html="notification.title"></v-list-item-title>
                <v-list-item-subtitle v-html="notification.message"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <div class="d-flex align-center justify-center pa-4" v-else>
            {{ $t('notifications.all_notifications_read') }}
          </div>
        </v-list>
      </v-card>
    </v-menu>

  </div>
</template>

<script>
import mockResponse from '@/libs/app/notifications/mockResponce.json'
import segmentMixin from "@/mixins/segmentEvents";

export default {
  mixins: [segmentMixin],

  data() {
    return {
      selectedItem: null,
      notifications: []
    }
  },

  methods: {
    unreadNotifications() {
      this.notifications = mockResponse.filter(notification => {
        return notification.status === "unread"
      })
    }
  },

  mounted () {
    this.unreadNotifications()
  }
}
</script>

<style scoped>

</style>
