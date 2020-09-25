<template>
  <footer class="footer">
    <ul>
      <router-link to='/home' tag="li">
        <span class="iconfont icon-shouye"></span>
        <p>首页</p>
      </router-link>
      <router-link to='/kind' tag="li">
        <span class="iconfont icon-fenlei"></span>
        <p>分类</p>
      </router-link>
      <router-link to='/cart' tag="li">
        <span class="iconfont icon-gouwuche"></span>
         <!-- 4.在购物车位置显示 -->
        <p>购物车 {{ totalNum }}</p>
      </router-link>
      <router-link to='/user' tag="li">
        <span class="iconfont icon-wode"></span>
        <p>我的</p>
      </router-link>
    </ul>
  </footer>
</template>
<script>
// 1.引入mapActions
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      totalNum: 'totalNum'
    })
  },
  methods: {
    // 2.生成函数
    ...mapActions({
      getCartData: 'cart/getCartData'
    })
  },
  mounted () {
    // 3.获取数据
    this.getCartData(localStorage.getItem('userid'))
  }
}
</script>
