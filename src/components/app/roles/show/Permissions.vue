<template>
  <div v-if="initialised">
    <v-row 
      v-for="(groupName, index) in Object.keys(groupedPermissions)"
      :key="groupName"
    >
      <v-col 
        v-if="group == 'Resourceful'"
        class="py-0"
        cols="12"
      >
        <h2 class="font-weight-bold subtitle-1 deep-orange--text">
          {{ upper(groupName.replace('-', ' ')) }}
        </h2>
      </v-col>
      <v-col
        v-for="(permission) in groupedPermissions[groupName]"
        :key="permission.name"
        cols="12"
        class="densed"
      >
        <v-row dense>
          <v-col 
            cols="12"
          >
            <v-checkbox 
              small
              inset
              dense
              hide-details
              class="body-2"
              v-model="switches[permission.name]"
              @change="synchronisePermission(permission)"
              :label="permission.display_name.replace('-', ' ')"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
      <v-col 
        cols="12"
        v-if="index < (Object.keys(groupedPermissions).length - 1)"
      >
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Role from "@/libs/app/roles/Role"
import { mapActions, mapGetters } from 'vuex'

export default {
  props: [
    'role', 'group'
  ],

  data () {
    return {
      switches: {},
      roleObj: new Role(),
      groupedPermissions: null,
    }
  },

  watch: {
    allPermissions ({data}) {
      this.groupPermissions()
    },

    group () {
      this.groupPermissions()
    },
  },

  computed: {
    ...mapGetters({
      allPermissions: 'getPermissions'
    }),

    initialised () {
      return this.groupedPermissions
    }
  },

  methods: {
    ...mapActions([
      'setPermissions'
    ]),

    upper(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    groupPermissions () {
      const { data } = this.allPermissions
      const permissions = data.filter(({permission_type}) => permission_type == this.group.toLowerCase())
      permissions.forEach(permission => {
        const rolePerm = this.role.permissions.find(({name}) => name == permission.name)
        this.switches[permission.name] = rolePerm ? true : false
      })
      this.groupedPermissions = _.groupBy(permissions, 'resource')
    },

    synchronisePermission (permission) {
      this.roleObj.syncPermissions(this.role.id, permission.id)
        .then(response => {
          flash({ message: 'Permission updated successfully' })
        })
        .catch(error => {
          flash({ message: 'Sorry! Something went wrong' })
        })
    }
  },

  mounted () {
    this.setPermissions({
      routes: {
        partner: (auth.retrieve('partner')).id
      }
    })
  }
}
</script>

<style lang="scss">
.densed {
  .v-input--selection-controls {
    margin-top: 0px;
    padding-top: 0px;
  }
}
</style>