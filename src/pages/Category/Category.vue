<template>
  <div class="home">
    <header-yellow></header-yellow>
    <div class="main">
      <div class="category">
        <ul class="categories">
          <li v-for="(item,index) in classifys" :key="item.classify_id" @click="changeClassifys(item.classify_id)"><span  :class="{'active': activeClassifysId === item.classify_id}">{{item.classify_title}}</span></li>
        </ul>
      </div>
      <div class="productList" @click="hideProductList()">
        <div class="product-filter" :class="{'active': ranking||allCategories}">
          <div class="filter-titles">
            <div :class="{'active': allCategories}" @click.stop="changeAllCategories()"><span>全部分类</span><var>&nbsp;</var></div>
            <div :class="{'active': ranking}" @click.stop="changeRanking()"><span>综合排序</span><var>&nbsp;</var></div>
          </div>
          <!-- 全部分类 -->
          <div class="filter-items" v-show="allCategories">
            <ul>
              <li :class="{'active': allCategoriesIndex === 'all'}" @click="changeCids('all')">全部分类</li>
              <li v-for="(item, index) in activeClassifysProduct.cids" :key="item.name" @click="changeCids(index)" :class="{'active': allCategoriesIndex === index}">{{item.name}}</li>
            </ul>
          </div>
          <!-- 综合排序 -->
          <div class="filter-items" v-show="ranking">
            <ul>
              <li v-for="(item, index) in rankingList" :key="item" :class="{'active': activeRankingIndex === index}" @click="changeRankingIndex(index)">
                {{item}}
              </li>
            </ul>
          </div>
        </div>
        <ul class="productList-wrap">
          <router-link tag="li" v-for="(item, index) in filterClassifysProduct" :to="'/product-item/'+item.product_id" :key="item.product_id">
            <dl>
              <dt>
                <img v-lazy="item.imgs.small" :ref="'item'+index">
              </dt>
              <dd class="nowrap product-item-title">{{item.title}}</dd>
              <dd class="product-specifics-wrap">
                <div class="product-specifics">
                  <span>{{item.unit}}ml</span>
                  <var>￥{{item.price}}</var>
                </div>
                <div class="product-operates">
                  <span class="inner" @click.stop="subNum(item, index)">-</span>
                  <span class="product-operates-item">{{item.num}}</span>
                  <span class="inner" @click.stop="addNum(item, index)">+</span>
                </div>
              </dd>
            </dl>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import headerYellow from 'components/Header-yellow/Header-yellow'
function orderBy (arr, type, bol) {
  if (bol === undefined) {
    bol = true
  }
  function sortNumber (a, b) {
    if (bol) {
      if (type) {
        return a[type] - b[type]
      } else {
        return a - b
      }
    } else {
      if (type) {
        return b[type] - a[type]
      } else {
        return b - a
      }
    }
  }
  return arr.sort(sortNumber)
}

export default {
  created () {
    let cartPos = this.$store.state.cartPos
    this.cartPos = cartPos
  },
  data () {
    return {
      // 激活的分类id
      activeClassifysId: 2,
      // 控制全部分类显示隐藏
      allCategories: false,
      // 激活的分类下标
      allCategoriesIndex: 'all',
      // 控制综合排序显示隐藏
      ranking: false,
      // 默认的排序方式
      rankingList: ['综合排序', '价格最低', '价格最高'],
      // 激活的排序方式
      activeRankingIndex: 0,
      cartPos: {}
    }
  },
  components: {
    headerYellow
  },
  methods: {
    subNum (item, index) {
      if (item.num > 0 && this.userInfo.id) {
        this.$store.dispatch('subNum', item)
        // tabBar中的购物车按钮动画
        this.$store.dispatch('changeCartActive')
      }
    },
    // 将数据添加到购物车
    addNum (item, index) {
      if (this.userInfo.id) {
        this.$store.dispatch('addNum', item)

        // 获取点击对象
        let imgObj = this.$refs['item' + index][0]
        let pos = imgObj.getBoundingClientRect()
        let cartPos = this.cartPos
        this.$addCart({
          src: item.imgs.small,
          width: pos.width,
          height: pos.height,
          start: {
            left: pos.left,
            top: pos.top
          },
          end: {
            left: cartPos.left,
            top: cartPos.top
          }
        })
        // tabBar中的购物车按钮动画
        this.$store.dispatch('changeCartActive')
      } else {
        this.$msg('提示', '未登录')
          .then(res => {
            this.$router.push('/login')
          })
      }
    },
    // 切换分类的id
    changeClassifys (id) {
      this.activeClassifysId = id
      this.allCategories = false
      this.allCategoriesIndex = 'all'
      this.activeRankingIndex = 0
      this.ranking = false
    },
    // 切换全部分类是否显示
    changeAllCategories () {
      this.allCategories = !this.allCategories
      this.ranking = false
    },
    // 切换子分类
    changeCids (index) {
      this.allCategoriesIndex = index
      this.allCategories = false
    },
    // 切换排序的显示隐藏
    changeRanking () {
      this.ranking = !this.ranking
      this.allCategories = false
    },
    // 切换排序的下标
    changeRankingIndex (index) {
      this.activeRankingIndex = index
      this.ranking = false
    },
    // 隐藏蒙版
    hideProductList () {
      this.ranking = false
      this.allCategories = false
    }
  },
  computed: {
    // 获取用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
    // 原始的分类数据
    classifys () {
      return this.$store.state.classifys
    },
    // 当前激活的分类数据
    activeClassifysProduct () {
      for (let i = 0; i < this.classifys.length; i++) {
        if (this.classifys[i].classify_id === this.activeClassifysId) {
          return this.classifys[i]
        }
      }
      return {}
    },
    // 对当前激活的分类数据进行过滤(排序)操作的数据
    filterClassifysProduct () {
      // 当前激活的所有商品数据
      let products = this.activeClassifysProduct.products
      if (this.allCategoriesIndex !== 'all') {
        // 过滤数据，根据商品的cids(子分类下标)跟allCategoriesIndex(激活的子分类下标)比较
        products = products.filter(item => item.cids === this.allCategoriesIndex)
      }

      switch (this.activeRankingIndex) {
        case 1:
          products = orderBy(products, 'price', true)
          break
        case 2:
          products = orderBy(products, 'price', false)
          break
      }
      return products
    }
  }
}
</script>
<style lang="less" scoped>
.category{
  overflow: hidden;
  position: relative;
  height: 100%;
}
.categories{
  float: left;
  width: 23.4375%;
  font-size: 1.3rem;
}
.categories>li{
  padding: 0.3rem 0;
  text-align: center;
  box-sizing: border-box;
  border-bottom: 0.1rem solid #d9d9d9;
}
.categories>li>span{
  display: block;
  height: 3.4rem;
  line-height: 3.4rem;
}
.categories>li>span.active{
  border-left: 0.6rem solid #f0d001;
}
.productList{
  /*float: right;*/
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 76%;
}
.product-filter{
  display: flex;
  display: -webkit-flex;
  flex-direction:column;
  -webkit-flex-direction:column;
  position: absolute;
  z-index: 2;
  width: 100%;
}
.product-filter.active{
  height: 100%;
}
.filter-titles{
  height: 1.8rem;
  padding: 1.1rem 0;
  background-color: rgba(255,255,255,0.8);
  width: 100%;
  border-bottom: 0.1rem solid #e1dbdd;
}
.filter-titles>div{
  float: left;
  width: 50%;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  font-size: 1.2rem;
}
.filter-titles>div:nth-child(1){
  box-sizing:border-box;
  border-right: 0.1rem solid #d5d5d5;
}
.filter-titles>div>var{
  display: inline-block;
  width: 1.3rem;
  height: 1.8rem;
  line-height: 1.8rem;
  background: url("./images/icon-down.png") center center no-repeat;
  -webkit-background-size: 1rem 0.6rem;
  background-size: 1rem 0.6rem;
  -webkit-transition: 0.5s ease;
  -o-transition: 0.5s ease;
  transition: 0.5s ease;
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
}
.filter-titles>div.active>var{
  -webkit-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
.filter-items{
  flex:1;
  -webkit-flex:1;
  width: 100%;

  background-color: rgba(0,0,0,0.2);
}
.filter-items>ul{
  overflow: hidden;
  padding-bottom: 1rem;
  background-color: rgba(255,255,255,1);
}
.filter-items>ul>li{
  padding: 0.7rem 0.9rem;
  border: 0.1rem solid #e0e0e0;
  /*border: 0.1rem solid #e6d056;*/
  border-radius: 0.4rem;
  float: left;
  margin: 0.8rem 0 0 0.8rem;
  
}
.filter-items>ul>li.active{
  background-color: #fff9d9;
  border-color: #e6d056;
}
.productList-wrap{
  position: absolute;
  top: 4.1rem;
  bottom: 0;
  width: 100%;
  overflow-y: scroll;
  background-color: #fff;
}
.productList-wrap>li{
  border-bottom: 0.1rem solid #e1dbdd;
  padding: 0.8rem 1rem;
}
.productList-wrap>li>dl{
  overflow: hidden;
}
.productList-wrap>li>dl>dt{
  float: left;
  width: 8rem;
  height: 8rem;
  margin-right: 1rem;
  overflow: hidden;
  text-align: center;
}
.productList-wrap>li>dl>dt>img{
  width: 100%;
}
.productList-wrap>li>dl>dd{
  font-size: 1.2rem;
}
.product-item-title{
  margin-bottom: 2.9rem;
}
.product-specifics-wrap{
  overflow: hidden;
}
.product-specifics{
  float: left;
  width: 30%;
  overflow: hidden;
}
.product-specifics>span{
  display: block;
  color: #858585;
  margin-bottom: 1rem;
}
.product-specifics>var{
  color: #f40;
}
.product-operates{
  float: right;
  width: 70%;
  overflow: hidden;
}
.product-operates>.inner{
  display: inline-block;
  font-size: 2.4rem;
  width: 2.9rem;
  height: 2.9rem;
  line-height: 3.4rem;
  color: #d73e00;
  text-align: center;
  /*padding: 0.8rem;*/
  border: 0.1rem solid #dcbd9e;
  border-radius: 50%;
}
.product-operates-item{
  display: inline-block;
  height: 2.8rem;
  line-height: 2.8rem;
  vertical-align: top;
  font-size: 1.2rem;
  margin: 0 0.5rem;
}
</style>


