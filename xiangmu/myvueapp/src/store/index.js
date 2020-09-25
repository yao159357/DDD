import Vue from 'vue'
import Vuex from 'vuex'
import cart from './cart'
import user from './user'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    cart,
    user
  }
})
