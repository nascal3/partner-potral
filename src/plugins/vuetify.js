import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#20264a',
        secondary: '#ee7d00',
        accent: '#e67e22',
      }
    },
  },
});
