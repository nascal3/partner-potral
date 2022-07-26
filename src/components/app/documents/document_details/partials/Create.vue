<template>
  <v-dialog

      v-model="dialogLaunch"
      width="400"
      persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          v-on="on"
          v-bind="attrs"
          color="primary"
          class="caption ttn"
          @click="setSegmentEvent('Add bank account')"
      >
        {{ $t('finance.add_bank') }}
      </v-btn>
    </template>

    <v-card v-if="initialised">
      <form @submit.prevent="submit()">
        <v-card-title>
          <h2 class="subtitle-1">
            {{ $t('finance.record_bank') }}
          </h2>
          <v-spacer></v-spacer>
          <v-btn
              icon
              small
              color="red"
              @click="dialogLaunch = false"
          >
            <v-icon small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-5">
          <v-select
              dense
              outlined
              class="body-2"
              persistent-hint
              item-value="id"
              item-text="bank_name"
              :items="vendorTypes.data"
              :label="$t('finance.select_bank_name')"
              v-model="bankObj.bank_id"
              :hint="errors.get('bank_id')"
              :error="errors.has('bank_id')"
              @input="errors.clear('bank_id')"
              @change="setSegmentEvent('Choose bank name')"
          ></v-select>

          <v-text-field
              dense
              outlined
              persistent-hint
              class="body-2"
              :label="$t('finance.bank_branch')"
              v-model="bankObj.bank_branch"
              :hint="errors.get('bank_branch')"
              :error="errors.has('bank_branch')"
              @input="errors.clear('bank_branch')"
              @change="setSegmentEvent('Enter bank branch')"
          ></v-text-field>


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
            {{ $t('finance.save_details') }}
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Bank from '@/libs/app/payments/Bank'
import segmentMixin from "@/mixins/segmentEvents";

export default {
  mixins: [segmentMixin],
  data () {
    return {
      loading: false,
      dialogLaunch: false,
      bankObj: new Bank(),
    }
  },

  watch: {
    country ({ data }) {
      this.loadVendorTypes()
    }
  },

  computed: {
    ...mapGetters({
      country: 'getCountry',
      vendorTypes: 'getVendorTypes',
    }),

    partner () {
      return auth.retrieve('partner')
    },

    initialised () {
      return this.vendorTypes.data && this.country
    },

    errors () {
      return this.vehicleObj.form.errors
    },

    selectedJurisdictions () {
      return this.vehicleObj.jurisdiction_ids
    }
  },

  methods: {
    ...mapActions([
      'setCountry',
      'setVendorTypes'
    ]),

    loadVendorTypes () {
      this.setVendorTypes({
        routes: {
          partner: this.partner.id
        },
        params: {
          country_id: this.partner.country_id,
        },
      })
    },

    submit () {
      this.setSegmentEvent('Add vehicle -- Submit')
      if (!this.loading) {
        this.loading = true
        this.vehicleObj.store()
            .then(response => {
              flash(response)
              this.$emit('stored')
              this.dialogLaunch = false
            })
            .finally(() => {
              this.loading = false
            })
      }
    },
  },

  mounted () {
    this.setCountry({
      routes: {
        id: this.partner.country_id
      },
    })
  }
}
</script>
