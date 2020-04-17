<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-29 10:37:02
 * @LastEditTime: 2019-11-15 18:19:41
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="page-wrap">
    <div class="finish-item">
      <p class="done-img">
        <img src="@/assets/images/done@3x.png" alt />
      </p>
      <p>{{$t('travel_successful_title')}}</p>
    </div>

    <div class="email-item">
      <span class="email-img">
        <img src="@/assets/images/Email@3x.png" alt />
      </span>
      <span class="email-info">
        <p>{{$t('issurer_emailed')}}</p>
        <!-- <p>GoLion will send you the Acknowlegement email, we recommend you to download our App for more features!</p> -->
      </span>
    </div>
    <div class="line"></div>
    <div class="listNumber">
      <h5>{{$t('policy_number')}}</h5>
      <p>{{listNumber}}</p>
      <a class="loading" :href="listPdf" target="_blank">
        <img src="../assets/images/confirmationOfCover@3x.png" alt />
        <span>{{$t('confirm_of_cover')}}</span>
        <img src="../assets/images/download@xxxhdpi.png" alt />
      </a>
    </div>
    <div class="finish-bottom">{{$t('agree_acknowledge')}}</div>
<div v-show="isShow" class="popover_back2"></div>
    <cube-loading v-show="loading"></cube-loading>
  <!-- <div v-show="showExplain" class="popover_back"></div>
    <div v-show="showExplain" class="explain">
      <div class="cancel">
        <img @click="showExplain = !showExplain" src="../assets/images/cancel.png" alt />
      </div>
      <div class="main">
        <div class="model_img">
          <img src="../assets/images/model.png" alt />
        </div>
        <div class="loadingApp">
          <p>Free Medical Hotline during your trip? Get it now!</p>
          <div>
            <img src="../assets/images/wesuranse 3-01@3x.png" alt />
            <span>GET</span>
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="button-bar">
      <button @click="toIndex" class="proceed">Finish</button>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      listNumber: "",
      listPdf: "",
      showExplain:false,
       loading: false,
      isShow: false
    };
  },
  created() {

  },

  methods: {
    // toIndex(){
    //  this.$router.push(
    //   `/index/${this.MerchantId}/${this.beginProductId}/${this.language}`
    // );
    // }
  //  showExplain(){
  //    this.showExplain=!this.showExplain
  //  }
  },
  async mounted() {
    //获取订单号接口
this.loading = true;
    this.isShow = true;
    try {
      const res = await this.$http.post("/wesupromo/web/guaranteeBook", {
        //trx_id: this.session_id,
        application_id:this.$route.query.Ref //sessionStorage.getItem("Ref")
      });
      console.log(res);
       if (res.status == 100) {
        this.loading = false;
        this.isShow = false;
      this.listNumber = res.data.awi_policy_no;
      this.listPdf = res.data.policy_link;
       }
    } catch (error) {
      console.log(error);
       this.loading = false;
      this.isShow = false;
      console.log(error);
       if (error.msg) {
        //请求错误
        this.$createToast({
          txt: error.msg,
          time: 3000,
          type: "txt"
        }).show();
      } else {
        //请求超时
        this.$createToast({
          txt: this.$t("request_error_title"),
          time: 3000,
          type: "txt"
        }).show();
      }
    }
  }

};
</script>

<style lang="less" scoped>
@import "~style/mixin.less";
@deep: ~">>>";

.page-wrap {
  width: 670px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 34px;
  background-color: #fff;
  .imgs {
    width: 100%;
  }
  .img {
    width: 100%;
    height: 100%;
  }
  .finish-item {
    text-align: center;
    margin-top: 100px;
    .done-img {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      color: @blue;
      font-size: 30px;
      margin-top: 30px;
    }
  }
  .email-item {
    display: flex;
    justify-content: space-around;
    margin-top: 200px;
    .email-img {
      width: 100px;
      height: 100px;
      margin-left: 40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .email-info {
      flex: 1;
      margin-left: 30px;
      line-height: 25px;
      letter-spacing: 1px;
      font-size: 25px;
      margin-top: 30px;
      p {
        color: rgb(0, 129, 255);
      }
    }
  }
  .line {
    background-color: #ccc;
    width: 100%;
    height: 2px;
    margin-top: 50px;
  }
  .listNumber {
    h5 {
      color: #9d9d9d;
      text-align: center;
      margin-top: 50px;
      font-size: 23px;
    }
    // .Number {
    //   display: flex;
    //   flex-wrap: wrap;
    //   justify-content: flex-start;
    p {
      text-align: center;
      font-size: 23px;
      font-weight: bold;
      margin-top: 30px;
      margin-left: 20px;
    }
    // }
    .loading {
      width: 100%;
      border-radius: 100px;
      height: 100px;
      border: 3px solid #0083ff;
      margin-top: 50px;
      color: #0083ff;
      text-align: center;
      line-height: 100px;
      font-size: 23px;
      display: inline-block;
      cursor: pointer;
      img {
        width: 40px;
        vertical-align: middle;
        padding: 0 5px;
      }
      span {
        font-weight: bold;
      }
    }
  }
  .finish-bottom {
    color: rgb(74, 74, 74);
    text-align: center;
    line-height: 26px;
    padding-top: 100px;
    padding-bottom: 100px;
    font-size: 20px;
  }
  .popover_back {
    width: 670px;
    margin-left: 50%;
    transform: translateX(-50%);
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    right: 0;
    bottom: 0;
    background-color: #000;
    opacity: 0.4;
  }
  .explain {
    width: 500px;
    margin-left: 50%;
    transform: translateX(-50%);
    height: 0px;
    position: fixed;
    z-index: 888;
    left: 0;
    bottom: 0;
    background-color: #fff;
    padding: 0 30px;
    box-sizing: border-box;
    border-radius: 20px 20px 0 0;
    border: 1px solid #ccc;
    opacity: 1;
    transition: height linear 1s;

    .cancel {
      height: 50px;
      text-align: right;
      margin-top: 20px;
      margin-bottom: 20px;
      img {
        height: 100%;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      margin-bottom: 20px;
      .model_img {
        width: 50%;
        height: 100%;
        img {
          width: 100%;
          height: 500px;
        }
      }
      .loadingApp {
        width: 50%;
        padding: 20px 20px;
        p {
          color: #000;
          font-weight: bold;
          font-size: 38px;
          text-align: center;
          margin-bottom: 50px;
          margin-top: 30px;
        }
        img {
          width: 35%;
          padding: 10px;
          box-sizing: border-box;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
          border-radius: 25px;
          margin-left: 30px;
        }
        a {
          background-color: #0083ff;
          color: #fff;
          font-weight: bold;
          width: 35%;
          display: inline-block;
          height: 38px;
          vertical-align: bottom;
          text-align: center;
          line-height: 38px;
          border-radius: 38px;
          margin-left: 30px;
          margin-bottom: 30px;
          cursor: pointer;
        }
      }
    }
  }
  .hide {
    height: 0;
  }
  .show {
    height: 680px;
  }
  .button-bar {
    margin: 0 auto;
    height: 240px;
    text-align: center;
    margin: 54px -34px -34px;
    background-color: rgba(250, 250, 250);
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px solid rgba(211, 209, 209, 0.25);
  }
  .proceed {
    width: 388px;
    height: 130px;
    line-height: 130px;
    border: none;
    border-radius: 10px;
    background: rgb(2, 164, 71);
    color: #fff;
    text-align: center;
    font-size: 36px;
  }
  @{deep} .cube-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background-color: rgb(231, 227, 227);
    text-align: center;
    border-radius: 10px;
    z-index: 101;
    .cube-loading-spinners {
      margin: 22px 22px;
      width: 60px;
      height: 60px;
    }
  }
  .popover_back2 {
    width: 670px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 97;
    transform: translateX(-50%);
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
}
</style>
