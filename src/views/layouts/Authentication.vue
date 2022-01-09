<template>
  <v-container>
    <v-row>
      <v-col 
        offset-md="4"
        cols="12"
        md="4"
      >
        <v-img 
          class="ml-n1"
          max-width="160"
          src="https://assets.website-files.com/5be92ce6e4a547dcc61b976c/60253f92874eabf1a8ecf88f_Logo_SendyMain_Colored_Normal_SVG.svg"
        ></v-img>

        <h1 class="headline font-weight-black mt-n3">
          {{ headline }}
        </h1>

        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    headline () {
      switch (this.$route.name) {
        case 'register':
          return 'Register partner account'
        case 'generate':
          return 'Login to the portal'
        case 'verify':
          return 'Enter your passcode'
        case 'accounts':
          return 'Choose a partner account '
        default:
          return 'Welcome to the partner portal'
      }
    }
  }
}
</script>