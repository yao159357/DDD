<template>
  <div class="box">
    <header class="header">
      <van-nav-bar title="选择地址" left-arrow @click-left="$router.back()" />
    </header>
    <section class="content">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="selectItem"
        @add="onAdd"
        @edit="onEdit"
      />
    </section>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, AddressList, Toast } from 'vant'
import { getAddresslist, updateDefaultAddress } from '@/api/order'
Vue.use(NavBar)
Vue.use(AddressList)
Vue.use(Toast)
export default {
  data () {
    return {
      chosenAddressId: '',
      list: []
    }
  },
  methods: {
    selectItem (item) {
      updateDefaultAddress({
        time: item.id,
        userid: localStorage.getItem('userid')
      }).then(() => {
        this.list.forEach(val => {
          val.isDefault = false
          if (item.id === val.id) {
            val.isDefault = true
          }
        })
        item.isDefault = true
        // console.log(item.isDefault)
      }).then(() => {
        this.$router.go(-1)
      })
    },
    onAdd () {
      Toast('新增地址')
      this.$router.push('/orderaddressadd/' + this.$route.params.time)
    },
    onEdit (item, index) {
      Toast('编辑地址:' + index)
    }
  },
  mounted () {
    getAddresslist({
      userid: localStorage.getItem('userid')
    }).then(res => {
      res.data.data.forEach(item => {
        if (item.isDefault === true) {
          this.chosenAddressId = item.time
        }
        const address = item.province === item.city ? item.province + item.county + item.addressDetail : item.province + item.city + item.county + item.addressDetail
        this.list.push({
          id: item.time,
          name: item.name,
          tel: item.tel,
          address: address,
          isDefault: item.isDefault
        })
      })
    })
    // console.log(this.list)
  }
}
</script>
