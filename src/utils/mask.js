import { Loading } from 'element-ui'
import Vue from 'vue'

let options = {
  target: '.app-main',
  lock: true,
  text: '',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.9)'
}

let loadInstanceArr = [] // 依赖收集

/*
  @prarms option:Object   自定义Loading配置
  注意：必须放在mount，如果想放在create的话必须异步加载(this.$nextTick),开启多个loading必须传目标dom元素
*/
Vue.prototype.$loadShow = (option) => {
  const obj = {}
  option && option.target && (obj.target = option.target)
  options = { ...options, ...option }
  obj.loadInstance = Loading.service(options)
  loadInstanceArr = [...loadInstanceArr, obj]
}

Vue.prototype.$close = (target = '') => {
  target ? (loadInstanceArr.forEach((item, index) => {
    item.target && item.target === target && (
      item.loadInstance && item.loadInstance.close(),
      loadInstanceArr.splice(index, 1)
    )
  })) : (
    loadInstanceArr.length > 0 && loadInstanceArr[0].loadInstance && loadInstanceArr[0].loadInstance.close(),
    loadInstanceArr = []
  )
}
