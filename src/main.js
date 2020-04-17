// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as http from '@/api/http'
import store from '@/store'
import progressive from 'progressive-image/dist/vue'; // 渐进式
import VueI18n from 'vue-i18n'
import { en, zh,idn} from './lang'


// Vue.use(router);
// 移动端适配
import 'lib-flexible/flexible.js'
import 'normalize.css/normalize.css' // 去除默认样式

import Cube from 'cube-ui'
Vue.use(Cube)
Vue.use(VueI18n)
import "./style/reset.less";


Vue.use(progressive, {
  removePreview: true,
  scale: true
})

import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)



// 解决移动端click事件300毫秒延迟方法
import FastClick from 'fastclick'
if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      FastClick.attach(document.body)
    },
    false
  )
}

const i18n = new VueI18n({
   // 从本地存储中取，如果没有默认为中文
  // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
  locale: localStorage.getItem('lang') || 'idn',
  messages: {
    'zh-CN': zh, // 中文繁体
    'eng': en, // 英文
    'idn': idn  //印尼
  }
})
// console.log(localStorage.getItem('lang'))
Vue.prototype.$http = http.default

Vue.config.productionTip = false



/* eslint-disable no-new */
 new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
