<template>
  <div class="book-management">
    <div style="display: flex;">
      <el-input style="width: 200px" placeholder="请输入书籍名称" />
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="bookFormVisible = true">新增</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      style="margin-top: 20px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
        fixed
      />
      <el-table-column
        prop="book_name"
        label="书名"
        align="center"
        min-width="120"
      />
      <el-table-column
        prop="book_image_url"
        label="书籍封面"
        align="center"
        min-width="120"
      >
        <template slot-scope="{ row }">
          <img :src="row.book_image_url" alt="" style="width: 80px; height: 80px;">
        </template>
      </el-table-column>
      <el-table-column
        prop="book_type"
        label="书籍分类"
        align="center"
        min-width="120"
      />
      <el-table-column
        prop="book_dow_num"
        label="下载数量"
        align="center"
        min-width="120"
      />
      <el-table-column
        prop="book_collection_num"
        label="收藏数量"
        align="center"
        min-width="120"
      />
      <el-table-column
        prop="book_publisher_username"
        label="发布作者"
        align="center"
        min-width="120"
      />
      <el-table-column
        prop="book_publisher_time"
        label="发布时间"
        align="center"
        min-width="180"
      />

      <el-table-column
        label="操作"
        align="center"
        min-width="160"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="updateBook(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delbook(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <book-create-and-updata-dialog
      v-if="bookFormVisible"
      :book-form-visible="bookFormVisible"
      :book-id="bookId"
      @closeDialog="bookFormVisible = false"
      @saveData="saveData"
    />
  </div>
</template>

<script>
import BookCreateAndUpdataDialog from './_components/bookCreateAndUpdataDialog'
import { messages, confirm } from '@/utils/message'

import {
  getBookList,
  delBook
} from '@/api/admin'
export default {
  components: { BookCreateAndUpdataDialog },
  data() {
    return {
      tableData: [{}],
      bookFormVisible: false,
      bookId: ''
    }
  },

  created() {
    this.feactData()
  },

  methods: {
    saveData() {
      this.feactData()
      this.bookFormVisible = false
    },

    feactData() {
      this.$loadShow()
      getBookList().then(res => {
        this.tableData = res.data
        this.$close()
      }).catch(() => this.$close())
    },

    updateBook({ _id }) {
      this.bookId = _id
      this.bookFormVisible = true
    },

    delbook({ _id }) {
      confirm({
        title: '删除数据无法恢复，是否删除？',
        successCb: () => {
          this.$loadShow()
          delBook(_id).then(res => {
            messages('删除成功')
            this.$close()
            this.feactData()
          }).catch(() => this.$close())
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.book-management {
  padding: 20px;
}
</style>
