<template>
  <v-row class="py-5">
    <v-col
      cols="12"
      v-for="(partner, index) in partners"
      :key="`partner-${index}`"
    >
      <v-list
        class="mx-auto"
        loading
        outlined
      >
        <v-list-item @click="setPartner(partner)">
          <v-list-item-avatar
            color="primary"
            size="40"
            class="body-1 white--text font-weight-bold"
          >
            {{ partner.business_name.charAt(0) }}
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">
              {{ partner.business_name }}
            </v-list-item-title>
            <v-list-item-subtitle class="deep-orange--text body-2">
              {{ partner.legal_entity_type }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-progress-circular
              v-if="loading == partner.id"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";

export default {
  mixins: [segmentMixin],
  data () {
    return {
      loading: null,
    }
  },

  computed: {
    partners () {
      return auth.retrieve('partners')
    }
  },

  methods: {
    setPartner (partner) {
      this.setSegmentEvent('Choose account')
      if (!this.loading) {
        auth.permit(partner).then(({data}) => {
          auth.encrypt({
            partner,
            abilities: data,
            ...auth.decrypt(),
          })
          this.loading = null
          this.$router.push({ name: 'orders.index' })
        })
      }
    }
  },
}
</script>
