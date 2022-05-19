<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('notifications.notifications_title') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

      </v-card-title>

      <v-divider></v-divider>

      <v-spacer></v-spacer>

      <notifications/>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    'notifications': () => import('./Show.vue')
  }
}
</script>

<style lang="scss">
#documents-tabs {
  .v-item-group {
    margin-bottom: 30px;
  }
}
</style>

