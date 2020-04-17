<!--
 * @Author: your name
 * @Date: 2019-10-24 10:27:06
 * @LastEditTime: 2019-10-24 14:37:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hospitalc:\Users\LiJiaQin\Desktop\新建文件夹 (5)\src\pages\AddMember.vue
 -->
<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('insured_person')}}</p>
      </div>
      <div class="form-wrap">
        <p>
          <span class="member">
            {{$t('quote_member')}}
            <span class="member-num">1</span>
          </span>
          <span class="member-title">
            <cube-select
              class="insuredMember"
              v-model="insuredPerson"
              :options="options"
              @change="change"
              :title="this.$t('insured_person')"
              :cancelTxt="this.$t('cancel')"
              :confirmTxt="this.$t('confirm')"
            ></cube-select>
          </span>
        </p>

        <div class="form-item">
          <p>{{$t('sex_title_1')}}</p>
          <cube-select
            class="Gender genderSelect"
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
            <!--  @click="form.certificatesType = 0" -->
            {{$t('no_KTP_number')}}
            <i v-show="form.certificatesType == 0" class="cubeic-ok"></i>
          </button>

          <button @click="passpor()" :class="{'card': true, selected: form.certificatesType == 1}">
            {{$t('personal_passport')}}
            <i v-show="form.certificatesType == 1" class="cubeic-ok"></i>
          </button>
          <!--  @click="form.certificatesType = 1" -->
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
      <button class="confirm" @click="Confirm">{{$t('next')}}</button>
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
        // areaCode: "",
        // phoneNumber: "",
        // email: ""
      },
      options: [
        this.$t("ship_myself"),
        this.$t("ship_child"),
        this.$t("Family_friends"),
        this.$t("ship_my_spouse")
      ],
      insuredPerson: this.$t("ship_myself"),
      genderOptions: [this.$t("Female"), this.$t("Male")],
      err: [],
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
    if (!this.inPerson) {
      this.insuredPerson = this.$t("ship_myself");
    } else {
      this.insuredPerson = this.inPerson;
    }

    var inPerson = this.insuredPerson;
    this.setInPerson(inPerson);
    // console.log(inPerson);
  },
  computed: {
    ...mapState([
      "child_age_definition",
      "addMember",
      "inPerson",
      "product_id",
      "userId",
      "language",
      "insureAges",
      "merchantId",
      "indexPath"
    ]),
    agesInfo() {
      return this.$t("addMember_age")
        .replace(/{min_age}/g, this.insureAges.min_age)
        .replace(/{max_age}/g, this.insureAges.max_age);
    }
  },
  methods: {
    ...mapMutations(["setAddMember", "setInPerson"]),
    toPrePage() {
      this.$router.push("/Prompt");
    },
    focusHandle() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: this.$t("account_info_birthday"),
          min: new Date(1620, 7, 8),
          max: new Date(),
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
    // checkID() {
    //   console.log(this.form.hkid);

    // },
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
      // if (this.form.areaCode == "") {
      //   this.validateObj.flag &&
      //     (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      // }
      // if (this.form.phoneNumber == "") {
      //   this.validateObj.flag &&
      //     (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      // } else if (this.form.phoneNumber != "") {
      //   const reg = /^1[3456789]\d{9}$/;
      //   if (this.form.areaCode == "China +86") {
      //     !reg.test(this.form.phoneNumber) &&
      //       this.validateObj.flag &&
      //       (this.validateObj = { flag: false, msg: this.$t("validPhone") });
      //   } else if (this.form.areaCode == "Hong Kong +852") {
      //     this.form.phoneNumber.length != 8 &&
      //       this.validateObj.flag &&
      //       (this.validateObj = { flag: false, msg: this.$t("validPhone") });
      //   } else {
      //     this.form.phoneNumber.length <= 5 &&
      //       this.validateObj.flag &&
      //       (this.validateObj = { flag: false, msg: this.$t("validPhone") });
      //   }
      // }

      // if (this.form.email == "") {
      //   this.validateObj.flag &&
      //     (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      // } else if (this.form.email != "") {
      //   const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      //   !reg.test(this.form.email) &&
      //     this.validateObj.flag &&
      //     (this.validateObj = { flag: false, msg: this.$t("validEmail") });
      // }

      if (this.form.datebirth == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
      if (this.form.hkid == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
    },
    // confirm按钮
    async Confirm() {
      var remindTime = this.getLastDate(this.form.datebirth); //自己选择的时间
      var str = remindTime.toString(); // toString
      str = str.replace("/-/g", "/"); //去空格字符等
      var oldTime = new Date(str).getTime(); //装date  用户输入的日期+18岁
      var nowTime = new Date().getTime(); //当前日期
      // console.log(remindTime);
      var title = "";
      if (this.form.gender == this.$t("Male")) {
        title = "Mr.";
      } else {
        title = "Ms.";
      }
      var params = {
        id: this.userId,
        title,
        product_id: this.product_id,
        language: this.language
      };
      try {
        const res = await this.$http.post(
          //获取问题
          "/wesupromo/web/indonesia/getQuestionContent",
          params
        );
        // console.log(res);
        this.questionsList = res.data;
      } catch (error) {
        // console.log(error);
        this.err = error;
        if (error.status == 105) {
          this.$createDialog({
            type: "alert",
            confirmBtn: {
              text: this.$t("confirm"),
              active: true,
              href: "javascript:;"
            },
            content: error.msg,
            onConfirm: () => {
              this.$router.push(this.indexPath
                // `/index/${this.merchantId}/${this.product_id}/${this.language}`
              );
            }
          }).show();
          return false;
        }
      }

      var minAge = this.insureAges.min_age * 12; //月
      var maxAge = this.insureAges.max_age * 12; //月
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
        //判断出生日期
        // console.log(this.form.datebirth);
        const checkAge = {
          product_id: this.product_id,
          web: "www.baidu.com",
          who_age: "insured",
          others_insured_list: [
            {
              dob: this.form.datebirth
            }
          ]
        };
        this.$http
          .post("/wesupromo/web/product/checkAge", checkAge)
          .then(res => {
            // console.log(res);
            if (res.data.checkAge == true) {
              this.$router.push("/Policyholder");
            } else {
              // console.log(this.agesInfo);
              this.$createDialog({
                type: "alert",
                confirmBtn: {
                  text: this.$t("confirm"),
                  active: true,
                  href: "javascript:;"
                },
                content: `${this.agesInfo}`,
                onConfirm: () => {
                  this.$router.push("/AddMember");
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
      this.setAddMember(query);
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
    },
    change() {
      var inPerson = this.insuredPerson;
      this.setInPerson(inPerson);
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
  background: @background;
}
.page-wraps {
  // padding-bottom: 400px;

  .headTitle {
    position: fixed;
    height: 100px;
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
  .form-wrap {
    margin-top: 80px;
    padding: 18px;
    box-shadow: 0px 5px 10px 0 rgba(0, 0, 0, 0.14);
    border-radius: 8px;

    p {
      display: flex;
      justify-content: space-between;
      .member {
        color: @blue;
        font-weight: bold;
        font-size: 25px;
      }
      .member-title {
        .insuredMember {
          outline: none;
          border: none;
        }
      }
      .member-num {
        color: @blue;
        font-weight: bold;
        font-size: 25px;
        margin-left: 10px;
        // line-height: 75px;
      }
    }
    .Gender {
      height: 60px;
      width: 100%;
      border-radius: 13px;
      font-size: 24px;
      border: 2px solid rgba(155, 155, 155, 0.5);
      text-indent: 18px;
      font-weight: bold;
    }
    .genderSelect {
      height: 62px;
      outline: none;
      border-radius: 8px;
    }
    /deep/.cube-select > span {
      // margin-left: -25px;
      display: block;
    }
    /deep/.cube-select-placeholder {
      color: rgb(233, 233, 233);
      letter-spacing: 2px;
      font-weight: 100;
      font-size: 24px;
    }
    /deep/ .cube-select-text {
      font-size: 24px;
      color: black;
      font-weight: bold;
    }
    input::-webkit-input-placeholder {
      color: rgb(233, 233, 233);
      letter-spacing: 2px;
      font-weight: 100;
      font-size: 24px;
    }
    .form-item {
      p {
        font-size: 26px;
        color: rgb(0, 0, 0);
      }
      line-height: 35px;
      margin-top: 15px;
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
    }
    .card {
      width: 275px;
      height: 50px;
      color: white;
      font-size: 20px;
      outline: none;
      border: none;
      border-radius: 10px;
      margin-top: 30px;
      background: rgb(214, 214, 214);
      cursor: pointer;
      &.selected {
        background: @blue;
      }
    }
    .HK {
      margin-top: 30px;
      font-size: 23px;
      margin-bottom: 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      font-size: 16px;
      margin-top: 4px;
    }
    .radio {
      display: flex;
      // border-bottom: 1px solid #9fbcd1;
      padding-bottom: 30px;
      margin-top: 15px;
      span {
        cursor: pointer;

        &.checked {
          display: inline-block;
          width: 35px;
          box-sizing: border-box;
          height: 35px;
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
            center/35px 35px;
        }
      }
      .agreed {
        flex: 1;
        margin-left: 30px;
        // color: @gray;
        line-height: 60px;
        font-size: 25px;
      }
    }
  }
}

.button-bar {
  text-align: center;
  // position: fixed;
  // left: 50%;
  // transform: translateX(-50%);
  // bottom: 0px;
  width: 100%;
  // height: 120px;
  height: 150px;
  background-color: #fff;
  // border-top: 2px solid rgba(211, 209, 209, 0.25);
  margin-top: 20px;
}
.confirm {
  cursor: pointer;
  background: rgb(2, 164, 71);
  width: 350px;
  // height: 80px;
  // line-height: 80px;
  height: 60px;
  line-height: 60px;
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
  /deep/ &:after {
    border: none !important;
  }
}
</style>
