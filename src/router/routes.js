
const _import = require('./_import_' + process.env.NODE_ENV)

export default [
  { // 首页
    path: '/home',
    component: _import('Home/Home'),
    meta: {
      title: '首页'
    }
  },
  { // 收藏夹
    path: '/pageFavorites',
    component: _import('PageFavorites/PageFavorites'),
    meta: {
      title: '收藏夹'
    }
  },
  { // 热门博客
    path: '/blog',
    component: _import('Blog/Blog'),
    meta: {
      title: '热门博客',
      icon: 'hot.png'
    }
  },
  { // 发布博客
    path: '/publishBlog',
    component: _import('PublishBlog/PublishBlog'),
    meta: {
      title: '发布博客',
      hidren: true
    }
  },
  { // 博客详情
    path: '/bolgInfo/:name',
    component: _import('BolgInfo/BolgInfo'),
    meta: {
      title: '博客详情',
      hidren: true
    }
  },
  { // 关于我
    path: '/aboutMe',
    component: _import('AboutMe/AboutMe'),
    meta: {
      title: '关于我'
    }
  },
  { // js库
    path: '/hodgepodge',
    component: _import('jsHodgepodgeMd/jsHodgepodgeMd'),
    meta: {
      title: 'js-hodgepodge'
    }
  },
  { // 反馈墙
    path: '/feedback',
    component: _import('MessageWall/MessageWall'),
    meta: {
      title: '反馈墙'
    }
  },
  { // 反馈墙
    path: '/epidemic',
    component: _import('EpidemicSituation/EpidemicSituation'),
    meta: {
      icon: 'new.png',
      title: 'IT资讯'
    }
  },
  { // 留言
    path: '/messageBoard',
    component: _import('MessageBoard/MessageBoard'),
    meta: {
      title: '留言板'
    }
  },
  { // 搜索
    path: '/search',
    component: _import('Search/Search'),
    meta: {
      title: '搜索',
      hidren: true
    }
  }
]
