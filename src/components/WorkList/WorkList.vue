<template>
  <div style="width: 100%">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <el-row v-for="(items, index) in datasArr" :key="index" v-loading="loading" class="swiper-slide">
          <div v-for="(item, i) in items" :key="i" class="box_son" :span="8">
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <el-popover
                :close-delay="50"
                placement="left"
                :title="item.workName"
                width="200"
                trigger="hover"
                :content="item.workIntroduction"
              >
                <img slot="reference" :src="item.workImg" class="image" @click="toOntherPage(item.workSrc)">
              </el-popover>
              <div style="padding: 14px;">
                <span>{{ item.workName }}</span>
                <div class="bottom" style="text-align: right;">
                  <el-dropdown v-if="userInfo.jurisdiction === 2" trigger="click" class="position" @command="changes">
                    <el-button size="mini" @click.stop="chooiceIndex(item)">
                      操作<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown" style="text-align: center; padding: 0 10px;">
                      <el-dropdown-item command="updata">编辑</el-dropdown-item>
                      <el-dropdown-item command="show">{{ item.isLook ? '可见' : '不可见' }}</el-dropdown-item>
                      <el-dropdown-item command="del">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </el-card>
          </div>
        </el-row>
      </div>
    </div>
    <div class="swiper-pagination" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'WorkList',
  props: {
    datasArr: {
      type: Array,
      default: () => []
    },
    loading: Boolean
  },

  computed: {
    ...mapState(['userInfo'])
  },

  methods: {
    toOntherPage(itemSrc) {
      window.open(itemSrc, '_blank')
    },

    chooiceIndex(item) {
      this.$emit('chooiceIndex', item)
    },

    changes(item) {
      switch (item) {
        case 'updata':
          return this.$emit('subUpdata', item)
        case 'del':
          return this.$emit('closeAlet', item)
        case 'show':
          return this.$emit('isShowWokerList', item)
        default:
          return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .swiper-pagination {
    width: 100%;
    bottom: 10px;
    left: 0;
  }

  .swiper-pagination > span {
    margin: 0 4px;
  }

  .swiper-pagination > span.swiper-pagination-bullet-active {
    background-color: #8650d9;
  }

  .image {
    width: 278px;
    height: 168px;
    display: block;
  }

  .swiper-container {
    font-family: '微软雅黑';
    width: 100%;
    margin: 0 auto;
    padding-bottom: 50px !important;
  }

  .swiper-wrapper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: right;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .box_son {
    margin-top: 30px;
    width: 25%;
    padding: 0 10px;
  }

  .box_son img {
    cursor: pointer;
  }

</style>
