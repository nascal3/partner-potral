<template>
  <div>
    <v-card-title class="body-1 font-weight-bold px-0 pb-0 pt-0 mt-n2">
      Current driver
    </v-card-title>
 
    <v-list-item class="px-0">
      <v-list-item-avatar
        color="primary"
        size="40"
        class="body-1 white--text font-weight-bold"
      >
        {{ transporter.driver.name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="subtitle-1">
          {{ transporter.driver.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="primary--text body-2">
          {{ transporter.driver.email }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn icon>
          <v-icon color="error">
            mdi-trash-can
          </v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: [
    'transporter'
  ],
}
</script>