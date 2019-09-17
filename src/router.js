import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'tableDome',
      component: () => import(/* webpackChunkName: "about" */ './views/tableDome.vue')
    }
  ]
})
