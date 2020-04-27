import Vue from 'vue'
import axios from 'axios'
import ToggleButton from 'vue-js-toggle-button'
import StatusIndicator from 'vue-status-indicator'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import App from './App'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ToggleButton)
Vue.use(StatusIndicator)
Vue.component('VueSlider', VueSlider)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
