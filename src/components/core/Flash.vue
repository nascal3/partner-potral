<template>
  <v-snackbar
    bottom
    right
    multi-line
    elevation="24"
    :value="show"
    :color="color"
    :timeout="timeout"
    class="body-1 white--text"
  >
    {{ body }}
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
      timeout: 8000,
    };
  },

  methods: {
    flash(details) {
      this.body = details.message;
      this.alert = details.alert;
      this.timeout = details.timeout || 8000;
      this.color = details.color || 'grey darken-3'

      this.show = true;
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
