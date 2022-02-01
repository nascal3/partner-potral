<template>
  <v-container>
    <v-row>
      <v-col
        offset-md="4"
        cols="12"
        md="4"
      >
        <div>
          <v-img
            class="ml-n1"
            max-width="100"
            src="https://assets.website-files.com/5be92ce6e4a547dcc61b976c/60253f92874eabf1a8ecf88f_Logo_SendyMain_Colored_Normal_SVG.svg"
          ></v-img>

          <h1 class="subtitle-1 font-weight-black mt-n3">
            {{ headline }}
          </h1>
        </div>
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
          return this.$t('auth.register_partner_account')
        case 'generate':
          return this.$t('auth.login_to_the_portal')
        case 'verify':
          return this.$t('auth.enter_your_passcode')
        case 'accounts':
          return this.$t('auth.choose_a_partner_account')
        default:
          return this.$t('welcome_to_the_partner_portal')
      }
    }
  }
}
</script>
