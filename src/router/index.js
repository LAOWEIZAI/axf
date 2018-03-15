import Vue from 'vue'
import Router from 'vue-router'
// 老的引入方式
/* import Home from 'pages/Home/Home'
import Category from 'pages/Category/Gategory' */
// 异步的引入方式
// 首页
const Home = resolve => require(['pages/Home/Home.vue'], resolve)
// 闪送超市
const Category = resolve => require(['pages/Category/Category.vue'], resolve)
// 购物车
const Cart = resolve => require(['pages/Cart/Cart.vue'], resolve)
// 登陆注册页
const Login = resolve => require(['pages/Login/Login.vue'], resolve)
// 选择地址页
const Site = resolve => require(['pages/Site/Site.vue'], resolve)
// 添加地址页
const AddSite = resolve => require(['pages/Add-site/Add-site.vue'], resolve)
// 选择地址页
const SelectSite = resolve => require(['pages/Select-site/Select-site.vue'], resolve)
// 选择地址页
const ProductItem = resolve => require(['pages/Product-item/Product-item.vue'], resolve)
// 我的页
const Mine = resolve => require(['pages/Mine/Mine.vue'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/category',
      name: 'category',
      component: Category
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/site',
      name: 'site',
      component: Site
    },
    {
      path: '/add-site',
      name: 'add-site',
      component: AddSite
    },
    {
      path: '/select-site',
      name: 'select-site',
      component: SelectSite
    },
    {
      path: '/product-item/:id',
      name: 'product-item',
      component: ProductItem
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    }
  ]
})
