<template>
  <v-card v-if="initialised" flat class="ma-0 pa-0">
    <v-card-title>
      <div>
        <h1 class="title font-weight-bold">
          {{ role.display_name }} Role
        </h1>
      </div>
    </v-card-title>

    <v-card-title class="pt-0 mt-0">
      <v-radio-group v-model="group" row>
        <v-radio 
          v-for="(ofType, index) in ['Resourceful', 'General']"
          :key="`permission-${index}`"
          :label="ofType" 
          :value="ofType"
          class="body-1"
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
      group: 'Resourceful',
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