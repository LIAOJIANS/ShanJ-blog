<template>
  <div style="padding-top: 30px;position: relative;">
    <transition name="el-fade-in-linear">
      <div v-show="isShow">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>博主收藏</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pageInfo">
          <div class="pageInfo-title dispaly-flex">
            <span>我的收藏</span>
            <div class="funBtn">
              <el-button v-if="isAdmin" size="small" @click="dialogFormVisible = true">添加收藏</el-button>
            </div>
          </div>
          <div class="pageInfo-body dispaly-space">
            <div class="pageInfo-body-left">
              <p>
                &nbsp; &nbsp; &nbsp; &nbsp;当今社会多有观点认为目前的艺术品市场以投资为收藏目地的成分太大，艺术拍卖难以体现艺术品真正的艺术价值或文化历史价值。从根本意义上讲，什么是收藏？其实，仔细想想，不管你出于什么目的去收藏，客观上都实现了一种传承，是一种公益行为。<br>
                &nbsp; &nbsp; &nbsp; &nbsp;当今社会多有观点认为目前的艺术品市场以投资为收藏目地的成分太大，艺术拍卖难以体现艺术品真正的艺术价值或文化历史价值。从根本意义上讲，什么是收藏？其实，仔细想想，不管你出于什么目的去收藏，客观上都实现了一种传承，是一种公益行为。
              </p>
            </div>
            <div class="pageInfo-body-right">
              <img :src="`${baseUrl}/public/assets/shou.jpg`" alt="">
            </div>
          </div>
        </div>
        <el-tabs v-if="isAdmin" v-model="activeName" @tab-click="handleTab">
          <el-tab-pane v-for="(c, i) in ['可见', '不可见']" :key="i" :label="c" :name="(i + 1).toString()">
            <work-list
              :datas-arr="datasArr"
              :loading="loading"
              @chooiceIndex="chooiceIndex"
              @subUpdata="subUpdata"
              @closeAlet="showAlert = true"
              @isShowWokerList="isShowWokerList"
            />
          </el-tab-pane>
        </el-tabs>
        <work-list
          v-else
          :datas-arr="datasArr"
          :loading="loading"
          @chooiceIndex="chooiceIndex"
          @subUpdata="subUpdata"
          @closeAlet="showAlert = true"
          @isShowWokerList="isShowWokerList"
        />
      </div>
    </transition>
    <!--    上传表单-->
    <el-dialog :title="funType === 'updata' ? '更新作品' : '添加作品'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="作品名称" :label-width="formLabelWidth">
          <el-input v-model="form.workName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="作品简介" :label-width="formLabelWidth">
          <el-input v-model="form.workIntroduction" autocomplete="off" />
        </el-form-item>
        <el-form-item label="作品链接" :label-width="formLabelWidth">
          <el-input v-model="form.workSrc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="作品图片" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="abc/abc"
            :file-list="fileList"
            :http-request="uploadSectionFile"
            :auto-upload="false"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
    <div class="fun-alert-content">
      <transition name="el-zoom-in-top">
        <div v-show="showAlert" class="fun-alert">
          <div class="title">
            <p>删除</p>
            <i class="el-icon-close" @click="showAlert = false" />
          </div>
          <div class="fun-dal">
            <p>是否删除页面 <span style="color: red">{{ curReview.workName }}</span></p>
          </div>
          <div class="fun-btn">
            <el-button type="primary" size="mini" @click="subDel">确定</el-button>
            <el-button size="mini" @click="showAlert = false">取消</el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/swiper.scss'
import { reqWorkList, reqAddWorkList, reqDelWorkList, reqUpdataWorkList, reqIsLook } from '../../api/pageFavorites'
import { _dataURL2File, _getObjectURL, _cutPictures } from '../../utils/uploadZip'
import WorkList from '../../components/WorkList/WorkList'
import { mapState } from 'vuex'
import { messages } from '@/utils/message'

export default {
  name: 'PageFavorites',

  components: {
    WorkList
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_API,
      isShow: false,
      isLook: false,
      showAlert: false,
      activeName: '1',
      loading: true, // 预加载
      datas: [], // 项目数据
      curReview: {}, // 默认为null
      funType: null, // 选择操作
      form: { // 表单数据
        workName: '',
        workIntroduction: '',
        workSrc: ''
      },
      dialogFormVisible: false, // 默认隐藏表单
      formLabelWidth: '120px', // 详情宽度
      fileList: [] // 文件数组
    }
  },

  computed: {
    datasArr() {
      const { datas } = this
      // 准备二维空数组
      const arr = []
      let minArr = []
      // 遍历datas
      datas.forEach(c => {
        if (minArr.length === 12) {
          minArr = []
        }
        if (minArr.length === 0) {
          arr.push(minArr)
        }
        minArr.push(c)
      })
      return arr
    },
    ...mapState(['token', 'userInfo']),

    isAdmin() {
      return this.userInfo.jurisdiction === 2
    }
  },

  watch: {
    datas(value) {
      // 界面更新之后立即使用轮播图
      this.$nextTick(() => {
        new Swiper('.swiper-container', {
          autoplay: false,
          observeParents: true,
          observer: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        })
      })
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
    loadData(flag = false) {
      reqWorkList().then(res => {
        this.datas = this.guolv(res.data, flag)
        this.loading = false
      })
    },

    chooiceIndex(item) {
      this.curReview = item
      this.showAlert = false
    },

    handleTab() {
      this.loadData(this.activeName === '1')
    },

    subUpdata(type) { // 编辑私有方法
      this.fileList = []
      this.funType = type
      this.dialogFormVisible = true
      this.form = {
        ...this.form,
        ...this.curReview
      }
      this.fileList.push({
        url: this.curReview.workImg
      })
    },

    isShowWokerList() {
      this.curReview.isLook = !this.curReview.isLook
      this.$loadShow()
      reqIsLook(this.curReview._id, this.curReview.isLook).then(res => {
        this.datas = this.guolv(this.datas)
        messages(res.msg)
        this.$close()
      }).catch(() => this.$close())
    },

    guolv(datas, flag = false) {
      return datas.filter(item => item.isLook === flag)
    },

    subDel() { // 删除私有方法
      this.$loadShow()
      reqDelWorkList(this.curReview._id).then(res => {
        this.showAlert = false
        messages(res.msg)
        this.$close()
        this.loadData()
      }).catch(() => this.$close())
    },

    replaceData() {
      for (const key in this.form) {
        this.form[key] = ''
      }
    },

    submitUpload() { // 触发提交表单
      const list = document.getElementsByClassName('el-upload-list__item is-ready')
      if (list.length === 0) {
        return messages('请选择要上传的图片', 'info')
      }
      this.$refs.upload.submit()
    },

    isUrl(url) { // 查看上传的是否是连接
      return /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(url)
    },

    uploadSectionFile(param) { // 提交表单
      const fileObj = param.file // 图片文件
      const formData = new FormData()
      const imgs = {} // 图片对象
      // 重写图片名储存至图片对象
      this.$set(imgs, fileObj.name + '?' + new Date().getTime(), fileObj)
      for (const key in imgs) { // 循环图片对象
        // 拿到处理好的图片URL
        const url = _getObjectURL(imgs[key])
        // 异步剪切图片
        _cutPictures(url).then(res => { // 异步提交至服务器
          // 转换为file文件格式
          const file = _dataURL2File(res, formData)
          const { form } = this
          if (!form.workName || !form.workSrc || !form.workIntroduction || !this.isUrl(form.workSrc)) {
            return messages('网页名称、简介、链接不能为空', 'error')
          }
          // 在formData的append添加健值方法
          Object.keys(form).forEach(key => formData.append(key, form[key]))
          formData.append('file', file)
          this.$loadShow()
          if (this.funType === 'updata') {
            formData.append('workId', this.curReview._id)
            reqUpdataWorkList(formData).then(res => {
              this.$close()
              this.restData(res.msg)
            }).catch(() => this.$close())
          } else {
            reqAddWorkList(formData).then(res => { // 发送至服务器
              this.$close()
              this.restData(res.msg)
            }).catch(() => this.$close())
          }
        })
      }
    },

    restData(msg) {
      this.loadData()
      this.replaceData()
      this.fileList = []
      this.dialogFormVisible = false
      messages(msg)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pageInfo {
    margin-top: 30px;
    width: 100%;
    background-color: #fff;

    .pageInfo-title {
      padding: 10px 20px;
      border-bottom: 1px solid #efefef;

      span {
        font-size: 16px;
        color: #666666;
        font-weight: bold;
      }
    }

    .pageInfo-body {
      padding: 0 20px;

      .pageInfo-body-left {
        width: 60%;
        padding-top: 30px;

        p {
          font-size: 16px;
          color: #2c2c2c;
          line-height: 30px;
        }
      }

      .pageInfo-body-right {
        width: 40%;
        text-align: center;

        img {
          width: 280px;
          height: 280px;
        }
      }
    }
  }

  .work {
    position: relative;
    padding-top: 100px;
    height: 100%;
  }

  .content {
    display: flex;
    min-width: 1080px;
  }

  .left {
    position: absolute;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 150px;
  }

  .footer p {
    width: 100%;
    color: #666;
    text-align: center;
    line-height: 150px;
    font-size: 18px;
    font-weight: bold;
  }

  .fun-alert-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;

    .fun-alert {
      width: 300px;
      background-color: #fff;
      box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.1);
      font-size: 14px;

      .title {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        background-color: #545c64;
        color: #ffffff;

        p {
          width: 100%;
          text-align: center;
          font-size: 14px;
        }

        i {
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
        }
      }

      .fun-dal {
        padding: 15px 0;
        font-size: 16px;
        text-align: center;
      }

      .fun-btn {
        padding: 15px 0;
        text-align: center;
      }
    }
  }
</style>
