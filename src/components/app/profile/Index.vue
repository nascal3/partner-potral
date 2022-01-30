<template>
  <div>
    <v-card 
      flat 
      class="ma-0 pa-0"
    >
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ doe.name }}
          </h1>
          <app-crumbs
            :crumbs="crumbs"
          ></app-crumbs>
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col 
            md="3"
            class="hidden-sm-and-down"
          >
            Sumn
          </v-col>

          <v-col
            sm="12"
            md="9"
          >
            <v-container fluid>
              <router-view
                :doe="doe"
              ></router-view>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-bottom-navigation 
      absolute
      class="body-2"
    >
      <v-btn
        v-for="(link, index) in navigation"
        :key="`link-${index}`"
        :to="`/profile/${link.to}`"
        active-class="active"
      >
        <span>{{ link.name }}</span>
        <v-icon>mdi-{{ link.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>import Auth from "../../../libs/auth/Auth"

export default {
  data () {
    return {
      // value: true,
      // vehicle: null,
      // vehicleObj: new Vehicle(),
      crumbs: [
        { text: 'Profile', to: 'vehicles' },
      ],
      navigation: [
        { name: 'Personal', icon: 'account', to: 'personal' },
        { name: 'Preferences', icon: 'cog', to: 'preferences' },
        { name: 'Security', icon: 'lock', to: 'security' },
      ]
    }
  },

  computed: {
    doe () {
      return auth.retrieve('user')
    }
  }
}
</script>