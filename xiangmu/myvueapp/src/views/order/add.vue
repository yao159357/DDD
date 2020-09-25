<template>
  <div class="box">
    <header class="header">
        <van-nav-bar title="添加地址" left-arrow @click-left="$router.back()" />
    </header>
    <section class="content">
      <van-address-edit
        :area-list="areaList"
        show-set-default
        save-button-text="保存并使用"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
      />
    </section>
  </div>
</template>
<script>
import Vue from 'vue'
import { AddressEdit, Toast, NavBar } from 'vant'
import areaList from '@/utils/area'
import { addressAdd, updateOrderAddress } from '@/api/order'
Vue.use(AddressEdit)
Vue.use(Toast)
Vue.use(NavBar)
export default {
  data () {
    return {
      areaList
      // searchResult: []
    }
  },
  methods: {
    // Adreessinfo 仅作为初始值传入，表单最终内容可以在sava事件中获取
    onSave (content) {
      // console.log(content)
      content.userid = localStorage.getItem('userid')
      const address = content.provice === content.city ? content.province + content.county + content.addressDetail : content.province + content.city + content.county + content.addressDetail
      addressAdd(content).then(res => {
        // 插入地址成功，使用---更新订单中的地址的信息
        updateOrderAddress({
          userid: localStorage.getItem('userid'),
          time: this.$route.params.time,
          name: content.name,
          tel: content.tel,
          address
        }).then(() => {
          // 订单地址修改成功，跳转到确认订单页面
          this.$router.go(-2)
        })
      })
    }
  }
}
</script>
