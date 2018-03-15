<template>
  <div class="add-site">
    <header-gray headerTitle="添加地址" back="true"></header-gray>
    <span class="extend-click header-icon save" @click="save()">保存</span>
    <div class="main">
      <div class="edit-form whitebg">
        <table class="addr-edit" width="100%">
          <tbody>
            <tr class="spline-top spline-bottom">
              <th>联系人</th>
              <td>
                <input type="text" class="addr-input" placeholder="收货人姓名" v-model="linkman">
              </td>
            </tr>
            <tr class="spline-top">
              <th>&nbsp;</th>
              <td>
                <span @click="sex=0" class="theme-radio" :class="{checked: sex==0}">先生</span>
                <span @click="sex=1" class="theme-radio" :class="{checked: sex==1}">女士</span>
              </td>
            </tr>
            <tr class="spline-top">
              <th>手机号码</th>
              <td>
                <input type="text" placeholder="鲜蜂侠联系您的电话" v-model="phone">
              </td>
            </tr>
            <tr class="spline-top">
              <th>所在城市</th>
              <td class="more">
                <select class="select-city" @change="bindChange()" v-model="city">
                  <option value="">请选择城市</option>
                  <option v-for="(item,index) in citys" :key="item" :value="item">{{item}}</option>
                </select>
              </td>
            </tr>
            <tr class="spline-top">
              <th>所在地区</th>
              <td class="more">
                <input type="text" placeholder="请选择您的住宅小区、大厦或学校" @click.prevent="selectSite()" :value="site">
              </td>
            </tr>
            <tr class="spline-top">
              <th>详细地址</th>
              <td>
                <input type="text" placeholder="请输入楼号门牌号等详细信息" v-model="detailSite">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderGray from 'components/Header-gray/Header-gray'
import api from '@/api'
export default {
  created () {
    // 获取城市列表数据
    let sendUrl = api.host + 'citys'
    this.$http.get(sendUrl)
      .then(data => {
        this.citys = data.data
      })
    // 读取城市和地址数据
    this.city = this.$store.state.selectCity
    console.log(this.city)
    this.site = this.$store.state.selectSite
  },
  data () {
    return {
      // 所选城市列表
      citys: [],
      // 所选城市,默认为0
      city: '',
      // 所选地址
      site: '',
      // 所选性别
      sex: 0,
      // 联系人
      linkman: '',
      // 手机号码
      phone: '',
      // 详细地址
      detailSite: ''
    }
  },
  methods: {
    selectSite () {
      if (this.city !== '') {
        // 切换到select-site页面
        this.$router.push('/select-site')
      } else {
        this.$msg('提示', '请选择城市')
      }
    },
    // 切换所选城市
    bindChange () {
      this.$store.commit('CHANGE_CITY', this.city)
    },
    // 保存地址信息
    save () {
      /* {
          地址列表的id,
          用户id,
          联系人，
          性别，
          手机号，
          所在城市，
          所在地区-》百度地图
          详细地址
          坐标数据
        } */
      let userInfo = this.$store.state.userInfo
      let location = this.$store.state.location
      // 验证是否有值
      console.log(location)
      if (userInfo.id && this.city !== '' && this.site !== '' && this.linkman !== '' && this.phone !== '' && this.detailSite !== '' && location.lng) {
        let siteObj = {
          // 用户id，键名必须为userId，跟users这个路由进行关联(关系图谱)
          userId: userInfo.id,
          // 所选城市,默认为0
          city: this.city,
          // 所选地址
          site: this.site,
          // 所选性别
          sex: this.sex,
          // 联系人
          linkman: this.linkman,
          // 手机号码
          phone: this.phone,
          // 详细地址
          detailSite: this.detailSite,
          // 坐标
          location: location
        }
        this.$store.dispatch('saveSite', siteObj)
          .then(res => {
            return this.$msg('提示', res)
          })
          .then(res => {
            this.$router.push('/site')
          })
      } else {
        this.$msg('提示', '输入有误')
      }
    }
  },
  components: {
    HeaderGray
  }
}
</script>
<style lang="less" scoped>
.main{
  bottom: 0;
  font-size: 1.4rem;
}
.save{
  position: absolute;
  top: 0;
  right: .6rem;
  text-align: center;
  width: 6rem;
  height: 4.4rem;
  line-height: 4.4rem;
  font-size: 1.4rem;
  z-index: 2;
}
.select-city{
  width: 90%;
}
.addr-edit{
  th{
    padding: 1rem 0 1rem 1.5rem;
    text-align: left;
    width: 7rem;
    line-height: 2rem;
    font-weight: 400;
  }
  td{
    input{
      width: 90%;
    }
  }
}
</style>


