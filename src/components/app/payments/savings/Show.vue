<template>
  <div>
    <v-card flat class="ma-0 pa-0">
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t('finance.savings') }}
          </h1>
        </div>
        <v-spacer></v-spacer>

      </v-card-title>

      <v-divider></v-divider>

      <v-row class="mt-5 mb-1">
        <v-col md="6" cols="12">
          <v-row class="date-filters">
            <v-col cols="12" md="4">
              <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dateFrom"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateFrom"
                      :label="$t('orders.from_date')"
                      prepend-inner-icon="event"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @blur="loadData"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateFrom" :locale="locale" :show-current="dateTo" :max="maximumDate">
                  <v-spacer></v-spacer>
                  <v-btn class="btn-text" text color="primary" @click="menu = false">{{ $t('orders.cancel') }}</v-btn>
                  <v-btn class="btn-text" color="primary" @click="$refs.menu.save(dateFrom)">{{ $t('orders.ok') }}</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
              <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="dateTo"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateTo"
                      :label="$t('orders.to_date')"
                      prepend-inner-icon="event"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @blur="loadData"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateTo" :locale="locale" :show-current="dateFrom" :min="minimumDate">
                  <v-spacer></v-spacer>
                  <v-btn class="btn-text" text color="primary" @click="menu2 = false">{{ $t('orders.cancel') }}</v-btn>
                  <v-btn class="btn-text" color="primary" @click="$refs.menu2.save(dateTo)">{{ $t('orders.ok') }}</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <v-card-text class="px-0">
        <v-tabs id="accounts-tabs" left>
          <v-tab>{{ $t('finance.tab_savings') }}</v-tab>
          <v-tab>{{ $t('finance.tab_loans') }}</v-tab>
          <!--      Savings tab-->
          <v-tab-item>
            <savings-details />
          </v-tab-item>
          <!--      Loans tab-->
          <v-tab-item>
            <loans-details/>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { format } from 'date-fns'

export default {
  components: {
    'savings-details': () => import('./partials/Savings'),
    'loans-details': () => import('./partials/Loans'),
  },

  data () {
    return {
      loading: true,
      menu: false,
      menu2: false,
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
      minimumDate: '',
      maximumDate: '',
      locale: localStorage.getItem('setLanguage'),
    }
  },

  watch: {
    dateFrom (newDate) {
      this.minimumDate = newDate
    },

    dateTo (newDate) {
      this.maximumDate = newDate
    }
  },

  methods: {

    formatDate(date) {
      if (!date) return
      return format(new Date(date), 'iii, do LLL')
    },

    loadData() {

    }
  }
}
</script>

<style lang="scss">
#accounts-tabs {
  .v-item-group {
    margin-bottom: 30px;
  }
  .v-chip {
    .v-chip__content {
      padding-top: 2px;
      display: inline-block !important;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.v-tab {
  text-transform: none !important;
  font-weight: 700;
  &--active {
    border-radius: 6px;
  }
}
</style>
