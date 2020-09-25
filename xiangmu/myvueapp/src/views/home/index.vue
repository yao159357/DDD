<template>
  <div class="box">
    <header class="header">
      <ul>
        <li class="left"><van-icon name="wap-nav" /></li>
        <li class="center">
          <div class="search" @click="$router.push('/search')">🔍&nbsp;&nbsp;请输入你要搜索的产品关键字</div>
        </li>
        <li class="right"><van-icon name="setting" /></li>
      </ul>
    </header>
    <div class="content" id="content" ref="content">
      <!-- 需要从哪里开始下拉刷新，那么就用这对标签包裹即可 -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="item of bannerlist" :key="item.bannerid">
            <van-image :src="item.img" />
          </van-swipe-item>
        </van-swipe>
        <Nav></Nav>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" >
          <Prolist :prolist="prolist"/>
        </van-list>
      </van-pull-refresh>
      <div class="backtop" @click="backtop" v-show="flag">
        <van-icon name="back-top" size="26"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Image as VanImage, List, PullRefresh, Icon } from 'vant'
import { getHomeBannerlistData, getHomeProlistData } from './../../api'
import Nav from './Nav'
import Prolist from './Prolist'
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(VanImage)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(Icon)
export default {
  components: {
    Nav,
    Prolist
  },
  data () {
    return {
      flag: false,
      bannerlist: [],
      prolist: [],
      loading: false, // 默认不加载
      finished: false, // 默认数据没有完全加载完毕 ----如果只为true，那么就不可以继续上拉
      count: 2, // 默认加载了第一页的数据 ----更具后端的接口的设定
      isLoading: false // 当前是不是处于下拉加载的状态中
      // count是分页的必须参数每加载一次，页码加一
    }
  },
  methods: {
    backtop () {
      // console.log(document.getElementById('content') === this.$refs.content)
      // content的滚动条距离的值为0
      this.$refs.content.scrollTop = 0
    },
    onRefresh () {
      // console.log('可以加载数据')
      this.isloading = true // 开始加载
      getHomeProlistData().then(res => {
        this.prolist = res.data.data // 下拉刷新就是加载第一页数据直接替换即可
        this.count = 2 // 页码重置
        this.finished = false // 保证数据可以正确的加载
        this.isLoading = false // 加载效果
      })
    },
    // 上拉加载的事件
    onLoad () {
      // console.log('可以加载数据')
      this.loading = true // 开始加载
      // 异步请求数据
      getHomeProlistData({
        limit: 10,
        count: this.count
      }).then(res => {
        this.loading = false // 设置加载状态结束
        // 判断有没有数据，有数据拼接数据；没有数据，说明已经全部展示数据
        if (res.data.data.length === 0) {
          this.finished = true // 没有数据了
        } else {
          this.prolist = [...this.prolist, ...res.data.data] // 扩展 运算符 合并 数组
        }
        // 本次加载结束，页码要加1
        this.count++
      })
    },
    scrollFn () {
      // console.log(this.$refs.content.scrollTop)
      // 滚动时记录滚动条的位置，可查看
      localStorage.setItem('top', this.$refs.content.scrollTop)
      if (this.$refs.content.scrollTop > 300) {
        this.flag = true
      } else {
        this.flag = false
      }
    }
  },
  // 保留组件的状态，不会触发销毁和重建，触发的是activated。deactivated钩子
  activated () {
    this.$refs.content.scrollTop = localStorage.getItem('top')
  },
  async mounted () {
    // 第一种写法
    const res1 = await getHomeBannerlistData()
    const res2 = await getHomeProlistData()
    this.bannerlist = res1.data.data
    this.prolist = res2.data.data
    this.$refs.content.addEventListener('scroll', this.scrollFn)
    // 第一种写法
    // getHomeBannerlistData().then(res => {
    //   // console.log(res)
    //   this.bannerlist = res.data.data
    //   // console.log(this.bannerlist)
    // })
    // getHomeProlistData().then(res => {
    //   // console.log(res)
    //   this.prolist = res.data.data
    //   // console.log(this.prolist)
    //   // 第一次数据加载完毕，开始监听滚动条
    //   this.$refs.content.addEventListener('scroll', this.scrollFn)
    // })
  },
  beforeDestory () {
    console.log('销毁之前移除事件监听')
    this.$refs.content.removeEventListener('scroll', this.scrollFn)
  }
}
</script>
<style lang="scss" scoped>
  .header {
    ul {
      height: 100%;
      display: flex;
      background: #f66;
      li {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &:nth-child(1),&:nth-child(3) {
          width: 50px;
          color: #fff;
          font-size: 26px;
        }
        &:nth-child(2){
          flex: 1;
          .search {
            width: 100%;
            height: 0.3rem;
            background: #fff;
            color: #666;
            padding-left: 12px;
            line-height: 0.3rem;
            border-radius: 20px;
          }
        }
      }
    }
  }
  .my-swipe .van-swipe-item {
    height: 1.5rem;
  }
  .backtop {
    position: fixed;
    bottom: 60px;
    right: 10px;
    z-index: 999;
    width: 30px;
    height: 30px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
