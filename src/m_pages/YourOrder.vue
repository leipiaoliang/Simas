<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('firm_order_title')}}</p>
      </div>
      <div class="plan-item">
        <p class="plan">{{$t('firm_order_plan_name')}}</p>
        <p class="travelead">{{this.name}}</p>
      </div>

      <div class="pre-item">
        <span>
          <p class="premium">{{$t('firm_order_policy_year')}}</p>
          <p class="price">{{this.plan.period_value}}{{plans}}</p>
        </span>
        <span>
          <p class="premium">{{$t('firm_order_premium')}}</p>
          <p class="price">{{this.currency_desc}}{{this.NumFormat(this.data.premium)}}</p>
        </span>
      </div>

      <div class="date">
        <span>
          <p class="date-title">{{$t('firm_order_star_date')}}</p>
          <p class="date-date">{{starTime}}</p>
        </span>
        <span>
          <p class="date-title">{{$t('endDate')}}</p>
          <p class="date-date">{{endDate}}</p>
        </span>
      </div>
      <!-- 投保人 -->
      <div class="members">
        <span>
          <p class="memb">
            {{$t('policyholder')}}
            <!-- <span>1</span> -->
          </p>
          <p>{{$t('relationship')}}</p>
          <p>{{$t('Gender')}}</p>
          <p v-if="this.policyholder.form.surname">{{$t('account_info_lastname')}}</p>
          <p>{{$t('Given_Name_English')}}</p>
          <!-- <p>{{$t('area_code')}}</p>
          <p>{{$t('phone_number')}}</p>
          <p>{{$t('login_email_r')}}</p>-->
          <p>{{$t('account_info_birthday')}}</p>
          <p>{{policyholderNames}}</p>
        </span>
        <span class="members-right">
          <p class="edit" @click="edit('/Policyholder')">{{$t('firm_order_change')}}</p>
          <p>{{$t('policyholder')}}</p>
          <p>{{this.policyholder.form.gender}}</p>
          <p v-if="this.policyholder.form.surname">{{this.policyholder.form.surname}}</p>
          <p>{{this.policyholder.form.givename}}</p>
          <!-- <p>{{policyCode}}</p>
          <p>{{this.policyholder.form.phoneNumber}}</p>
          <p>{{this.policyholder.form.email}}</p>-->
          <p>{{this.policyholder.form.datebirth}}</p>
          <p>{{this.policyholder.form.hkid}}</p>
        </span>
      </div>

      <!-- 受保人 -->
      <div class="members">
        <span>
          <p class="memb">
            {{$t('insured_person')}}
            <!-- <span>1</span> -->
          </p>
          <p>{{$t('relationship')}}</p>
          <p>{{$t('Gender')}}</p>
          <p v-if="this.addMember.form.surname">{{$t('account_info_lastname')}}</p>
          <p>{{$t('Given_Name_English')}}</p>
          <!-- <p>{{$t('area_code')}}</p>
          <p>{{$t('phone_number')}}</p>
          <p>{{$t('login_email_r')}}</p>-->
          <p>{{$t('account_info_birthday')}}</p>
          <p>{{addMemberNames}}</p>
        </span>
        <span class="members-right">
          <p class="edit" @click="edit('/AddMember')">{{$t('firm_order_change')}}</p>
          <p>{{this.inPerson}}</p>
          <p>{{this.addMember.form.gender}}</p>
          <p v-if="this.addMember.form.surname">{{this.addMember.form.surname}}</p>
          <p>{{this.addMember.form.givename}}</p>
          <!-- <p>{{addmemberCode}}</p>
          <p>{{this.addMember.form.phoneNumber}}</p>
          <p>{{this.addMember.form.email}}</p>-->
          <p>{{this.addMember.form.datebirth}}</p>
          <p>{{this.addMember.form.hkid}}</p>
        </span>
      </div>
      <!-- 调用组件 -->
      <!-- <WOrder></WOrder> -->
    </div>
    <div class="button-bar">
      <button class="proceed" @click="Confirm">{{$t('confirm')}}</button>
    </div>
    <div v-show="isShow" class="popover_back2"></div>
    <cube-loading v-show="loading"></cube-loading>
  </div>
</template>

<script>
import WOrder from "components/WOrder.vue";
import { mapState, mapMutations } from "vuex";

export default {
  // components: {
  //   WOrder
  // },
  data() {
    return {
      data: "",
      isShow: true,
      loading: true
    };
  },
  created() {
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
    this.$http
      .post("/wesupromo/web/product/getMedicalInsuranceProductQuote", params)
      .then(res => {
        // console.log(res);
        if (res.status == 100) {
          this.loading = false;
          this.isShow = false;

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

    //獲取公鑰
    this.$http
      .post("/wesupromo/web/getpublicKey", {
        id: this.userId
      })
      .then(res => {
        // console.log(res);
        if (res.status == 100) {
          this.setCommonKey(res.data.public_key);
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
  methods: {
    ...mapMutations(["setOrderDate", "setCommonKey"]),
    //编辑按钮
    edit(path) {
      // this.$router.push(path);
      this.$router.push({
        path: path,
        query: { isChange: "true" }
      });
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
    Confirm() {
      const time = {
        starTime: this.starTime,
        endTime: this.endDate
      };
      this.setOrderDate(time);
      this.$router.push("/Payment");
    },
    toPrePage() {
      this.$router.push("Address");
    },
    //结束时间
    getEndDate(date, month, year) {
      // console.log(date);
      var date2 = null;
      //判断加了三个月之后是否大于12月
      var years = Number(date[0]) + year;
      var months = Number(date[1]) + month;
      // console.log(years, months);
      if (months > 12) {
        months = months - 12;
        years = Number(date[0]) + 1;
      }
      date2 = [
        years.toString(),
        months.toString(),
        date[2] < 10 ? "0" + date[2] : date[2]
      ].join("/");
      // console.log(date2);
      // console.log(new Date(date2));
      var times = new Date(`${date2} 00:00:00`).getTime() - 1; //转成时间戳
      var date = new Date(times);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // console.log(Y + M + D);
      return Y + M + D;
    }
  },
  computed: {
    ...mapState([
      "plan",
      "addMember",
      "address",
      "orderDate",
      "product_id",
      "language",
      "currency_desc",
      "userId",
      "commonKey",
      "policyholder",
      "name",
      "inPerson"
    ]),
    starTime() {
      var date = new Date();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    // endTime() {
    //   var date = new Date();
    //   var month =
    //     date.getMonth() + 1 < 10
    //       ? "0" + (date.getMonth() + 1)
    //       : date.getMonth() + 1;
    //   var day =
    //     date.getDate() < 10 ? "0" + date.getDate() - 1 : date.getDate() - 1;
    //     day=day < 10 ? "0" + day : day;
    //     console.log(day)
    //   return date.getFullYear() + 1 + "-" + month + "-" + day;
    // },
    plans() {
      let plans = "";
      if (this.plan.period_type == 2) {
        if (this.plan.period_value > 1) {
          plans = this.$t("firm_order_years");
        } else {
          plans = this.$t("firm_order_year");
        }
      } else if (this.plan.period_type == 1) {
        plans = this.$t("Days");
      } else {
        if (this.plan.period_value > 1) {
          plans = this.$t("months");
        } else {
          plans = this.$t("month");
        }
      }
      return plans;
    },
    addMemberNames() {
      let addMemberNames = "";
      if (this.addMember.form.certificatesType == 0) {
        addMemberNames = this.$t("no_KTP_number");
      } else {
        addMemberNames = this.$t("personal_passport");
      }
      return addMemberNames;
    },
    policyholderNames() {
      let policyholderNames = "";
      if (this.policyholder.form.certificatesType == 0) {
        policyholderNames = this.$t("no_KTP_number");
      } else {
        policyholderNames = this.$t("personal_passport");
      }
      return policyholderNames;
    },
    //     policyCode(){
    //  if(this.policyholder){
    // var str = this.policyholder.form.areaCode;
    //       console.log(str)
    //       str=str.split(" +")
    //        console.log(str)
    //       str = "+" +str[1];
    //       return str;
    //       }
    //     },
    //     addmemberCode(){
    //  if(this.addMember){
    // var str = this.addMember.form.areaCode;
    //       console.log(str)
    //       str=str.split(" +")
    //        console.log(str)
    //       str = "+" +str[1];
    //       return str;
    //       }
    //     },
    //结束日期
    endDate() {
      var start = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-");
      // console.log(start);
      if (this.plan.period_type == 2) {
        return this.getEndDate(start, 0, this.plan.period_value);
      } else if (this.plan.period_type == 3) {
        return this.getEndDate(start, this.plan.period_value, 0);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~style/mixin.less";
@deep: ~">>>";

.page-wrap {
  padding: 34px;
  padding-bottom: 60px;
  background-color: rgba(253, 253, 253);

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
    .plan-item {
      margin-top: 90px;
      line-height: 40px;
      .plan {
        color: #9b9b9b;
        letter-spacing: 1px;
        font-size: 26px;
      }
      .travelead {
        font-size: 36px;
      }
    }
    .pre-item {
      line-height: 40px;
      margin-top: 40px;
      display: flex;
      > span {
        margin-right: 25px;
      }
      .premium {
        color: #9b9b9b;
        font-size: 26px;
      }
      .price {
        color: @blue;
        font-weight: 700;
        font-size: 40px;
      }
    }
    .date {
      display: flex;
      justify-content: space-between;
      margin-top: 100px;
      line-height: 45px;
      span {
        .date-title {
          color: #9b9b9b;
          font-size: 26px;
        }
        .date-date {
          font-size: 30px;
        }
      }
      .edit {
        color: @blue;
      }
    }
    .members {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      background-color: white;

      span {
        line-height: 40px;
        .memb {
          color: #9b9b9b;
          margin-bottom: 20px;
          font-size: 26px;
        }
        .edit {
          margin-bottom: 20px;
          text-align: right;
          color: @blue;
          cursor: pointer;
          font-size: 26px;
        }
        p {
          font-size: 26px;
        }
      }
      .members-right {
        text-align: right;
      }
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
    height: 200px;
    margin-top: 40px;
    // height: 120px;
    // border-top: 2px solid rgba(211, 209, 209, 0.25);
  }
  .proceed {
    width: 500px;
    height: 100px;
    line-height: 100px;
    // height: 80px;
    // line-height: 80px;
    border: none;
    border-radius: 10px;
    background: rgb(2, 164, 71);
    color: #fff;
    text-align: center;
    font-size: 30px;
    margin-top: 60px;
    cursor: pointer;
  }
  @{deep} .cube-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
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
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
}

</style>
