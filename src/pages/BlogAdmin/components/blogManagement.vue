<template>
  <div class="blogAdmin">
    <div class="total">
      <ul class="dispaly-flex">
        <li>
          <p><i class="iconfont iconzongfangwenliang" />网站访问总数</p>
          <p>{{ counts }}</p>
        </li>
        <li>
          <p><i class="iconfont iconquanbu" />全部博客</p>
          <p>{{ total }}篇</p>
        </li>
        <li>
          <p><i class="iconfont iconicon4" />博客访问总量</p>
          <p>{{ allLookNumber }}</p>
        </li>
        <li>
          <p><i class="iconfont icondianzanshuliang" />博客点赞总量</p>
          <p>{{ dzNumber }}</p>
        </li>
      </ul>
    </div>
    <div class="title-info">
      <div class="info dispaly-flex">
        <p>博客列表</p>
        <div class="select">
          <el-select v-model="value" placeholder="请选择" size="small" @change="selectChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        :header-cell-style="{ background: ' #fafafa' }"
        style="width: 100%"
      >
        <el-table-column
          prop="blogTitle"
          align="center"
          label="博客名"
        />
        <el-table-column
          prop="fzName"
          align="center"
          label="分类名"
        />
        <el-table-column
          prop="blogDNumber"
          align="center"
          sortable
          label="点赞数"
        >
          <template slot-scope="{ row }">
            <span>{{ row.blogDNumber || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="blogLookNumber"
          sortable
          align="center"
          label="浏览数"
        >
          <template slot-scope="{ row }">
            <span>{{ row.blogLookNumber || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentTime"
          align="center"
          label="创建时间"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{ row }">
            <el-dropdown trigger="click" class="position" @command="changes">
              <el-button type="text" size="mini" @click="chooiceIndex(row)">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item command="classification">更换分类</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
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
    <transition name="el-zoom-in-top">
      <div v-show="alertShow" class="alert-show">
        <p><i class="el-icon-close" @click="alertShow = false" /></p>
        <p>设置分组：</p>
        <el-select v-model="fzValue" placeholder="请选择" size="small" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
        <div class="btn">
          <el-button type="primary" plain @click="updataFz">确定</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { fzItemList, getBoldList, fuzzySearch } from '../../../api/blog'
import { counts } from '../../../api/index'
import { blogDel, changeFz } from '../../../api/admin'
import { confirm, messages } from '@/utils/message'
export default {
  name: 'BlogManagement',
  data() {
    return {
      listQuery: { // 分页的配置
        pageNum: 1,
        pageSize: 10
      },
      total: null, // 分页数
      tableData: [],
      selectType: '', // 选择类型
      blogItem: {}, // 操作当前元素
      options: [
        { label: '全部', value: 0 }
      ],
      value: 0, // 筛选
      fzValue: '全部',
      counts: 0, // 访问总数
      allLookNumber: 0, // 总访问量
      dzNumber: 0, // 点赞总数
      alertShow: false // 是否显示弹窗
    }
  },
  created() {
    this.loadData()
    this.loadBlogList()
  },
  methods: {
    loadData() {
      fzItemList().then(res => {
        res.data.forEach((item, index) => {
          this.options = [
            ...this.options,
            {
              value: index + 1,
              label: item
            }
          ]
        })
      })
      counts().then(res => {
        this.counts = res.data.reduce((a, b) => (a + b.counts), 0)
      })
    },

    loadBlogList() {
      this.$loadShow()
      getBoldList(this.listQuery).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.dzNumber = res.data.dzNumber
        this.allLookNumber = res.data.allLookNumber
        this.$close()
      }).catch(() => this.$close())
    },

    changes(type) { // 选择时
      type === 'del' ? this.subDel() : this.alertShow = true
    },

    subDel() {
      confirm({
        title: '此操作将永久删除该博客, 是否继续?',
        successCb: () => {
          this.$loadShow()
          blogDel(this.blogItem.blogTitle, this.blogItem.fzName).then(res => {
            messages('删除成功!')
            this.loadBlogList() // 重新加载数据
            this.$close()
          }).catch(() => this.$close())
        }
      })
    },

    selectChange(val) {
      this.options.forEach(item => {
        if (item.value === val) {
          if (item.label === '全部') {
            this.loadBlogList()
          } else {
            this.$loadShow()
            fuzzySearch(item.label).then(res => {
              this.tableData = res.data
              this.total = 1
              this.$close()
            }).catch(() => this.$close())
          }
        }
      })
    },

    chooiceIndex(item) {
      this.blogItem = item
    },

    handleCurrentChange(val) { // 分页
      this.listQuery.pageNum = val
      this.loadBlogList()
    },

    updataFz() {
      this.$loadShow()
      changeFz(this.blogItem.blogTitle, this.blogItem.fzName, this.fzValue).then(res => {
        messages('更换成功!')
        this.alertShow = false
        this.loadBlogList()
        this.$close()
      }).catch(() => this.$close())
    }
  }
}
</script>

<style lang="scss" scoped>
  .blogAdmin {
    padding: 10px;
    border: 3px;
  }
  .title-info {
    font-weight: bold;
    font-size: 18px;
    color: #545c64;
  }
  .info {
    margin-bottom: 30px;
  }
  .select {
    width: 30%;
    text-align: right;
  }
  .total {
    margin-bottom: 30px;
    li {
      padding: 30px 0;
      width: 25%;
      border-right: 1px solid #cccccc;
      text-align: center;
      p {
        font-size: 16px;
        font-weight: bold;
        color: #545c64;
        i {
          padding-right: 5px;
          font-size: 18px;
        }
      }
      p:nth-of-type(2) {
        margin-top: 20px;
        font-size: 14px;
      }
    }
    li:last-of-type {
      border-right: none;
    }
  }
  .title-info {
    padding-top: 30px;
    border-top: 1px  solid #f0f9f1;
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
  .alert-show {
    padding: 10px 20px 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    border: 1px solid #fafafa;
    background: #fff;
    box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.1);
    i {
      font-size: 18px;
      cursor: pointer;
    }
    p:nth-of-type(1) {
      margin: 0;
      text-align: right;
    }
    p {
      margin: 10px 0 20px;
      font-size: 14px;
      color: #666666;
    }
    .btn {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
