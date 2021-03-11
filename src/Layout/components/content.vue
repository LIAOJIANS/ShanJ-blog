<template>
  <div class="index-content">
    <div class="index-body">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">

.index-content {
  width: 100%;
  background-color: #f4f4f4;

  .index-body {
    padding-top: 61px;
    max-width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
  }
}
</style>
