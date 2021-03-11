<template>
  <div class="content">
    <iframe
      class="iframe"
      src="static/js-hodgepodge-md/README.html"
      width="1200"
      :height="contentHeight"
      frameborder="0"
      scrolling="auto"
    />
    <div class="comment">
      <Comment />
    </div>
  </div>
</template>

<script>
import Comment from '../../components/Comment/Comment'
export default {
  name: 'JsHodgepodgeMd',
  components: {
    Comment
  },
  data() {
    return {
      contentHeight: 0
    }
  },
  created() {
    this.contentHeight = window.innerHeight - 140 + 'px'
  }
}
</script>

<style lang="scss" scoped>
  .content {
    padding: 10px 0 5px;
    background-color: #fff;
  }
  .comment {
    padding: 20px;
  }
</style>
