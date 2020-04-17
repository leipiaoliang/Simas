<template>
  <div class="page-wrap">
    <div class="headTitle">
      <i @click="toPrePage" class="cubeic-arrow"></i>
      <p>{{$t('title_general_info')}}</p>
    </div>
    <p class="answer">
      {{$t('product_ques_title')}}
      <br />
      <!-- <span class="insured">{{$t('insuredPerson')}}</span> -->
    </p>
    <div class="wrapper">
      <swiper ref="mySwiper" :options="swiperOption" class="swiper-container">
        <!-- slides -->
        <swiper-slide
          class="swiper-item"
          v-for="(item,index) in questionsList"
          data-index="index"
          :key="item.question_id"
        >
          <p class="questions">{{$t('qa_ques')}} {{item.question_number}}</p>
          <p
            class="quesContent"
            ref="quescontent"
            :class="{'quesType':item.question_type=='FREETEXT'}"
          >{{item.option_content}}</p>
          <!-- //:style="{'fontSize':  setFontSize(item.option_content.length)}"  -->
          <p v-if="item.question_type === 'FREETEXT' ">
            <input
              class="quesInput"
              type="text"
              v-model="dataForm[item.question_number]"
              :placeholder="item.option_content"
            />
          </p>
          <div class="buttons">
            <div
              class="yes"
              @click="answer($t('login_dialog_yes'), item, index,'true')"
              v-if="item.question_type === 'YES/NO' "
            >{{$t('login_dialog_yes')}}</div>
            <div
              class="no"
              @click="answer($t('sa_question_no'), item, index,'false')"
              v-if="item.question_type === 'YES/NO' "
            >{{$t('sa_question_no')}}</div>
            <div class="confirm" @click="confirm(item, index,'input')" v-else>{{$t('confirm')}}</div>
          </div>
        </swiper-slide>
        <!-- Optional controls ,显示小点-->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div v-show="isShow" class="popover_back2"></div>
    <cube-loading v-show="loading"></cube-loading>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import { mapState, mapMutations } from "vuex";

export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      questionsList: [],
      swiperOption: {
        // 参数选项,显示小点
        pagination: ".swiper-pagination",
        //循环
        // loop:true,
        //每张播放时长3秒，自动播放
        // autoplay:2000,
        //滑动速度
        speed: 1000,
        // delay:1000
        // initialSlide: 4,
        activeIndex: 1
      },
      dataForm: [],
      answerList: [],
      questionContent: [],
      loading: false,
      isShow: false
    };
  },
  computed: {
    ...mapState([
      "maleData",
      "addMember",
      "userId",
      "product_id",
      "language",
      "policyholder"
    ]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    // var QC=document.getElementById('quescontent')
    // console.log(QC)
    // console.log(this.$refs)
    //  console.log(this.$refs.mySwiper)
    //  console.log(this.$refs.quescontent[0])
    //  let contentList=[]
    //  contentList.push(this.$refs.quescontent)
  },
  created() {
    var title = "";
    if (this.addMember.form.gender == this.$t("Male")) {
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
    this.loading = true;
    this.show = true;

    this.$http
      .post("/wesupromo/web/indonesia/getQuestionContent", params)
      .then(res => {
        if (res.status == 100) {
          this.loading = false;
          this.show = false;

          if (this.$route.query.reEdit) {
            JSON.parse(this.$route.query.reEdit).forEach(item => {
              res.data.forEach(val => {
                if (item.question_id === val.question_id) {
                  this.questionsList.push(val);
                  if (val.question_type === "FREETEXT") {
                    this.dataForm[val.question_number] = item.content;
                  }
                }
              });
            });
          } else {
            this.questionsList = res.data;
            // console.log(this.questionsList)
          }
        }
      });
  },
  methods: {
    ...mapMutations(["setMale"]),
    toPrePage() {
      //  if(!this.policyholder){
      //      this.$router.push('/AddMember')
      //  }else{
      this.$router.push("/Policyholder");
      //  }
    },
    answer(content, item, index, buttonChecked) {
      // console.log(buttonChecked)
      const maleData = {
        question_id: item.question_id,
        type: item.question_type,
        quesNumber: item.question_number,
        content,
        special: item.special ? item.special : "",
        pass_answer: item.pass_answer ? item.pass_answer : "",
        option_content: item.option_content,
        checked: false,
        buttonChecked: buttonChecked
      };
      // console.log(maleData)
      this.questionsList.splice(index, 1);
      if (this.$route.query.reEdit) {
        this.maleData[item.question_number - 1] = maleData;
        this.answerList = this.maleData;
      } else {
        this.answerList[item.question_number - 1] = maleData;
      }

      if (this.questionsList.length === 0) {
        this.setMale(this.answerList);
        this.$router.push("/Summary");
      }
    },
    // setFontSize (length) {
    //   console.log(length)

    //   const fontSize = Number.parseInt(( 570 / length) * 17);
    //   return fontSize > 34 ? '26px' : `${fontSize}px`
    // },

    confirm(item, index, buttonChecked) {
      const maleData = {
        question_id: item.question_id,
        type: item.question_type,
        quesNumber: item.question_number,
        content: this.dataForm[item.question_number],
        special: item.special ? item.special : "",
        pass_answer: item.pass_answer ? item.pass_answer : "",
        option_content: item.option_content,
        checked: false,
        buttonChecked: buttonChecked
      };
      if (!this.dataForm[item.question_number]) {
        const toast = this.$createToast({
          time: 3000,
          txt: this.$t("insurance_toast")
        });
        toast.show();
        return;
      }

      this.questionsList.splice(index, 1);
      if (this.$route.query.reEdit) {
        this.maleData[item.question_number - 1] = maleData;
        this.answerList = this.maleData;
      } else {
        this.answerList[item.question_number - 1] = maleData;
      }

      if (this.questionsList.length === 0) {
        this.setMale(this.answerList);
        this.$router.push("/Summary");
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~style/mixin.less";
@deep: ~">>>";
body,
html {
  height: 100%;
  width: 100%;
}

.page-wrap {
  padding: 35px;
  width: 670px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: #fff;
  .headTitle {
    position: fixed;
    height: 100px;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: rgb(253, 253, 253);
    border-bottom: 2px solid rgba(211, 209, 209, 0.25);
    width: 670px;
    margin-left: 50%;
    transform: translateX(-50%);
    .cubeic-arrow {
      color: rgb(0, 122, 255);
      display: inline-block;
      transform: rotateZ(180deg);
      font-size: 32px;
      font-weight: bold;
      position: absolute;
      left: 10px;
      line-height: 80px;
      width: 50px;
      text-align: center;
      height: 100%;
      cursor: pointer;
    }
    p {
      position: absolute;
      width: 70%;
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
      display: inline-block;
      font-size: 28px;
      font-weight: 600;
      margin-top: 50px;
    }
  }
  .swiper-container {
    margin-top: 20px;
    overflow: visible;
    padding: 5px;
    border-radius: 10px;
    .swiper-wrapper {
      .swiper-item {
        //overflow: auto;
        p {
          .quesInput {
            width: 90%;
            height: 45px;
            margin: 0 auto;
            border-bottom: 1px solid rgb(74, 74, 74);
            position: absolute;
            transform: translateX(-50%);
            top: 50%;
            left: 50%;
          }
        }
      }
    }
  }
  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: -70px;
  }
  @{deep} .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
  }
  @{deep} .swiper-pagination-bullet-active {
    background: rgb(74, 74, 74);
    opacity: 0.7;
  }
  .swiper-slide {
    height: 500px;
    padding-top: 25px;
    width: 400px;
    box-shadow: 8px 10px 15px 15px rgba(139, 139, 139, 0.14);
    border-radius: 20px;
  }

  .answer {
    font-size: 28px;
    letter-spacing: 1px;
    color: rgb(74, 74, 74);
    line-height: 50px;
    margin-top: 90px;
    .insured {
      font-weight: bold;
    }
  }
  .wrapper {
    height: 800px;
    overflow: hidden;
    .swiper-item {
      width: 100% !important;
    }
  }
  .questions {
    text-align: center;
    font-size: 30px;
    color: rgb(24, 95, 146);
    font-weight: bold;
  }
  .quesContent {
    text-align: center;
    font-weight: bold;
    padding: 0 30px;
    font-size: 26px;
    margin-top: 65px;
    // line-height: 38px;
  }
  .quesType {
    font-size: 16px !important;
    text-align: left;
    margin-top: 290px;
  }
  .buttons {
    position: absolute;
    width: 100%;
    height: 100px;
    padding: 100px 0;
    bottom: -300px;
    display: flex;
    justify-content: space-between;
    .yes {
      width: 120px;
      height: 60px;
      color: white;
      background: rgb(245, 166, 35);
      text-align: center;
      font-size: 28px;
      line-height: 60px;
      border-radius: 10px;
      position: absolute;
      left: 0;
      margin-left: 40px;
      cursor: pointer;
    }
    .no {
      width: 120px;
      height: 60px;
      color: white;
      background: rgb(126, 211, 33);
      text-align: center;
      font-size: 28px;
      line-height: 60px;
      border-radius: 10px;
      position: absolute;
      right: 0;
      margin-right: 40px;
      cursor: pointer;
    }
    .confirm {
      background: rgb(2, 164, 71);
      width: 100%;
      height: 100px;
      text-align: center;
      line-height: 100px;
      border-radius: 15px;
      color: white;
      font-weight: 550;
      font-size: 35px;
      outline: none;
      border: none;
      margin-right: 40px;
      margin-left: 40px;
    }
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
