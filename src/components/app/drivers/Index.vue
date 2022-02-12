<template>
  <div>
    <app-loading v-if="!initialised" />
    <v-row v-if="initialised">
      <v-col 
        v-if="transporter"
        cols="12"
      >
        <v-card 
          class="elevation-2"
        >
          <v-card-text>
            <v-list-item 
              class="px-0"
            >
              <v-list-item-avatar 
                color="primary" 
                size="40"
                class="body-1 white--text font-weight-bold"
              >
                {{ transporter.driver.name.charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="subtitle-1">
                  {{ transporter.driver.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="primary--text body-2">
                  Currently assigned driver
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="error">
                    mdi-trash-can
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-card-text>
        </v-card>

        <v-divider class="mt-9"></v-divider>
      </v-col>

      <v-col cols="12">
        <v-list>
          <template
            v-for="(user, index) in drivers"
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  props: [
    'vehicle'
  ],

  data () {
    return {
      drivers: null,
      transporter: null,
      transporterObj: new Transporter(),
      metadata: {
        title: 'Driver Allocation',
      }
    }
  },

  watch: {
    users ({ data }) {
      this.drivers = data.filter(({ roles }) => {
        let roleNames = _.map(roles, 'name')
        for (let index=0; index<roleNames.length; index++) {
          roleNames[index] = roleNames[index].split('::').pop()
        }
        return roleNames.includes('driver')
      })
    },

    transporters ({ data }) {
      if (data[0]) {
        this.transporterObj.show(data[0].id)
          .then(({ data }) => {
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
      return this.drivers && this.transporters
    },
  },

  methods: {
    ...mapActions([
      'setUsers',
      'setTransporters',
    ]),
  },

  mounted () {
    this.$emit('meta', this.metadata)
    this.setUsers({
      routes: {
        partner: (auth.retrieve('partner')).id
      }
    })

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
}
</script>