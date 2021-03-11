<template>
  <div class="rotation-chart">
    <div class="chart-top">
      <h1>轮播图设置</h1>
      <p>用于首页的轮播图，进行设置并且可以更换轮播顺序</p>
    </div>
    <div class="chart-body dispaly-space">
      <div class="chart-body-left">
        <p>上传轮播：</p>
        <el-upload
          class="icon-uploader"
          action=""
          :http-request="IconUpload"
          :show-file-list="false"
          :before-upload="beforeImgUpload"
        >
          <img v-if="IconImgUrl" :src="IconImgUrl" class="cover">
          <i v-else class="el-icon-plus cover-uploader-icon" />
        </el-upload>
        <div class="sub-btn">
          <el-button type="primary" @click="addImg">添加</el-button>
        </div>
      </div>
      <div class="chart-body-right">
        <p>轮播图列表：</p>
        <el-table
          :data="tableData"
          border
          size="mini"
          tooltip-effect="dark"
          :header-cell-style="{ background: ' #fafafa' }"
          style="width: 100%"
        >
          <el-table-column
            prop="iconId"
            label="序列"
            align="center"
            width="150"
          >
            <template slot-scope="{ row }">
              <div>
                <el-select v-if="row.isUpdata" v-model="row.iconId" placeholder="请选择" size="mini">
                  <el-option
                    v-for="(item, index) in tableData"
                    :key="index"
                    :label="item.iconId"
                    :value="item.iconId"
                  />
                </el-select>
                <span v-else>{{ row.iconId }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="图标"
          >
            <template slot-scope="{ row }">
              <div>
                <el-upload
                  v-if="row.isUpdata"
                  class="icon-uploader"
                  action=""
                  :http-request="UpdataIconUpload"
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                >
                  <img v-if="updataIconImgUrl" :src="updataIconImgUrl" class="updataCover">
                  <img v-else :src="row.IconImgUrl" class="updataCover">
                </el-upload>
                <img v-else :src="row.IconImgUrl" class="updataCover">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="操作"
          >
            <template slot-scope="{ row }">
              <div class="button">
                <el-button v-if="!row.isUpdata" type="text" size="small" style="color: red" @click="delIcon(row._id)">删除</el-button>
                <el-button v-else type="text" size="small" style="color: red" @click="row.isUpdata = false">取消</el-button>
                <el-button type="text" size="small" @click="updataIcon(row)">{{ row.isUpdata ? '保存' : '编辑' }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="showAlert" class="icon-alert">
      <div class="info">
        <p class="title">是否确认保存</p>
      </div>
      <div class="fun-button dispaly-space">
        <el-button type="primary" @click="saveTime">是</el-button>
        <el-button @click="showAlert = false">否</el-button>
      </div>
    </div>
    <div v-show="showAlert" class="bgc" />
  </div>
</template>

<script>
import { getLunBoList, uploadLunBo, updataLunBo, delLunBo } from '../../../api/admin'
import { messages } from '@/utils/message'
export default {
  name: 'CarouselManagement',
  data() {
    return {
      IconImgUrl: '', // 图片地址
      updataIconImgUrl: '', // 更换图片
      tableData: [], // 图片数组
      IconItem: {}, // 单个icon对象
      iconId: 1, // 更新前的图标序列
      showAlert: false, // 弹窗
      fileobj: '', // 图片对象
      updataFileobj: '' // 更新的图片对象
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$loadShow()
      getLunBoList().then(res => {
        res.data.forEach(item => {
          item.isUpdata = false
        })
        this.tableData = res.data
        this.tableData.sort((a, b) => (a.iconId - b.iconId))
        this.$close()
      }).catch(() => this.$close())
    },

    IconUpload(fileobj) { // 上传图标图片
      this.IconImgUrl = URL.createObjectURL(fileobj.file)
      this.fileobj = fileobj
    },

    UpdataIconUpload(fileobj) { // 上传图标图片
      this.updataIconImgUrl = URL.createObjectURL(fileobj.file)
      this.updataFileobj = fileobj
    },

    beforeImgUpload(file) { // 图片校验
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isJPG) this.$message.error('图片只能是 JPG/PNG/GIF 格式!"')
      if (!isLt2M) this.$message.error('图片大小不能超过 3MB!')
      return isJPG && isLt2M
    },

    _addClear() {
      this.IconImgUrl = ''
    },

    addImg() {
      const filename = new FormData()
      filename.append('iconId', this.tableData.length + 1)
      filename.append('file', this.fileobj.file)
      uploadLunBo(filename).then(res => {
        messages('上传成功!')
        this._addClear()
        this.loadData()
      })
    },

    saveTime() {
      this.showAlert = false
      const { IconItem } = this
      this.tableData.forEach(item => {
        if (item._id === IconItem._id) {
          const filename = new FormData()
          filename.append('iconId', IconItem.iconId)
          filename.append('oldIconId', this.iconId)
          filename.append('id', IconItem._id)
          filename.append('file', this.updataFileobj.file)
          updataLunBo(filename).then(res => {
            messages('更新成功!')
            this.loadData()
          })
        }
      })
    },

    delIcon(id) { // 删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLunBo(id).then(res => {
          messages('删除成功!')
          this.loadData()
        })
      }).catch(() => {})
    },

    updataIcon(IconItem) { // 更新
      if (IconItem.isUpdata) { // 保存
        this.showAlert = true
        this.IconItem = IconItem
      } else { // 编辑
        this._editingTime(IconItem)
      }
    },

    _editingTime(IconItem) {
      this.iconId = IconItem.iconId // 储存点击编辑时的ID
      this.updataIconImgUrl = IconItem.IconImgUrl
      this.tableData.forEach(item => {
        if (item._id === IconItem._id) {
          item.isUpdata = true
        } else {
          item.isUpdata = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .rotation-chart {
    padding: 20px;
  }
  .chart-top {
    h1 {
      font-size: 16px;
      font-weight: bold;
    }
    p {
      font-size: 12px;
      color: #999999;
    }
  }
  .chart-body {
    margin-top: 60px;
  }
  .cover {
    width: 500px;
    height: 300px;
    display: block;
  }
  .updataCover {
    width: 150px;
    height: 80px;
    display: block;
  }
  .chart-body-left,
  .chart-body-right{
    width: 50%;
    p {
      margin: 10px 0 20px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
  }
  .sub-btn {
    margin-top: 50px;
    text-align: center;
  }
  .cover-uploader-icon {
    border: 1px solid #ccc;
    font-size: 48px;
    color: #8c939d;
    width: 500px;
    height: 300px;
    line-height: 300px;
    text-align: center;
  }
  .icon-alert {
    width: 20%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 1px solid #999999;
    border-radius: 10px;
    z-index: 11;
    padding: 50px 0 30px;
    .title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #333333;
    }
    .fun-button {
      text-align: center;
      margin-top: 50px;
      padding: 0 20px;
    }
  }
  .bgc {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 10;
  }
</style>
