import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
import childRoutes from './routes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'index',
      component: () => import('@/Layout/main'),
      children: childRoutes
    },
    { // 博客管理
      path: '/blogAdmin',
      component: _import('BlogAdmin/BlogAdmin'),
      children: [{ // 博客管理
        path: '/blogAdmin/blogManagement',
        component: _import('BlogAdmin/components/blogManagement')
      },
      { // 轮播图管理
        path: '/blogAdmin/carouselManagement',
        component: _import('BlogAdmin/components/CarouselManagement')
      },
      {
        path: '/blogAdmin/userListManagement',
        component: _import('BlogAdmin/components/UserListManagement')
      },
      {
        path: '/blogAdmin/bookManagement',
        component: _import('BlogAdmin/components/bookManagement')
      }]
    },
    {
      path: '*',
      component: _import('404/404')
    }
  ]
})
