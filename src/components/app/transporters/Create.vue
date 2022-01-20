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
          <v-select
            dense
            outlined
            persistent-hint
            label="Select driver *"
            item-text="name"
            item-value="id"
            :items="users.data"
            v-model="transporterObj.driver_id"
            :hint="errors.get('driver_id')"
            :error="errors.has('driver_id')"
            @input="errors.clear('driver_id')"
          ></v-select>
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
import { mapActions, mapGetters } from 'vuex'
import Transporter from "@/libs/app/transporters/Transporter"

export default {
  props: [
    'allocate',
    'vehicle',
  ],

  data () {
    return {
      loading: false,
      dialogLaunch: false,
      transporterObj: new Transporter()
    }
  },

  watch: {
    allocate (value) {
      this.dialogLaunch = Boolean(value)
    }
  },

  computed: {
    ...mapGetters({
      users: 'getUsers'
    }),

    errors () {
      return this.transporterObj.form.errors
    }
  },

  methods: {
    ...mapActions([
      'setUsers'
    ]),

    submit () {
      if (!this.loading) {
        this.transporterObj.vehicle_id = this.vehicle.id

        this.loading = true
        this.transporterObj.store()
          .then(response => {
            flash(response)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
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