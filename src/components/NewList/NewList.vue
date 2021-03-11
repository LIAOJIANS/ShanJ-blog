<template>
  <div class="item-body" @click="gotoRouter(item.url)">
    <img :src="item.picUrl" alt="">
    <div class="news-body">
      <p>{{ item.title }}</p>
      <p class="dispaly-flex">
        <span>{{ item.ctime }}</span>
        <span>{{ item.description }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewList',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    gotoRouter(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-body {
    display: flex;

  }
  img {
    max-width: 200px;
    max-height: 140px;
    min-width: 200px;
    min-height: 140px;
  }
  .news-body {
    flex: 1;
    padding-top: 10px;
    padding-right: 20px;
    margin-left: 15px;
    p {
      font-size: 16px;
      color: #666666;
      font-weight: bold;
    }
    .dispaly-flex {
      margin-top: 94px;
      span {
        font-size: 12px;
        color: #999999;
      }
    }
  }
</style>
