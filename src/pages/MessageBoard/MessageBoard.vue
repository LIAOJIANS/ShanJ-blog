<template>
  <div class="Message">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>留言板</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="vcomment dispaly-space">
      <Comment />
      <div class="rigth">
        <Right />
      </div>
    </div>
  </div>
</template>

<script>
import Right from '../../components/right/right'
import Comment from '../../components/Comment/Comment'
export default {
  name: 'MessageBoard',
  components: {
    Right,
    Comment
  }
}
</script>

<style lang="scss" scoped>
  .Message {
    padding-top: 30px;
  }
  .vcomment {
    width: 100%;
    margin-top: 30px;
    padding-bottom: 30px;
  }
  #vcomments {
    margin-right: 40px;
    padding: 10px;
    width: 72%;
    background-color: #fff;
    display: block;
    margin-left: auto;
  }
  .rigth {
    width: 28%;
  }
</style>
