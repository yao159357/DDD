import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Footer from './../components/Footer' // Footer多次被使用
import store from './../store'
Vue.use(VueRouter)
const routes = [
  // 一定要放在最开始，路由的匹配时从上到下的，匹配到即停止
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home', // 访问的路径
    name: 'home', // 命名路由
    // component: () => import('../views/home/index.vue') // 需要渲染的组件---路由的懒加载，到该路由时再加载该页面
    components: { // 路由懒加载页面使用时才加载 -
      default: () => import('../views/home/index.vue'),
      footer: Footer
      // 需要底部必写components，传入default和footer
      // 不需要底部可写component，也可以写components，但是只写default
    },
    // 给分类添加路由元信息，保留组件状态
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/kind',
    name: 'kind',
    components: {
      default: () => import('../views/kind/index.vue'),
      footer: Footer
    },
    // 给分类添加路由元信息，保留组件状态
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/cart',
    name: 'cart',
    components: {
      default: () => import('../views/cart/index.vue'),
      footer: Footer
    },
    beforeEnter (to, from, next) {
      if (!store.state.user.loginState) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/user',
    name: 'user',
    components: {
      default: () => import('../views/user/index.vue'),
      footer: Footer
    }
  },
  {
    // proid为参数
    path: '/detail/:proid',
    name: 'detail',
    component: () => import('../views/detail/index.vue'),
    // 如果使用命名视图，需要写对象形式，如果没有使用，直接写props：true
    props: {
      default: true,
      footer: true
    }
  },
  {
    path: '/test/:id',
    name: 'test',
    component: () => import(/* webpackChunkName: "group-base" */'../views/test/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "group-base" */'../views/register/index.vue')
  },
  {
    path: '/sms',
    name: 'sms',
    component: () => import(/* webpackChunkName: "group-base" */'../views/register/sms.vue')
  },
  {
    path: '/setpwd',
    name: 'setpwd',
    component: () => import(/* webpackChunkName: "group-base" */'../views/register/setpwd.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/register/login.vue')
  },
  {
    path: '/order/:time',
    name: 'order',
    component: () => import('../views/order/index.vue')
  },
  {
    path: '/orderaddresslist/:time',
    name: 'order',
    component: () => import('../views/order/list.vue')
  },
  {
    path: '/orderaddressadd/:time',
    name: 'order',
    component: () => import('../views/order/add.vue')
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('../views/pay/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/search.vue')
  },
  {
    path: '/kindlist',
    name: 'kindlist',
    component: () => import('../views/kind/list.vue')
  }
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]
// 生成路由的实例
const router = new VueRouter({
  mode: 'hash', // 展示的样式 /mode 还可以是hash
  base: process.env.BASE_URL,
  routes, // 路由的规则
  scrollBehavior (to, from, savedPosition) {
    // console.log('savedPosition', savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 全局的导航守卫
// 全局的导航守卫适用于绝大多数的路由，都要满足的条件，只有部分需要验证的可以不使用全局的导航守卫
// router.beforeEach((to, from, next) => {
//   console.log('to', to)
//   console.log('from', from)
//   if (to.name === 'cart') {
//     if (store.state.user.loginState) {
//       next()
//     } else {
//       next('/login')
//     }
//   } else {
//     next()
//   }
// })

export default router
