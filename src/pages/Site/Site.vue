<template>
  <div class="site">
    <header-gray header-title="选择地址" back="true"></header-gray>
    <div class="main">
      <!-- 没有地址的时候 -->
      <div class="empty-notice" v-if="!(sites.length>0)">
        <div class="notice-icon"></div>
        您还没地址哦~
      </div>
      <!-- 显示地址列表 -->
      <ul class="addr-list block" v-if="sites.length>0">
        <li class="addr-item spline-bottom" v-for="(item,index) in sites" :key="item.id" @click="changeSelectedSite(item)">
          <div class="addr-desc" :class="{selected: item.id==selectedSite.id}">
            <p class="no-wrap">{{item.linkman}}&nbsp;&nbsp;&nbsp;{{item.phone}}</p>
            <p class="no-wrap theme-font-gray">{{item.city}}{{item.site}}</p>
          </div>
          <div class="addr-edit" @click.stop="editSite(item)"></div>
        </li>
      </ul>
      <div class="pub-footer spline-bottom spline-top">
        <div class="theme-btn-big yellowbg" @click="addSite()">新增地址</div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderGray from 'components/Header-gray/Header-gray'
export default {
  components: {
    HeaderGray
  },
  computed: {
    sites () {
      return this.$store.state.sites
    },
    selectedSite () {
      return this.$store.state.userInfo.selectedSite
    }
  },
  methods: {
    addSite () {
      this.$router.push('/add-site')
    },
    changeSelectedSite (item) {
      this.$store.dispatch('changeSelectedSite', item)
        .then(res => {
          this.$msg('提示', res)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.pub-footer{
  position: fixed;
  bottom: 0;
}
.empty-notice{
  padding-top: 20%;
  text-align: center;
  line-height: 4rem;
  font-size: 1.4rem;
}
.notice-icon{
  width: 8rem;
  height: 8rem;
  border-radius: 4rem;
  background: url("./images/empty_addrlist.png") center center no-repeat;
  -webkit-background-size: contain;
  background-size: contain;
  margin: 0 auto;
}
.theme-btn-big:before{
  content: '+ ';
}
.addr-list{
  font-size: 1.4rem;
}
.addr-item{
  height: 8rem;
  position: relative;
}
.addr-desc{
  position: absolute;
  left: 0;
  top: .5rem;
  right: 8rem;
  bottom: .5rem;
  line-height: 2.8rem;
  padding-top: .7rem;
  padding-left: 1rem;
  border-left: 0.5rem solid transparent;
}
.addr-desc.selected{
  border-left: 0.5rem solid #ffd600;
}
.addr-edit{
  position: absolute;
  width: 8rem;
  height: 5.2rem;
  top: 1.5rem;
  right: 0;
  background: url("./images/addr-edit.png") center center no-repeat;
  -webkit-background-size: 2.2rem;
  background-size: 2.2rem;
  border-left: 1px solid #e0e0e0;
}
</style>


