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
            Allocate vehicle
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
          <!-- <v-text-field
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
          ></v-textarea> -->
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
            Allocate Vehicle to Driver
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: [
    'vehicle'
  ],

  data () {
    return {
      loading: false,
      dialogLaunch: false
    }
  },

  watch: {
    vehicle (value) {
      this.dialogLaunch = Boolean(value)
    }
  },

  methods: {
    ...mapActions([
      'setUsers'
    ])
  },

  mounted () {
    this.setUsers({
      routes: {
        partner: auth.retrieve('partner').id
      }
    })
  }
}
</script>