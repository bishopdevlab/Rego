import '@babel/polyfill'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Trend from 'vuetrend'
import VuetifyDialog from 'vuetify-dialog'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import cfg from '../config'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.prototype.$cfg = cfg
if (process.env.NODE_ENV === 'production' && location.protocol === 'http:' && cfg.httpsOnly) location.replace(`https://${location.hostname}`)
Vue.use(VeeValidate)
Vue.use(Trend)
Vue.use(VuetifyDialog)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
