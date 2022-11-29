<template>
  <div class="align-center app--full-height">
    <app-drawer
      :show-drawer="showDrawer"
      @closed="showDrawer = false"
    />

    <div class="app--main-content">
      <app-bar
        @drawer="showDrawer = true"
      />

      <v-container
        class="app--content-container"
        fluid
      >
        <v-alert
            v-if="isSanctioned"
            text
            prominent
            type="error"
            icon="mdi-cloud-alert"
            border="left"
        >
          Praesent blandit laoreet nibh. Praesent nonummy mi in odio. Phasellus tempus. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Duis leo.
        </v-alert>
        <router-view />
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    'app-drawer': () => import('./includes/AppDrawer'),
    'app-bar': () => import('./includes/AppBar'),
  },

  data () {
    return {
      showDrawer: false
    }
  },

  computed: {
    ...mapGetters({
      sanction: 'getSanctions',
    }),

    isSanctioned () {
      return this.sanction && this.sanction.sanction
    },

    isTiny () {
      const name = this.$vuetify.breakpoint.name
      return name == 'xs' || name == 'sm'
    }
  },

  methods: {
    ...mapActions([
        'setSanctions',
    ]),

    fetchSanction() {
      const { id } = auth.retrieve('partner')
      this.setSanctions({
        routes: {
          partner: id
        }
      }).catch(error => {
        flash({
          message: error.data.message,
          color: '#e74c3c',
        })
        throw error
      })
    }
  },

  mounted () {
    this.showDrawer = !this.isTiny
    this.fetchSanction()
  }
}
</script>

<style lang="scss">
.container.container {
  background-color: #FFFFFF;
  min-height: 100%;
}
.app--content-container {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
.clip {
  height: 0;
}
</style>
