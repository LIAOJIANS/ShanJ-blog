<template>
  <div>
    <div class="article-right-search">
      <search-ipunt />
    </div>
    <div class="article-right-body">
      <div class="article-right-top">
        <div class="nav1" @click="$router.push('/aboutMe')">
          <p>
            <span>关于我</span>
          </p>
        </div>
        <div class="nav2" @click="$router.push('/pageFavorites')">
          <p>
            <span>页面收藏夹</span>
          </p>
        </div>
        <div class="nav3" @click="$router.push('/blog')">
          <p>
            <span>热门博客</span>
          </p>
        </div>
        <div class="nav4" @click="$router.push('/messageBoard')">
          <p>
            <span>留言板</span>
          </p>
        </div>
      </div>
    </div>
    <div class="article-right-lits">
      <p>热门文章</p>
      <ul>
        <li
          v-for="(item, index) in blogTitleList"
          v-show="index < 10"
          :key="index"
          class="ellipsis"
          @click="gotoBlogInfo(item._id, item.blogTitle)"
        >
          <span>{{ item.blogTitle }}</span>
          <p>阅读数：{{ item.blogLookNumber }}</p>
        </li>
      </ul>
    </div>
    <div class="article-right-help">
      <p>捐助本站</p>
      <div class="help-me-img">
        <img src="http://www.liaojs.cn:3000/public/assets/helpMe.jpg" alt>
        <p>无论多少，都是心意！</p>
      </div>
    </div>
  </div>
</template>

<script>
import { blogTitleList } from '../../api/blog'
import SearchIpunt from '../SearchInput/SearchInput'
export default {
  name: 'Right',

  components: {
    SearchIpunt
  },
  props: {
    blogList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchValue: '', // 搜索内容
      blogTitleList: [] // 热门数据
    }
  },
  created() {
    blogTitleList().then(res => {
      this.blogTitleList = res.data
    })
  },
  methods: {
    gotoBlogInfo(id) {
      this.$router.replace(`/bolgInfo/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.article-right-body {
  .article-right-top {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: #fff;
    > div {
      width: 50%;
      text-align: center;
      padding: 20px 20px 0;
      > p {
        line-height: 50px;
        font-size: 16px;
        color: #ffffff;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 5px;
        span {
          display: block;
          transition: all 1s;
        }
        > span:hover {
          transform: rotate(360deg);
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .nav1 {
      > p {
        background-color: #666;
      }
    }
    .nav2 {
      > p {
        background-color: #0cc;
      }
    }
    .nav3 {
      padding-bottom: 20px;
      > p {
        background-color: #c96;
      }
    }
    .nav4 {
      padding-bottom: 20px;
      > p {
        background-color: #63c;
      }
    }
  }
}
.article-right-lits {
  margin-bottom: 20px;
  background-color: #fff;
  > p {
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px;
  }
  ul {
    padding: 5px 15px;
    li {
      padding: 15px 10px;
      cursor: pointer;
      transition: all 0.1s;
      p {
        margin-top: 5px;
        font-size: 12px;
        color: #858585;
      }
    }
    li:hover {
      background-color: #f7f7f7;
    }
  }
}
.article-right-help {
  background-color: #fff;
  padding-bottom: 10px;
  > p {
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px;
  }
  .help-me-img {
    text-align: center;
    padding: 10px;
    img {
      width: 80%;
    }
  }
}
</style>
