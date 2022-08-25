<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    class="pa-0 pt-1 caption"
  >
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        exact
        :to="`/${item.to}`"
        :disabled="item.disabled"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: [
    "crumbs"
  ],

  computed: {
    heel () {
      return {
        text: 'Dashboard',
        disabled: false,
        to: '/',
      }
    },

    breadcrumbs () {
      const found = this.crumbs.find(({text}) => text == this.heel.text);
      if (!found) {
        this.crumbs.unshift(this.heel)
      }
      return this.crumbs
    }
  },
}
</script>
