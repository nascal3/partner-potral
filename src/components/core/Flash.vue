<template>
  <v-snackbar
    elevation="24"
    :value="show"
    :color="color"
    :timeout="timeout"
    class="body-1 white--text"
  >
    {{ body }}
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        text
        color="#ffffff"
        v-bind="attrs"
        @click="show = false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: ["details"],

  data() {
    return {
      body: "",
      show: false,
      alert: null,
      color: 'grey darken-3',
      timeout: 4000,
    };
  },

  methods: {
    flash(details) {
      this.body = details.message;
      this.alert = details.alert;
      this.timeout = details.timeout || 10000;
      this.color = details.color || 'grey darken-3'

      this.show = this.body.length;
      setTimeout(() => {
        this.body = "";
        this.show = false;
        this.alert = null;
      }, this.timeout);
    },
  },

  created() {
    window.events.$on("flash", (details) => {
      this.flash(details);
    });
  },
};
</script>
