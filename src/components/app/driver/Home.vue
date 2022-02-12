<template>
  <div>
    <div v-if="!transporter">
      <div class="ma-0 pa-0">
        <div class="d-flex align-center justify-center" style="height: 60vh;">
          <v-card flat>
            <v-card-text class="text-center headline">
              <p class="font-weight-bold">{{ $t('driver.not_active') }}</p>
              <p class="body-1">
                {{ $t('driver.not_active_message') }}
              </p>
              <p class="body-1 mt-4 text-center">
                <router-link
                  class="deep-orange--text"
                  to="/dashboard"
                >
                  {{ $t('core.to_dashboard') }}
                </router-link>
              </p>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div> 

    <div v-if="transporter">
      <go-online
        v-if="!activeBroadcast"
      ></go-online>

      
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'transporter'
  ],

  components: {
    'go-online': () => import('./home/GoOnline.vue')
  },

  data () {
    return {

    }
  },

  computed: {
    activeBroadcast () {
      return this.transporter.broadcasts.find(({ is_transmitting }) => is_transmitting)
    }
  },

  mounted () {
    return this.$emit('meta', {
      title: 'Home',
      crumbs: {
        text: 'Home', disabled: true,
      }
    })
  }
}
</script>
