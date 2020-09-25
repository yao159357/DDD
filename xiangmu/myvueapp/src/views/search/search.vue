<template>
  <div class="box">
    <header class="headersearch">
      <!-- 输入信息回车跳转 -->
      <van-search v-model="searchText" placeholder="请输入搜索关键词" show-action shape='round' clearable @search="onSearch">
      <template #left>
        <div class="searchback" @click="$router.back()"><van-icon name="arrow-left" /></div>
      </template>
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
      </van-search>
    </header>
    <div class="content">
      <div class="searchBox">
        <h3>热门搜索</h3>
        <van-tag plain round :text-color="this.searchText === '手机' ? '#f66' : ''" @click="search('手机')">手机</van-tag>
        <van-tag plain round :text-color="this.searchText === '电脑' ? '#f66' : ''" @click="search('电脑')">电脑</van-tag>
        <van-tag plain round :text-color="this.searchText === '美食' ? '#f66' : ''" @click="search('美食')">美食</van-tag>
        <van-tag plain round :text-color="this.searchText === '美妆' ? '#f66' : ''" @click="search('美妆')">美妆</van-tag>
        <van-tag plain round :text-color="this.searchText === '螺蛳粉' ? '#f66' : ''" @click="search('螺蛳粉')">螺蛳粉</van-tag>
        <van-tag plain round :text-color="this.searchText === '老马是谁' ? '#f66' : ''" @click="search('老马是谁')">老马是谁</van-tag>
        <van-tag plain round :text-color="this.searchText === '厨房用品' ? '#f66' : ''" @click="search('厨房用品')">厨房用品</van-tag>
        <h3>搜索历史</h3>
        <van-tag plain round v-for="(item, index) of historylist" :key="index" @click="search(item)">{{ item }}</van-tag>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Icon, Search, Tag, Toast } from 'vant'
// import { getCategoryBrand } from '@/api'
Vue.use(Icon)
Vue.use(Search)
Vue.use(Tag)
Vue.use(Toast)
export default {
  data () {
    return {
      searchText: '',
      historylist: []
    }
  },
  mounted () {
    const searchListStr = localStorage.getItem('searchlist')
    const searchList = JSON.parse(searchListStr)
    this.historylist = searchList
  },
  methods: {
    // 搜索按钮
    onSearch () {
      if (this.searchText.trim() === '') {
        Toast('请先输入需要搜索的关键字')
        return
      }
      // 从本地获取 搜索列表的数据
      const searchListStr = localStorage.getItem('searchlist') || '[]'
      const searchList = JSON.parse(searchListStr)
      // 获取本次输入的查询的信息在数组中存在不存在
      const index = searchList.indexOf(this.searchText)
      console.log(index)
      if (index === -1) {
        searchList.unshift(this.searchText)
      } else {
        // 删掉原来的位置，在数组的头部插入
        searchList.splice(index, 1)
        searchList.unshift(this.searchText)
      }
      this.historylist = searchList
      localStorage.setItem('searchlist', JSON.stringify(searchList))
      // 跳转的关键
      this.$router.replace('/kindlist?searchText=' + this.searchText)
    },
    search (val) {
      this.searchText = val
      // 点击热门搜索或者搜索历史 跳转
      this.onSearch()
    }
  }
}
</script>
<style lang="scss" scoped>
.van-search {
  padding: 5px 12px;
}
.searchback {
  margin: 0 20px 0 0;
}
.searchBox {
  padding: 10px 8px;
  h3 {
    margin-top: 15px;
  }
}
.content {
  .van-tag {
    margin:15px 15px 0 5px;
  }
}
</style>
