<template>
  <div class="content">
    <transition name="el-fade-in-linear">
      <div v-show="show" class="transition-box">
        <div class="t-body">
          <img src="http://www.liaojs.cn:3000/public/assets/login.png" alt="">
          <p>欢迎您回来，拥有神一般权利的超级管理员</p>
        </div>
      </div>
    </transition>
    <div class="admin-fun">
      <div class="admin-fun-left">
        <img src="http://www.liaojs.cn:3000/public/assets/login.png" alt="">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="(r, i) in routerList"
            :key="i"
            :index="i.toString()"
            @click="$router.replace(`${ r.path }`)"
          >
            <i :class="r.icon" />
            <span slot="title">{{ r.title }}</span>
          </el-menu-item>

        </el-menu>
      </div>
      <div class="admin-fun-top dispaly-flex">
        <i class="el-icon-menu" />
        <div class="admin-info dispaly-center" @click="$router.go(-1)">
          <el-avatar
            size="small"
            :src="userInfo.avatar_url ? userInfo.avatar_url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
          />
          <span>{{ userInfo.username || userInfo.login }}</span>
        </div>
      </div>
      <div class="admin-fun-right">
        <div class="body">
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import routerList from './model/routerViex'

export default {
  name: 'BlogAdmin',
  data() {
    return {
      show: false,
      activeIndex: '0',
      routerList
    }
  },

  computed: {
    ...mapState(['userInfo'])
  },

  created() {
    this.show = true
    this._adminCheck()
  },
  methods: {
    _adminCheck() {
      const timerId = setTimeout(() => {
        this.show = false
        const path = this.$route.path

        this.activeIndex = this.routerList.findIndex(r => r.path === path).toString()

        if (path === '/blogAdmin') {
          this.$router.replace('/blogAdmin/blogManagement')
          this.activeIndex = '0'
        }

        clearTimeout(timerId)
      }, 1500)
    },

    handleSelect(e) {
      this.activeIndex = e
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    height: 100%;
    position: relative;
  }

  .transition-box {
    width: 100%;
    height: 100%;
    background-color: #545c64;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    border-radius: 5px;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);

    .t-body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    img {
      width: 300px;
    }

    p {
      margin-top: 20px;
      font-size: 22px;
      color: #ffffff;
    }
  }

  .admin-fun {
    height: 100%;

  }

  .admin-fun-left {
    position: fixed;
    left: 0;
    top: 0;
    width: 180px;
    height: 100%;
    background-color: rgb(84, 92, 100);
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);

    img {
      padding: 10px 0;
    }
  }

  .admin-fun-top {
    width: 100%;
    padding: 0 20px;
    position: fixed;
    top: 0;
    left: 180px;
    line-height: 60px;
    background-color: #fff;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
    color: #999999;
    cursor: pointer;
    z-index: 99;

    .admin-info {
      padding-right: 250px;

      span {
        margin-left: 5px;
        font-size: 14px;
      }
    }
  }

  .admin-fun-right {
    padding: 60px 0 1px 180px;
    background-color: #f0f2f5;

    .body {
      margin: 20px;
      padding: 10px;
      min-height: calc(100vh - 101px);

      background-color: #fff;
      border-radius: 5px;

    }
  }
</style>
