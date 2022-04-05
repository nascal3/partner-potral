import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // primary: '#324BAB',
        // primary: '#4136A9',
        primary: '#20264a',
        secondary: '#4DB6AC',
        accent: '#e67e22',
      }
    },
  },
});
