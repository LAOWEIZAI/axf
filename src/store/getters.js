export default {
  // 统计购物车中的所有数据并相加
  total (state) {
    let result = 0
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].selected) {
        result += (state.carts[i].num * state.carts[i].price)
      }
    }
    return result
  },
  // 统计购物车的商品总数
  cartsLen (state) {
    let result = 0
    for (let i = 0; i < state.carts.length; i++) {
      result += state.carts[i].num
    }
    return result
  },
  // 全选的状态
  isAllSelect (state) {
    let isAllSelectBol = true
    for (let i = 0; i < state.carts.length; i++) {
      if (!state.carts[i].selected) {
        isAllSelectBol = false
        break
      }
    }
    return isAllSelectBol
  }
}
