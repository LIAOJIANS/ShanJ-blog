<template>
  <transition name="el-fade-in-linear">
    <div v-show="isShow" class="content">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item>IT咨询</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="body">
        <div class="new-list">
          <ul>
            <li v-for="(item, index) in dataList" :key="index" class="que nowQue">
              <NewList :item="item" />
            </li>
          </ul>
          <el-button :loading="loading" class="mode" plain size="mini" @click="modeList">{{ loading ? '加载中' : '查看更多'
          }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { newsData } from '../../api/index'
import '../../../node_modules/echarts/map/js/china.js'
import NewList from '../../components/NewList/NewList'
export default {
  name: 'EpidemicSituation',
  components: {
    NewList
  },
  data() {
    return {
      dataList: [],
      yqData: {},
      page: 2,
      isShow: true,
      loading: false
    }
  },
  created() {
    this.loadData()
  },
  mounted() {
    this.isShow = true
  },
  methods: {
    loadData() {
      this.loading = true
      newsData(this.page).then(res => {
        this.dataList = [...this.dataList, ...res.data.newslist]
        this.loading = false
      })
    },

    modeList() {
      this.page = ++this.page
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .new-list {
    padding: 10px;
    border-radius: 5px;

    li {
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #f4f4f4;
    }

    .mode {
      width: 100%;
      cursor: pointer;
      margin-top: 20px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      color: #666666;
      border: 2px solid #fafafa;
    }
  }

  .content {
    width: 100%;
    padding-top: 30px;
    padding-bottom: 20px;
  }

  .article-let-title {
    padding: 10px 10px 15px;
    color: #3d3d3d;
    font-size: 18px;
    font-weight: bold;
  }

  .body {
    background-color: #fff;
    margin: 20px 0;
  }

  .dispaly-center {
    padding: 10px 20px;

    li {
      padding: 10px 0;
      width: 25%;
      text-align: center;
      cursor: pointer;
      margin-left: 5px;

      p {
        line-height: 20px;
      }
    }

    .nowQue, .leiQue, .leizhi, .leiDie, .nowys, .nowzz {
      .oneP {
        font-size: 12px;
        color: #999999;
      }

      .twoP {
        font-size: 18px;
        padding: 5px 0;
        font-weight: bold;
        box-sizing: border-box;
      }

      .threeP {
        font-size: 14px;
        color: #333333;
        font-weight: bold;
      }
    }

    .nowQue {
      p {
        color: #d7413b;

        span {
          font-weight: bold;
          color: #d7413b;
        }
      }
    }

    .leiQue {
      p {
        color: #bc2726;

        span {
          font-weight: bold;
          color: #bc2726;
        }
      }
    }

    .leizhi {
      p {
        color: #187d56;

        span {
          font-weight: bold;
          color: #187d56;
        }
      }
    }

    .leiDie {
      p {
        color: #58656e;

        span {
          font-weight: bold;
          color: #58656e;
        }
      }
    }

    .nowys {
      p {
        color: #f98b08;

        span {
          font-weight: bold;
          color: #f98b08;
        }
      }
    }

    .nowzz {
      p {
        color: #e94a88;

        span {
          font-weight: bold;
          color: #e94a88;
        }
      }
    }

    .que {
      background-color: #fef2f1;
    }

    .zhiy {
      background-color: #f0f9f1;
    }

    .die {
      background-color: #f2f7f8;
    }

    .yisi {
      background-color: #fef8e7;
    }

    .nowZ {
      background-color: #faf3f8;
    }
  }
</style>
