// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入babel-polyfill解决为Babel 默认只转换新的 JavaScript 语法，而不转换新的 API的问题,不需要引入babel-runtime
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入fastclick-》解决300ms延迟的问题
import fastclick from 'fastclick'
// 官方推荐将fastclick绑定到body下，这样在body下的元素都不会有300ms的延迟
fastclick.attach(document.body)

// 引入mint-ui
import { Lazyload, MessageBox } from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Lazyload)
Vue.prototype.$msg = MessageBox

// 引入addCart
import AddCart from '@/plugins/addCart/addCart'
Vue.use(AddCart)

import axios from 'axios'
Vue.prototype.$http = axios
// 引入通用样式
import 'common/styles/index.less'
import 'common/reset.js'

// 监听全局路由变化
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/category' || to.path === '/cart' || to.path === '/mine') {
    store.state.tabBarShow = true
  } else {
    store.state.tabBarShow = false
  }
  // 导航守卫实现的地址转向
  /* if (to.path === '/cart') {
    if (!store.state.userInfo.id) {
      next('/login')
    }
  } */
  next()
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
