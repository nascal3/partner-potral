<template>
  <v-menu 
    offset-y
    min-width="220"
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
        color="secondary"
        class="white--text"
      >
        {{ user.name.charAt(0) }}
      </v-avatar>
    </template>
    <v-list>
      <v-list-item :to="`/profile/security`">
        <v-icon small>mdi-account</v-icon>
        <span class="ml-2 body-2">Account settings</span>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-content>
          <v-btn 
            text
            block
            outlined  
            class="caption"
            @click="logout()"
          >Logout</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  computed: {
    user () {
      return auth.retrieve('user')
    }
  },

  methods: {
    logout () {
      auth.logout()
      this.$router.push({
        name: "login"
      })
    }
  }
}
</script>
