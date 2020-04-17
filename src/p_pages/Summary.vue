<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <div class="headTitle">
        <i @click="toPrePage" class="cubeic-arrow"></i>
        <p>{{$t('summary')}}</p>
      </div>
      <div class="title-item">
        <span class="general">{{$t('title_general_info')}}</span>
        <span>
          <span class="editButon" @click.stop.self="edit">{{$t('firm_order_change')}}</span>
        </span>
      </div>
      <div class="check-item" v-for="(item,index) in questionsList" :key="index">
        <span
          v-show="editAbled"
          @click="checked(index)"
          :class="{'checkbox':true,'selected':item.checked}"
        ></span>
        <span class="general-item" :style="{width:generalWidth}">
          <p class="ques">{{$t('qa_ques')}}{{item.quesNumber}}</p>
          <p class="quesContent">{{item.option_content}}</p>
          <div :class="{'button':item.content==$t('sa_question_no'),'No':item.content==$t('login_dialog_yes')}">{{item.content}}</div>
        </span>
      </div>
    </div>
    <div class="button-bar">
      <button
        class="confirm"
        @click="Confirm"
      >{{!editAbled ? $t('confirm') : $t('firm_order_change')}}</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      value: "",
      editAbled: false,
      questionsList: "",
      generalWidth: "",
      data: "",
      dataList:[]
    };
  },
  computed: {
    ...mapState(["maleData", "summary",'merchantId','product_id','language','addressList'])
  },
  methods: {
    ...mapMutations(["setSummary","setAddressList"]),
    Confirm() {
       const loading = this.$createToast({
      time: 0,
      txt: this.$t("loading")
    });
       this.setAddressList(this.dataList)

      let question_answers = [];
      //再次编辑确认
      if (this.editAbled) {
        question_answers = this.questionsList.filter(item => item.checked);
        // console.log(question_answers);
        if (question_answers.length == 0) {
          return false;
        } else {
          this.$router.push({
            path: "/GeneralInfo",
            query: {
              reEdit: JSON.stringify(question_answers)
            }
          });
        }
      } else {
        // console.log(this.questionsList)
this.questionsList.forEach(item=>{
  if(item.pass_answer==""){
    this.$router.push("/Address")
  }else{
// console.log(this.questionsList)
        let question_answers=[]
        this.questionsList.forEach(items => {
         if(items.buttonChecked=='false'){
            items.contents='No'
          }
          if(items.buttonChecked=='true'){
            items.contents='Yes'
          }
          if(items.buttonChecked=='input'){
            items.contents=items.content
          }
          question_answers.push({
            question_id: items.question_id,
            question_type: items.type,
            special:items.special,
            question_number: items.quesNumber,
            pass_answer: items.contents
          });

        });
        // console.log(question_answers)
        this.$http
          .post("/wesupromo/web/indonesia/questionSubmit", { question_answers })
          .then(res => {
            // console.log(res.data);
            if (res.status == 100) {
              this.data = res.data;
              this.setSummary(this.data);
              this.$router.push("/Address");
            }
          //    this.$nextTick(() => {
          //   loading.hide();
          // });
          })
          .catch(error => {
            // console.log(error);
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
                  this.$router.push(`/index/${this.merchantId}/${this.product_id}/${this.language}`);
                }
              }).show();
            }
          });
  }
})
      //  if( this.questionsList=this.questionsList.filter(items =>items.pass_answer)){

      //  }else{
      //    console.log(this.questionsList)
      //         this.$router.push("/Address");

      //  }

      }
    },

    edit() {
      this.editAbled = !this.editAbled;
      if (this.editAbled) {
        this.generalWidth = "88%";
      } else {
        this.generalWidth = "95%";
      }
    },
    checked(index) {
      // this.questionsList[index].checked=!this.questionsList[index].checked
      const status = !this.questionsList[index].checked;
      this.$set(this.questionsList[index], "checked", status);
      // console.log(this.questionsList);
    },
    toPrePage() {
      this.$router.push("/GeneralInfo");
    }
  },
  created() {
    this.questionsList = JSON.parse(JSON.stringify(this.maleData));
// console.log(this.questionsList)
//请求下个页面的地址 并存入vuex
      this.$http.post("/wesupromo/web/indonesia/getProvinceAndCity").then(res => {
      this.dataList = res.data;
      // console.log(this.dataList)
      // res.data.forEach(item => {
      //   this.provinceList.push(item.provinceName);
      //   item.cityList.forEach(val => {
      //     this.cityList.push(val.cityName);
      //   });
      // });
      //       console.log(this.provinceList)
    });
    // const toast = this.$createToast({
    //   time: 0,
    //   txt: this.$t("loading")
    // });
    // toast.show();
  },
  mounted(){

  }
};
</script>
<style lang="less" scoped>
@import "~style/mixin.less";
// * {
//   touch-action: none;
// }
.page-wrap {
  padding: 30px;
  padding-top: 50px;
  padding-bottom: 60px;
  background-color: white;
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
    .title-item {
      margin-top: 80px;
      display: flex;
      justify-content: space-between;
    }
    .general {
      font-size: 30px;
      color: rgb(74, 74, 74);
    }
    .editButon {
      display: inline-block;
      width: 70px;
      height: 40px;
      line-height: 40px;
      border-radius: 7px;
      background: @blue;
      color: white;
      text-align: center;
      cursor: pointer;
      font-size: 24px;
    }
    .check-item {
      > span {
        vertical-align: middle;
        &.checkbox {
          display: inline-block;
          width: 38px;
          height: 38px;
          background: url("../assets/images/TickOff@3x.png") no-repeat center
            center/38px 38px;
        }
        &.selected {
          background: url("../assets/images/Tick@3x.png") no-repeat center
            center/38px 38px;
        }
      }

      .general-item {
        display: inline-block;
        box-shadow: 5px 5px 5px 5px rgba(65, 64, 64, 0.14);
        border-radius: 8px;
        margin-top: 40px;
        padding: 15px;
        width: 95%;
        .ques {
          color: rgb(24, 95, 146);
          letter-spacing: 1px;
          font-weight: bold;
          margin-bottom: 15px;
          font-size: 24px;
        }
        .quesContent {
          font-size: 24px;
          margin-bottom: 30px;
        }
        .button {
          width: 85px;
          height: 35px;
          color: white;
          background: rgb(126, 211, 33);
          text-align: center;
          font-size: 26px;
          line-height: 35px;
          border-radius: 10px;
        }
        .No {
          width: 85px;
          height: 35px;
          color: white;
          background: rgb(245, 166, 35);
          text-align: center;
          font-size: 26px;
          line-height: 35px;
          border-radius: 10px;
        }
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
    height: 150px;
    margin-top: 40px;
    // height: 120px;
    //    border-top: 2px solid rgba(211, 209, 209, 0.25);
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
  /deep/.cube-toast .cube-popup-content {
    height: 100px;
    background: rgb(241, 241, 241);
    color: black;
    border-radius: 8px;
  }

  /deep/.cube-toast-tip {
    line-height: 90px;
    max-height: 100px;
  }
}
</style>
