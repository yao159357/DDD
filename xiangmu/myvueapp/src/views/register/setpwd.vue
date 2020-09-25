<template>
  <div class="box">
    <header class="header">
      <van-nav-bar title="注册" left-arrow @click-left="back"/>
    </header>
    <div class="content">
      <div class="tip">
        <van-image src="https://plogin.m.jd.com/mreg/static/img/pwd_icon.fa526d8.png" />
        <div class="note">
          请设置登录密码
        </div>
      </div>
      <van-field v-model="password" :type="type" placeholder="请输入8-20位登录密码" clearable :right-icon="righticon" @click-right-icon="changeIcon"/>
      <!-- 键盘 -->
      <p class="waring" v-if="password === ''">密码由8-20位字母、数字活着半角符号组成</p>
      <p class="error" v-else-if="password.length < 8 || password.length > 20 || !reg.test(password)">登陆密码长度需要在8-20位字符之间</p>
      <p class="error" v-else></p>
      <van-button class="mybtn" block round :disabled="pwdFlag" @click='register' color="linear-gradient(to right, rgb(241, 0, 0), rgb(255, 77, 23))">完成</van-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Field, Button, Dialog, Image as VanImage, Toast } from 'vant'
import { dosetpassword } from '@/api'
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(VanImage)
Vue.use(Toast)
export default {
  data () {
    return {
      password: '',
      reg: /^[0-9A-Za-z]{8,20}/,
      type: 'password',
      righticon: 'closed-eye' // closed-eye
    }
  },
  mounted () {
  },
  methods: {
    register () {
      dosetpassword({
        tel: localStorage.getItem('mobile'),
        password: this.password
      }).then(res => {
        Dialog.alert({
          message: '注册成功，登陆手机号为 \n' + localStorage.getItem('mobile')
        }).then(() => {
          Toast('注册成功')
          this.$router.replace('/login')
        })
      })
    },
    changeIcon () {
      if (this.type === 'password') {
        this.righticon = 'eye-o'
        this.type = 'text'
      } else {
        this.righticon = 'closed-eye'
        this.type = 'password'
      }
    },
    back () {
      Dialog.confirm({
        message: '点击“返回”将中断注册，确定返回吗？',
        messageAlign: 'left',
        theme: 'round'
      }).then(() => {
        this.$router.back()
      }).catch(() => {})
    }
  },
  computed: {
    pwdFlag () {
      if (this.password.length < 8 || this.password.length > 20 || !this.reg.test(this.password)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  background-color: #fff;
  padding: 30px 15px;
  .van-field{
    border-bottom: 1px solid #efefef;
  }
  .mybtn {
    margin-top: 60px;
    box-shadow: 0 10px 20px #f66;
  }
  .tip {
    text-align: center;
    .van-imgage {
      width: 100px;
      display: block;
      margin: 10px auto 30px;
    }
    .note {
      padding: 10px 20px 30px;
    }
  }
  .waring { color: #999;margin-top: 10px;}
  .error { color: #f66;margin-top: 10px;}
}
</style>
