<template>
  <div class="article-right-search">
    <el-input
      v-model="searchValue"
      placeholder="请输入搜索内容"
      class="input-with-select"
      @focus="gotoSearchPage"
      @keydown.enter.native="subSearch"
    >
      <el-button slot="append" icon="el-icon-search" @click="subSearch" />
    </el-input>
    <ul v-show="type" class="input-button dispaly">
      <li
        v-for="(item, index) in hotData"
        :key="index"
        class="ellipsis"
        @click="gotoInfo(item.id)"
      >{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
import { searchContent } from '../../api/search'
export default {
  props: {
    hotData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchValue: '',
      type: false
    }
  },

  created() {
    if (this.$router.currentRoute.fullPath === '/search') {
      this.type = true
    }
  },

  methods: {
    gotoInfo(id) {
      this.$router.push(`/bolgInfo/${id}`)
    },

    gotoSearchPage() {
      if (this.$router.currentRoute.fullPath === '/search') {
        this.type = true
        return
      }
      this.$router.push({ path: '/search' })
    },

    subSearch() {
      const { type, searchValue } = this
      if (!type || !searchValue) return
      searchContent(searchValue).then(res => {
        this.$emit('getSearchValue', res.data)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.article-right-search {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 20px;
}

.input-button {
  margin-top: 5px;

  li {
    max-width: 100px;
    margin: 5px 10px 0;

    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
}
</style>
