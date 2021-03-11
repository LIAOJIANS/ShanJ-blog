<template>
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
          <img :src="`${basURL}/public/assets/user_wx.jpg`" alt>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

import { counts } from '../../api/index'
export default {
  data() {
    return {
      showWx: false,
      counts: 0,
      isShowComeback: false,
      nowDaction: 0
    }
  },

  computed: {
    basURL() {
      return process.env.VUE_APP_API
    }
  },

  created() {
    counts().then(res => {
      this.counts = res.data.reduce((a, b) => (a + b.counts), 0)
    })
  },

  mounted() {
    const self = this
    window.onscroll = function() {
      self.nowDaction = window.scrollY
      self.isShowComeback = window.scrollY > 100
    }
  },

  methods: {
    goBackTop() {
      // 重定向到头部
      const that = this
      const timer = setInterval(() => {
        const ispeed = Math.floor(-that.nowDaction / 5)
        document.documentElement.scrollTop = document.body.scrollTop = that.nowDaction + ispeed
        if (that.nowDaction === 0) {
          clearInterval(timer)
        }
      }, 16)
    }
  }
}
</script>

<style lang="scss">

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

      display: flex;
      align-items: center;
      justify-content: center;

      background-color: #fff;
      border: 1px solid #ececec;
      border-bottom: 0;
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

        position: absolute;
        top: -36px;
        left: -136px;

        border: 1px solid #e8eaec;
        background-color: #fff;

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
