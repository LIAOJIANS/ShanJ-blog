<template>
  <div class="index-header">
    <div class="menu dispaly-flex">
      <div class="dispaly-space">
        <img :src="`${basUrl}/login.png`" alt>
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            v-for="route in routesList"
            :key="route.path"
            :index="route.path"
            @click="$router.replace({ path: route.path})"
          >
            <img
              v-if="route.meta.icon"
              :src="`${basUrl}/${route.meta.icon}`"
              :class="route.path === '/blog' ? 'img' : 'img2'"
            >
            {{ route.meta.title }}
          </el-menu-item>
        </el-menu>
      </div>
      <div v-if="!token">
        <el-menu
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
          v-if="token && userInfo.jurisdiction === 2"
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
          v-else-if="token && userInfo.jurisdiction !== 2"
          class="userInfo-info dispaly-center"
        >
          <el-avatar
            :src="userInfo.avatar_url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
          />
          <span
            class="ellipsis"
          >{{ userInfo.username || userInfo.login }}</span>
          <span style="color: red" @click="userLogout">注销</span>
        </div>
      </div>
    </div>
    <LoginAndregihster
      :is-show-user-fun="isShowUserFun"
      :form-type="formType"
      @closeForm="isShowUserFun = false"
    />
  </div>
</template>

<script>
import routes from '@/router/routes'
import LoginAndregihster from './loginAndregihster'
import { mapState } from 'vuex'
export default {

  components: {
    LoginAndregihster
  },

  data() {
    return {
      routes,
      activeIndex2: '/home',
      isShowUserFun: false,
      formType: 'login'
    }
  },

  computed: {
    basUrl() {
      return `${process.env.VUE_APP_API}/public/assets`
    },

    routesList() {
      return routes.filter(i => !i.meta.hidren)
    },

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
    this.activeIndex2 = this.$route.path
    if (this.activeIndex2 === '/publishBlog') {
      this.activeIndex2 = '/blog'
    }
  },

  methods: {
    userFunction(type) {
      this.isShowUserFun = true
      this.formType = type
    },

    userLogout() {
      this.$store.dispatch('logout')
    },

    goPushBlog(type) {
      this.$router.push(`${type === '发布博客' ? '/publishBlog' : '/blogAdmin'}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.index-header {
  background-color: rgb(84, 92, 100);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.17);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
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
