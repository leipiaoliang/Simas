<!--
 * @Author: your name
 * @Date: 2019-10-24 10:27:06
 * @LastEditTime: 2019-10-25 16:49:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hospitalc:\Users\LiJiaQin\Desktop\新建文件夹 (5)\src\pages\Payment.vue
 -->
<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('menu_payment')}}</p>
      </div>
      <div class="travelead">{{this.caegoryName}}</div>
      <div class="simas">{{this.name}}</div>
      <div class="date">
        <span>
          <p class="date-title">{{this.$t('product_decs_quote_dialog_start')}}</p>
          <p class="date-date">{{this.orderDate.starTime}}</p>
        </span>
        <span>
          <p class="date-title">{{this.$t('endDate')}}</p>
          <p class="date-date">{{this.orderDate.endTime}}</p>
        </span>
      </div>

      <div class="customer">
        <span>
          <p class="days">{{this.plan.period_value}} {{this.$t('firm_order_year')}}</p>
          <p>{{this.addMember.form.givename}} {{this.addMember.form.surname}}</p>
        </span>
        <span class="customer-type">
          <p>1 {{identity}}</p>
          <p>{{this.inPerson}}</p>
        </span>
      </div>

      <!-- <div class="subtotalPrice">
      <span>
        <p class="subTotal">SubTotal</p>
      </span>
      <span class="price">
        <p>HK$190.00</p>
      </span>
      </div>-->

      <div class="subtotalPrice">
        <span>
          <p class="subTotal">{{$t('travel_checkout_subtotal')}}</p>
        </span>
        <span class="price">
          <p>{{this.currency_desc}}{{this.NumFormat(this.data.premium)}}</p>
        </span>
      </div>

      <div class="total-item">
        <span class="total">{{this.$t('travel_checkout_total')}}</span>
        <span class="totalprice">{{this.currency_desc}}{{total ? total : ""}}</span>
      </div>
      <!-- 单选 -->
      <div class="radio">
        <span @click="clickRadio" :class="{'checked':true, 'selected':checked}"></span>
        <p class="agreed">
          {{$t('agreed_confirm')}}
          <span
            class="declaration"
            @click="declarations"
          >{{$t('we_travel_declarations')}}</span>
          {{this.$t('and')}}
          <span
            class="declaration"
            @click="personal"
          >{{$t('FillInfo_Email_Desc2')}}.</span>
        </p>
      </div>
    </div>

    <div class="button-bar">
      <button class="proceed" @click="pay">{{$t('Checkout')}}</button>
    </div>
    <div v-show="isShow" class="popover_back2"></div>
    <cube-loading v-show="loading"></cube-loading>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import JSEncrypt from "jsencrypt/bin/jsencrypt";

export default {
  data() {
    return {
      count: {
        confirm: 0
      },
      checked: false,
      value: "",
      data: "",
      url: {
        declarations: "",
        levy: "",
        pics: ""
      },
      userPeopleInfo: [],
      protectorShow: false,
      totalInfo: [],
      web_policy_holder: {},
      //保存随机生成的数字
      rendomNum: "",
      facility: "",
      isShow: false,
      loading: false
    };
  },
  computed: {
    ...mapState([
      "orderDate",
      "currency_desc",
      "plan",
      "addMember",
      "address",
      "summary",
      "product_id",
      "language",
      "userId",
      "merchantId",
      "inPerson",
      "policyholder",
      "sessionId",
      "productType",
      "applicationID",
      "commonKey",
      "caegoryName",
      "name",
      "CouponCode"
    ]),

    //总价
    total() {
      return this.NumFormat(this.data.levy + this.data.premium);
    },
    identity() {
      // console.log(this.addMember.form.datebirth);
      var remindTime = this.getLastDate(this.addMember.form.datebirth); //自己选择的时间
      var str = remindTime.toString(); // toString
      str = str.replace("/-/g", "/"); //去空格字符等
      var oldTime = new Date(str).getTime(); //装date  用户输入的日期+18岁
      var nowTime = new Date().getTime(); //当前日期
      // console.log(oldTime, nowTime);
      if (nowTime > oldTime) {
        return this.$t("member_adult");
      } else {
        return this.$t("member_child");
      }
    }
  },
  created() {
    this.getRamNumber();

    if (this.$store.state.policyholder) {
      this.protectorShow = true;
    }
    this.userPeopleInfo = this.addMember.form;
    // console.log(this.userPeopleInfo);

    // for (var i = 0; i < this.userPeopleInfo.length; i++) {
    var userObject = {};
    // console.log(this.userPeopleInfo.surname);
    //res加密
    userObject.doc_firstname = this.toEncryption(this.userPeopleInfo.givename);
    if (this.addMember.form.surname) {
      userObject.doc_surname = this.toEncryption(this.userPeopleInfo.surname);
      // console.log(userObject.doc_surname);
    } else {
      userObject.doc_surname = "";
      // console.log(userObject.doc_surname)
    }
    //判斷是HKID還是passport
    if (this.userPeopleInfo.hkid != "") {
      userObject.doc_type = "passport";
      userObject.doc_id = this.toEncryption(this.userPeopleInfo.hkid);
    } else {
      userObject.doc_type = "idcard";
      userObject.doc_id = this.toEncryption(this.userPeopleInfo.hkid);
    }
    // console.log(this.userPeopleInfo.datebirth)
    //出生日期
    userObject.dob = this.userPeopleInfo.datebirth;
    //判斷關係
    switch (this.inPerson) {
      case this.$t("ship_myself"):
        userObject.relation = "2001";
        break;
      case this.$t("ship_my_spouse"):
        userObject.relation = "2002";
        break;
      case this.$t("ship_child"):
        userObject.relation = "2003";
        break;
      case this.$t("Family_friends"):
        userObject.relation = "2004";
        break;
      case this.$t("policyholder"):
        userObject.relation = "2001";
        break;
    }
    // console.log(this.userPeopleInfo.gender);
    // userObject.title = "Ms.";
    //判斷性別
    switch (this.userPeopleInfo.gender) {
      case this.$t("Male"):
        userObject.title = "Mr.";
        break;
      case this.$t("Female"):
        userObject.title = "Ms.";
        break;
    }
    // console.log(userObject.title);
    this.totalInfo.push(userObject);
    // }
    //判斷vuex中的policyholder是否存在
    // console.log(this.policyholder);
    //定義一個空對象來保存userInfo數組中的每一個對象
    var policyObject = {};
    if (this.policyholder) {
      //加密
      policyObject.doc_firstname = this.toEncryption(
        this.policyholder.form.givename
      );
      if (this.policyholder.form.surname) {
        policyObject.doc_surname = this.toEncryption(
          this.policyholder.form.surname
        );
      } else {
        policyObject.doc_surname = "";
        // console.log(policyObject.doc_surname)
      }
      //判斷是HKID還是passport
      if (this.policyholder.form.hkid != "") {
        policyObject.doc_type = "passport";
        policyObject.doc_id = this.toEncryption(this.policyholder.form.hkid);
      } else {
        policyObject.doc_type = "idcard";
        policyObject.doc_id = this.toEncryption(this.policyholder.form.hkid);
      }
      // console.log(this.policyholder.form.datebirth);
      //出生日期
      policyObject.dob = this.policyholder.form.datebirth;
      // policyObject.title = "Ms.";
      // console.log(this.policyholder.form.gender);
      //判斷性別
      switch (this.policyholder.form.gender) {
        case this.$t("Male"):
          policyObject.title = "Mr.";
          break;
        case this.$t("Female"):
          policyObject.title = "Ms.";
          break;
        // case "男":
        //   policyObject.title = "Mr.";
        //   break;
        // case "女":
        //   policyObject.title = "Ms.";
        //   break;
      }
      this.web_policy_holder = policyObject;
      // console.log(this.web_policy_holder);
      // console.log(this.web_policy_holder.title);
    } else {
      this.web_policy_holder = userObject;
      // console.log(this.web_policy_holder);
    }

    // console.log(this.summary);
  },
  methods: {
    ...mapMutations(["SetApplicationID"]),
    toPrePage() {
      this.$router.push("/YourOrder");
    },
    clickRadio() {
      this.checked = !this.checked;
    },
    declarations() {
      const { href } = this.$router.resolve({
        path: "/Declarations"
      });
      window.open(href, "_blank");
    },
    personal() {
      const { href } = this.$router.resolve({
        path: "/PersonalInformation"
      });
      window.open(href, "_blank");
    },

    // 金额显示.00格式
    NumFormat(value) {
      if (!value) return "0.00";
      value = value.toFixed(2);
      var intPart = Math.trunc(value); // 获取整数部分
      var intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
      var floatPart = ".00"; // 预定义小数部分
      var value2Array = value.split(".");
      // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString(); // 拿到小数部分
        if (floatPart.length === 1) {
          // 补0,实际上用不着
          return intPartFormat + "." + floatPart + "0";
        } else {
          return intPartFormat + "." + floatPart;
        }
      } else {
        return intPartFormat + floatPart;
      }
    },

    getLastDate(time) {
      var date = new Date(time);
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + 18 + "-" + month + "-" + day;
    },
    //随机生成数值
    getRamNumber() {
      var result = "";
      for (var i = 0; i < 16; i++) {
        result += Math.floor(Math.random() * 16).toString(16); //获取0-15并通过toString转16进制
      }
      //默认字母小写，手动转大写
      // console.log(result.toUpperCase()); //另toLowerCase()转小写
      this.rendomNum = result.toUpperCase();
      // console.log(this.rendomNum);
    },
    hint() {
      this.$createDialog({
        type: "alert",
        confirmBtn: {
          text: this.$t("confirm"),
          active: true,
          href: "javascript:;"
        },
        content: this.$t("checkout_no_levy")

        // '如有查询，请联络Starr:<a href="mailto:(852)37655566/cs.hk@starrcompanies.com">(852)37655566/cs.hk@starrcompanies.com</a>(办公时间：星期一至星期五，上午9:00至12:30；下午1:30至下午5:00)',
      }).show();
    },
    //封裝一個加密方法
    toEncryption(value) {
      let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
      let publicKey = this.commonKey; //把之前生成的贴进来，实际开发过程中，可以是后台传过来的
      encryptor.setPublicKey(publicKey); // 设置公钥
      let rsaPassWord = encryptor.encrypt(value); // 对需要加密的数据进行加密
      //  console.log(rsaPassWord); //得到加密后的数据
      return rsaPassWord;
    },
    //获取cookie-------------------------------------------------------
    getCookie(c_name) {
      let c_start = "";
      let c_end = "";
      // console.log(document.cookie);
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) {
            c_end = document.cookie.length;
          }
          return unescape(document.cookie.substring(c_start, c_end));
          // return c_name;
        }
      }
      return "";
    },
    pay() {
      var device = this.getCookie(this.product_id);
      // console.log(device);
      if (!this.checked) {
        const toast = this.$createToast({
          time: 3000,
          txt: this.$t("insurance_toast")
        });
        toast.show();
        return false;
      } else {
        this.loading = true;
        //調用支付接口
        //转成真数组
        var totalInfo2 = JSON.parse(JSON.stringify(this.totalInfo));
        // console.log(totalInfo2);
        // console.log(this.userId);
        // console.log(this.rendomNum);
        let paymentParams = {
          company_plan_id: this.plan.company_plan_id,
          address: this.address.address,
          province: this.address.province,
          city: this.address.city,
          postalCode: this.address.postalcode,
          questionerAnswer: this.summary,
          application_id: "microweb" + this.rendomNum,
          web_policy_holder: this.web_policy_holder, //投保人信息
          others_insured_list: totalInfo2,
          id: this.userId,
          trx_id: this.sessionId,
          payment_type: 12,
          product_id: this.product_id,
          start_date: this.orderDate.starTime.replace(/\//g, "-"),
          end_date: this.orderDate.endTime.replace(/\//g, "-"),
          operation: this.productType,
          merchant_id: this.merchantId,
          device_session_id: device,
          pmb_id:sessionStorage.getItem("awiTravel_pmbid")

        };
        // console.log(paymentParams);
        // console.log(JSON.stringify(paymentParams));

        this.$http
          .post("/wesupromo/web/checkout/wvp4Starr1", paymentParams)
          .then(res => {
            console.log(res);
            if ((res.status = 100)) {
              // console.log(res);
              this.loading = false;
              if (this.CouponCode) {
                window.location.href =
                  res.data.checkout_url +
                  "?id=" +
                  this.userId +
                  "&application_id=" +
                  "microweb" +
                  this.rendomNum +
                  "&voucher_promocode=" +
                  this.CouponCode;
              } else {
                window.location.href =
                  res.data.checkout_url +
                  "?id=" +
                  this.userId +
                  "&application_id=" +
                  "microweb" +
                  this.rendomNum;
              }
            }
          })
          .catch(error => {
            // console.log(error);
            this.loading = false;
            this.$createToast({
              txt: error.msg,
              time: 3000,
              type: "txt"
            }).show();
          });
        //this.$router.push("/Topayment");
        this.SetApplicationID(this.rendomNum);
      }
      // this.$router.push('/Complete')
    }
  },
  mounted() {
    //报价
    var params = {
      product_id: this.product_id,
      language: this.language,
      company_plan_id: this.plan.company_plan_id,
      others_insured_list: [
        {
          dob: this.addMember.form.datebirth
        }
      ]
    };
    this.isShow = true;
    this.loading = true;
    this.$http
      .post("/wesupromo/web/product/getMedicalInsuranceProductQuote", params)
      .then(res => {
        // console.log(res);
        if (res.status == 100) {
          this.isShow = false;
          this.loading = false;
          this.data = res.data;
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
    //获取产品详情
    var params = {
      language: this.language,
      product_id: this.product_id,
      phone_country_code: this.areacode,
      merchant_id: this.merchantId
    };
    this.$http
      .post("/wesupromo/web/tpc/getProductDetails", params)
      .then(res => {
        // console.log(res);
        if (res.status == 100) {
          this.url.declarations = res.data.declarations_url;
          this.url.levy = res.data.levy_url;
          this.url.pics = res.data.pics_url;
          //循环遍历获取银行卡图标
          // for (var i = 0; i < this.options.length; i++) {
          //   this.options[i].value = res.data.pay_icons[i].card_scheme;
          //   this.options[i].src = res.data.pay_icons[i].card_scheme_icon_url;
          //   console.log(this.options);
          // }
        }
      });
  }
};
</script>

<style lang="less" scoped>
@import "~style/mixin.less";
@deep: ~">>>";

* {
  touch-action: pan-y;
}
.page-wrap {
  padding: 34px;
  padding-bottom: 60px;
  background-color: white;
  .page-wraps {
    // padding-bottom: 200px;
    .headTitle {
      position: fixed;
      height: 100px;
      top: 0;
      margin-left: 50%;
      transform: translateX(-50%);
      top: 0;
      width: 670px;
      left: 0;
      z-index: 99;
      background-color: rgb(253, 253, 253);
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
    .travelead {
      text-align: center;
      font-weight: bold;
      font-size: 38px;
      margin-top: 90px;
    }
    .simas {
      color: @blue;
      text-align: center;
      font-weight: bold;
      font-size: 27px;
      margin-top: 25px;
    }
    .date {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgb(209, 208, 208);
      border-bottom: 1px solid rgb(209, 208, 208);
      line-height: 45px;
      padding-left: 80px;
      padding-right: 80px;
      margin-top: 30px;
      span {
        text-align: center;
        .date-title {
          font-size: 23px;
          color: rgb(74, 74, 74);
        }
        .date-date {
          font-size: 23px;
          color: rgb(155, 155, 155);
        }
      }
    }
    .customer {
      display: flex;
      justify-content: space-between;
      line-height: 45px;
      padding-left: 100px;
      padding-right: 100px;
      text-align: center;
      font-size: 20px;
      margin-top: 10px;
      span {
        .days {
          font-size: 24px;
          color: rgb(74, 74, 74);
        }
        p {
          &:nth-of-type(2) {
            font-size: 24px;
          }
        }
      }
      .customer-type {
        color: rgb(155, 155, 155);
        p {
          &:nth-of-type(1) {
            font-size: 25px;
          }
          &:nth-of-type(2) {
            font-size: 24px;
          }
        }
      }
    }

    .coupon {
      margin-top: 10px;
      p {
        font-size: 25px;
        color: #ccc;
      }
      .input {
        font-size: 0;
        width: 100%;
        position: relative;
        margin-top: 10px;
        line-height: 60px;
        input {
          display: inline-block;
          position: relative;
          width: 100%;
          height: 60px;
          border: 2px solid #ccc;
          box-sizing: border-box;
          font-size: 23px;
          padding-left: 20px;
          border-radius: 10px;
          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
        span {
          display: inline-block;
          position: absolute;
          right: 0;
          width: 110px;
          height: 60px;
          background-color: @blue;
          color: #fff;
          vertical-align: top;
          border-radius: 10px;
          font-size: 23px;
          text-align: center;
          cursor: pointer;
        }
      }
      .couponInfo {
        height: 60px;
        width: 100%;
        font-size: 25px;
        box-sizing: border-box;
        padding-left: 10px;
        border: 2px solid #ccc;
        line-height: 60px;
        color: @blue;
        margin-top: 10px;
        // margin-bottom: 10px;
        border-radius: 10px;
        .coupInput {
          background: white;
          color: @blue;

          &::-webkit-input-placeholder {
            color: rgb(24, 95, 146);
          }
        }
      }
    }
    .subtotalPrice {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #9fbcd1;
      border-bottom: 1px solid #9fbcd1;
      padding-top: 10px;
      padding-bottom: 30px;
      margin-top: 20px;
      span {
        .subTotal {
          color: rgb(74, 74, 74);
          font-size: 22px;
          font-family: HelveticaNeue-Medium;
          letter-spacing: 0.05px;
        }
        p {
          margin-top: 20px;
          color: rgb(74, 74, 74);
          .collection {
            color: @blue;
          }
        }
      }
      .price {
        text-align: right;
        p {
          color: rgb(24, 95, 146);
          font-size: 23px;
        }
      }
    }
    .levy {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      margin-top: 10px;
      .levy_item {
        color: rgb(74, 74, 74);
        font-size: 22px;
        .morelevy {
          color: @blue;
        }
      }
      .levy_price {
        color: rgb(24, 95, 146);
        font-size: 23px;
      }
    }
    .disc {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #9fbcd1;
      padding-bottom: 10px;
      margin-top: 10px;
      .disc_item {
        color: rgb(74, 74, 74);
        font-size: 22px;
      }
      .disc_price {
        color: rgb(24, 95, 146);
        font-size: 23px;
      }
    }
    .total-item {
      display: flex;
      justify-content: space-between;
      padding-top: 30px;
      padding-bottom: 30px;

      .total {
        color: rgb(74, 74, 74);
        font-size: 27px;
        font-family: HelveticaNeue-Medium;
        letter-spacing: 0.05px;
      }
      .totalprice {
        color: rgb(24, 95, 146);
        font-size: 26px;
      }
    }

    .radio {
      display: flex;
      border-bottom: 1px solid #9fbcd1;
      padding-bottom: 30px;
      span {
        cursor: pointer;

        &.checked {
          display: inline-block;
          width: 38px;
          box-sizing: border-box;
          height: 38px;
          border: 2px solid #888;
          background: none;
          border-radius: 50%;
          margin-top: 13px;
          // background: url("../assets/images/TickOff@3x.png") no-repeat center center/44px 44px;
        }
        &.selected {
          border: none;
          border-radius: 0;
          background: url("../assets/images/Tick@3x.png") no-repeat center
            center/38px 38px;
        }
      }
      .agreed {
        flex: 1;
        margin-left: 40px;
        color: @gray;
        line-height: 30px;
        font-size: 23px;
        .declaration {
          text-decoration: underline;
          color: @blue;
        }
      }
    }
  }

  .button-bar {
    width: 100%;
    height: 150px;
    margin-top: 30px;
    // height: 120px;
    text-align: center;
    // position: fixed;
    // text-align: center;
    // bottom: 0px;
    // left: 50%;
    // transform: translateX(-50%);
    background: white;
    // border-top: 2px solid rgba(211, 209, 209, 0.25);
  }
  .proceed {
    cursor: pointer;
    width: 350px;
    height: 60px;
    line-height: 60px;
    // height: 80px;
    // line-height: 80px;
    border: none;
    border-radius: 10px;
    background: rgb(2, 164, 71);
    color: #fff;
    text-align: center;
    font-size: 24px;
    margin-top: 60px;
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
.cube-select {
  border: 2px solid rgb(151, 151, 151);
  height: 80px;
  line-height: 50px;
  border-radius: 8px;
}
</style>
