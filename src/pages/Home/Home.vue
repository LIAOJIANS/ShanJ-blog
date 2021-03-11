<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="isShow" class="index">
        <div class="swipe" style="padding-top: 20px">
          <el-carousel :interval="4000" type="card" height="350px">
            <el-carousel-item v-for="item in swipe" :key="item._id">
              <img style="width: 100%" :src="item.IconImgUrl" alt="" @click="$router.push('/404')">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="recommendation">
          <h2>热门推荐</h2>
          <div class="recommendation-content dispaly-space">
            <div class="recommend">
              <span>今日头条</span>
              <div class="recommend-body">
                <img :src="`${ baseUrl }/public/assets/user_wx.jpg`" alt="">
                <div class="recommend-content">
                  <p>关于开发者</p>
                  <p>很多人问我如何加上博客博主，现在限时活动啦，只要扫以上二维码即可免费加博主，机不可失时不再来，快来行动吧！</p>
                </div>
              </div>
            </div>
            <div class="tab">
              <el-tabs v-model="activeName">
                <el-tab-pane
                  v-for="(item, id) in fzList"
                  :key="id"
                  :label="item.fzName"
                  :name="id.toString()"
                >
                  <div class="tab-body">
                    <div class="tab-left">
                      <div v-for="img in item.fzImgList" :key="img" class="img-bg">
                        <img :src="img" alt="">
                        <div class="tab-bgc">
                          <span>
                            一个web前端的学习流程
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="tab-right">
                      <div
                        v-for="(items, index) in item.fz"
                        v-show="index < 5"
                        :key="index"
                        class="tab-right-body"
                        :class="{ 'active': tableInfo === index }"
                        @mouseover="tableInfo = index"
                      >
                        <p><span>{{ index + 1 }}</span>{{ items.name }}</p>
                        <p class="tab-content">
                          {{ items.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <div class="article dispaly-space">
          <div class="article-left">
            <h2>文章推荐</h2>
            <div class="article-left-body">
              <blog-item :is-home="isHome" :blog-list="blogList" />
            </div>
          </div>
          <div class="article-right">
            <h2>关注博主</h2>
            <blog-shortcut-bar />
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import { getBlodfzinfo, getBoldList } from '../../api/blog'
import { getLunBoList } from '../../api/admin'
import BlogItem from '../../components/BlogItem/BlogItem'
import BlogShortcutBar from '../../components/blogShortcutBar/blogShortcutBar'
export default {
  name: 'Home',
  components: {
    BlogItem,
    BlogShortcutBar
  },
  data() {
    return {
      isHome: true,
      isShow: false,
      tableInfo: 1, // 默认显示第一条新闻
      swipe: [], // 图片数组
      fzList: [], // 默认分组数据
      activeName: '0',
      searchValue: '', // 搜索内容
      blogList: [], // 博客数组
      listQuery: { // 分页的配置
        pageNum: 1,
        pageSize: 10
      }
    }
  },

  computed: {
    baseUrl() {
      return process.env.VUE_APP_API
    }
  },

  created() {
    this.loadData()
  },

  mounted() {
    // 默认动画
    this.isShow = true
  },

  methods: {
    async loadData() {
      getBlodfzinfo().then(res => { // 获取分组数据
        const fzList = res.data
        let index = 1
        fzList.forEach(item => {
          const fzImg = []
          for (let i = 0; i < 2; i++) { // 为每个分组数据添加图片数组
            fzImg.push(`${process.env.VUE_APP_API}/public/assets/home/page${index}.jpg`)
            if (index === 8) { // 如果index大于总静态图片数量则从第一张开始算
              index = 0
            }
            index++
          }
          item.fzImgList = fzImg
        })
        this.fzList = fzList
      })

      getBoldList(this.listQuery).then(res => {
        this.blogList = res.data.data
      })

      getLunBoList().then(res => {
        this.swipe = res.data
        this.swipe.sort((a, b) => a.iconId - b.iconId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-carousel__item h3 {
    margin: 0;
    line-height: 200px;

    font-size: 14px;
    color: #475669;

    opacity: 0.75;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .index {
    padding-bottom: 40px;
  }

  .recommendation {
    h2 {
      padding: 2px 0 2px 10px;
      margin: 20px 0 20px 2px;
      height: 25px;
      line-height: 25px;

      font-size: 16px;
      color: #333;
      font-weight: 400;

      border-left: 2px solid #545c64;
    }
    .recommendation-content {

      .recommend {
        width: 30%;
        height: 255px;
        padding: 0 10px;
        margin-right: 10px;

        position: relative;
        background-color: #fff;
        cursor: pointer;
        overflow: hidden;

        > span {
          padding: 4px 6px;

          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;

          color: #fff;
          background-color: #ea6f1c;
          border-radius: 2px;
        }
        .recommend-body {

          > img {
            max-width: 80%;
            max-height: 158px;
            margin: 10px auto;

            display: block;
          }
          .recommend-content {

            p:nth-of-type(2) {
              color: #666;
            }

            p:nth-of-type(1) {
              padding-bottom: 10px;

              font-size: 16px;
              color: #000;
              font-weight: bold;
              text-align: center;
            }
          }
        }
      }

      .recommend:hover {
        margin-top: -10px;

        transition: margin-top 0.5s;
      }

      .tab {
        width: 70%;
        height: 255px;
        padding: 10px;

        background-color: #fff;
        display: flex;

        .tab-body {
          width: 100%;

          display: flex;
        }

        .tab-left {
          position: relative;

          .img-bg {
            min-width: 200px;
            max-width: 200px;
            min-height: 90px;
            max-height: 90px;
            margin-bottom: 4px;

            position: relative;
            overflow: hidden;
            cursor: pointer;
          }

          img {
            min-width: 200px;
            max-width: 200px;
            height: 90px;

            display: block;
            position: absolute;
            top: 0;
            left: 0;

            transition: all .5s;
            opacity: .8;
          }
          .img-bg:hover{

            img {
              min-width: 210px;
              max-width: 210px;
              height: 95px;

              top: -5px;
              left: -5px;
            }

          }
          .tab-bgc {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 0;
            z-index: 2;
            background: rgba(0,0,0,.2);

            font-size: 13px;
            color: #fff;
            font-weight: 400;
            text-align: center;

            > span {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }

        .tab-right {
          margin-left: 10px;
          padding-top: 5px;

          .tab-right-body {
            padding: 5px 0px 5px 10px;
            height: 27px;

            overflow: hidden;
            transition: all .2s;
            cursor: pointer;

            p {
              font-size: 14px;
            }

            p:nth-of-type(2) {
              padding: 10px 0;

              font-size: 14px;
              color: #666;
            }

            span {
              width: 20px;
              height: 20px;
              margin-right: 5px;
              line-height: 20px;

              display: inline-block;
              font-size: 14px;
              color: #fff;
              text-align: center;

              background: #9a9a9a;
              border-radius: 2px;
            }
          }

          .active {
            height: 70px;

            background-color: #f7f7f7;

            span {
              background-color: #000000;
            }
          }
        }
      }
    }
  }
  .article {
    h2 {
      padding: 2px 0 2px 10px;
      margin: 20px 0 20px 2px;
      height: 25px;
      line-height: 20px;

      font-size: 16px;
      color: #333;
      font-weight: 400;
      border-left: 2px solid #545c64;

    }

    .article-left {
      width: 72%;

      .article-left-body {
        margin-right: 40px;
      }
    }

    .article-right {
      width: 28%;
    }
  }
</style>
