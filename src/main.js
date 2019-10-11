import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// import mixin from '@/views/mixin.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueJsonp from 'vue-jsonp'
import { utility } from '@/views/defineApi.js'
import Table from '@/api/tables.js'

Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.prototype.utility = utility
Vue.config.productionTip = false
Vue.use(VueJsonp)
Vue.use(Table)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Vue.mixin({
//   data () {
//     return {
//       dataReady: false
//     }
//   }
// })
