<template>
  <div class="index">
    <NavigationHead />
    <AppContent />
    <AppFooter />
    <Chongdx />
  </div>
</template>

<script>

import NavigationHead from './components/navigationHead'
import AppFooter from './components/footer'
import AppContent from './components/content'
import Chongdx from './components/chongdx'
export default {
  components: {
    NavigationHead,
    AppFooter,
    AppContent,
    Chongdx
  }
}
</script>

<style lang="scss" scoped>
.index {
  background-color: #f4f4f4;
  height: 100%;
  font-size: 14px;
  position: relative;
}
</style>

