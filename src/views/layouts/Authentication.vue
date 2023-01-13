<template>
  <v-container class="auth-container">
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
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.container.container {
  background-color: #F8F9FC;
  min-height: 100%;
}

 .auth-container {
   z-index: 1;

   .content-box {
     position: relative;
     z-index: 1;
   }
 }

</style>

<style lang="scss" scoped>

</style>
