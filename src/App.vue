<template>
  <div id="app">
    <router-view/>
    <tab-bar v-show="tabBarShow"></tab-bar>
  </div>
</template>

<script>
import TabBar from 'components/TabBar/TabBar'
export default {
  created () {
    // 初始化操作
    // 首页的bannar数据,
    this.$store.dispatch('setBannar')
    // 设置获取分类的数据
    this.$store.dispatch('setClassifys')
  },
  components: {
    TabBar
  },
  computed: {
    tabBarShow () {
      return this.$store.state.tabBarShow
    }
  }
}
</script>

<style>

</style>
