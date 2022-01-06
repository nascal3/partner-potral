<template>
  <div>
    <h1 class="title font-weight-bold text-center">
      Select Partner Account
    </h1>

    <v-divider class="my-3"></v-divider>
    
    <div
      v-for="(partner, index) in partners"
      :key="`partner-${index}`"
    >
      <v-btn
        class="body-2 ttn"
        @click="selectPartner(partner)"
        text
      >
        {{ partner.name }}
      </v-btn>
    </div>
    
  </div>
</template>

<script>
export default {
  computed: {
    partners () {
      return auth.retrieve('partners')
    }
  },

  methods: {
    selectPartner (partner) {
      auth.encrypt({
        partner,
        ...auth.decrypt(),
      })

      this.$router.push({ name: 'app-dashboard' })
    }
  },
}
</script>