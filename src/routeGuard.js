import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import store from './store'
import {
  getToken
} from './utils/token'

NProgress.inc(0.2)
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false
})

const blackList = ['/publishBlog', '/blogAdmin/blogManagement', '/blogAdmin', '/blogAdmin/carouselManagement']
router.beforeEach(async(to, from, next) => {
  const isBlack = blackList.some(url => url === to.path)
  NProgress.start()
  if (!getToken()) {
    if (isBlack) { // 如果不存在管理用户token则跳回入口页
      next(from.path)
    } else {
      next()
    }
  } else {
    await store.dispatch('adminUserInfo')
    if (isBlack) {
      Number(store.state.userInfo.jurisdiction) === 2 ? next() : next(from.path)
    } else {
      next()
    }
  }
  NProgress.done() // 结束Progress
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
