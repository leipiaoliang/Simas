<template>
    <div class="page_wrap">
    <div class="fail_box"><img src="@/assets/images/fail_641022.png" alt=""></div>
    <div>
   
    <p class="trans">{{$t('fail_FAILED')}}</p>
    <p>{{$t('fail_Transaction')}}</p>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
             count:1,//倒计时
          timer: null,
          data:""
        }
    },
     created() {
    this.countDown();
  },

  methods: {
    countDown() {
      if(!this.timer) {
        this.timer = setInterval(() => {
          if(this.count > 0) {
            this.count = this.count -1
          } else {
            clearInterval(this.timer);
            this.timer = null;
            //跳转的页面写在此处
            this.$router.push({
              path: '/Payment'
            });
          }
        }, 1000);
      }
    }
  },

  beforeDestroy () {
    if(this.timer) { 
        clearInterval(this.timer);
        this.timer = null;
    }
  },
 
}
</script>

<style lang="less" scoped>
@import "~style/mixin.less";
.page_wrap{ 
    display: flex;
    position: absolute;
    width: 500px;
    height: 150px;
    line-height: 30px;
    // border: 1px solid red;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    vertical-align: middle;
    .fail_box{
        width: 100px;
        height: 100px;
        margin-right: 20px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    div{
       
        justify-content:space-between; 
    }
    .trans{
        margin-top: 15px;
        margin-bottom: 15px;
    }
}

</style>
