<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('hl_insurance_start_notes1')}}</p>
      </div>
      <div class="head-imgs">
        <img class="head-img" :src="this.data.logo_path" alt />
      </div>

      <div class="Starr">
        <div :class="{'desc':flag}" v-html="this.data.desc1"></div>
        <span class="more" @click="clickmore">{{flag ? $t('product_decs_key_more') : $t('hide')}}</span>
      </div>

      <div class="individual" v-html="this.data.descHtml"></div>
    </div>
    <div class="button-bar">
      <button class="proceed" @click="enter">{{$t('confirm')}}</button>
    </div>
    <div v-show="isShow" class="popover_back2"></div>
    <cube-loading v-show="loading"></cube-loading>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      more: false,
      data: "",
      flag: true,
      loading: false,
      isShow: false
    };
  },
  created() {
    // toast.show();
  },
  methods: {
    clickmore() {
      this.flag = !this.flag;
    },
    enter() {
      this.loading = true;

      this.$router.push("/AddMember");
    },
    toPrePage() {
      this.$router.push("/Login");
    },
    consoleReplaceUrl(text) {
      // var re= /(http||https:\/\/)*?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/*?([a-zA-Z0-9][-a-zA-Z0-9]{0,62})\/*?([a-zA-Z0-9][-a-zA-Z0-9]{0,62})/g
      var re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      var s = text.replace(re, function(a) {
        return (
          '<a href="' +
          a +
          '" target=_blank style="color:#0c81ff;text-decoration:underline">' +
          a +
          "</a>"
        );
      });
      // console.log(s);
      return s;
    }
  },
  computed: {
    ...mapState(["language", "product_id"])
  },
  mounted() {
    // const loading = this.$createToast({
    //   time: 0,
    //   txt: this.$t("loading")
    // });
    var params = {
      product_id: this.product_id,
      language: this.language
    };
    this.loading = true;
    this.isShow = true;
    this.$http
      .post("/wesupromo/web/tpc/getImportantNotes", params)
      .then(res => {
        this.data = res.data;
        // console.log(this.data);
        this.data.desc1 = this.consoleReplaceUrl(res.data.desc1);

        this.$nextTick(() => {
          this.loading = false;
          this.isShow = false;
        });
      })
      .catch(error => {
        this.loading = false;
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
      });
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";

@import "~style/mixin.less";
.page-wrap {
  padding: 34px;
  padding-bottom: 60px;
  // width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
  background: @background;
  .page-wraps {
    // padding-bottom: 200px;
    .headTitle {
      position: fixed;
      height: 100px;
      margin-left: 50%;
      transform: translateX(-50%);
      top: 0;
      width: 670px;
      left: 0;
      z-index: 99;
      background-color: rgba(253, 253, 253);
      border-bottom: 2px solid rgba(211, 209, 209, 0.25);
      .cubeic-arrow {
        color: rgb(0, 122, 255);
        display: inline-block;
        transform: rotateZ(180deg);
        font-size: 36px;
        font-weight: bold;
        position: absolute;
        left: 10px;
        line-height: 100px;
        width: 50px;
        text-align: center;
        height: 100%;
      }
      p {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: inline-block;
        font-size: 30px;
        font-weight: 600;
        margin-top: 40px;
      }
    }
    .head-imgs {
      width: 400px;
      height: 180px;
      // margin: 0 auto;
      margin-top: 90px;
      .head-img {
        width: 100%;
        height: 100%;
      }
    }
    .Starr {
      margin-top: 40px;
      border-bottom: 1px solid rgb(209, 208, 208);
      padding-bottom: 60px;
      white-space: pre-line;
      position: relative;
      font-size: 25px;
      line-height: 30px;
      color: rgb(74, 74, 74);
    }
    .desc {
      font-size: 25px;
      color: #4a4a4a;
      overflow: hidden;
      line-height: 32px;
      // position: relative;
      height: 97px;
    }
    .desc:after {
      content: "...";
      text-align: left;
      position: absolute;
      bottom: 25px;
      left: 0;
      // width: 30px;
      // height: 30px;
      font-size: 30px;
      // background: linear-gradient(
      //   to right,
      //   rgba(255, 255, 255, 0),
      //   rgba(255, 255, 255, 1) 50%
      // );
      // background-color: #fff;
    }
    .more {
      color: @blue;
      position: absolute;
      right: 0;
      bottom: 5px;
      cursor: pointer;
      font-size: 24px;
    }
    .individual {
      margin-top: 25px;
      padding-left: 18px;
      padding-bottom: 30px;
      font-size: 25px;
      color: rgb(74, 74, 74);
      line-height: 32px;
      margin-bottom: 5px;
    }
  }
  .button-bar {
    // position: fixed;
    text-align: center;
    // bottom: 0px;
    // left: 50%;
    // transform: translateX(-50%);
    background: white;
    width: 100%;
    height: 180px;
    // margin-top: 30px;
    // height: 120px;
    // border-top: 2px solid rgba(211, 209, 209, 0.25);
  }
  .proceed {
    cursor: pointer;
    width: 350px;
    // height: 80px;
    // line-height: 80px;
    height: 60px;
    line-height: 60px;
    margin-top: 40px;
    border: none;
    border-radius: 10px;
    background: rgb(2, 164, 71);
    color: #fff;
    text-align: center;
    font-size: 25px;
    cursor: pointer;
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
    width:670px;
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
@{deep} a {
  color: #0c81ff;
  text-decoration: underline;
}
</style>
