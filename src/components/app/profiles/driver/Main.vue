<template>
  <div>
    <v-card
      flat
      class="ma-0 pa-0"
    >
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ title }}
          </h1>
          <app-crumbs
            :crumbs="breadcrumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="px-1">
        <v-row>
          <v-col
            md="3"
            class="hidden-sm-and-down"
          ></v-col>

          <v-col
            sm="12"
            md="9"
          >
            <v-container fluid>
              <router-view
                @meta="setMetadata"
              ></router-view>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-bottom-navigation
      absolute
      class="body-2 links"
    >
      <v-btn
        v-for="(link, index) in navigation"
        :key="`link-${index}`"
        :to="`/driver/${link.to}`"
        active-class="active"
      >
        <span>{{ link.name }}</span>
        <v-icon>mdi-{{ link.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Transporter from "@/libs/app/transporters/Transporter"
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

  data () {
    return {
      title: '',
      crumbs: [
        { text: this.$t('driver.driver'), disabled: true, }
      ],
      navigation: [
        { name: this.$t('driver.home'), icon: 'home-variant', to: 'home' },
        { name: this.$t('driver.orders'), icon: 'package-variant', to: 'orders' },
        { name: this.$t('driver.payments'), icon: 'hand-coin', to: 'payments' },
        { name: this.$t('driver.more'), icon: 'apps', to: 'payments' },
      ]
    }
  },

  methods: {
    setMetadata (meta) {
      this.title = meta.title
      this.breadcrumbs = _.union([
        { text: 'Driver', disabled: true, }
      ], meta.crumbs)
    },
  },

  mounted () {
    this.setSegmentEvent('Open driver profile')
    this.setTransporters({
      routes: {
        partner: auth.retrieve('partner').id
      },
      params: {
        is_active: true,
        driver_id: this.user.id,
      }
    })
  }
}
</script>

<style lang="scss">
  .links {
    a.active {
      color: #324BA8 !important
    }
  }
</style>
