import http from 'axios'
import api from '@/api'
export default {
  setBannar ({commit}) {
    let url = api.host + 'bannar'
    http.get(url)
      .then(res => {
        commit('SET_BANNAR', res.data)
      })
  },
  setClassifys ({commit}) {
    let url = api.host + 'classifys'
    http.get(url)
      .then(res => {
        commit('SET_CLASSIFYS', res.data)
      })
  },
  login ({commit}, phone) {
    /* 根据phone判断是注册还是登陆 */
    let url = api.host + 'users?phone=' + phone
    return http.get(url)
      .then(res => {
        if (res.data.length > 0) {
          // 已有-》登陆获取用户信息
          let data = res.data[0]
          commit('SAVE_USERINFO', data)
          // 读取该用户的地址信息
          // http://localhost:8081/users/2/sites
          let getSitesApi = api.host + 'users/' + data.id + '/sites'
          http.get(getSitesApi)
            .then(res => {
              commit('SAVE_SITES', res.data)
            })
          // 获取该用户的购物车商品信息
          let getCartsApi = api.host + 'users/' + data.id + '/carts'
          http.get(getCartsApi)
            .then(res => {
              // 保存购物车信息
              commit('SAVE_CARTS', res.data)
              // 更新原始数据信息
              commit('UPDATE_CLASSIFYS', res.data)
            })
          return '登陆成功'
        } else {
          // 没有->注册
          let url = api.host + 'users'
          /* {
            id: 1,
            phone: 18600805498,
            level: "V0",
            current_score: 0,
            dif_score: '距下一等级还需 30 成长值',
            // 所选的地址
            selectedSite: {}
          } */
          let userObj = {
            phone: phone,
            level: 'V0',
            current_score: 0,
            dif_score: '距下一等级还需 30 成长值',
            selectedSite: {}
          }
          return http.post(url, userObj)
            .then(res => {
              // 用户信息保存userInfo
              commit('SAVE_USERINFO', res.data)
              return '注册成功'
            })
        }
      })
  },
  // 保存地址信息
  saveSite (store, siteObj) {
    let url = api.host + 'sites'
    // 保存到了数据库中
    return http.post(url, siteObj)
      .then(res => {
        // 将数据保存到vuex中
        store.commit('SAVE_SITE', res.data)
        // 更改userInfo中的selectedSite
        // 更改数据库该用户的selectedSite值
        // 切换数据库中的用户所选地址
        let changeSelectedSiteApi = api.host + 'users/' + store.state.userInfo.id
        http.get(changeSelectedSiteApi)
          .then((data) => {
            // 判断是不是获取到了数据
            if (data.data.id > 0) {
              data.data.selectedSite = siteObj
              // 更改数据库中的当前用户的SelectedSite值
              http.put(changeSelectedSiteApi, data.data)
            }
          })
        store.commit('CHANGE_SEHLECTED_SITE', res.data)
        return '保存地址成功'
      })
  },
  // 点击切换选中的地址
  changeSelectedSite (store, siteObj) {
    let changeSelectedSiteApi = api.host + 'users/' + store.state.userInfo.id
    return http.get(changeSelectedSiteApi)
      .then((data) => {
        // 判断是不是获取到了数据
        if (data.data.id > 0) {
          data.data.selectedSite = siteObj
          // 更改数据库中的当前用户的SelectedSite值
          return http.put(changeSelectedSiteApi, data.data)
        }
      })
      .then(res => {
        store.commit('CHANGE_SEHLECTED_SITE', res.data.selectedSite)
        return '更改选中的地址成功'
      })
  },
  subNum (store, item) {
    let carts = store.state.carts
    for (let i = 0; i < carts.length; i++) {
      if (Number(carts[i].product_id) === Number(item.product_id)) {
        store.commit('SUB_CART', carts[i])
        if (item.num > 0) {
          // 更新num的数值
          // 更新购车中的数据
          let changeCartApi = api.host + 'carts/' + carts[i].id
          return http.get(changeCartApi)
            .then(res => {
              if (res.data.id) {
                let newCartObj = res.data
                newCartObj.num--
                return http.put(changeCartApi, newCartObj)
              }
            })
            .then(res => {
              return '更新成功'
            })
        } else {
          // 从购物车中移除改商品
          let delCartApi = api.host + 'carts/' + carts[i].id
          return http.delete(delCartApi)
            .then(res => {
              // 从vuex的购物车中移除
              store.commit('DEL_CART', item)
              return '删除成功'
            })
        }
      }
    }
  },
  // 添加到购物车
  addNum (store, item) {
    let carts = store.state.carts
    let addBol = true
    for (let i = 0; i < carts.length; i++) {
      if (Number(carts[i].product_id) === Number(item.product_id)) {
        // vuex中的购物车是有这个商品的
        addBol = false
        // 更新购车中的数据
        let changeCartApi = api.host + 'carts/' + carts[i].id
        return http.get(changeCartApi)
          .then(res => {
            if (res.data.id) {
              let newCartObj = res.data
              newCartObj.num++
              return http.put(changeCartApi, newCartObj)
            }
          })
          .then(res => {
            store.commit('UPDATE_CART', res.data)
            return '更新成功'
          })
      }
    }
    if (addBol) {
      // 添加
      let addApi = api.host + 'carts'
      // 添加一个勾选状态(默认为true)
      item.selected = true
      item.num++
      return http.post(addApi, item)
        .then(res => {
          // 添加到服务器购物车
          store.commit('ADD_CART', res.data)
          // 添加到本地购物车
          store.commit('ADD_LOCAL_CART', item)
          console.log('添加成功')
          return '添加到购物车成功'
        })
    }
  },
  // 切换cartActive来实现购物车按钮的动画
  changeCartActive ({commit}) {
    commit('CHANGE_CARTACTIVE_TRUE')
    setTimeout(() => {
      commit('CHANGE_CARTACTIVE_FALSE')
    }, 300)
  },
  // 切换购物车中的当前对象的选择状态
  switchSelect ({commit}, item) {
    // 更改服务器中选择状态
    let switchSelectApi = api.host + 'carts/' + item.id
    return http.get(switchSelectApi)
      .then(res => {
        if (res.data.id) {
          commit('SWITCH_SELECT', item)
          return http.put(switchSelectApi, item)
        }
      })
      .then(res => {
        console.log(res)
        return '更改selected成功'
      })
  }
  /* changeTabBarBolToFalse ({commit}) {
    commit('CHANGE_TABBAR_BOL_TO_FALSE')
  },
  changeTabBarBolToTrue ({commit}) {
    commit('CHANGE_TABBAR_BOL_TO_TRUE')
  } */
}
