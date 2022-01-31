<template>
  <v-row>
    <v-list dense>
      <v-list-item 

        v-for="(user, index) in users.data"
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
        <!-- <v-list-item-action>
          <v-progress-circular
            v-if="loading == partner.id"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-list-item-action> -->
      </v-list-item>
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
      metadata: {
        title: 'Driver Allocation',
      }
    }
  },

  computed: {
    ...mapGetters({
      users: 'getUsers'
    }),
  },

  methods: {
    ...mapActions([
      'setUsers'
    ])
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