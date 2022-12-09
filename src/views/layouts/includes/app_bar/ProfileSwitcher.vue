<template>
  <v-menu
    offset-y
    min-width="230"
  >
    <template v-slot:activator="{ on }">
      <v-avatar
        v-on="on"
        size="32"
        v-if="user.avatar"
      >
        <img
          :src="user.avatar"
          alt="John"
        >
      </v-avatar>

      <v-avatar
        v-else
        size="32"
        v-on="on"
        color="primary"
        class="white--text"
      >
        {{ user.name ? user.name.charAt(0) : 'Co' }}
      </v-avatar>
    </template>
    <v-list class="pt-0">
      <v-list-item
        v-for="(link, index) in links"
        :key="`app-bar-link-${index}`"
        :to="link.to"
      >
        <v-list-item-content class="body-2">
          {{ link.title }}
        </v-list-item-content>
      </v-list-item>

      <!-- <v-list-item>
        <v-list-item-content class="body-2">
          Account Information
        </v-list-item-content>
      </v-list-item> -->

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-content>
          <v-btn
            dark
            block
            color="#e74c3c"
            class="caption font-weight-bold"
            @click="logout()"
          >
            {{ $t('navigation.logout') }}
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";

export default {
  mixins: [segmentMixin],

  data () {
    return {
      links: [
        // { title: this.$t('navigation.driver_profile'), icon: 'driver', to: 'driver/home' }
      ]
    }
  },

  computed: {
    user () {
      return auth.retrieve('user')
    }
  },

  methods: {
    logout () {
      this.setSegmentEvent(`Select logout`)
      auth.logout()
      this.$router.push({
        name: "generate"
      })
    }
  }
}
</script>
