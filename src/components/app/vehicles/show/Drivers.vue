<template>
  <div>
    <app-loading
      v-if="!initialised"
    ></app-loading>

    <div v-if="initialised">

<!--      <driver-deallocate-->
<!--        v-if="transporter"-->
<!--        :transporter="transporter"-->
<!--        @deallocated="loadTransporters()"-->
<!--      ></driver-deallocate>-->

      <driver-allocate
        :users="users"
        :vehicle="vehicle"
        @allocated="loadTransporters()"
      ></driver-allocate>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Transporter from '@/libs/app/transporters/Transporter'

export default {
  props: [
    'vehicle'
  ],

  components: {
    'driver-allocate': () => import('./drivers/Allocate.vue'),
    'driver-deallocate': () => import('./drivers/Deallocate.vue'),
  },

  data () {
    return {
      driver: null,
      transporter: null,
      transporterObj: new Transporter(),
    }
  },

  watch: {
    transporters ({ data }) {
      const transporter = data[0]
      if (transporter) {
        this.transporterObj.show(transporter.id).then(({ data }) => {
          this.transporter = data
        })
      } else {
        this.transporter = null
      }
    }
  },

  computed: {
    ...mapGetters({
      users: 'getUsers',
      transporters: 'getTransporters'
    }),

    initialised () {
      return this.users.data && this.transporters.data
    },
  },

  methods: {
    ...mapActions([
      'setUsers',
      'setTransporters',
    ]),

    loadUsers () {
      this.setUsers({
        routes: {
          partner: (auth.retrieve('partner')).id
        },
        params: {
          roles: 'driver'
        }
      })
    },

    loadTransporters () {
      this.setTransporters({
        routes: {
          partner: (auth.retrieve('partner')).id
        },
        params: {
          is_active: true,
          vehicle_id: this.vehicle.id,
        }
      })
    },
  },

  mounted () {
    this.$emit('meta', {
      title: 'Driver Allocation',
    })

    this.loadUsers()
    this.loadTransporters()
  }
}
</script>
