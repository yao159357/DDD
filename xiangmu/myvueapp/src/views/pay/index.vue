<template>
  <div class="box">
    <header class="header">
      <van-nav-bar title="支付" left-arrow @click-left="back"/>
    </header>
    <div class="content">
        <van-image :src='url' />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Dialog, Image as VanImage } from 'vant'
Vue.use(NavBar)
Vue.use(Dialog)
Vue.use(VanImage)
export default {
  beforeRouteLeave (to, from, next) {
    if (this.payState) {
      next()
    } else {
      alert('请先完成支付')
      next(false)
    }
  },
  data () {
    return {
      url: ''
    }
  },
  // sokets: {}
  mounted () {
    console.log(this.$route)
    this.url = localStorage.getItem('url')
    // this.$sockets.subscribe('get_pay_result', (data){
    //   if (data === 'success') {
    //     this.$router.$router.replace('/支付结果页面')
    //   }
    // })
  },
  methods: {
    back () {
      Dialog.confirm({
        message: '返回将中断本次支付，需要去订单中心继续支付',
        theme: 'round'
      })
        .then(() => {
          // on confirm
          this.$router.back()
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>
