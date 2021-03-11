<template>
  <div
    v-loading="loading"
    class="index"
    element-loading-text="正在登录中....."
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="index-header">
      <div class="menu dispaly-flex">
        <div class="dispaly-space">
          <img src="http://www.liaojs.cn:3000/public/assets/login.png" alt>
          <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/home" @click="$router.replace({ path: '/'})">首页</el-menu-item>
            <el-menu-item
              index="/pageFavorites"
              @click="$router.replace({ path: '/pageFavorites'})"
            >博主收藏</el-menu-item>
            <el-menu-item index="/blog" @click="$router.replace({ path: '/blog'})">
              <img src="http://www.liaojs.cn:3000/public/assets/hot.png" class="img">热门博客
            </el-menu-item>
            <el-menu-item index="/aboutMe" @click="$router.replace({ path: '/aboutMe'})">关于ShanJ</el-menu-item>
            <el-menu-item
              index="/hodgepodge"
              @click="$router.replace({ path: '/hodgepodge'})"
            >js-hodgepodge</el-menu-item>
            <el-menu-item index="/feedback" @click="$router.replace({ path: '/feedback'})">反馈墙</el-menu-item>
            <el-menu-item index="/epidemic" @click="$router.replace({ path: '/epidemic'})">
              <img src="http://www.liaojs.cn:3000/public/assets/new.png" class="img2">IT资讯
            </el-menu-item>
            <el-menu-item
              index="/messageBoard"
              @click="$router.replace({ path: '/messageBoard'})"
            >留言板</el-menu-item>
          </el-menu>
        </div>
        <div v-if="!token">
          <el-menu
            :default-active="activeIndex1"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#fff"
          >
            <el-menu-item index="1" @click="userFunction('login')">登录</el-menu-item>
            <el-menu-item index="2" @click="userFunction('register')">注册</el-menu-item>
          </el-menu>
        </div>
        <div v-else>
          <el-dropdown
            v-if="token && userInfo._id === '5e20337d6b56130b643ece5d'"
            @command="goPushBlog"
          >
            <div class="userInfo-info dispaly-center">
              <el-avatar
                :src="userInfo.avatar_url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
              />
              <span
                class="ellipsis"
                @mouseover="showLogout = true"
                @mouseout="showLogout = false"
              >{{ userInfo.username || userInfo.login }}</span>
              <span style="color: red" @click="userLogout">注销</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="发布博客">发布博客</el-dropdown-item>
              <el-dropdown-item command="博客管理">博客管理</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div
            v-else-if="token && userInfo._id !== '5e20337d6b56130b643ece5d'"
            class="userInfo-info dispaly-center"
          >
            <el-avatar
              :src="userInfo.avatar_url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
            />
            <span
              class="ellipsis"
              @mouseover="showLogout = true"
              @mouseout="showLogout = false"
            >{{ userInfo.username || userInfo.login }}</span>
            <span style="color: red" @click="userLogout">注销</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShowUserFun" class="index-bgc" />
    <div v-show="isShowUserFun" class="index-function">
      <div class="title">
        <p>{{ userFunctionType === 'login' ? '登录Shanj博客' : '注册Shanj博客' }}</p>
        <i class="el-icon-close" @click="_replaceData" />
      </div>
      <div class="body">
        <form action>
          <label for class>
            <span>
              <em style="color:red; margin-right: 5px;">*</em>电子邮箱
              <span style="color: red; font-size: 12px; display: inline">（注：目前只支持QQ邮箱）</span>
            </span>
            <el-input v-model="username" placeholder="请输入邮箱">
              <i slot="prefix" class="el-input__icon el-icon-s-custom" />
            </el-input>
          </label>
          <label v-show="userFunctionType === 'register'" for class="register">
            <span>
              <em style="color:red; margin-right: 5px;">*</em>验证码
            </span>
            <span class="div">
              <el-input v-model="yzm" placeholder="请输入邮箱验证码">
                <i slot="prefix" class="el-input__icon el-icon-success" />
              </el-input>
              <el-button
                type="button"
                class="button"
                :disabled="typeof yzmMsg === 'number'"
                :style="typeof yzmMsg === 'number' ? '' : null"
                @click="sendYzm"
              >{{ yzmMsg }}</el-button>
            </span>
          </label>
          <label for class>
            <span>
              <em style="color:red; margin-right: 5px;">*</em>密码
            </span>
            <el-input v-model="password" type="password" placeholder="请输入密码" @keydown.enter.native="subForm">
              <i slot="prefix" class="el-input__icon el-icon-lock" />
            </el-input>
          </label>
        </form>
        <div class="index-btn">
          <button class="button" @click="subForm">{{ userFunctionType === 'login' ? '登录' : '登录' }}</button>
          <div class="index-alert-info dispaly-flex">
            <p>
              {{ userFunctionType === 'login' ? '没有账号' : '已有账号' }}？
              <span
                @click="_repalce(true)"
              >{{ userFunctionType === 'login' ? '注册' : '登录' }}</span>
            </p>
            <p>{{ userFunctionType === 'login' ? '忘记密码' : null }}</p>
          </div>
        </div>
        <div class="index-onther-btn">
          <p>{{ userFunctionType === 'login' ? '第三方登录' : '第三方注册' }}</p>
          <div>
            <span class="iconfont iconQQ" />
            <span class="iconfont icongit" @click="gotoOrderLogin(gitHubUrl)" />
          </div>
        </div>
      </div>
    </div>
    <div class="index-content">
      <div class="index-body">
        <router-view />
      </div>
    </div>
    <div class="index-button">
      <p>
        Design By :
        <span>建山</span> 备案号 :
        <span>粤ICP备19116950号</span>
      </p>
    </div>
    <div class="index-chongdx">
      <ul>
        <li v-show="isShowComeback" @click="goBackTop">
          <span class="iconfont iconup" style="font-size: 20px; color: #eb5651;" />
        </li>
        <el-tooltip
          class="item"
          effect="dark"
          :content="`访问总人数：${ counts >= 10000 ? `${ parseInt(counts / 10000) }万+` : counts }`"
          placement="left"
        >
          <li>
            <span
              style="font-weight: bold; color: #eb5651;"
            >{{ counts >= 10000 ? `${ parseInt(counts / 10000) }万+` : counts }}</span>
          </li>
        </el-tooltip>
        <li class="liuy" @click="$router.replace({ path: '/feedback'})">
          <span class="iconfont iconfankui" />
        </li>
        <li>
          <span class="iconfont iconicon" style="font-size: 20px; color: #439dde;" />
        </li>
        <li class="user_wx" @mouseover="showWx = true" @mouseout="showWx = false">
          <span class="iconfont iconweixin" style="color: #35a32a;" />
          <div v-show="showWx" class="img">
            <img src="http://www.liaojs.cn:3000/public/assets/user_wx.jpg" alt>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  userLogin,
  sendMsg,
  registerSub
} from '../../api/user'
import { counts, gitHubLogin } from '../../api/index'
import { getUrlKey } from '../../utils/getUrlKey'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeIndex2: '/home',
      yzmMsg: '发送验证码',
      loading: false, // 是否登录中
      activeIndex1: '0',
      userFunctionType: 'login', // 默认用户操作为
      username: '', // 用户名
      password: '', // 密码
      yzm: '', // 邮箱验证码
      isShowUserFun: false, // 显示登录注册框
      counts: 0, // 默然显示的访问数量
      isShowComeback: true, // 是否显示重定距离
      nowDaction: 0, // 停止滑动时的距离
      showWx: false, // 默认隐藏微信二维码
      showLogout: false, // 默认隐藏退出登录按钮
      gitHubUrl: 'https://github.com/login/oauth/authorize?client_id=Iv1.61e6f59c8fc30634&redirect_uri=http://blog.liaojs.cn/home', // 跳转GitHub的路由地址
      // gitHubUrl: 'https://github.com/login/oauth/authorize?client_id=Iv1.61e6f59c8fc30634&redirect_uri=http://127.0.0.1:8080/home', // 跳转GitHub的路由地址
      // wxLoginUrl: 'https://open.weixin.qq.com/connect/qrconnect?appid=wxebdb8b9b72be58ba&redirect_uri=http://www.liaojs.cn:3000/public/myBlog/#/home&response_type=code&scope=SCOPE&state=STATE#wechat_redirect',
      gitHubCode: '' // GitHub登录成功后获取携带的code值
    }
  },

  computed: {
    ...mapState(['token', 'userInfo'])
  },

  watch: {
    $route(to, form) {
      if (to.params.name !== form.params.name) {
        this.activeIndex2 = to.fullPath
      }
    }
  },

  created() {
    this._loadData()
    this.gitHubCode = getUrlKey('code') // 获取code值
    this.activeIndex2 = this.$route.path
    if (this.activeIndex2 === '/publishBlog') {
      // 如果匹配的是博客详情页
      this.activeIndex2 = '/blog'
    }
  },

  mounted() {
    if (this.gitHubCode) {
      // 如果code存在
      this.loading = true
      this._gitHubLogin()
    }
    const self = this
    window.onscroll = function() {
      // const timeId = setTimeout(() => { // 防抖节流
      self.nowDaction = window.scrollY
      if (window.scrollY > 100) {
        // 如果滚动距离超过100显示重定向
        self.isShowComeback = true
      } else {
        self.isShowComeback = false
      }
      // clearTimeout(timeId)
      // }, 300)
    }
  },
  methods: {
    _loadData() {
      counts().then(res => {
        this.counts = res.data.counts
      })
    },

    _gitHubLogin() {
      // gitHub登录
      const client_id = 'Iv1.61e6f59c8fc30634' // id值
      const client_secret = '821a18bac0ea7ef79185896efa3478ef3c1882b8'
      const code = this.gitHubCode // 拿到浏览器中的code值
      gitHubLogin(client_id, client_secret, code).then(res => {
        // 发送请求GitHub用户信息
        if (res.code === 0) {
          this.loading = false
          this.$store.dispatch('adminUserInfo')
        } else {
          this.loading = false
        }
      })
    },

    gotoOrderLogin(url) {
      location.href = url
    },

    goPushBlog(type) {
      if (type === '发布博客') {
        this.$router.push('/publishBlog')
      } else {
        this.$router.push('/blogAdmin')
      }
    },

    sendYzm() {
      // 发送验证码
      if (this.username) {
        let count = 60
        const timer = setInterval(() => {
          this.yzmMsg = count--
          if (count === 0) {
            this.yzmMsg = '发送验证码'
            clearInterval(timer)
          }
        }, 1000)
        sendMsg(this.username).then(res => {
          this.Message('success', '已发送至邮箱', 1000)
        })
      } else {
        this.Message('info', '请填写邮箱', 1000)
      }
    },

    goBackTop() {
      // 重定向到头部
      const that = this
      const timer = setInterval(() => {
        const ispeed = Math.floor(-that.nowDaction / 5)
        document.documentElement.scrollTop = document.body.scrollTop =
          that.nowDaction + ispeed
        if (that.nowDaction === 0) {
          clearInterval(timer)
        }
      }, 16)
    },

    userLogout() {
      console.log('退出登录')
      // 退出登录
      // logout().then(res => {
      //   location.reload() // 重新刷新页面
      //   // location.replace('http://127.0.0.1:8080/public/myBlog/home') // 重定向到首页
      //   location.replace('http://www.liaojs.cn:3000/public/myBlog/home') // 重定向到首页
      //   this.$store.dispatch('logout')
      // })
    },

    userFunction(type) {
      // 存入标识
      this.userFunctionType = type
      this.isShowUserFun = true
    },

    subForm() {
      // 提交表单
      if (this.userFunctionType === 'login') {
        this._subLogin()
      } else {
        this._subRegister()
      }
    },

    _subLogin() {
      // 登录
      const { username, password } = this
      if (!this._isEmail(username)) {
        this.Message('info', '请输入正规邮箱', 1000)
      } else if (!password) {
        this.Message('info', '请输入密码', 1000)
      } else {
        this.loading = true
        userLogin(username, password)
          .then(res => {
            this._success('登录成功', res.data._id)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    _success(msg, token) {
      this._replaceData()
      this.loading = false
      this.$store.dispatch('adminUserInfo')
      this.$store.dispatch('isLogin', token)
      this.Message('success', msg, 1000)
    },

    _replaceData() {
      // 重置数据
      this.isShowUserFun = false
      this._repalce()
    },

    _repalce(type = false) {
      if (type) {
        // 如果只是登录注册切换
        this.userFunctionType = this.userFunctionType === 'login' ? 'register' : 'login'
      }
      this.username = ''
      this.password = ''
      this.yzm = ''
    },

    _subRegister() {
      // 注册
      const { username, password, yzm } = this
      if (!this._isEmail(username)) {
        this.Message('info', '请输入正规邮箱', 1000)
      } else if (!yzm) {
        this.Message('info', '请输入验证码', 1000)
      } else if (!password) {
        this.Message('info', '请输入密码', 1000)
      } else {
        this.loading = true
        registerSub(username, password, yzm)
          .then(res => {
            this._success('登录成功', res.data._id)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    _isEmail(email) {
      return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
        email
      )
    },

    Message(type, msg, time) {
      // 消息封装
      this.$message({
        message: msg,
        type: type,
        duration: time
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  background-color: #f4f4f4;
  height: 100%;
  font-size: 14px;
  position: relative;
}
.index-header {
  background-color: rgb(84, 92, 100);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.17);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  .menu {
    max-width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    height: 60px;
    overflow: hidden;
    img {
      margin-top: 9px;
      margin-right: 10px;
      width: 162px;
      height: 42px;
      cursor: pointer;
    }
  }
  .userInfo-info {
    position: relative;
    cursor: pointer;
    span {
      margin-left: 10px;
      color: #ffffff;
      max-width: 140px;
    }
    .logout {
      padding: 10px;
      position: absolute;
      left: 45%;
      bottom: -40px;
      background-color: #fff;
      border: 1px solid #e8eaec;
    }
  }
}
.index-content {
  width: 100%;
  background-color: #f4f4f4;
  .index-body {
    padding-top: 61px;
    max-width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
  }
}
.index-button {
  height: 50px;
  line-height: 50px;
  text-align: center;
  > p {
    padding: 10px 0;
    color: #ffffff;
    background-color: rgb(84, 92, 100);
    > span {
      font-weight: bold;
    }
  }
}
.index-bgc {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
}
.index-function {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  padding: 5px 20px;
  border-radius: 5px;
  .title {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e8eaec;
    padding: 14px 0;
    p {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #363940;
      line-height: 1;
      font-weight: bold;
    }
    i {
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .body {
    font-size: 14px;
    color: #333333;
    width: 400px;

    form {
      label {
        display: block;
        margin-top: 20px;
      }
      .register {
        .button {
          /*width: 80px;*/
          margin-left: 10px;
          display: block;
          border-radius: 4px;
          border: none;
          text-align: center;
          /*line-height: 36px;*/
          color: #fff;
          background: #19be6b;
          cursor: pointer;
        }
        .div {
          display: flex;
        }
      }
      span {
        display: block;
        padding: 10px 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
      }
    }
    .index-btn {
      margin-top: 20px;
      .button {
        display: block;
        width: 100%;
        margin-bottom: 8px;
        border-radius: 4px;
        border: none;
        text-align: center;
        line-height: 36px;
        color: #fff;
        background: #19be6b;
        cursor: pointer;
      }
      .index-alert-info {
        span,
        p:nth-of-type(2) {
          color: #2a8bec;
          cursor: pointer;
        }
      }
    }
    .index-onther-btn {
      margin: 20px 0 10px;
      > div {
        padding: 15px 0;
        text-align: center;
        span {
          cursor: pointer;
          font-size: 38px;
        }
        span:nth-of-type(1) {
          color: #1a98fc;
          margin-right: 20px;
        }
        span:nth-of-type(2) {
          color: #24292e;
          margin-left: 10px;
        }
      }
    }
  }
}
.index-chongdx {
  width: 50px;
  background-color: #fff;
  position: fixed;
  bottom: 10%;
  right: 4%;
  z-index: 50;
  ul {
    li {
      width: 100%;
      height: 55px;
      background-color: #fff;
      border: 1px solid #ececec;
      border-bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .liuy {
      color: #666666;
      > span {
        font-size: 22px;
      }
    }
    .liuy:hover {
      color: #2a8bec;
    }
    .user_wx {
      position: relative;
      .img {
        padding: 10px;
        background-color: #fff;
        position: absolute;
        top: -36px;
        left: -136px;
        border: 1px solid #e8eaec;
        > img {
          width: 100px;
          height: 100px;
        }
        &::before {
          content: "";
          width: 15px;
          height: 15px;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(50%, -50%) rotate(45deg);
          background-color: #fff;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-menu-item {
  position: relative;
  .img2 {
    position: absolute;
    top: -6px;
    right: 2px;
    max-width: 37px;
    max-height: 16px;
  }
  .img {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 29px;
    max-height: 19px;
  }
}
.el-loading-mask {
  position: fixed;
  top: 0;
  left: 0;
}
.el-menu.el-menu--horizontal {
  border: none;
}
</style>
