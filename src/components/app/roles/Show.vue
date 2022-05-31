<template>
  <div>
    <div
        v-if="!initialised"
        class="d-flex justify-center align-center loader"
    >
      <app-loading/>
    </div>

    <v-card v-if="initialised" flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ role.display_name }} {{ $t('role.role') }}
          </h1>
          <app-crumbs
              :crumbs="crumbs"
          ></app-crumbs>
        </div>
      </v-card-title>

      <div
          v-if="isSystemManaged"
          class="ma-0 pa-0"
      >
        <div class="d-flex align-center justify-center" style="height: 60vh;">
          <v-card flat>
            <v-card-text class="text-center headline">
              <p class="font-weight-bold">{{ $t('role.oops') }}</p>
              <p class="body-1">
                {{ $t('role.access_control') }}
              </p>
              <p class="body-1 mt-4 text-center">
                <router-link
                    class="deep-orange--text"
                    to="/roles"
                >
                  {{ $t('role.back_to_roles') }}
                </router-link>
              </p>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <div
          v-if="!isSystemManaged"
          class="ma-0 pa-0"
      >
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
      </div>
    </v-card>
  </div>
</template>

<script>
import Role from "@/libs/app/roles/Role"

export default {
  data () {
    return {
      role: null,
      group: 'Resourceful',
      roleObj: new Role(),
      crumbs: [
        { text: 'Roles', to: 'roles' },
        { text: 'Access control', disabled: true },
      ],
    }
  },

  computed: {
    roleId () {
      return this.$route.params.roleId
    },

    initialised () {
      return this.role;
    },

    isSystemManaged () {
      const roleName = (this.role.name.split('::')).pop()
      return ['admin', 'general', 'driver'].includes(roleName)
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

<style lang="scss" scoped>
  .loader {
    min-height: 300px;
  }
</style>
