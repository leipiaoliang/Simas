<!--
 * @Author: your name
 * @Date: 2019-10-24 10:27:06
 * @LastEditTime: 2019-10-24 14:36:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hospitalc:\Users\LiJiaQin\Desktop\新建文件夹 (5)\src\pages\Policyholder.vue
 -->
<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('policy_holder_title')}}</p>
      </div>
      <p class="poli">{{ageInfo}}</p>

      <div class="form-wrap">
        <p>
          <span class="member">
            {{$t('policy_holder_title')}}
            <span class="member-num"></span>
          </span>
          <!-- <span class="member-title">
          <cube-select v-model="value" :options="options"></cube-select>
          </span>-->
        </p>

        <div class="form-item">
          <p>{{$t('sex_title_1')}}</p>
          <cube-select
            class="Gender"
            v-model="form.gender"
            :options="genderOptions"
            :placeholder="this.$t('Gender')"
            :title="this.$t('Gender')"
            :cancelTxt="this.$t('cancel')"
            :confirmTxt="this.$t('confirm')"
          ></cube-select>
        </div>
        <div class="form-item">
          <p>{{$t('account_info_lastname2')}}</p>
          <input
            class="Gender"
            v-model="form.surname"
            type="text"
            :placeholder="this.$t('member_lastname')"
          />
        </div>

        <div class="form-item">
          <p>{{$t('account_info_firstname2')}}</p>
          <input
            class="Gender"
            v-model="form.givename"
            type="text"
            :placeholder="this.$t('member_firstname')"
          />
        </div>

        <!-- <div class="form-item">
          <p>{{$t('country_code2')}}</p>
          <cube-select
            class="Gender genderSelect"
            v-model="form.areaCode"
            :options="areaCodeOptions"
            :placeholder="this.$t('area_code')"
            :title="this.$t('area_code')"
            :cancelTxt="this.$t('cancel')"
            :confirmTxt="this.$t('confirm')"
          ></cube-select>
        </div>

        <div class="form-item">
          <p>{{this.$t('phone_number2')}}</p>
          <input
            class="Gender"
            v-model="form.phoneNumber"
            type="text"
            :placeholder="this.$t('phone_number')"
          />
        </div>

        <div class="form-item">
          <p>{{this.$t('account_info_email2')}}</p>
          <input
            class="Gender"
            v-model="form.email"
            type="text"
            :placeholder="this.$t('login_email_r')"
          />
        </div>-->

        <div class="form-item">
          <p>{{$t('Date_of_Birth')}}</p>
          <div
            @click="focusHandle"
            :class="{blank:form.datebirth!=this.$t('account_info_birthday')}"
            class="GenderDiv"
          >{{form.datebirth}}</div>
        </div>

        <div>
          <button @click="noktp()" :class="{'card': true, selected: form.certificatesType == 0}">
            {{$t('no_KTP_number')}}
            <i v-show="form.certificatesType == 0" class="cubeic-ok"></i>
          </button>
          <button @click="passpor()" :class="{'card': true, selected: form.certificatesType == 1}">
            {{$t('personal_passport')}}
            <i v-show="form.certificatesType == 1" class="cubeic-ok"></i>
          </button>
        </div>

        <div class="HK">
          <span
            class="hkNumber"
          >{{form.certificatesType == 0 ? $t('no_KTP_number') : $t('personal_passport') }}</span>
          <input class="IDnumber" v-model="form.hkid" type="text" placeholder="88888888" />
        </div>
      </div>
    </div>
    <div class="button-bar">
      <button class="confirm" @click="Confirm">{{$t('confirm')}}</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      flag: true,
      form: {
        gender: "",
        surname: "",
        givename: "",
        datebirth: this.$t("account_info_birthday"),
        hkid: "",
        certificatesType: 0
        //  areaCode: "",
        // phoneNumber: "",
        // email: ""
      },
      genderOptions: [this.$t("Female"), this.$t("Male")],
      areaCodeOptions: [
        "Hong Kong +852",
        "Philippine +63",
        "Indonesia +62",
        "China +86"
      ]
    };
  },
  created() {
    if (this.addMember) {
      for (var key in this.addMember.form) {
        this.form[key] = this.addMember.form[key];
      }
    }
    if (this.policyholder) {
      for (var key in this.policyholder.form) {
        this.form[key] = this.policyholder.form[key];
      }
    }
  },
  computed: {
    ...mapState([
      "child_age_definition",
      "policyholder",
      "insureAges",
      "addMember",
      "product_id"
    ]),
    ageInfo() {
      return this.$t("policy_holder_age")
        .replace(/{min_age}/g, this.insureAges.min_pp_age)
        .replace(/{max_age}/g, this.insureAges.max_pp_age);
    }
  },
  methods: {
    ...mapMutations(["setPolicyholder"]),
    toPrePage() {
      this.$router.push("/AddMember");
    },
    focusHandle() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: this.$t("account_info_birthday"),
          min: new Date(1620, 7, 8),
          max: new Date(2050, 9, 20),
          value: new Date(),
          cancelTxt: this.$t("cancel"),
          confirmTxt: this.$t("confirm"),
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        });
      }
      this.datePicker.show();
    },
    selectHandle(date, selectedVal, selectedText) {
      this.form.datebirth = this.dateTozero(selectedVal).join("-");
    },
    cancelHandle() {},
    dateTozero(arr) {
      return arr.map(item => (item < 10 ? "0" + item : "" + item));
    },
    getFormData() {
      return this.form;
    },
    noktp() {
      this.form.certificatesType = 0;
      this.form.hkid = "";
      this.form.hkid = this.form.hkid;
    },
    passpor() {
      this.form.certificatesType = 1;
      this.form.hkid = "";
      this.form.hkid = this.form.hkid;
    },
    validate() {
      this.validateObj = {
        flag: true,
        msg: ""
      };
      if (this.form.gender == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
      // if (this.form.surname == "") {
      //   this.validateObj.flag &&
      //     (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      // }
      if (this.form.givename == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }

      //  if (this.form.areaCode == "") {
      //         this.validateObj.flag &&
      //           (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      //       }
      //       if (this.form.phoneNumber == "") {
      //         this.validateObj.flag &&
      //           (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      //       } else if (this.form.phoneNumber != "") {
      //         const reg = /^1[3456789]\d{9}$/;
      //         if (this.form.areaCode == "China +86") {
      //           !reg.test(this.form.phoneNumber) &&
      //             this.validateObj.flag &&
      //             (this.validateObj = { flag: false, msg: this.$t("validPhone") });
      //         } else if (this.form.areaCode == "Hong Kong +852") {
      //           this.form.phoneNumber.length != 8 &&
      //             this.validateObj.flag &&
      //             (this.validateObj = { flag: false, msg: this.$t("validPhone") });
      //         } else {
      //           this.form.phoneNumber.length <= 5 &&
      //             this.validateObj.flag &&
      //             (this.validateObj = { flag: false, msg: this.$t("validPhone") });
      //         }
      //       }

      //       if (this.form.email == "") {
      //         this.validateObj.flag &&
      //           (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      //       } else if (this.form.email != "") {
      //         const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      //         !reg.test(this.form.email) &&
      //           this.validateObj.flag &&
      //           (this.validateObj = { flag: false, msg: this.$t("validEmail") });
      //       }

      if (this.form.datebirth == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
      if (this.form.hkid == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
    },
    Confirm() {
      var remindTime = this.getLastDate(this.form.datebirth); //自己选择的时间
      var str = remindTime.toString(); // toString
      str = str.replace("/-/g", "/"); //去空格字符等
      var oldTime = new Date(str).getTime(); //装date
      var nowTime = new Date().getTime();

      var minAge = this.insureAges.min_pp_age * 12; //月
      var maxAge = this.insureAges.max_pp_age * 12; //月

      var userDate = this.getFirststDate(this.form.datebirth); //用户选择的日期
      var nowDate = this.getFirststDate(new Date()); //当前日期

      var mm = this.datemonth(nowDate, userDate); //相差的月份
      // console.log(minAge, mm, maxAge);

      this.validate(); //最上面调用表单校验方法
      if (!this.validateObj.flag) {
        // 如果表单某项有错误则弹出toast 并带出错误信息this.validateObj.msg
        this.$createToast({
          txt: this.validateObj.msg,
          type: "txt"
        }).show();
        return false;
      } else {
        // if (minAge < mm && mm < maxAge) {
        //   //如果用户输入的日期+18小于当然日期跳转
        //   // if (oldTime <= nowTime) {
        //   this.$router.push("/GeneralInfo");
        //   // } else {
        //   //   this.$router.push("/Policyholder");
        //   // }
        // }
        //  else {
        //   const toast = this.$createDialog({
        //     type: "alert",
        //     confirmBtn: {
        //       text: this.$t("confirm"),
        //       active: true,
        //       href: "javascript:;"
        //     },
        //     content: `${this.ageInfo}`,
        //     onConfirm: () => {
        //       this.$router.push("/Policyholder");
        //     }
        //   });
        //   toast.show();
        //   return false;
        // }

        //验证出生日期，购买的范围
        // console.log(this.form.datebirth);
        const checkAge = {
          product_id: this.product_id,
          web: "www.baidu.com",
          who_age: "holder",
          policy_holder_info: {
            dob: this.form.datebirth
          }
        };
        this.$http
          .post("/wesupromo/web/product/checkAge", checkAge)
          .then(res => {
            // console.log(res);
            if (res.data.checkAge == true) {
              if (this.$route.query.isChange) {
                this.$router.push("/YourOrder");
              } else {
                this.$router.push("/GeneralInfo");
              }
            } else {
              //  console.log(this.ageInfo);
              this.$createDialog({
                type: "alert",
                confirmBtn: {
                  text: this.$t("confirm"),
                  active: true,
                  href: "javascript:;"
                },
                content: `${this.ageInfo}`,
                onConfirm: () => {
                  this.$router.push("/Policyholder");
                }
              }).show();
              return false;
            }
          });
      }
      // 把表单信息存到vuex
      const query = {
        form: this.form
      };
      this.setPolicyholder(query);
    },
    //计算日期之间的月数
    datemonth: function(date1, date2) {
      // 拆分年月日  当前日期
      date1 = date1.split("-");
      // 得到月数
      date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
      // 拆分年月日  选择日期
      date2 = date2.split("-");
      // 得到月数
      date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
      //var m =

      return Math.abs(date1 - date2);
    },
    getLastDate: function(time) {
      var date = new Date(time);
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return (
        date.getFullYear() + this.child_age_definition + "-" + month + "-" + day
      );
    },
    getFirststDate: function(time) {
      var date = new Date(time);
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    }
  }
};
</script>
<style  lang="less" scoped>
@import "~style/mixin.less";
// * {
//   touch-action: none;
// }
.page-wrap {
  padding: 20px;
  padding-top: 50px;
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
        color: black;
        font-weight: 600;
        margin-top: 40px;
      }
    }
    .poli {
      margin-top: 80px;
      font-size: 21px;
      color: rgb(201, 200, 200);
    }
  }
  .form-wrap {
    padding: 18px;
    box-shadow: 0px 5px 10px 0 rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    margin-bottom: 30px;
    margin-top: 10px;
    p {
      display: flex;
      justify-content: space-between;
      .member {
        color: @blue;
        font-weight: bold;
        font-size: 25px;
      }
      .member-num {
        color: @blue;
        font-weight: bold;
        font-size: 30px;
        margin-left: 15px;
        line-height: 75px;
      }
    }
    .Gender {
      height: 60px;
      width: 100%;
      border-radius: 13px;
      font-size: 24px;
      border: 2px solid rgba(155, 155, 155, 0.5);
      text-indent: 20px;
      font-weight: bold;
    }
    /deep/.cube-select > span {
      margin-left: -25px;
    }
    /deep/.cube-select-placeholder {
      color: rgb(233, 233, 233);
      letter-spacing: 2px;
      font-weight: 100;
      font-size: 24px;
    }
    /deep/ .cube-select-text {
      color: black;
      font-weight: bold;
      font-size: 24px;
    }
    input::-webkit-input-placeholder {
      color: rgb(233, 233, 233);
      letter-spacing: 2px;
      font-weight: 100;
      font-size: 24px;
    }
    .GenderDiv {
      height: 60px;
      width: 100%;
      border-radius: 13px;
      font-size: 24px;
      border: 2px solid rgba(155, 155, 155, 0.5);
      text-indent: 20px;
      line-height: 60px;
      color: rgb(233, 233, 233);
    }
    .blank {
      height: 60px;
      width: 100%;
      border-radius: 13px;
      font-size: 24px;
      border: 2px solid rgba(155, 155, 155, 0.5);
      text-indent: 20px;
      line-height: 60px;
      color: rgb(0, 0, 0);
      font-weight: bold;
    }

    .form-item {
      p {
        font-size: 26px;
        color: rgb(0, 0, 0);
      }
      line-height: 35px;
      margin-top: 15px;
    }
    .card {
      width: 275px;
      height: 50px;
      color: white;
      font-size: 20px;
      outline: none;
      border: none;
      border-radius: 10px;
      margin-top: 40px;
      background: rgb(214, 214, 214);
      cursor: pointer;
      &.selected {
        background: @blue;
      }
    }
    .HK {
      margin-top: 30px;
      font-size: 23px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .hkNumber {
        color: rgb(0, 0, 0);
        // font-weight: bold;
        font-family: HelveticaNeue;
        // margin-left: 50px;
      }

      .IDnumber {
        // flex: 1;
        // height: 58px;
        // border-radius: 13px;
        // font-size: 30px;
        // border: 2px solid rgba(173, 175, 175, 0.199);
        // margin-left: 20px;
        // text-align: right;
        height: 60px;
        width: 330px;
        padding-right: 10px;
        text-align: right;
        border-radius: 13px;
        font-size: 24px;
        letter-spacing: 2px;
        border: 2px solid rgba(155, 155, 155, 0.5);
        text-indent: 20px;
        font-weight: bold;
      }
    }
    .htText {
      color: @gray;
      font-size: 14px;
      margin-top: 2px;
    }
  }
}
.button-bar {
  width: 100%;
  text-align: center;
  height: 150px;
  // margin-top: 40px;
  // position: fixed;
  // text-align: center;
  // bottom: 0px;
  // left: 50%;
  // height: 120px;
  // transform: translateX(-50%);
  background: white;
  // border-top: 2px solid rgba(211, 209, 209, 0.25);
}
.confirm {
  cursor: pointer;
  background: rgb(2, 164, 71);
  width: 350px;
  height: 60px;
  line-height: 60px;
  // height: 80px;
  // line-height: 80px;
  border-radius: 15px;
  color: white;
  font-weight: 550;
  font-size: 24px;
  outline: none;
  border: none;
  margin-top: 60px;
}
.cube-select {
  color: black;
  font-size: 30px;
  letter-spacing: 1px;
}
</style>
