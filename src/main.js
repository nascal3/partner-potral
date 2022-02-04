require('./bootstrap')
require('./views')

import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing"
import vuetify from './plugins/vuetify'
import './assets/sass/app.scss'
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

Vue.config.productionTip = false
const environment = process.env.DOCKER_ENV
const dns = environment === 'production'
    ? "https://2a1ed506f7124aaba8d015b8e0e4b9a6@o32379.ingest.sentry.io/6179395"
    : null

Sentry.init({
  Vue,
  dsn: dns,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["localhost", "https://partner.sendyit.com/", /^\//],
    }),
  ],
  environment: environment,
  tracesSampleRate: 1.0,
  logErrors: true
});

const options = {
  defaultCountry: 'ke',
  onlyCountries: ['KE', 'CI', 'NG', 'UG'],
  inputOptions: {
    placeholder: 'Phone number *',
  },
  styleClasses: 'phoneInput',
}
Vue.use(VueTelInput, options);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
