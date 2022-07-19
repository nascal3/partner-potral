<template>
  <div v-if="driver">
    <go-online
      :driver="driver"
      :active-broadcast="activeBroadcast"
    ></go-online>
  </div>
</template>

<script>
import Driver from '@/libs/auth/Driver'

export default {
  // props: [
  //   'transporter'
  // ],

  components: {
    'go-online': () => import('./home/GoOnline.vue')
  },

  data () {
    return {
      driver: null,
      driverObj: new Driver()
    }
  },

  computed: {
    activeBroadcast () {
      return this.driver.broadcasts.find(({ is_transmitting }) => is_transmitting)
    }
  },

  methods: {
    setDriverProfile () {
      this.driverObj.profile()
        .then(({ data }) => {
          this.driver = data
          this.$emit('meta', {
            title: 'Home',
            crumbs: [{
              text: 'Location', disabled: true,
            }]
          })
        })
        .catch(error => {
          if (error.status == 404) {
            this.$router.push({ name: 'driver-invalid'} )
          }
        })
    }
  },

  mounted () {
    this.setDriverProfile()
  }
}
</script>
