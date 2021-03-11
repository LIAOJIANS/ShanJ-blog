import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import './assets/reset.css'
import './assets/fonts/iconfont.css'

// import ElementUI from 'element-ui'
import ElementUI from './utils/elementUi'
import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import './routeGuard'
import '@/utils/mask'

Vue.use(ElementUI, {
  locale
})

Vue.use(router)

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})

console.log(
  '███████╗ ██╗  ╔██╗      ╔██╗       ███╗   ██╗      ██╗' +
    '\n' +
    '██╔════╝ ██║  ║██║    ╔██╝╚██╗     ████╗  ██║      ██║' +
    '\n' +
    '███████╗ ██║██║██║   ╔██║██║██╗    ██╔██╗ ██║      ██║' +
    '\n' +
    '╚════██║ ██║██║██║  ╔██╝    ╚██╗   ██║╚██╗██║ ██   ██║' +
    '\n' +
    '███████║ ██║  ║██║ ╔██╝      ╚██╗  ██║ ╚████║ ╚█████╔╝' +
    '\n' +
    '╚══════╝ ╚═╝  ╚══╝ ╚═╝        ╚═╝  ╚═╝  ╚═══╝ ╚════╝   '
)
