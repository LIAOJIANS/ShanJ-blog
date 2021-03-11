<template>
  <div class="content">
    <h1 class="dispaly-content-center">懂记录，勤分享，快输入内容搜索你想要的吧~</h1>
    <search-input :hot-data="hotData" @getSearchValue="getSearchValue" />
    <div class="content-box">
      <p v-show="isShowTuiJian" class="tuijian">热门推荐</p>
      <blog-item :blog-list="blogList" :is-home="false" />
      <el-button :loading="loading" class="mode" plain size="mini" @click="modeList">{{ content }}</el-button>
    </div>
  </div>
</template>

<script>
import SearchInput from '../../components/SearchInput/SearchInput'
import BlogItem from '../../components/BlogItem/BlogItem'
import { getBoldList, blogTitleList } from '../../api/blog'

export default {
  components: {
    SearchInput,
    BlogItem
  },
  data() {
    return {
      searchVal: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      blogList: [],
      loading: true,
      content: '查看更多',
      isShowTuiJian: true,
      hotData: []
    }
  },
  created() {
    this.loadData()
    this.getHotDate()
  },
  methods: {
    getHotDate() {
      blogTitleList().then(res => {
        res.data.forEach((item, index) => {
          if (index > 6) return
          this.hotData.push({
            id: item._id,
            title: item.blogTitle
          })
        })
      })
    },

    loadData() {
      getBoldList(this.listQuery).then(res => {
        const { data } = res.data
        this.loading = false
        this.content = '查看更多'
        if (data < 10) {
          this.content = '暂无更多数据'
        }
        this.blogList = this.blogList.length === 0 ? data : [...this.blogList, ...data]
      })
    },

    getSearchValue(data) {
      this.blogList = data
    },

    modeList() {
      if (this.content !== '查看更多') return
      this.content = '加载中......'
      this.listQuery.pageNum = ++this.listQuery.pageNum
      this.loadData()
    }
  }
}
</script>

<style lang='scss' scoped>
.content {
  padding-bottom: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;

  h1 {
    padding-top: 30px;
    color: #666;
    font-size: 24px;
  }

  .tuijian {
    margin: 20px 0;
    font-size: 24px;
  }

  .content-box {
    padding-top: 10px;
    background: #f4f4f4;
  }

  .ellipsis {
    max-width: 100px;
  }
}

.mode {
  width: 100%;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #666666;
  border: 2px solid #fafafa;
}
</style>
