<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="isShow" class="wall">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>反馈墙</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="title">
          <div class="all-zan dispaly-flex">
            <span>反馈公告</span>
            <div class="btn" @click="showAlert = true">
              <el-button size="small">我要反馈</el-button>
            </div>
          </div>
          <div class="all-notice dispaly-space">
            <p>请各位小伙伴们和平反馈！！！！！！</p>
            <div class="zan" :class="{ 'on' : isZan }" @click="dianz">
              <p>{{ isZan ? '谢谢您的认可哟(＾Ｕ＾)ノ~ＹＯ' : '如果你觉得好的话请给我一个大大的赞吧！！！！' }}</p>
              <p><i class="iconfont icondianzan" /><span>{{ allCount }}</span></p>
            </div>
          </div>
        </div>
        <ul>
          <li v-for="item in wallList" :key="item._id">
            <div class="left-img">
              <img :src="item.avatar_url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" alt="">
            </div>
            <div class="right-content">
              <p class="info ellipsis-one">
                {{ item.content }}
                <span class="name">{{ item.username }}</span>
                <span class="date-time">{{ item.current_time }}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </transition>
    <div class="fun-alert-content">
      <transition name="el-zoom-in-top">
        <div v-show="showAlert" class="fun-alert">
          <div class="title">
            <p>您的意见将是我最大的动力~谢谢各位</p>
            <i class="el-icon-close" @click="showAlert = false" />
          </div>
          <div class="fun-updata">
            <el-input
              v-model="inputValue"
              type="textarea"
              :rows="2"
              placeholder="请输入反馈内容"
            />
          </div>
          <div class="fun-btn">
            <el-button type="primary" size="mini" @click="submitUpdata">确定</el-button>
            <el-button size="mini" @click="showAlert = false">取消</el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { thumbsUp, wallList, subWall } from '../../api/wall'
import { mapState } from 'vuex'
import { messages } from '@/utils/message'
export default {
  name: 'MessageWall',
  data() {
    return {
      isShow: false,
      allCount: 0,
      wallList: [], // 反馈墙数据
      showAlert: false,
      isZan: false,
      inputValue: '' // 反馈内容
    }
  },

  computed: {
    ...mapState(['userInfo'])
  },

  created() {
    this.loadData()
  },

  mounted() {
    this.isShow = true
    console.log(this.$store.state.userInfo)
    this.$nextTick(() => (this.isZan = this.userInfo.isZan))
  },

  methods: {
    loadData() {
      wallList().then(res => {
        this.wallList = res.data.list
        this.allCount = res.data.total
      })
    },
    dianz() { // 对项目进行点赞
      if (!this.userInfo._id) {
        this.$store.dispatch('setLoginViewState', true)
        return messages('请先登录！', 'error')
      }
      this.isZan ? messages('已点过赞,谢谢您的认可哟！') : this.zanHandle()
    },

    zanHandle() {
      thumbsUp().then(res => {
        this.isZan = true
        this.loadData()
        messages(res.msg)
      })
    },

    submitUpdata() { // 提交反馈
      if (!this.inputValue || !this.userInfo._id) {
        return !this.inputValue && messages('请输入内容！', 'error') || !this.userInfo._id && (
          this.$store.dispatch('setLoginViewState', true),
          messages('请先登录！', 'error')
        )
      }
      this.$loadShow()
      subWall(this.inputValue).then(res => {
        messages(res.msg)
        this.showAlert = false
        this.$close()
        this.loadData()
      }).catch(() => this.$close())
    }
  }
}
</script>

<style lang="scss" scoped>
  .wall {
    width: 100%;
    padding: 30px 0;
    .title {
      width: 100%;
      height: 250px;
      margin:  20px 20px 0;
      background-color: #fff;
    }
    .all-zan {
      padding: 10px 20px;
      border-bottom: 1px solid #efefef;
      span {
        font-size: 16px;
        color: #666666;
        font-weight: bold;
      }
    }
    .all-notice {
      padding: 10px;
      > p {
        color: #606266;
        width: 60%;
        font-size: 16px;
        text-align: center;
      }
      .zan {
        margin-right: 50px;
        p:nth-of-type(1) {
          font-size: 16px;
        }
        p:nth-of-type(2) {
          text-align: center;
          margin-top: 20px;
          cursor: pointer;
          span {
            display: block;
            font-size: 32px;
            margin-top: 5px;
          }
        }
        p:nth-of-type(2), i {
          font-size: 90px;
        }
      }
      .on {
        color: #0cc;
      }
    }
    ul {
      margin-top: 30px;
    }
    li {
      position: relative;
      display: flex;
      margin-left: 15px;
      &::before {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 20px 22px;
        border-color: transparent transparent transparent #fff;
        transition: all .5s;
        position: absolute;
        left: 99px;
        top: 36px;
      }
      &::after {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        left: 133px;
        top: 28px;
        background: #ccccce;
        border: 2px solid #fff;
        transition: all .5s;
      }
      &:hover {
        &::before {
          border-color: transparent transparent transparent #ccccce;
        }
        &::after{
          background-color: #666;
        }
        .right-content {
          background-color: #e2dfdf;
        }
      }
    }
    .left-img {
      height: 120px;
      opacity: .9;
      position: relative;
      &::before {
        content: "";
        width: 5px;
        height: 100%;
        background-color: #ee5a5a;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      img {
        position: relative;
        max-width: 100px;
        max-height: 100px;
        min-height: 100px;
        min-width: 100px;
        border-radius: 50%;
        z-index: 999;
      }
    }
    .right-content {
      width: 100%;
      height: 90px;
      background: #f8f8f8;
      display: block;
      border-radius: 5px;
      border: 1px solid #e2dfdf;
      transition: all .5S;
      font-size: 14px;
      margin: 10px 10px 0 60px;
      color: #10200a;
      .info {
        height: 53px;
        padding: 10px;
      }
      span {
        display: block;
        height: 25px;
        line-height: 25px;
        background: #ee5a5a;
        border-radius: 3px;
        text-align: center;
        color: #fff;
        position: absolute;
        overflow: hidden;
        font-size: 14px;
      }
      .name {
        padding: 0 5px;
        right: 118px;
        bottom: 30px;
      }
      .date-time {
        width: 85px;
        right: 18px;
        bottom: 30px;
      }
    }
  }
  .fun-alert-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    .fun-alert {
      width: 300px;
      background-color: #fff;
      box-shadow: 0 0 6px 1px rgba(0,0,0,0.1);
      font-size: 14px;
      .title {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        background-color: #545c64;
        color: #ffffff;
        p {
          width: 100%;
          text-align: center;
          font-size: 12px;
        }
        i {
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
        }
      }
      .fun-updata {
        padding: 20px 10px;
      }
      .fun-btn {
        padding: 15px 0;
        text-align: center;
      }
    }
  }
</style>
