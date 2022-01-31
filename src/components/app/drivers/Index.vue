<template>
  <v-row v-if="initialised">
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
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: [
    'vehicle'
  ],

  data () {
    return {
      drivers: null,
      metadata: {
        title: 'Driver Allocation',
      }
    }
  },

  watch: {
    users ({ data }) {
      console.log(data)
      this.drivers = data.filter(user => {
        
      })
    }
  },

  computed: {
    ...mapGetters({
      users: 'getUsers'
    }),

    initialised () {
      return this.drivers
    }
  },

  methods: {
    ...mapActions([
      'setUsers'
    ]),
  },

  mounted () {
    this.$emit('meta', this.metadata)
    this.setUsers({
      routes: {
        partner: (auth.retrieve('partner')).id
      }
    })
  }
}
</script>