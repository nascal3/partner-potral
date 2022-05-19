<template>
  <div>
    <app-loading v-if="initialising"></app-loading>

    <v-card
      v-if="!initialising"
      flat
      class="ma-0 pa-0"
    >
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ title }}
          </h1>
          <app-crumbs
            :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="px-1">
        <v-row>
          <v-col
            md="3"
            class="hidden-sm-and-down"
          >
          </v-col>

          <v-col
            sm="12"
            md="9"
          >
            <v-container fluid>
              <router-view
                :transporter="transporter"
                @meta="meta"
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
      initialising: true,
      transporter: null,
      transporterObj: new Transporter(),
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

  watch: {
    transporters ({ data }) {
      if (data.length) {
        const transporter = data[0]
        this.transporterObj.show(transporter.id)
          .then(({ data }) => {
            this.transporter = data
            this.initialising = false
          })
      } else {
        this.initialising = false
      }
    }
  },

  computed: {
    ...mapGetters({
      transporters: 'getTransporters'
    }),

    user () {
      return auth.retrieve('user')
    }
  },

  methods: {
    ...mapActions([
      'setTransporters'
    ]),

    meta (info) {
      this.title = info.title
      const exists = this.crumbs.find(({ text }) => text == info.crumbs.text)
      if (!exists) {
        this.crumbs.push(info.crumbs)
      }
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
