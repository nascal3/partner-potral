<template>
  <v-container>
    <v-img
        class="ml-n1"
        max-width="100"
        src="https://assets.website-files.com/5be92ce6e4a547dcc61b976c/60253f92874eabf1a8ecf88f_Logo_SendyMain_Colored_Normal_SVG.svg"
    ></v-img>

    <v-row class="content-box pa-4">
      <v-col
        cols="12"
        md="12"
      >
<!--        <div>-->
<!--          <h1 class="subtitle-1 font-weight-black mb-5">-->
<!--            {{ headline }}-->
<!--          </h1>-->
<!--          <h2 class="subtitle-2 font-weight-light mt-n3">-->
<!--            {{ subtitle }}-->
<!--          </h2>-->
<!--        </div>-->
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
        case 'contract':
          return this.$t('auth.partner_contract')
        default:
          return this.$t('auth.welcome_to_the_partner_portal')
      }
    },

    subtitle () {
      switch (this.$route.name) {
        case 'register':
          return this.$t('auth.register_partner_account')
        case 'generate':
          return this.$t('auth.login_to_the_portal')
        case 'verify':
          return this.$t('auth.enter_your_passcode')
        case 'accounts':
          return this.$t('auth.choose_a_partner_account')
        case 'contract':
          return this.$t('auth.contract_subtitle')
        default:
          return this.$t('auth.welcome_to_the_partner_portal')
      }
    },
  }
}
</script>

<style lang="scss">
 .container.container {
   background-color: #F8F9FC;
   min-height: 100%;
   z-index: 1;

   .content-box {
     position: relative;
     z-index: 1;
   }

 }

</style>

<style lang="scss" scoped>

</style>
