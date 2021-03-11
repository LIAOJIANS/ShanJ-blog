<template>
  <div>
    <div
      v-for="(item, index) in blogList"
      v-show="index < (isHome ? blogNumber : blogList.length)"
      :key="index"
      class="article-left-item"
      @click="gotoBlogInfo(item._id)"
    >
      <p class="article-let-title">{{ item.blogTitle }}</p>
      <div class="article-left-content">
        <div class="img">
          <p v-show="index < 2 && isHome" class="common-label" :class="{ 'on': index === 1 }">
            {{ index === 1 ? '值' : '荐' }}<span class="triangle" />
          </p>
          <div class="div">
            <img :class="{ 'hover': index < positionIndex}" src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1038106752,198645983&fm=26&gp=0.jpg" alt="">
          </div>
        </div>
        <div class="article-user-a">
          <div class="a-user-top">
            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="">
            <span class="pl10">ShanJ</span>
            <span class="pl20">发布时间：{{ item.currentTime }}</span>
            <span class="pl20">分类：{{ item.fzName }}</span>
          </div>
          <div class="a-user-content-text">
            <p>{{ item.content }}</p>
            <div>
              <span><i class="iconfont icondianzan" />{{ item.blogDNumber }}</span>
              <!--              <span><i class="iconfont iconpinglun"></i></span>-->
              <span><i class="iconfont iconchakan" />{{ item.blogLookNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogItem',
  props: {
    blogList: {
      type: Array,
      default: () => []
    },
    isHome: Boolean
  },
  data() {
    return {
      blogNumber: 10,
      positionIndex: 0
    }
  },
  mounted() {
    addEventListener('scroll', this._throttle(this._scorllContent, 100))
  },

  methods: {
    _throttle(fn, delay) { // 节流函数 ————  防止快速触发scroll事件
      let data = new Date()
      return function(...args) { // 利用闭包储存时间
        const context = this
        const now = new Date()
        if (now - data >= delay) {
          // 执行函数
          fn.apply(context, args)
          data = now
        }
      }
    },

    _scorllContent() {
      if (window.scrollY > window.innerHeight) {
        this.positionIndex = Math.ceil((window.innerHeight + window.scrollY - 235) / 235)
      } else {
        if (this.isHome) {
          this.positionIndex = Math.ceil((window.scrollY + 235) / 235)
        } else {
          this.positionIndex = Math.ceil((window.innerHeight + window.scrollY - 235) / 235)
        }
      }
    },
    gotoBlogInfo(id) {
      this.$router.push(`/bolgInfo/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .article-left-item {
    padding: 10px 0 25px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;
    background-color: #fff;
    cursor: pointer;
    .article-let-title {
      padding: 10px 10px 8px;
      color: #3d3d3d;
      font-size: 16px;
      font-weight: bold;
    }
    .article-left-content {
      padding: 10px;
      display: flex;
      .img {
        position: relative;
        .div {
          overflow: hidden;
        }
        img {
          display: block;
          max-width: 205px;
          max-height: 137px;
          min-width: 205px;
          min-height: 137px;
          filter: blur(20px);
          overflow: hidden;
          transition: all 1s;
        }
        .hover {
          filter: blur(0px);
        }
      }
      .common-label {
        position: absolute;
        width: 30px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        background-color: #db4659;
        top: 5px;
        left: -21px;
        z-index: 9;
        .triangle {
          position: absolute;
          top: 24px;
          left: -10px;
          width: 0;
          height: 0;
          z-index: 33;
          border-left: 10px solid transparent;
          border-right: 10px solid #df0d3a;
          border-bottom: 7px solid transparent;
        }
      }
      .on {
        background-color: #3472ef;
        .triangle {
          border-right: 10px solid #3472ef;
        }
      }
      .article-user-a {
        margin-left: 15px;
      }
      .a-user-top {
        display: flex;
        align-items: center;
        color: #919898;
        font-size: 14px;
        > img {
          width: 33px;
          height: 33px;
          border-radius: 50%;
        }
        .pl10 {
          padding-left: 10px;
        }
        .pl20 {
          padding-left: 20px;
        }
      }
      .a-user-content-text {
        color: #526163;
        font-size: 14px;
        padding: 8px 9pt 3px 5px;
        > p {
          color: #526163;
          line-height: 18px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          font-size: 14px;
          padding: 8px 9px 3px 5px;
        }
        > div {
          margin-top: 10px;
          span {
            padding-left: 40px;
            font-size: 12px;
            color: #999;
            i {
              padding-right: 5px;
            }
          }
          span:nth-of-type(1) {
            padding-left: 0;
          }
        }
      }
    }
  }
  .article-left-item:hover {
    box-shadow: 3px 4px 8px 3px rgba(0,0,0,0.1);
    transition: box-shadow 0.5s;
  }
</style>
