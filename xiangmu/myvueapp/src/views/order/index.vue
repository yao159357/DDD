<template>
    <div class="box">
      <header class="header">
          <van-nav-bar title="确认订单" left-arrow @click-left="back()" />
      </header>
      <div class="content">
        <van-cell v-if='flag' center :title="name + '' + tel " :label='address' is-link @click="changeAddress"/>
        <van-cell v-else center title="添加收获地址" icon="location-o" is-link @click="changeAddress" />
        <div class="bottom"></div>
        <van-card v-for="item of orderlist"
        :key='item.orderid'
          :num="item.num"
          :price="item.price"
          :title="item.proname"
          :thumb="item.proimg"
        />
        <van-submit-bar :price="totalPrice" :disabled="!flag" button-text="去结算" @submit="pay" />
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Cell, Card, SubmitBar, Dialog } from 'vant'
import { ConfirmOrderInfo, getDefuailAddress, updateOrderAddress, deleteCartData, pay } from '@/api/order'
Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Card)
Vue.use(SubmitBar)
Vue.use(Dialog)
export default {
  data () {
    return {
      flag: true,
      orderlist: [],
      name: '', // 收货名字
      tel: '', // 收货电话
      address: '', // 收货地址
      defaultData: []// 默认收货信息
    }
  },
  mounted () {
    ConfirmOrderInfo({
      userid: localStorage.getItem('userid'),
      time: this.$route.params.time
    }).then(res => {
      this.orderlist = res.data.data
      // console.log(this.orderlist)
      if (this.orderlist[0].tel !== '') { // 有订单的地址
        this.name = this.orderlist[0].name
        this.tel = this.orderlist[0].tel
        this.address = this.orderlist[0].address
        this.flag = true // 默认地址
      } else { // 没有订单的地址
        // 请求默认的地址，如果有显示的默认地址，如果没有显示添加地址
        getDefuailAddress({
          userid: localStorage.getItem('userid')
        }).then(res => {
          if (res.data.data.length === 0) {
            // 没有默认地址
            this.flag = false
          } else {
            const address = res.data.data[0].province === res.data.data[0].city ? res.data.data[0].province + res.data.data[0].county + res.data.data[0].addressDetail : res.data.data[0].province + res.data.data[0].city + res.data.data[0].county + res.data.data[0].addressDetail
            this.flag = true
            this.defaultData = res.data.data
            this.name = res.data.data[0].name
            this.tel = res.data.data[0].tel
            this.address = address
            // console.log(res.data.data[0].name)
            // console.log(this.address)
          }
        })
      }
    })
  },
  methods: {
    pay () {
      // console.log('去支付')
      // 判断有没有订单地址，没有，同步默认地址
      if (this.orderlist[0].tel === '') {
        // 同步默认地址，删除购物车的数据。跳转支付页面
        const address = this.defaultData[0].province === this.defaultData[0].city ? this.defaultData[0].province + this.defaultData[0].county + this.defaultData[0].addressDetail : this.defaultData[0].province + this.defaultData[0].city + this.defaultData[0].county + this.defaultData[0].addressDetail
        const { name, tel } = this.defaultData[0]
        // 同步默认的地址到订单的地址
        updateOrderAddress({
          userid: localStorage.getItem('userid'),
          time: this.$route.params.time,
          name,
          tel,
          address
        }).then(res => {
          // 删除购物车的数据，跳转到支付页面
          this.deleteData()
        })
      } else {
        // 有订单地址，删除购物车数据，跳转到支付页面
        this.deleteData()
      }
    },
    deleteData () {
      // console.log('123')
      // 跳转支付页面前先删除勾选订单数据
      deleteCartData({
        userid: localStorage.getItem('userid')
      }).then(res => {
        // 跳转至支付页面
        this.$router.replace('/pay?body=' + this.orderlist.length + '件商品&total_fee=' + this.totalPrice + '&out_trade_no=' + this.$route.params.time)
        pay({
          body: this.orderlist.length + '件商品',
          total_fee: this.totalPrice,
          out_trade_no: this.$route.params.time
        }).then(res => {
          // console.log('res', res)
          localStorage.setItem('url', res.data.url)
          this.$router.replace('/pay')
        })
      })
    },
    changeAddress () {
      this.$router.push('/orderaddresslist/' + this.$route.params.time)
    },
    back () {
      // this.$router.push('/cart')
      // 弹出框
      Dialog.confirm({
        message: '便宜不等人，请三思哦',
        thema: 'round'
      })// 点击确定后弹出框小事且页面跳转至返回
        .then(() => {
          // on confirm
          this.$router.back()
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  computed: {
    totalPrice () {
      // 这个是计算金额，单位为分
      return this.orderlist.reduce((sum, item) => {
        return sum + item.price * item.num
      }, 0) * 100
    }
  }
}
</script>
<style lang='scss' scoped>
.bottom {
    width: 100%;
    height: 5px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAKBAMAAACOO0tGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURf///4u16Oxtbezz/J3B7NDh9vSmprjS8vGNjfjDw/vd3f7w8O57e0EOI68AAABSSURBVCjPY2CAAE4l7GACVJ4hUBArEIXJL8KuXw0mz4xdv2ABVJ77EHYDGmAGmGDXLwKT58CuX2cDTIEjdgOcYfJJ2A3Qgsmz4/CBwWgQUiMIAXzCOFELLk/nAAAAAElFTkSuQmCC) -7px bottom repeat-x;
    background-size: 64px 5px;
}
</style>
