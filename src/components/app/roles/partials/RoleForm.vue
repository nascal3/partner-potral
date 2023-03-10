<template>
  <v-dialog
    v-model="dialogLaunch"
    width="400"
    persistent
  >
    <v-card>
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ role ? `${$t('role.update')}` : `${$t('role.record')}` }} {{ $t('role.role_details') }}
          </h2>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            color="red"
            @click="$emit('close')"
          >
            <v-icon small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-5">
          <v-text-field
            dense
            outlined
            persistent-hint
            label="Name *"
            v-model="roleObj.display_name"
            :hint="errors.get('display_name')"
            :error="errors.has('display_name')"
            @input="errors.clear('display_name')"
          ></v-text-field>

          <v-textarea
            outlined
            no-resize
            label="Description"
            v-model="roleObj.description"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="px-4 pb-5">
          <v-btn
            block
            large
            type="submit"
            color="primary"
            class="caption font-weight-bold"
            :dark="!loading"
            :loading="loading"
            :disabled="loading"
          >
            {{ role ? $t('role.update') : $t('role.save') }} Role Details
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Role from "@/libs/app/roles/Role"

export default {
  props: [
    'dialogLaunch', 'role'
  ],

  data () {
    return {
      loading: false,
      roleObj: new Role(),
    }
  },


  watch: {
    role (value) {
      if (value) {
        this.roleObj.name = value.name;
        this.roleObj.display_name = value.display_name;
        this.roleObj.description = value.description;
      }
    }
  },

  computed: {
    errors () {
      return this.roleObj.form.errors
    },
  },

  methods: {
    submit () {
      if (!this.loading) {
        this.loading = true
        !this.role ? this.store() : this.update()
      }
    },

    store () {
      this.roleObj.store()
        .then(response => {
          flash({...response, color: '#38c172'})
          this.$emit('stored')
        }).catch(error => {
          flash({
            message: error.message,
            color: '#e74c3c'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    update () {
      this.roleObj.update(this.role.id)
        .then(response => {
          flash({...response, color: '#38c172'})
          this.$emit('updated')
        }).catch(error => {
          flash({
            message: error.message,
            color: '#e74c3c'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
}
</script>
