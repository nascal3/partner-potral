<template>
  <div class="mr-4 pt-2">
    <v-menu
        open-on-hover
        transition="slide-y-transition"
        offset-y
        bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on"  icon>
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
              v-model="selectedItem"
              color="primary"
          >
            <v-list-item
                v-for="(notification, index) in notifications"
                :key="index"
            >
              <v-list-item-content @click="setSegmentEvent('Clicked nav notification message')">
                <v-list-item-title v-html="notification.title"></v-list-item-title>
                <v-list-item-subtitle v-html="notification.subtitle"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>

  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";

export default {
  mixins: [segmentMixin],

  data() {
    return {
      selectedItem: null,
      notifications: [
        {
          title: 'Brunch this weekend?',
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`
        },
        {
          title: 'Oui oui',
          subtitle: '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        {
          title: 'Birthday gift',
          subtitle: '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        {
          title: 'Recipe to try',
          subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ],
    }
  },
}
</script>

<style scoped>

</style>
