<template>
  <div class="box">
    <header class="header">
      <ul>
        <li class="left"><van-icon name="arrow-left" /></li>
        <li class="center">
          <div class="search" @click="$router.push('/search')">搜索商品</div>
        </li>
        <li class="right"><van-icon name="setting" /></li>
      </ul>
    </header>
    <div class="content">
        <van-sidebar v-model="activeKey" @change="onChange"><!-- 改变索引值 -->
          <van-sidebar-item  :title="item" v-for="item of categorylist" :key="item.proid" @click="selectItem(item)"/>
        </van-sidebar>
        <div class="contentright">
          <!-- 修改图标一行3个，修改图标的尺寸为48 -->
          <van-grid :column-num='3' :icon-size='48'>
            <!-- 点击进入品牌以及分类的查询列表页面 -->
            <van-grid-item :icon='item.logo' :text='item.brand' v-for="(item, index) of brandlist" :key='index' @click="tolist(item.brand)"/>
          </van-grid>
        </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Icon, Sidebar, SidebarItem, Grid, GridItem } from 'vant'
import { getCategory, getCategoryBrand } from '@/api'
Vue.use(Icon)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(Grid)
Vue.use(GridItem)
export default {
  data () {
    return {
      activeKey: 0,
      categorylist: [],
      brandlist: []
    }
  },
  mounted () {
    // 加载调用
    this.getCategory()
  },
  methods: {
    onChange (val) {
      // 打印什么类型的商品
      // console.log(val)
      this.activeKey = val
    },
    getCategory () {
      getCategory().then(res => {
        this.categorylist = res.data.data
        // 这个是初始的时候没有值，加一个这个可在初始的时候显示第一个的列表里的数据
        this.selectItem(this.categorylist[0])
      })
    },
    selectItem (item) {
      // console.log(item)
      getCategoryBrand({
        category: item
      }).then(res => {
        this.brandlist = res.data.data
      })
    },
    tolist (brand) {
      // 跳转至新增 搜索 页面
      this.$router.push(`/kindlist?category=${this.categorylist[this.activeKey]}&brand=${brand}`)
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
.content{
  display: flex;
  .contentright{
    flex: 1;
  }
}
</style>
