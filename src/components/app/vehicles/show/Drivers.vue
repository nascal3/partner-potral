<template>
  <div>
    <app-loading 
      v-if="!initialised"
    ></app-loading>
  
    <div v-if="initialised">
      <vehicle-transporter
        v-if="transporter"
        :transporter="transporter"
      ></vehicle-transporter>

      <v-card-title class="body-1 font-weight-bold px-0 py-0">
        Available drivers
      </v-card-title>
      <v-list>
        <template
          v-for="(user, index) in users.data"
        >
          <v-list-item 
            :key="`driver-${index}`"
            class="px-0"
          >
            <v-list-item-avatar 
              color="primary" 
              size="40"
              class="body-1 white--text font-weight-bold"
            >
              {{ user.name.charAt(0) }}
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-1">
                {{ user.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="deep-orange--text body-2">
                {{ user.email || 'n/a' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider
            :key="`divider-${index}`"
            v-if="index < users.data.length - 1"
          ></v-divider>
        </template>
      </v-list>
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
    'vehicle-transporter': () => import('./drivers/Transporter.vue')
  },

  data () {
    return {
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
    }
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