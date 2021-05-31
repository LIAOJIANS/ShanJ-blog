<template>
  <div>
    <div class="dispaly" style="margin-bottom: 10px">
      <el-input placeholder="搜索" style="width: 200px" />
      <el-button type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        prop="username"
        label="用户名"
        align="center"
      />
      <el-table-column
        prop="countIp"
        label="用户访问IP"
        align="center"
      />
      <el-table-column
        label="用户角色"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.jurisdiction | jurisdiction }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="danger" size="mini" @click="delUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getUserList
} from '@/api/admin'
export default {
  name: 'UserListManagement',

  filters: {
    jurisdiction(e) {
      let role = ''
      switch (e) {
        case 1:
          role = '博主'
          break
        case 2:
          role = '超级管理员'
          break
        case 0:
          role = '游客'
          break
        default:
          break
      }
      return role
    }
  },

  data() {
    return {
      tableData: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.$loadShow()
      getUserList().then(res => {
        this.tableData = res.data
        this.$close()
      }).catch(() => this.$close())
    },

    delUser({ _id }) {
      console.log(_id)
    }
  }
}
</script>

<style scoped>

</style>
