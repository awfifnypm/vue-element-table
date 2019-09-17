import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// import mixin from '@/views/mixin.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueJsonp from 'vue-jsonp'

Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.config.productionTip = false
Vue.use(VueJsonp)
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    console.log(binding)
    el.style.position = 'fixed'
    var s = (binding.arg === 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})

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
