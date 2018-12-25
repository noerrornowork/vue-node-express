// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import "@/assets/css/base.css"
import '@/assets/css/checkout.css'

import infiniteScroll from 'vue-infinite-scroll'
import  { ToastPlugin } from 'vux'
import * as filters from '@/assets/js/filter.js'

Vue.config.productionTip = false
Vue.use(ToastPlugin)
Vue.use(infiniteScroll)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
