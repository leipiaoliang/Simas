<!--
 * @Author: your name
 * @Date: 2019-10-24 10:27:06
 * @LastEditTime: 2019-10-24 14:05:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hospitalc:\Users\LiJiaQin\Desktop\新建文件夹 (5)\src\pages\Login.vue
 -->
<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('login')}}</p>
      </div>
      <div class="ownedBy">
        {{this.ownedBy}}
        <span @click="showHiddenExplain('show')">
          <img class="title_img" src="@/assets/images/email_img.png" alt />
        </span>
      </div>
      <div class="header progressive">
        <!-- <span>Fintech</span><span>travel.com</span> -->
        <img :src="logo" alt />
      </div>
      <p class="title">{{$t('login_welcome')}}</p>
      <p class="tip-text">{{$t('input_number_email')}}</p>
      <p class="label">{{$t('input_number')}}</p>
      <div class="flex ver-mid">
        <div class="area-wrap">
          <span class="areaCode">{{areaCode}}</span>
          <cube-select
            class="areaSelect"
            v-model="areaCode"
            placeholder=" "
            title=" "
            :cancelTxt="this.$t('cancel')"
            :confirmTxt="this.$t('confirm')"
            :options="areaOptions"
          >
            <span>1</span>
          </cube-select>
        </div>
        <cube-input
          class="input-item"
          v-model="form.mobile"
          placeholder="8888 8888"
          @change="mobile"
        ></cube-input>
      </div>
      <p class="label" style="margin-top:30px">{{$t('login_email_1')}}</p>
      <cube-input
        class="input-item"
        v-model="form.email"
        placeholder="example@email.com"
        @change="email"
      ></cube-input>

      <div class="form-tip">{{$t('ePolicy')}}</div>
      <!-- <p class="tixing">
      {{$t('clickNext')}}
      <span @click="terms" class="terms">{{$t('otg_terms')}}</span>{{$t('and')}}
      <span @click="privacy" class="privacy">{{$t('privacy_policies')}}</span> .
      </p>-->
    </div>
    <div class="loginButton-bar">
      <router-link to>
        <button @click="next" class="loginNext">{{$t('info_doc_data_next')}}</button>
      </router-link>
    </div>
    <div v-show="showExplain" class="popover_back"></div>
    <div v-show="showExplain" class="explain">
      <img :src="logo" alt />
      <p>{{this.ownedByDetail}}</p>
      <div @click="showHiddenExplain('hidden')" class="button_back">{{$t('btn_back')}}</div>
    </div>
    <cube-loading v-show="loading"></cube-loading>
  </div>
</template>

<script>
import http from "@/api/http";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Index",
  data() {
    return {
      areaCode: "+62",
      areaOptions: [
        { value: "+852", text: "Hong Kong +852" },
        { value: "+63", text: "Philippine +63" },
        { value: "+62", text: "Indonesia +62" },
        { value: "+86", text: "China +86" }
      ],
      form: {
        mobile: "",
        email: ""
      },
      validateObj: {
        flag: true,
        msg: ""
      },
      user_Id: "",
      showExplain: false,
      loading: false
    };
  },
  // created() {
  //   const toast = this.$createToast({
  //     time: 1000,
  //     txt: this.$t("loading")
  //   });
  //   toast.show();
  // },
  mounted() {
    if (this.login) {
      for (var key in this.login) {
        this.form[key] = this.login[key];
      }
    }
  },
  computed: {
    ...mapState([
      "userId",
      "login",
      "sessionId",
      "logo",
      "merchantId",
      "language",
      "product_id",
      "ownedByDetail",
      "ownedBy",
      "CouponCode",
      "indexPath"
    ])
  },
  methods: {
    ...mapMutations(["setUser", "setLogin"]),
    next() {
      this.validate(); //最上面调用表单校验方法
      if (!this.validateObj.flag) {
        // 如果表单某项有错误则弹出toast 并带出错误信息this.validateObj.msg
        this.$createToast({
          txt: this.validateObj.msg,
          type: "txt"
        }).show();
        return false;
      }
      this.loading = true;

      this.areaCode = this.areaCode.replace("+", "");
      // console.log(this.areaCode);
      //参数
      const params = {
        phone: this.form.mobile,
        phone_country_code: this.areaCode,
        language: this.language,
        // web: "www.baidu.com",
        email: this.form.email,
        trx_id: this.sessionId
      };
      this.$http
        .post("/wesupromo/web/add", params)
        .then(res => {
          if (res.status === 100) {
            // console.log(res);
            this.loading = false;

            sessionStorage.setItem("userId", res.data.id);
            this.user_Id = res.data.id;
            // console.log(this.user_Id);
            this.setUser(this.user_Id);
            this.setLogin(this.form);
            this.$router.push({ path: "/Prompt" });
          }
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
    },
    mobile() {
      this.setLogin(this.form);
      // sessionStorage.setItem("mobile",this.form.mobile)
    },
    email() {
      this.setLogin(this.form);

      // sessionStorage.setItem("email",this.form.email)
    },
    toPrePage() {
      this.$router.push(this.indexPath
        // `/index/${this.merchantId}/${this.product_id}/${this.language}/${this.CouponCode}`
      );
    },
    validate() {
      this.validateObj = {
        flag: true,
        msg: ""
      };
      if (this.form.mobile == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("input_number") });
      } else if (this.form.mobile != "") {
        const reg = /^1[3456789]\d{9}$/;
        if (this.areaCode == "+86") {
          !reg.test(this.form.mobile) &&
            this.validateObj.flag &&
            (this.validateObj = { flag: false, msg: this.$t("validPhone") });
        } else if (this.areaCode == "+852") {
          this.form.mobile.length != 8 &&
            this.validateObj.flag &&
            (this.validateObj = { flag: false, msg: this.$t("validPhone") });
        } else {
          this.form.mobile.length <= 5 &&
            this.validateObj.flag &&
            (this.validateObj = { flag: false, msg: this.$t("validPhone") });
        }
      }

      if (this.form.email == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("emailEmpty") });
      } else if (this.form.email != "") {
        // const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        !reg.test(this.form.email) &&
          this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("validEmail") });
      }
    },
    terms() {
      this.$router.push("/Terms");
    },
    privacy() {
      this.$router.push("/Privacy");
    },
    //禁止滚动
    stop() {
      var mo = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", mo, false); //禁止页面滑动
    },
    /***取消滑动限制***/
    move() {
      var mo = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", mo, false);
    },

    //头部感叹号
    // ownedByDetails() {
    //   this.showExplain = true;
    //   // this.stop()
    // },
    showHiddenExplain(value) {
      this.showExplain = !this.showExplain;
      if (value == "show") {
        var mo = function(e) {
          e.preventDefault();
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", mo, false); //禁止页面滑动
      } else {
        var mo = function(e) {
          e.preventDefault();
        };
        document.body.style.overflow = ""; //出现滚动条
        document.removeEventListener("touchmove", mo, false);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "~style/mixin.less";
.page-wrap {
  padding: 54px 54px 54px 54px;
  padding-bottom: 60px;
  background: @background;
  .page-wraps {
    // padding-bottom: 200px;

    .headTitle {
      position: fixed;
      height: 100px;
      top: 0;
      width: 100%;
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
    .ownedBy {
      color: rgb(155, 155, 155);
      font-size: 26px;
      margin-bottom: 30px;
      margin-top: 80px;
    }
    .title_img {
      width: 35px;
      vertical-align: middle;
      cursor: pointer;
    }
    .header {
      // text-align: center;
      width: 428px;
      height: 194px;
      // margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      color: #000;
      font-weight: 600;
      font-size: 48px;
      line-height: 58px;
      margin-top: 40px;
    }
    .tip-text {
      font-size: 32px;
      line-height: 41px;
      letter-spacing: 2px;
      color: @gray;
      margin-bottom: 102px;
      margin-top: 20px;
    }
    .label {
      font-size: 26px;
      letter-spacing: 1px;
      color: @gray;
      line-height: 28px;
      margin-bottom: 20px;
    }
    .area-wrap {
      position: relative;
      width: 160px;
      border-bottom: 4px solid #000;
      margin-right: 18px;
      .areaCode {
        position: absolute;
        height: 90px;
        right: 30px;
        left: 0;
        text-align: right;
        font-size: 44px;
        line-height: 90px;
        // z-index: 1;
        color: #000;
      }
      .areaSelect {
        background: transparent;
        position: relative;
        // z-index: 2;
        overflow: hidden;
        height: 90px;
        /deep/ .cube-select-text {
          color: transparent;
        }
        &::after {
          border: none;
        }
        /deep/ span {
          font-size: 44px;
          color: #000;
        }
        /deep/ .cube-select-icon {
          border-width: 10px 6px 0 6px !important;
          border-color: #000 transparent transparent;
        }
      }
    }
    .input-item {
      height: 86px;
      line-height: 70px;
      font-size: 40px;
      border-bottom: 4px solid #000;
      &::after {
        border: none;
      }
      /deep/ input {
        color: #000;
        padding: 0;
        line-height: 26px;
        letter-spacing: 2px;
      }
      /deep/ input::-webkit-input-placeholder {
        color: rgb(223, 223, 223);
        letter-spacing: 2px;
        line-height: 70px;
      }
    }
    .form-tip {
      margin-top: 6px;
      font-size: 26px;
      color: @gray;
      line-height: 26px;
    }
    .tixing {
      font-size: 22px;
      line-height: 24px;
      margin-top: 120px;
    }
    .terms {
      color: #0081ff;
      text-decoration: underline;
    }
    .privacy {
      color: #0081ff;
      text-decoration: underline;
    }
  }
  .loginButton-bar {
    text-align: center;
    width: 100%;
    height: 200px;
    margin-top: 40px;
    // height: 120px;
    // position: fixed;
    // text-align: center;
    // bottom: 0px;
    // left: 50%;
    // transform: translateX(-50%);
    background: white;
    // border-top: 2px solid rgba(211, 209, 209, 0.25);
  }
  .loginNext {
    cursor: pointer;
    background: rgb(2, 164, 71);
    width: 500px;
    // height: 80px;
    // line-height: 80px;
    height: 100px;
    line-height: 100px;
    border-radius: 15px;
    color: white;
    font-weight: 550;
    font-size: 30px;
    outline: none;
    border: none;
    margin-top: 60px;
  }
  .popover_back {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    right: 0;
    bottom: 0;
    background-color: rgb(41, 40, 40);
    opacity: 0.4;
  }
  .explain {
    width: 600px;
    // height: 700px;
    position: fixed;
    z-index: 100000;
    left: 50%;
    top: 50%;
    transform: translate(calc(-50% - 2px), calc(-50% - 2px));
    //padding: 30px;
    text-align: center;
    background-color: #fff;
    border-radius: 20px;
    padding: 0 30px;
    img {
      width: 60%;
      margin-top: 50px;
      margin-bottom: 50px;
    }
    p {
      font-size: 35px;
      line-height: 40px;
      margin-bottom: 85px;
    }
    .button_back {
      width: 50%;
      height: 80px;
      border-radius: 20px;
      line-height: 80px;
      color: #fff;
      margin: 0 auto;
      font-size: 30px;
      margin-bottom: 80px;
      background-color: #00a738;
    }
  }
}

</style>
