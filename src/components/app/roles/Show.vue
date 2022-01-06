<template>
  <v-card v-if="initialised" flat class="ma-0 pa-0">
    <v-card-title>
      <div>
        <h1 class="title font-weight-bold">
          {{ role.display_name }} Role Access Control
        </h1>
      </div>
      <v-spacer></v-spacer>
      <v-radio-group v-model="group" row>
        <v-spacer></v-spacer>
        <v-radio 
          v-for="(ofType, index) in ['General', 'Resourceful']"
          :key="`permission-${index}`"
          :label="ofType" 
          :value="ofType"
        ></v-radio>
      </v-radio-group> 
    </v-card-title>

    <v-card-text>
      <router-view
        :role="role"
        :group="group"
      ></router-view>
    </v-card-text>
  </v-card>
</template>

<script>
import Role from "@/libs/app/roles/Role"

export default {
  data () {
    return {
      role: null,
      group: 'General',
      roleObj: new Role(),
    }
  },

  computed: {
    roleId () {
      return this.$route.params.roleId
    },

    initialised () {
      return this.role;
    }
  },

  methods: {
    show () {
      this.roleObj.show(this.roleId)
        .then(({ data }) => {
          this.role = data
        })
        .catch(error => {

        })
    },
  },

  mounted () {
    this.show()
  }
}
</script>