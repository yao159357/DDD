<template>
  <div class="box">
    <div class="content" ref='content'>
      <!-- <header class="detailheater">
        <transition name="van-fade">
          <ul class="no" v-if="scrolltop >= 44">
            <li @click="$router.back()">
              <van-icon name='arrow-left'/>
            </li>
            <li></li>
            <li @click="showShare = true"><van-icon name='weapp-nav'/></li>
          </ul>
        </transition>
        <transition name="van-fade">
          <ul class="ok" v-if="scrolltop <= 44">
            <li @click="$router.back()">
              <van-icon name='arrow-left'/>
            </li>
            <li>
              <div :class="activeindex === 0 ? 'active' : ''">商品</div>
              <div :class="activeindex === 1 ? 'active' : ''">评价</div>
              <div :class="activeindex === 2 ? 'active' : ''">详情</div>
              <div :class="activeindex === 3 ? 'active' : ''">推荐</div>
            </li>
            <li @click="showShare = true"><van-icon name='weapp-nav'/></li>
          </ul>
        </transition>
      </header> -->
      <van-nav-bar title="标题" left-arrow @click-left="$router.back()" @click-right="showShare = true">
        <template #right>
          <van-icon name="weapp-nav" size="20"/>
        </template>
      </van-nav-bar>
      <van-empty v-if="flag" image="search" description="抱歉，没有查找到该产品" />
      <div class="detail-swipe" v-else>
        <!-- 改变索引值 -->
        <van-swipe class="detail-swipe" @change="onChange">
          <!-- 点击预览照片 -->
          <van-swipe-item v-for="(item, index) of detailBannerlist" :key="index" @click="previewImg">
            <van-image :src="item" />
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">
              {{ current + 1 }}/ {{ detailBannerlist.length }}
            </div>
          </template>
        </van-swipe>
        <div class="proinfo">
          <!-- 价格 -->
          <b>￥{{ proObj.price }}</b>
          距离结束时间还有
          <van-count-down class="van-count-down" :time="time" />
          <!-- 品牌+名称 -->
          <h3><van-tag type='danger'>{{proObj.brand}}</van-tag>--{{ proObj.proname }}</h3>
          <!-- 描述 -->
          <h4>{{ proObj.desc }}</h4>
        </div>
        <!-- 详情的底部 -->
        <van-goods-action>
          <van-goods-action-icon icon="chat-o" text="客服" color="#07c160" @click="chat" />
          <van-goods-action-icon icon="cart-o" text="购物车" @click="loginState ? $router.push('/Cart') : $router.push('/login')" :badge="totalNum"/><!-- 修改这里mapGetters -->
          <van-goods-action-icon icon="star" text="已收藏" color="#ff5000" />
          <van-goods-action-button type="warning" text="加入购物车" @click="addCart"/>
          <van-goods-action-button type="danger" text="立即购买" />
        </van-goods-action>
        <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options"/>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Icon, Empty, Swipe, SwipeItem, Image as VanImage, ImagePreview, GoodsAction, GoodsActionIcon, GoodsActionButton, ShareSheet, CountDown, Toast } from 'vant'
import { getProDetailData, addCart } from '@/api'
import { mapActions, mapGetters, mapState } from 'vuex'
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Empty)
Vue.use(Swipe)
Vue.use(VanImage)
Vue.use(SwipeItem)
Vue.use(GoodsAction)
Vue.use(GoodsActionButton)
Vue.use(GoodsActionIcon)
Vue.use(ShareSheet)
Vue.use(CountDown)
Vue.use(Toast)
export default {
  props: ['proid'],
  computed: {
    ...mapGetters({ totalNum: 'totalNum' }),
    ...mapState({ loginState: ({ user: { loginState } }) => loginState })
  },
  data () {
    return {
      proObj: {},
      flag: true,
      detailBannerlist: [
        'https://m.360buyimg.com/mobilecms/s843x843_jfs/t1/130541/26/5645/90415/5f227fbaE0ffdb27c/e89a0f82caeafdbf.jpg!q70.dpg.webp',
        'https://m.360buyimg.com/mobilecms/s843x843_jfs/t1/85501/9/13683/363340/5e5cdb63Ed74ac67b/5dc28b6f6d3b0c22.jpg!q70.dpg.webp'
      ],
      current: 0,
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ],
      time: 30 * 60 * 60 * 1000
    }
  },
  methods: {
    // 美洽客服
    chat () {
      window._MEIQIA('showPanel')
      window._MEIQIA('metadata', {
        name: '智子', // 美洽默认字段
        tel: '18813007814',
        address: '半人马座阿尔法星', // 美洽默认字段
        aaa: 'bla bla bla', // 自定义字段
        xyz: 'lalala' // 自定义字段
      })
      window._MEIQIA('product', {
        picUrl: 'https://xxx/xxx.jpg',
        title: '美洽 - 客服系统',
        description: '支持PC端/移动端/微信/APP/微博...等全渠道对话接入，稳定快速，无需下载部署，注册即用',
        productUrl: 'http://www.mobiletrain.org/?pinzhuanbdtg=biaoti',
        salesCount: 111,
        success: data => {
          // console.log(data, 'data')
        },
        error: error => {
          console.log(error, 'error')
        }
      })
    },
    addCart () {
      //  如果登陆状态值为否，那么就跳转到登陆页面
      if (!this.loginState) {
        this.$router.push('/login')
      }
      addCart({
        userid: localStorage.getItem('userid'),
        proid: this.proObj.proid,
        num: 1
      }).then(res => {
        if (res.data.code === '200') {
          Toast('加入购物车成功')
          // 3.获取数据
          this.getCartData(localStorage.getItem('userid'))
        }
      })
    },
    onChange (index) {
      this.current = index
    },
    // 点击预览照片
    previewImg () {
      ImagePreview({
        // 预览图片数组
        images: this.detailBannerlist,
        // 起始预览的索引值
        startPosition: this.current,
        onClose () {
        }
      })
    },
    ...mapActions({
      getCartData: 'cart/getCartData'
    })
  },
  mounted () {
    // 美洽客服
    window._MEIQIA('withoutBtn')
    window._MEIQIA('init')
    // 3.获取数据
    this.getCartData(localStorage.getItem('userid'))
    // console.log(this.$route)
    const proid = this.$route.params.proid
    // const { proid } = this.$route.params
    // const { params: { proid } } = this.$route // 多重结构赋值
    // console.log(proid)
    getProDetailData({
      proid
    }).then(res => {
      if (res.data.code === '10001') {
        this.flag = true
      } else {
        this.flag = false
        // this.proObj是数据
        this.proObj = res.data.data
        // 组合详情的轮播图,数组前添加，添加至第一张
        this.detailBannerlist.unshift(this.proObj.proimg)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .detail-swipe {
    height: 3.75rem;
  }
  .custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
}
.proinfo {
  padding: 5px 10px;
  b{
    font-size: 26px;
    color: #f66;
  }
  .van-count-down {
    display: inline-block;
    width: 100px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 5px;
    margin-left: 15px;
  }
  h4{
    color: #cccccc;
    margin-top: 10px;
    font-weight: 100;
  }
}
</style>
