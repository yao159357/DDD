export default {
  namespaced: true, // 命名空间 ---避免actions 和mutations 重名
  state: {
    loginState: localStorage.getItem('loginState') === 'true' || false
  },
  // 页面刷新，状态管理器的状态会消失
  mutations: {
    change_login_state (state, data) {
      console.log(state)
      state.loginSate = data
    }
  }
}
