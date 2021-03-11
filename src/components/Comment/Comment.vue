<template>
  <div id="vcomments" />
</template>

<script>
export default {
  name: 'Comment',
  mounted() {
    this.createValine()
  },
  methods: {
    createValine() {
      const Valine = require('valine')
      window.AV = require('leancloud-storage')
      new Valine({
        el: '#vcomments',
        appId: 'RgHMBifH4jJhLmBR0c3MJOxk-gzGzoHsz',
        appKey: 'AKJwt7UPoJ2Ac4DSxhjvdQ4r',
        notify: false,
        verify: false,
        avatar: 'monsterid',
        pageSize: 10, // 20条换页
        path: this.$route.path,
        placeholder: '欢迎留言与我分享您的想法...'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
