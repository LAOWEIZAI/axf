export default {
  SET_BANNAR (state, data) {
    state.bannar = data
  },
  SET_CLASSIFYS (state, data) {
    state.classifys = data
  },
  SAVE_USERINFO (state, data) {
    state.userInfo = data
  },
  CHANGE_CITY (state, data) {
    state.selectCity = data
  },
  CHAGNE_SITE (state, name) {
    state.selectSite = name
  },
  CHANGE_LOCATION (state, data) {
    state.location = data
  },
  SAVE_SITE (state, data) {
    state.sites.push(data)
  },
  SAVE_SITES (state, data) {
    state.sites = data
  },
  CHANGE_SEHLECTED_SITE (state, data) {
    state.userInfo.selectedSite = data
  },
  SAVE_CARTS (state, data) {
    state.carts = data
  },
  ADD_CART (state, data) {
    state.carts.push(data)
  },
  ADD_LOCAL_CART (state, data) {
    state.localCarts.push(data)
  },
  DEL_CART (state, data) {
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].product_id === data.product_id) {
        state.carts.splice(i, 1)
        break
      }
    }
  },
  SUB_CART (state, data) {
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].id === data.id) {
        state.carts[i].num--
        break
      }
    }
    for (let i = 0; i < state.localCarts.length; i++) {
      if (state.localCarts[i].product_id === data.product_id) {
        state.localCarts[i].num--
      }
    }
  },
  UPDATE_CART (state, data) {
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].id === data.id) {
        state.carts[i].num++
        break
      }
    }
    for (let i = 0; i < state.localCarts.length; i++) {
      if (state.localCarts[i].product_id === data.product_id) {
        state.localCarts[i].num++
      }
    }
  },
  // 初始化原始分类数据
  UPDATE_CLASSIFYS (state, carts) {
    let classifys = state.classifys
    for (let i = 0; i < carts.length; i++) {
      for (let j = 0; j < classifys.length; j++) {
        let products = classifys[j].products
        for (let z = 0; z < products.length; z++) {
          if (Number(carts[i].product_id) === Number(products[z].product_id)) {
            products[z].num = carts[i].num
            // 将原始的购物车对象存储到本地的购物车中
            state.localCarts.push(products[z])
          }
        }
      }
    }
  },
  CART_POS (state, cartPos) {
    state.cartPos = cartPos
  },
  CHANGE_CARTACTIVE_TRUE (state) {
    state.cartActive = true
  },
  CHANGE_CARTACTIVE_FALSE (state) {
    state.cartActive = false
  },
  SWITCH_SELECT (state, item) {
    let index = state.carts.indexOf(item)
    state.carts[index].selected = !state.carts[index].selected
  }
  /* CHANGE_TABBAR_BOL_TO_FALSE (state) {
    state.tabBarShow = false
  },
  CHANGE_TABBAR_BOL_TO_TRUE (state) {
    state.tabBarShow = true
  } */
}
