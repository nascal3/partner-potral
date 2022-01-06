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
            {{ role ? `Update` :`Record` }} role details
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
            {{ role ? 'Update' : 'Save' }} Role Details
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
          flash(response)
          this.$emit('stored')
        })
        .finally(() => {
          this.loading = false
        })
    },

    // update () {

    // }
  },
}
</script>