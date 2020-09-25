<template>
  <div class="container">
    <!-- <div class="box">
      <header class="header"></header>
      <div class="content">内容</div>
    </div> -->
    <!-- 路由那边引入的，点击进入详情，返回在原位置 -->
    <!-- 一个路由控制多个视图的变化 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- 过渡效果的css -->
    <transition name="slide">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <router-view name="footer"></router-view>
    <!-- <footer class="footer">
      <ul>
        <router-link to='/home' tag="li">
          <span class="iconfont icon-shouye"></span>
          <p>首页</p>
        </router-link>
        <router-link to='/kind' tag="li">
          <span class="iconfont icon-fenlei"></span>
          <p>分类</p>
        </router-link>
        <router-link to='/cart' tag="li">
          <span class="iconfont icon-gouwuche"></span>
          <p>购物车</p>
        </router-link>
        <router-link to='/user' tag="li">
          <span class="iconfont icon-wode"></span>
          <p>我的</p>
        </router-link>
      </ul>
    </footer> -->
  </div>
</template>

<style lang="scss">
*{padding: 0;margin: 0;list-style: none;}
html,body,.container{width:100%;height: 100%;}
html{
  //移动端适配
  font-size: 26.6666666vw;
}
 // 横屏
@media all and (orientation: landscape) {
  html{
    font-size: 100px;
  }
  .container {
    font-size: 14px;
    max-width: 640px;
    margin: 0 auto;
  }
}
body{
  font-size: 14px;
}
.container{
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
    .box{
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .header{
      height: 0.44rem;
      background: #f7f6f6;
    }
    .content{
      flex: 1;
      overflow: auto; // 内容超出显示滚动条
    }
  }
  .footer{
    height: 0.5rem;
    background: #efefef;
    ul{
      display: flex;
      height: 100%;
      li{
        flex: 1;
        height: 100%;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span{
          font-size: 0.24rem;
        }
        p{
          font-size: 0.12rem;
        }
      }
    }
  }
}
// 过渡效果的css
.slide-enter {
  transform: translateX(100%);
}
.slide-enter-active {
  transition: all 0.5s;
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave {
  transform: translateX(100%);
}
.slide-leave-active {
  transition: all 0s;
}
.slide-leave-to {
  transform: translateX(0);
}
</style>
