<template>
  <div id="app" :class="{p_app:isPc}">
    <!-- <div :class="{leftRightLine:isPc}"></div>
    <div :class="{headerLine:isPc}"></div>
    <div :class="{footerLine:isPc}"></div> -->
    <!-- <Header v-show="title" :title="title" :hasClose="hasClose"/> -->
     <router-view class="view"></router-view>
  </div>
</template>

<script>
import router from './router'
export default {
  name: 'App',
  data() {
    return {
      isPc: false

    }
  },
   created() {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
      console.log("移動");
    } else {
      console.log("pc端");
      this.isPc = true;
    }
  },
   watch:{
    '$route':function(to,from){
　    document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  }
  }



</script>

<style lang="less" scoped>
@import 'style/reset.less';
#app {
  font-family: 'HelveticaNeue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  height: 100%;
  background-color: white;
  /* color: #2c3e50; */
 /* margin-top: 60px;*/
}
.p_app {
  width: 670px;
  margin: 0 auto;
  .leftRightLine {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: 500px;
    border-left: 10px solid #838383;
    border-right: 10px solid #838383;
    border-radius: 15px;
  }
  .headerLine {
    position: fixed;
    top: 0;
    height: 18px;
    background-color: #838383;
    width: 500px;
    z-index: 99;
  }
  .footerLine {
    position: fixed;
    bottom: 0;
    height: 18px;
    background-color: #838383;
    width: 500px;
    z-index: 99;
  }
  .view {
    position: relative;
    z-index: 1;
  }
}
</style>

