import Vue from 'vue'// 引入的Vue的基础模块
import App from './App.vue'// 主页面结构
import './registerServiceWorker'// 暂时不去关心<script src=''></script>
import router from './router'// 导入路由模块
import store from './store'// 导入状态管理器模块
// import VueSocketI0 from 'vue-socket.io'
Vue.config.productionTip = false// 生产环境标识---false（开发环境，测试环境，生产环境）

// Vue.use(new VueSocketI0({
//   debug: true,
//   connection: 'http://localhost:3000'
// }))
// 类似于nes Vue({ el: '',caomponnents: {}})
// 使用如下写法，可以避免使用components注册组件以及在publlic/index.html 中使用组件
// 结合vue实例图谱加以理解
new Vue({
  router,
  store,
  render: h => h(App) // 通过render 直接把App.vue组件渲染至id为app的选项内部
}).$mount('#app')
