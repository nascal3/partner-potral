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
            prominent
            type="error"
            icon="mdi-alert-octagon-outline"
            border="left"
        >
          {{ sanctionMessage }}
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
      showDrawer: false,
      sanctionMessage: null,
      isSanctioned: false
    }
  },

  computed: {
    ...mapGetters({
      sanction: 'getSanctions',
    }),

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
        if (error.response.status === 403) this.isSanctioned = true
        this.sanctionMessage = error.response.data.message
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

<style lang="scss" scoped>
.v-alert {
  z-index: 3;
  position: fixed;
  top: 100px;
}
</style>
