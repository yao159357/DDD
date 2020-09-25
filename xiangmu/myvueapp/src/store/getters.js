export default ({
  totalNum (state) {
    return state.cart.cartlist.reduce((sum, item) => {
      // 如果购物车的状态是勾选的,那么数据就是sum + 总数 ,反之为0
      return item.flag ? sum + item.num : sum + 0
    }, 0)
  }
})
