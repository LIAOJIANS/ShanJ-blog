<template>
  <div class="release-container">
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item to="/blog">热门博客</el-breadcrumb-item>
      <el-breadcrumb-item>发布博客</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="dispaly-space">
      <div class="release-left">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="博客编写" name="md" />
          <el-tab-pane label="MD文件上传发布" name="file" />
        </el-tabs>
        <form v-if="activeName === 'file'" action="">
          <el-upload
            ref="upload"
            class="upload-demo"
            :drag="true"
            action="abc/abc"
            :file-list="fileList"
            :http-request="uploadSectionFile"
            :auto-upload="false"
            accept=".md"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传md文件</div>
          </el-upload>
        </form>
        <div v-else>
          <el-input
            v-model="blogTitle"
            placeholder="请输入博客标题"
            style="width: 97%; margin: 0 10px 20px 10px"
            @blur="checkHasBlogTitle"
          />
          <mavon-editor
            ref="md"
            v-model="content"
            style="min-height: 600px; margin-bottom: 20px"
            @change="change"
            @imgAdd="imgAdd"
          />
        </div>

        <div class="release-select">
          <el-select v-model="groupValue " no-data-text="暂无分组" placeholder="请选择分支不选默认无分组">
            <el-option
              v-for="item in fzList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <span>没有分组?</span>
          <el-button type="text" @click="dialogVisible = true">去创建</el-button>
          <el-dialog
            title="创建分组"
            :visible.sync="dialogVisible"
            width="30%"
          >
            <el-input v-model="fzName" placeholder="请输入分组名" />
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="createFzSub">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
        <div class="btn">
          <el-button type="primary" @click="subMdfile">提交</el-button>
        </div>
      </div>
      <blog-shortcut-bar class="release-right" />
    </div>
  </div>
</template>

<script>
import BlogShortcutBar from '../../components/blogShortcutBar/blogShortcutBar'
import { uploadBold, createFz, getFzList, checkBlogUnique, publishBlog } from '../../api/blog'
import { messages } from '@/utils/message'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  components: {
    BlogShortcutBar,
    mavonEditor
  },
  data() {
    return {
      activeName: 'md',
      check: true,
      blogTitle: '',
      content: '',
      mdHtml: '',
      fileList: [], // 文件数组
      fzList: [], // 分组数据
      dialogVisible: false, // 是否显示创建分组框
      groupValue: '', // 选择的分组名
      fzName: '' // 创建分组名
    }
  },
  created() {
    this.loadData()
  },

  methods: {
    loadData() {
      this.$loadShow()
      getFzList().then(res => {
        this.fzList = res.data
        this.$close()
      }).catch(() => this.$close())
    },

    change(val, html) {
      this.mdHtml = html
    },

    imgAdd(pos, file) {

    },

    createFzSub() { // 创建分组名
      if (!this.fzName) {
        return messages('分组名不能为空!', 'error')
      }
      this.$loadShow()
      createFz(this.fzName).then(res => {
        messages('创建成功!')
        this.dialogVisible = false
        this.fzName = ''
        this.$close()
        this.loadData()
      }).catch(() => this.$close())
    },

    subMdfile() {
      this.activeName === 'file' ? this.$refs.upload.submit() : this.publishBlog()
    },

    publishBlog() {
      if (!this.check) { return messages('博客名已存在!', 'error') }
      publishBlog({
        mdContent: this.content,
        blogTitle: this.blogTitle,
        fz: this.groupValue
      }).then(res => {

      })
    },

    checkHasBlogTitle() {
      checkBlogUnique(this.blogTitle).then(res => {
        this.check = true
      }).catch(() => (this.check = false))
    },

    uploadSectionFile(param) { // 提交表单
      const list = document.getElementsByClassName('el-upload-list__item is-ready')
      if (list.length === 0) {
        return messages('请选择要上传的md博客!', 'error')
      }
      const fileObj = param.file
      const filename = new FormData()
      filename.append('file', fileObj)
      filename.append('fz', this.groupValue)
      this.$loadShow()
      uploadBold(filename).then(res => { // 提交文件
        this.fileList = []
        this.groupValue = ''
        messages('上传成功!')
        this.$close()
      }).catch(() => this.$close())
    }

  }
}
</script>

<style lang="scss" scoped>
  .release-container {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .release-left {
    width: 100%;
    padding: 10px 0;
    margin-right: 40px;

    background-color: #fff;

    .release-select {
      padding: 10px 10px;
      text-align: center;

      span {
        padding-left: 10px;
        padding-right: 5px;
      }
    }

    .btn {
      margin-top: 20px;
      width: 100%;
      text-align: center;
    }
  }

  .upload-demo {
    padding: 10px 20px;
  }

  .el-icon-upload {
    display: block;
    margin: 200px 0 16px !important;
  }

  .el-upload__tip {
    font-size: 14px;
    text-align: center;
  }

  .release-right {
    width: 28%;
  }
</style>
<style>
  form .upload-demo .el-upload-dragger {
    width: 100%;
    height: 480px;
  }

  form .upload-demo .el-upload--text {
    width: 100%;
  }

  .release-select .el-select {
    width: 50%;
  }

  .btn .el-button--primary {
    width: 200px;
  }

  .v-note-wrapper {
    z-index: 998!important;
  }

  .fullscreen {
    z-index: 1000!important;
  }
</style>
