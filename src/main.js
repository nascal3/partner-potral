require('./bootstrap')
require('./views')

import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import vuetify from './plugins/vuetify'
import './assets/sass/app.scss'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import VAnimateCss from 'v-animate-css'

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
      tracingOrigins: ["https://partner-portal.sendyit.com/", /^\//],
    }),
  ],
  environment: environment,
  tracesSampleRate: 1.0,
  logErrors: true
});

const options = {
  defaultCountry: 'ke',
  enabledCountryCode: true,
  mode: 'international',
  inputOptions: {
    placeholder: 'Phone number *',
  }
}
Vue.use(VueTelInput, options)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.MAPS_API_KEY,
    libraries: 'places'
  },
  autobindAllEvents: true
})
Vue.use(VAnimateCss);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
