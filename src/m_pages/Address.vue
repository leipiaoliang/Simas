<template>
  <div class="page-wrap">
    <div class="headTitle">
      <i @click="toPrePage" class="cubeic-arrow"></i>
      <p>{{$t('account_info_address')}}</p>
    </div>
    <p class="address">{{$t('input_address_2')}}</p>
    <div class="form-wrap">
      <p>
        <cube-select
          class="city_select"
          :placeholder="this.$t('address_province')"
          :title="this.$t('address_province')"
          @change="selectProvince"
          v-model="form.province"
          :options="provinceList"
          :cancelTxt="this.$t('cancel')"
          :confirmTxt="this.$t('confirm')"
        :disabled='this.disabled'
        ></cube-select>
      </p>
      <p>
        <cube-select
          class="city_select"
          :placeholder="this.$t('address_city')"
          :title="this.$t('address_city')"
          @change="selected"
          v-model="form.city"
          :options="cityList"
          :cancelTxt="this.$t('cancel')"
          :confirmTxt="this.$t('confirm')"
        :disabled='this.cityDisabled'
        ></cube-select>
      </p>
      <p class="inputAddress" ref="inputAddress">
        <input type="text"
        :placeholder="this.$t('account_info_address')"
         v-model="form.address" />
      </p>
      <p>
        <input type="text"
        :placeholder="this.$t('address_postal_code')"
        v-model="form.postalcode" />
      </p>
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
      dataList: [],
      form: {
        province: "",
        city: "",
        address: "",
        postalcode: ""
      },
      provinceList: [],
      cityList: [],
      currentType: 1, // 当前选择的下拉列表类型 1：省份列表 2：对应的城市列表
      validateObj: {
        flag: true,
        msg: true
      },
      disabled:"",
      cityDisabled:""
    };
  },
  computed: {
    ...mapState(["address", "inPerson", "addressList"])
  },
  created() {
    this.getData()
  },
  mounted() {
    // this.dataList = this.addressList;
    // console.log(this.dataList);
    // // this.$http.post("/wesupromo/web/indonesia/getProvinceAndCity").then(res => {
    // //   this.dataList = res.data;
    // //   console.log(this.dataList)
    // this.dataList.forEach(item => {
    //   this.provinceList.push(item.provinceName);
    //   item.cityList.forEach(val => {
    //     this.cityList.push(val.cityName);
    //   });
    // });
    // console.log(this.provinceList);

    // console.log(this.form.province)
       if(this.form.province ==""){
        this.cityDisabled=true
       }else{
         this.cityDisabled=false
       }

    let inputAd = this.$refs.inputAddress;
    // console.log(inputAd);
    inputAd.style.borderBottom = "2px solid rgb(218, 218, 218)";
  },

  methods: {
    ...mapMutations(["setAddress"]),
    toPrePage() {
      this.$router.push("/Summary");
    },
    getData(){
const loading = this.$createToast({
      time: 0,
      txt: this.$t("loading")
    });
      loading.show();

    // console.log(this.addressList);
    // if (this.addressList.length == 0) {
      this.$http
        .post("/wesupromo/web/indonesia/getProvinceAndCity")
        .then(res => {
          this.dataList = res.data;
          // console.log(this.dataList);
          this.dataList.forEach(item => {
            this.provinceList.push(item.provinceName);
            item.cityList.forEach(val => {
              this.cityList.push(val.cityName);
            });
          });
          // console.log(this.provinceList);
             this.$nextTick(() => {
            loading.hide();
            this.disabled=false
            // this.cityDisabled=false
          });
        });
    // }
    },
    selectProvince(selectedVal, selectedIndex, selectedText) {
      // console.log(this.form.province)
      this.form.province = selectedText;
      this.cityList = this.dataList[selectedIndex].cityList.map(item => {
        return item.cityName;
        // console.log(this.cityList)
      });
      this.form.city = this.cityList.some(item => item === this.form.city)
        ? this.form.city
        : "";
         this.cityDisabled=false

    },

    cancelHandle() {},

    selected(selectedVal, selectedIndex, selectedText) {
      // console.log(this.form.province)
      // if(this.form.province ==""){
      //   this.cityDisabled=true
      //   // this.cityList=""
      //   this.form.city=""
      // }else{
      this.form.city = selectedText;

      // }
    },
    canceled() {},
    Confirm() {
      this.setAddress(this.form);

      this.validate();
      if (!this.validateObj.flag) {
        // 如果表单某项有错误则弹出toast 并带出错误信息this.validateObj.msg
        this.$createToast({
          txt: this.validateObj.msg,
          type: "txt"
        }).show();
        return false;
      } else {
        this.$router.push("/YourOrder");
      }
    },
    validate() {
      this.validateObj = {
        flag: true,
        msg: ""
      };
      if (this.form.province == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
      if (this.form.city == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
      if (this.form.address == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
      if (this.form.postalcode == "") {
        this.validateObj.flag &&
          (this.validateObj = { flag: false, msg: this.$t("insurance_toast") });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~'>>>';
@import "~style/mixin.less";
.page-wrap {
  padding: 30px;
  padding-top: 50px;
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
  .address {
    margin-top: 90px;
    font-size: 30px;
    letter-spacing: 1px;
  }
  .form-wrap {
    border: 3px solid rgb(218, 218, 218);
    padding: 5px 0px 14px 25px;
    margin-top: 30px;
    .inputAddress {
      border-bottom: 3px solid rgb(199, 199, 199) !important;
    }
    > p {
      &:nth-of-type(1),
      &:nth-of-type(2) {
        border-bottom: 3px solid rgb(199, 199, 199) !important;
      }
      &:nth-of-type(3) {
        border-bottom: 3px solid rgb(199, 199, 199) !important;
      }
      &:nth-of-type(4){
        border-bottom: none;

      }
      input {
        height: 95px;
        width: 99.9%;
        line-height: 95px;
        font-size: 30px;
      }
      input::-webkit-input-placeholder {
        color: rgb(230, 227, 227);
        letter-spacing: 2px;
        font-weight: 0px;
        font-size: 28px;
      }
    //  input{
    //   &:nth-of-type(1) ,
    //   &:nth-of-type(2){
    //     border-bottom: none;
    //   }
    //   }
     @{deep} .city_select {
        // border-bottom: 1px solid rgb(218, 218, 218);
         .cube-select-icon {
          display: none;
        }
         .cube-select-placeholder {
          height: 60px;
          line-height: 60px;
          font-size: 28px;
          color: rgb(219, 219, 219);
          letter-spacing: 2px;
        }
         .cube-select-text {
          height: 60px;
          line-height: 60px;
          font-size: 30px;
          letter-spacing: 2px;
          color: black;
        }
      }
      .cube-select {
        width: 99%;
        border: none !important;

        /deep/ &:after {
          border: none !important;
        }
      }
      .cube-select_disabled {
        color: #fff;
        background-color: #fff;
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
    height: 270px;
    margin-top: 40px;
    // height: 120px;
    // border-top: 2px solid rgba(211, 209, 209, 0.25);
  }
  .confirm {
    cursor: pointer;
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
  }
}

@media screen and (-webkit-min-device-pixel-ratio: 0) {
  /* Webkit内核兼容CSS选择器样式 放到这里 */
  .inputAddress {
    border-bottom: 3px solid rgb(199, 199, 199) !important;
  }
}
</style>
