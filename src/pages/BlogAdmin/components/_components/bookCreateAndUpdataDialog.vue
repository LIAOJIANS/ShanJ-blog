<template>
  <el-dialog
    :title="bookId ? '编辑书籍' : '新增书籍'"
    :visible.sync="bookFormVisible"
    width="650px"
    :before-close="closeDialog"
  >
    <el-form
      ref="formData"
      :model="formData"
      :rules="rules"
      label-width="150px"
      style="width: 550px"
      class="formData"
    >
      <el-form-item label="书籍名称" prop="book_name">
        <el-input v-model="formData.book_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="书籍分类" prop="book_type">
        <el-select v-model="formData.book_type" placeholder="请选择书籍的分类" style="width: 100%">
          <el-option v-for="i in bookTypeList" :key="i._id" :label="i.book_type_name" :value="i.book_type_name" />
        </el-select>
        <el-popover
          placement="bottom"
          width="300"
          trigger="click"
        >
          <div style="display: flex">
            <div>
              <el-input v-model="bookType_name" size="mini" @blur="checkHasBookType" />
              <p v-show="showTip" style="color: red; font-size: 12px">分类已存在哦！</p>
            </div>
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 10px"
              :disabled="showTip"
              @click="cBookType"
            >新增</el-button>
          </div>
          <p slot="reference" style="font-size: 12px; width: 200px">没有分类？<el-button type="text" size="mini">创建分类</el-button></p>
        </el-popover>
      </el-form-item>

      <el-form-item label="书籍封面" prop="book_image_url">
        <el-upload
          class="avatar-uploader"
          action=""
          accept="image/*"
          :http-request="uploadBookImg"
          :show-file-list="false"
        >
          <img v-if="formData.book_image_url" :src="formData.book_image_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="上传书籍" prop="book_url">
        <el-upload
          action=""
          accept=".pdf"
          :http-request="uploadBook"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="saveData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import {
  uploadBookInfo,
  createBookType,
  checkBookType,
  getBookType,
  createBook,
  selectBook
} from '@/api/admin'

import { messages } from '@/utils/message'

export default {
  props: {
    bookFormVisible: {
      type: Boolean,
      default: false
    },

    bookId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      formData: {
        book_name: '',
        book_type: '',
        book_image_url: '',
        book_url: ''
      },

      bookType_name: '',
      showTip: false,

      fileList: [],

      bookTypeList: [],

      rules: {
        book_name: [{ required: true, message: '请输入书籍名称', trigger: 'blur' }],
        book_type: [{ required: true, message: '请选择书籍分类', trigger: 'change' }],
        book_image_url: [{ required: true, message: '请上传书籍封面', trigger: 'change' }],
        book_url: [{ required: true, message: '请上传书籍', trigger: 'change' }]
      }
    }
  },

  async created() {
    await this.getBookTypeList()

    this.bookId && this.selectUpdataBook()
  },

  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },

    selectUpdataBook() {
      this.$nextTick(() => this.$loadShow({ target: '.formData' }))
      selectBook(this.bookId).then(res => {
        this.formData = {
          ...this.formData,
          ...res.data
        }
        this.fileList = [{ uid: 1, name: res.data.book_name }]
        this.$close()
      }).catch(() => this.$close())
    },

    saveData() {
      this.$refs.formData.validate(f => {
        if (f) {
          this.$nextTick(() => this.$loadShow({ target: '.formData' }))
          createBook(this.formData).then(res => {
            this.$emit('saveData')
            this.$close()
          }).catch(() => this.$close())
        }
      })
    },

    async getBookTypeList() {
      this.$nextTick(() => this.$loadShow({ target: '.formData' }))
      await getBookType().then(res => {
        this.bookTypeList = res.data
        this.$close()
      }).catch(() => this.$close())
    },

    checkHasBookType(e) {
      checkBookType(e.target.value).then(res => {
        this.showTip = false
      }).catch(() => (this.showTip = true))
    },

    cBookType() {
      this.$nextTick(() => this.$loadShow({ target: '.formData' }))
      createBookType(this.bookType_name).then(res => {
        messages('创建成功')
        this.$close()

        this.getBookTypeList()
      }).catch(() => this.$close())
    },

    uploadBookImg(fileObj) {
      this.$nextTick(() => this.$loadShow({ target: '.formData' }))
      uploadBookInfo('upload_book_img', fileObj.file).then(res => {
        this.formData.book_image_url = res.data.imgUrl || ''
        this.$close()
      }).catch(() => this.$close())
    },

    uploadBook(fileObj) {
      this.$nextTick(() => this.$loadShow({ target: '.formData' }))
      uploadBookInfo('upload_book', fileObj.file).then(res => {
        this.formData.book_url = res.data.bookUrl || ''
        this.$close()
      }).catch(() => this.$close())
    }
  }
}
</script>

<style>
  .el-dialog__body {
    padding-bottom: 10px!important;
  }
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }

  .el-icon-plus:before {
    line-height: 178px;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
