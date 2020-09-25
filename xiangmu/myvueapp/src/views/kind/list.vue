<template>
  <div class="box">
    <header class="header">
      <ul>
        <li class="left" @click="$router.back()"><van-icon name="arrow-left" /></li>
        <li class="center">
          <div class="search" @click="$router.push('/search')">{{text}}</div>
        </li>
        <li class="right"></li>
      </ul>
    </header>
    <div class="content">
      <van-empty v-if='this.prolist.length === 0' image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="没有查找到您想要的商品信息" />
      <van-dropdown-menu v-else>
        <!-- 价格排序 -->
        <van-dropdown-item v-model="pricevalue" :options="priceoption" @change="priceSort"/>
        <!-- 销量排序 -->
        <van-dropdown-item v-model="salesvalue" :options="salesoption" @change="salesSort"/>
        <!-- 筛选 -->
        <van-dropdown-item title="筛选" ref="item" class='myitem' position='right'>
          <div class="pricebox">
            <h5>价格区间</h5>
            <van-field v-model="min" placeholder="0" />
            <div>~</div>
            <van-field v-model="max" placeholder="最大值" />
          </div>
          <!-- 筛选里面的按钮 -->
          <div style="padding: 5px 16px;">
            <van-button type="danger" block round @click="filter" >
              确认
            </van-button>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
      <!-- 数据列表 -->
      <Prolist :prolist='prolist'></Prolist>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { DropdownMenu, DropdownItem, Cell, Button, Icon, Field, Empty } from 'vant'
import { getCategoryBrandLists, getSearchData } from '@/api'
import Prolist from './Prolist'
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Cell)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Field)
Vue.use(Empty)
export default {
  components: {
    Prolist
  },
  data () {
    return {
      prolist: [], // kind分类的数据
      searchlist: [], // 搜索跳转来的数
      list: [], // 深拷贝prolist
      text: '',
      min: 0,
      max: '',
      // 标题可见价格排序
      pricevalue: 0,
      // 标题可见销量排序
      salesvalue: 0,
      switch1: false,
      switch2: false,
      priceoption: [
        { text: '价格排序', value: 0 },
        { text: '价格升序', value: 1 },
        { text: '价格降序', value: 2 }
      ],
      salesoption: [
        { text: '销量排序', value: 0 },
        { text: '销量升序', value: 1 },
        { text: '销量降序', value: 2 }
      ]
    }
  },
  mounted () {
    // 挂载运行
    this.getCategoryBrandLists()
    this.getSearchData()
  },
  methods: {
    // 销量
    salesSort (value) {
      // console.log(value)
      switch (value) {
        case 0:
          console.log('默认销量排序')
          this.saleslist = this.saleslistlist
          break
        case 1:
          console.log('销量升序')
          this.saleslist.sort((a, b) => {
            return a.sales - b.sales
          })
          break
        case 2:
          console.log('销量降序')
          this.saleslist.sort((a, b) => {
            return b.sales - a.sales
          })
      }
    },
    // 价格区间的筛选
    filter () {
      this.prolist = this.list
      console.log(this.list)
      let arr = []
      if (this.max === null) {
        arr = this.prolist.filter(item => {
          return item.price >= this.min * 1
        })
      } else {
        arr = this.prolist.filter(item => {
          return item.price >= this.min * 1 && item.price <= this.max * 1
        })
      }
      this.prolist = arr
      this.$refs.item.toggle()
    },
    // 价格排序
    priceSort (value) {
      // console.log(value)
      switch (value) {
        case 0:
          console.log('默认价格排序')
          this.prolist = this.list
          break
        case 1:
          console.log('价格升序')
          this.prolist.sort((a, b) => {
            return a.price - b.price
          })
          break
        case 2:
          console.log('价格降序')
          this.prolist.sort((a, b) => {
            return b.price - a.price
          })
      }
    },
    // 显示从搜索跳转来的
    getSearchData () {
      const { searchText } = this.$route.query
      this.text = searchText
      getSearchData({
        searchText
      }).then(res => {
        this.searchlist = res.data.data
        // console.log(res)
        this.prolist = res.data.data
        this.saleslist = res.data.data
        this.list = JSON.parse(JSON.stringify(this.prolist))
        this.saleslistlist = JSON.parse(JSON.stringify(this.saleslist))
      })
    },
    // 显示从分类跳转来的
    getCategoryBrandLists () {
      const { category, brand } = this.$route.query
      this.text = brand
      getCategoryBrandLists({
        category, brand
      }).then(res => {
        // console.log(res)
        this.prolist = res.data.data
        this.saleslist = res.data.data
        this.list = JSON.parse(JSON.stringify(this.prolist))
        this.saleslistlist = JSON.parse(JSON.stringify(this.saleslist))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
    ul {
      height: 100%;
      display: flex;
      li {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &:nth-child(1),&:nth-child(3) {
          width: 50px;
          color: #cac6c6;
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
.myitem {
  .van-dropdown-item {
    position: fixed;
    right: 0;
    left: 15%;
    z-index: 10;
    overflow: hidden;
  }
  .van-popup--top {
    top: 0;
    bottom: 0;
    left: 15%;
    width: 85%;
  }
}
.pricebox {
  padding: 10px 15px;
  display: flex;
  h5 {
    line-height: 38PX;
  }
  .van-field {
    flex: 1;
    input {
      text-indent: 12px;
    }
  }
}
</style>
