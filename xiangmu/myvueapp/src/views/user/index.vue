<template>
  <div class="box">
    <header class="header">
      <van-nav-bar title="个人中心">
        <template #right>
          <van-icon name="setting-o" size="24"/>
        </template>
      </van-nav-bar>
    </header>
    <div class="content">
      <div class="imgbox">
        <div class="img">
          <van-image round width="100" height="100" src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2796144188,439704386&fm=26&gp=0.jpg" />
        </div>
        <div class="info">
          <h3>小样</h3>
          <p>超级会员</p>
        </div>
      </div>
      <van-grid>
        <van-grid-item icon="photo-o" text="待付款" />
        <van-grid-item icon="photo-o" text="待收货" />
        <van-grid-item icon="photo-o" text="待评价" />
        <van-grid-item icon="photo-o" text="我的订单" />
      </van-grid>
      <van-cell title="我的地址" is-link  />
      <van-cell title="我的收藏" is-link  />
      <van-cell title="我的足迹" is-link  />
      <van-cell title="我的优惠券" is-link  />
      <van-cell title="我的消息" is-link  >
        <template #default>
          <van-tag round type="danger" >1</van-tag>
        </template>
      </van-cell>
      <van-cell title="关于我们" is-link  />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Button, Image as VanImage, Grid, GridItem, Cell, Tag, Icon, CouponCell, CouponList, Popup } from 'vant'
Vue.use(NavBar)
Vue.use(Button)
Vue.use(VanImage)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Cell)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(CouponCell)
Vue.use(CouponList)
Vue.use(Popup)
export default {
  data () {
    return {
    }
  },
  beforeRouteEnter (to, from, next) {
    if (localStorage.getItem('loginState') === 'true') {
      next()
    } else {
      next('/login')
    }
  }
}
</script>

<style lang="scss">
.imgbox {
  padding: 30px 20px;
  display: flex;
  background: coral;
  // .img {
  //   // width: 100%;
  //   // height: 100%;
  // }
  .info {
    padding: 10px 5px;
    flex: 1;
    margin-left: 30px;
    p {
      margin: 8px 0;
      color: #999;
    }
  }
}
</style>
