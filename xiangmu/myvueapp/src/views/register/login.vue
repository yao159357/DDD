<template>
  <div class="box">
    <header class="header">
      <van-nav-bar title="登陆" left-arrow @click-left="$router.back()"/>
    </header>
    <div class="content">
      <div v-if="logintype==='tel'">
         <van-field v-model="tel" placeholder="请输入手机号" clearable/>
      <van-field :value="telCode" readonly placeholder="请输入手机验证码" clearable @click.native.stop="show=true">
        <template #button>
          <!-- 显示验证码已发送还有多少时间可以再次发送验证码的 -->
          <van-button size="small" :disable="flag" round color="rgb(255, 77, 23)" @click.stop="sendCode">{{ btncontent }}</van-button>
        </template>
      </van-field>
      <!-- 键盘 -->
      <van-number-keyboard v-model="telCode" :show="show" :maxlength='6' @blur="show = false" />
      <van-button class="mybtn" block round @click="login" :disabled="btnflag" color="linear-gradient(to right, rgb(241, 0, 0), rgb(255, 77, 23))">登陆</van-button>
      </div>
      <div  v-if="logintype==='loginname'">
        <van-field v-model="tel" placeholder="手机号/邮箱/用户名" clearable/>
        <van-field v-model="password" placeholder="密码" clearable  key="pwd1">
      </van-field>
      <!-- 键盘 -->
      <van-number-keyboard v-model="telCode" :show="show" :maxlength='6' @blur="show = false" />
      <van-button class="mybtn" block round @click="loginOfLoginname" :disabled="btn1flag" color="linear-gradient(to right, rgb(241, 0, 0), rgb(255, 77, 23))">登陆</van-button>
      </div>
      <van-row>
        <van-col span="12">
          <span v-if="logintype==='tel'" @click="toggleLogin('loginname')">账户密码登陆</span>
          <span v-if="logintype==='loginname'" @click="toggleLogin('tel')">手机验证码登陆</span>
        </van-col>
        <van-col span="12" class="right">
          使用手机快速注册
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Field, Button, Dialog, Image as VanImage, NumberKeyboard, Toast, Col, Row, Form } from 'vant'
import { dosmslogin, dosendloginCode, domlogin } from '@/api'
import { mapMutations } from 'vuex'
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(VanImage)
Vue.use(NumberKeyboard)
Vue.use(Toast)
Vue.use(Col)
Vue.use(Row)
Vue.use(Form)
export default {
  data () {
    return {
      tel: '',
      telCode: '',
      show: false,
      btncontent: '发送验证码',
      timer: null,
      flag: false,
      reg: /^[1][3,4,5,7,8][0-9]{9}$/,
      loginname: '',
      password: '',
      logintype: 'loginname'
    }
  },
  watch: {
    telCode (newVal) {
      if (newVal.length === 6) {
        this.show = false
      }
    }
    // 监听验证码的长度
  },
  methods: {
    loginOfLoginname () {
      domlogin({
        loginname: this.loginname,
        password: this.password
      }).then(res => {
        if (res.data.code === '10007') {
          Toast('密码错误')
        } else if (res.data.code === '10005') {
          Toast('该用户还未注册')
        } else {
          Toast('登陆成功')
          localStorage.setItem('userid', res.data.data.userid)
          localStorage.setItem('token', res.data.data.token)
          // 设置状态值为true
          localStorage.setItem('loginState', true)
          // 设置状态值为true
          this.changeloginstate(true)
          this.$router.back()
        }
      })
    },
    toggleLogin (type) {
      this.logintype = type
    },
    sendCode () {
      let time = 10
      this.timer = setInterval(() => {
        time--
        if (time <= 0) {
          this.btncontent = '发送验证码'
          this.flag = false
          clearInterval(this.timer)
        } else {
          this.flag = true
          this.btncontent = '重新发送(' + time + 's)'
        }
      }, 1000)
      dosendloginCode({
        tel: this.tel
      }).then(res => {
        console.log(res.data)
      })
    },
    login () {
      console.log('login')
      dosmslogin({
        tel: this.tel,
        telCode: this.telCode
      }).then(res => {
        if (res.data.code === '10006') {
          Toast('验证码错误')
        } else if (res.data.code === '10005') {
          Toast('该用户还未注册，请先注册')
        } else {
          localStorage.setItem('userid', res.data.data.userid)
          localStorage.setItem('token', res.data.data.token)
          localStorage.setItem('loginState', true)
          this.changeloginstate(true)
          this.$router.back()
        }
      })
    },
    ...mapMutations({
      changeloginstate: 'user/change_login_state'
    })
  },
  computed: {
    btnflag () {
      if (this.telCode.length !== 6 || !this.reg.test(this.tel)) {
        return true
      } else {
        return false
      }
    },
    btn1flag () {
      if (this.loginname !== '' || this.password.length < 6) {
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
  .van-field {
    border-bottom: 1px solid #efefef;
  }
  .mybtn {
    margin-top: 60px;
    margin-bottom: 15px;
    box-shadow: 0 0 20px #f66;
  }
  .van-dialog {
    background-color: #0f0;
    .van-dialog__footer {
      .van-dialog__confirm {
        background-color: #f66;
        .van-button__content {
          color:#fff;
        }
      }
    }
  }
  .tip {
    text-align: center;
    .van-image {
      display: block;
      margin: 10px auto 30px;
    }
    .note {
      padding: 10px 24px 30px
    }
  }
  .right {
    text-align: right;
  }
}
</style>
