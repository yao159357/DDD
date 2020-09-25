<template>
  <div class="box">
    <header class="header">
      <van-nav-bar title="注册" left-arrow @click-left="$router.back()"/>
    </header>
    <div class="content">
      <van-field v-model="tel" placeholder="请输入手机号"  clearable/>
      <van-button block round :disabled="telFlag" @click="checkPhone" color="linear-gradient(to right, rgb(241, 0, 0), rgb(255, 77, 23))">下一步</van-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Field, Button, Dialog } from 'vant'
import { docheckphone } from '@/api'
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Button)
Vue.use(Dialog)
export default {
  data () {
    return {
      tel: '',
      reg: /^[1][3,4,5,7,8][0-9]{9}$/
    }
  },
  methods: {
    checkPhone () {
      docheckphone({ tel: this.tel }).then(res => {
        localStorage.setItem('mobile', this.tel)
        if (res.data.code === '10002') {
          localStorage.setItem('mobile', this.tel)
        } else {
          Dialog.confirm({
            message: '我们将发送短信验证码至:<br/>' + this.tel,
            messageAlign: 'left',
            theme: 'round',
            className: 'confirmBtn'
          })
            .then(() => {
              // on confirm
              this.$router.push('/sms')
            })
            .catch(() => {
              // on cancel
            })
        }
      })
    }
  },
  computed: {
    telFlag () {
      if (this.tel === '' || !this.reg.test(this.tel)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  background-color: #fff;
  padding: 30px 15px;
  .van-field{
    border-bottom: 1px solid #efefef;
  }
  .van-button {
    margin-top: 60px;
    box-shadow: 0 0 20px #f66;
  }
}
</style>
