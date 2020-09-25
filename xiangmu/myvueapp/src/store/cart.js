import { getCartData } from '@/api'
export default {
  namespaced: true, // 命名空间 ---避免actions 和mutations 重名
  state: {
    cartlist: []
  },
  actions: {
    getCartData (context, userid) {
      console.log(context)
      return new Promise((resolve, reject) => {
        getCartData({
          userid: userid
        }).then(res => {
          // 无需声明模块change_cart_list，context就是自己
          context.commit('change_cart_list', res.data.data)
          resolve() // 使用promise一定不要忘记这一步
        })
      })
    }
  },
  mutations: {
    change_cart_list (state, data) { // state 即为 当前模块的状态，data即为参数 - cartlist的数据
      state.cartlist = data
    }
  }
}
