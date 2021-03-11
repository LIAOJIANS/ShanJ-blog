<template>
  <div class="blogInfo dispaly-space">
    <div class="content">
      <div class="title">
        <p>{{ infoData.blogTitle }}</p>
        <div class="stat dispaly-flex">
          <p>发布时间：{{ infoData.currentTime }}</p>
          <p>分类：<span>{{ infoData.fzName }}</span></p>
          <p><span>作者：</span>ShanJ</p>
          <p><i class="iconfont icondianzan" />{{ infoData.blogDNumber }}次点赞</p>
          <p><i class="iconfont iconchakan" />{{ infoData.blogLookNumber }}次阅读</p>
        </div>
      </div>
      <div class="htmStr" v-html="infoData.htmlStr" />
      <div class="dianz">
        <el-button type="warning" size="medium" :disabled="userIsDina" @click="dianz">{{ userIsDina ? '已点赞' : '点赞' }}</el-button>
      </div>
      <div class="new-list">
        <ul>
          <li v-for="(item, index) in newsLists" v-show="index < 2" :key="index">
            <NewList :item="item" />
          </li>
        </ul>
        <div class="mode" @click="$router.push('/epidemic')">查看更多</div>
      </div>
      <Comment />
    </div>
    <div class="right">
      <Right />
    </div>
  </div>
</template>

<script>
import { blodInfo, blogD, getBlogLikeList } from '../../api/blog'
import { newsData } from '../../api/index'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai.css'
import { mapState } from 'vuex'
import Comment from '../../components/Comment/Comment'
import Right from '../../components/right/right'
import NewList from '../../components/NewList/NewList'
import { messages } from '@/utils/message'
export default {
  name: 'BolgInfo',
  components: {
    Comment,
    Right,
    NewList
  },

  data() {
    return {
      id: this.$route.params.name,
      infoData: {},
      userIsDina: false,
      newsLists: [],
      curUserLinkList: []
    }
  },

  computed: {
    ...mapState(['userInfo'])
  },

  watch: {
    '$route'(to, from) { // 监听路由是否变化
      if (to.params.name !== from.params.name) {
        this.id = to.params.name
        this.loadData()
      }
    }
  },

  created() {
    this.loadData()
  },

  mounted() {
    this.$nextTick(() => {
      getBlogLikeList(this.userInfo._id).then(res => {
        this.userIsDina = res.data.some(i => i.bId === this.id)
      })
    })
  },

  methods: {
    loadData() {
      blodInfo(this.id).then(res => {
        this.infoData = res.data
        this.$nextTick(() => {
          const blocks = document.querySelectorAll('pre code')
          blocks.forEach(item => {
            hljs.highlightBlock(item)
          })
        })
      })

      newsData(1).then(res => {
        this.newsLists = res.data.newslist
      })
    },

    dianz() {
      if (!this.userInfo._id) {
        this.$store.dispatch('setLoginViewState', true)
        return messages('请先登录!', 'error')
      }
      this.$loadShow()
      blogD(this.infoData.id, this.userInfo._id).then(res => {
        this.userIsDina = true
        messages(res.msg)
        this.$close()
      }).catch(() => this.$close())
    }
  }
}
</script>

<style lang="scss" scoped>
  .blogInfo {
    margin-top: 20px;
    padding: 0 10px;
  }
  .htmStr {
    padding: 10px;
    > p {
      padding: 10px;
    }
  }
  .title {
    width: 100%;
    font-size: 18px;
    text-align: center;
    padding-top: 10px;
    border-bottom: 1px solid #eae6e6;
    > p {
      margin-top: 20px;
      font-size: 26px;
      font-weight: bold;
    }
    .stat {
      padding: 30px 40px;
      font-size: 12px;
      color: #919898;
      .iconfont {
        margin-right: 5px;
      }
    }
  }
  .dianz {
    padding: 30px 0;
    text-align: center;
  }
  .right {
    width: 28%;
    margin-top: 30px;
  }
  .content {
    width: 78%;
    margin-top: 30px;
    padding-bottom: 30px;
    margin-right: 40px;
    background-color: #fff;
  }
  #vcomments {
    padding: 10px;
    background-color: #fff;
    display: block;
  }
  .new-list {
    li {
      margin-top: 20px;
      padding: 0 10px;
      cursor: pointer;
    }
    .mode {
      cursor: pointer;
      margin: 20px 0;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      color: #666666;
      border: 2px solid #fafafa;
    }
  }
</style>

<style lang="scss">
  .dianz {
    .el-button--medium {
      padding: 10px 50px;
    }
  }
  .htmStr {
    code {
      margin: 10px 0;
    }
    h1,
    h2,
    h3,
    h4,
    h5{
      color: #666;
    }
    p {
      color: #666;
      line-height: 25px;
      text-indent: 22px;
    }
    table {
      font-family: verdana,arial,sans-serif;
      font-size:11px;
      color:#333333;
      border-width: 1px;
      border-color: #a9c6c9;
      border-collapse: collapse;
    }
    table th {
      border-width: 1px;
      padding: 8px;
      border-style: solid;
      border-color: #a9c6c9;
    }
    table td {
      border-width: 1px;
      padding: 8px;
      border-style: solid;
      border-color: #a9c6c9;
    }
    img {
      max-width: 80%;
      margin: 10px 0;
      display: block;
    }
  }

</style>
