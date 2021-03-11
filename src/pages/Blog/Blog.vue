<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="isShow" class="content">
        <div v-if="fzName === ''" class="title">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>热门博客</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div v-else class="title">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">热门博客</a></el-breadcrumb-item>
            <el-breadcrumb-item>{{ fzName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="fen-fuList">
          <ul>
            <li>
              <span @click="screenBlog('全部')">全部</span>
            </li>
            <li v-for="item in fzList" :key="item.id">
              <span @click="screenBlog(item)">{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="article-left-body">
          <BlogItem
            :blog-list="bolgList"
            :is-home="isHome"
          />
          <div class="pagination-wrapper">
            <p>共 {{ total }} 条记录 第 {{ listQuery.pageNum }} / {{ Math.ceil(total / 10) }} 页</p>
            <el-pagination
              :total="total"
              :current-page="listQuery.pageNum"
              background
              :page-size="listQuery.pageSize"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getBoldList, fzItemList, fuzzySearch } from '../../api/blog'
import BlogItem from '../../components/BlogItem/BlogItem'
export default {
  name: 'PageFavorites',

  components: {
    BlogItem
  },

  data() {
    return {
      isShow: false,
      bolgList: [],
      fzList: [],
      fzName: '', // 选择的分组名
      positionIndex: 2,
      isHome: false,
      listQuery: { // 分页的配置
        pageNum: 1,
        pageSize: 10
      },
      total: null // 分页数
    }
  },

  computed: {
    ...mapState(['userInfo'])
  },

  created() {
    this.loadData()
    fzItemList().then(res => {
      this.fzList = res.data
    })
  },

  mounted() {
    this.isShow = true
  },

  methods: {
    loadData() {
      getBoldList(this.listQuery).then(res => {
        this.bolgList = res.data.data
        this.total = res.data.total
      })
    },

    screenBlog(blogTitle) { // 分类：按条件过滤
      this.fzName = blogTitle
      blogTitle === '全部' ? this.loadData() : fuzzySearch(blogTitle).then(res => {
        this.bolgList = res.data
        this.total = 1
      })
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    padding: 30px 0;
  }
  .fen-fuList {
    margin-top: 20px;
    padding: 10px 0;

    > ul {
      display: flex;
      flex-wrap: wrap;

      > li {
        width: 33%;
        height: 70px;

        text-align: center;
        position: relative;
        > span {
          padding: 10px 0;
          width: 300px;

          font-size: 16px;
          color: #ffffff;

          display: block;
          background-color: #545c64;
          cursor: pointer;

          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        span:hover {
          background-color: #868584;
        }
      }
    }
  }
  .article-left-body {
    margin-right: 40px;

    .article-left-item {
      /*height: 222px;*/
      padding: 10px 0 25px;
      margin-bottom: 20px;

      background-color: #fff;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;

      .article-let-title {
        padding: 10px 10px 15px;

        font-size: 18px;
        font-weight: bold;
        color: #3d3d3d;
      }

      .article-left-content {
        padding: 10px;

        display: flex;

        .img {
          position: relative;

          > img {
            max-width: 205px;
            max-height: 137px;
            min-width: 205px;
            min-height: 137px;
          }

          .bgc {
            width: 100%;
            height: 100%;

            position: absolute;
            top: 0;
            left: 0;

            background-color: #fff;
            opacity: .6;
            transition: all 1s;
          }

          .hover {
            opacity: 0;
          }

        }
        .article-user-a {
          margin-left: 15px;
        }

        .a-user-top {
          display: flex;

          font-size: 14px;
          color: #919898;
          align-items: center;

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
          padding: 8px 9pt 3px 5px;

          font-size: 14px;
          color: #526163;

          > p {
            padding: 8px 9px 3px 5px;

            font-size: 14px;
            color: #526163;
            line-height: 18px;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            word-wrap:break-word;
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

    .pagination-wrapper {
      padding: 10px 25px 10px 25px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      > p {
        font-size: 12px;
        color: #929292;
      }
    }
  }
</style>
