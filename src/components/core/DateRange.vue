<template>
  <v-row>
    <v-col cols="12" md="6">
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
              :label="$t('core.from_date')"
              prepend-inner-icon="event"
              outlined
              dense
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dateFrom" :locale="locale" :show-current="dateTo" :max="maximumDate">
          <v-spacer></v-spacer>
          <v-btn class="btn-text" text color="primary" @click="menu = false">{{ $t('core.cancel') }}</v-btn>
          <v-btn class="btn-text" color="primary" @click="$refs.menu.save(dateFrom)">{{ $t('core.ok') }}</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" md="6">
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
              :label="$t('core.to_date')"
              prepend-inner-icon="event"
              outlined
              dense
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dateTo" :locale="locale" :show-current="dateFrom" :min="minimumDate">
          <v-spacer></v-spacer>
          <v-btn class="btn-text" text color="primary" @click="menu2 = false">{{ $t('core.cancel') }}</v-btn>
          <v-btn class="btn-text" color="primary" @click="$refs.menu2.save(dateTo)">{{ $t('core.ok') }}</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DateRange",
  data() {
    return {
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
      this.loadDates()
    },

    dateTo (newDate) {
      this.maximumDate = newDate
      this.loadDates()
    }
  },

  methods: {
    loadDates() {
      const dates = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      }
      this.$emit('getDateRange', dates)
    }
  }
}
</script>

<style scoped>

</style>
