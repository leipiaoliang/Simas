<!--
 * @Author: your name
 * @Date: 2019-10-24 10:27:06
 * @LastEditTime: 2019-10-24 14:06:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hospitalc:\Users\LiJiaQin\Desktop\新建文件夹 (5)\src\pages\Index.vue
 -->
<template>
  <div class="page-wrap">
    <div class="page-wraps">
      <p class="title">
        {{data.displayed_owned_by}}
        <span @click="showHiddenExplain('show')">
          <img class="title_img" src="@/assets/images/email_img.png" alt />
        </span>
      </p>
      <div>
        <cube-select
          class="cubeSelect"
          v-model="selectValue"
          :title="title"
          :options="options"
          :auto-pop="autoPop"
          :disabled="disabled"
          @change="change"
          :cancelTxt="this.$t('cancel')"
          :confirmTxt="this.$t('confirm')"
        ></cube-select>
      </div>
      <div class="headerimgs">
        <img class="headerimg" :src="this.data.insurers_banner" alt />
        <!--src="@/assets/images/jiwa_Copy@1X.png"  -->
      </div>
      <p class="travelead">{{data.name}}</p>
      <p class="budget">{{data.desc1}}</p>
      <div class="travel-insurance">{{data.category_name}}</div>
      <!-- 价格 -->
      <div class="price" v-if="plan">{{plan.price_desc ? plan.price_desc : ''}}</div>
      <div>
        <img class="box" v-if="data" :src="data.products_imgs[0]" alt />
      </div>
      <!-- Single Plan和Annual Plan -->
      <div
        class="sum-insured"
        v-if="this.data.plan_list !==undefined && this.data.plan_list.length > 0"
      >
        <p>{{$t('sum_Insured')}}</p>
        <div class="buttons">
          <button
            class="single btn"
            v-for="(item,index) in this.data.plan_list"
            :key="index"
            @click="setPlan(item)"
            :class="{isActive:plan.company_plan_id == item.company_plan_id}"
          >{{item.plan_list_name}}</button>
        </div>
      </div>
      <!-- <div class="trip" v-if="plan" >{{plan.plan_list_desc ? plan.plan_list_desc : ''}}</div> -->
      <!-- Key Features -->
      <div>
        <p class="key">{{$t('product_decs_key_title')}}</p>
        <div class="key-content">
          <div class="features-wrap">
            <p :class="{'features': flag}">{{data.remarks}}</p>
            <span
              class="more"
              @click="clickmore"
            >{{flag ? $t('product_decs_key_more') : $t('hide')}}</span>
          </div>
        </div>
      </div>
      <!-- Customer Service -->
      <div class="customers" @click="showCustomerService = !showCustomerService">
        <span class="starrs">
          <img class="starr" :src="data.cs_logo" alt />
        </span>
        <span class="customer">{{$t('account_customer_service')}}</span>
        <i class="cubeic-arrow"></i>
      </div>
      <!-- Coverage Details -->
      <div class="coverages" @click="coverage">
        <span class="covers">
          <img class="cover" src="@/assets/images/Confirmation of cover@3x.png" alt />
        </span>
        <span class="coverage">{{$t('products_choose_plan_coverage_title1')}}</span>
        <i class="cubeic-arrow"></i>
      </div>
    </div>

    <div class="button-bar">
      <button class="quato" @click="proceed">{{$t('products_proceed')}}</button>
    </div>
    <div v-show="showExplain" class="popover_back"></div>
    <div v-show="showExplain" class="explain">
      <img :src="this.data.insurers_banner" alt />
      <p>{{this.data.displayed_owned_by_details}}</p>
      <div @click="showHiddenExplain('hidden')" class="button_back">{{$t('btn_back')}}</div>
    </div>

    <!-- 客服服务弹框 -->
    <div v-show="showCustomerService" class="popover_back"></div>
    <div v-show="showCustomerService" class="CustomerService">
      <p v-html="data.customer_service"></p>
      <div @click="showCustomerService = !showCustomerService" class="button_back">{{$t('confirm')}}</div>
    </div>
    <div v-show="isShow" class="popover_back2"></div>
    <cube-loading v-show="loading"></cube-loading>
    <transition name="bounce">
      <div
        class="footerText"
        v-show="isshowFootertext"
      >The digital transformation ecosystem is powered by Golion</div>
    </transition>
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
      remarks: [],
      ischecked: 0,
      trip: "",
      price: "",
      productId: "",
      Language: "",
      MerchantId: "",
      rendomNum: "",
      trxid: "",
      showExplain: false,
      facility: "",
      options: ["English", "Indonesia"], //选择语言
      selectValue: "", //"English",
      title: this.$t("language"),
      autoPop: false,
      disabled: false,
      showCustomerService: false,
      couponCode: "",
       isShow: false,
      loading: false,
      timer: null,
      scrollT: 0,
      stopscroll: 0,
      isshowFootertext: false,
      pmb_id:''

    };
  },
  computed: {
    ...mapState([
      "product_id",
      "language",
      "plan",
      "child_age_definition",
      "addMember",
      "currency_desc",
      "userId",
      "merchantId",
      "policyholder",
      "login",
      "inPerson",
      "progressLogo",
      "sessionId",
      "productType",
      "insureAges",
      "logo",
      "caegoryName",
      "name",
      "ownedByDetail",
      "ownedBy",
      "CouponCode",
      "indexPath"

    ])
  },

  async mounted() {
      if(this.$route.query.pmb_id){
      this.pmb_id=this.$route.query.pmb_id
      sessionStorage.setItem("awiTravel_pmbid",this.pmb_id)
    }


    window.addEventListener("scroll", this.handleScroll);
 this.loading = true;
    this.isShow = true;
    this.IsPC();
    this.productId = this.$route.params.productId;
    this.Language = this.$route.params.language;
    this.MerchantId = this.$route.params.merchantId;
    this.couponCode = this.$route.params.CouponCode;

    this.setCouponCode(this.couponCode);

    window.localStorage.setItem("lang", this.Language);
    if (this.Language == "idn") {
      this.selectValue = "Indonesia";
    } else if (this.Language == "tc") {
      this.selectValue = "English";
    } else {
      this.selectValue = "English";
    }
    // console.log(this.$i18n.locale);
    //点击按钮用一下代码可以更换语言
    this.$i18n.locale =
      this.Language == "eng"
        ? (this.$i18n.locale = "eng")
        : (this.$i18n.locale = "idn");
    this.setLanguage(this.Language);
    this.setProductId(this.productId);
    this.setMerchantId(this.MerchantId);

    this.getData();
    const resetFile = [
      "product_info",
      "plan",
      "addMember",
      "userId",
      "policyholder",
      "login",
      "inPerson",
      "indexPath"

    ];
    this.reset(resetFile);

    this.getRamNumber();

    //调用储存点击量接口  session_id
    this.trxid = this.MerchantId + this.rendomNum;
    this.setSessionId(this.trxid);

    //获取cookie
    var uname = this.getCookie(this.productId);
    //如果cookie中没有name就设置一个并且调用接口
    if (uname == "" || uname != this.productId) {
      //获取随机生成的cookie
      var index = this.randomString(20);
      //调用储存点击量接口
      try {
        const res = await this.$http.post("/wesupromo/web/addClicks", {
          //trx_id: this.MerchantId + this.rendomNum,
          merchant_id: this.MerchantId,
          product_id: this.productId,
          device_session_id: index,
          device_platform: this.facility, //设备
          pmb_id:this.pmb_id

        });

        // console.log(res);
        //设置cookie
        //this.setCookie(this.productId, index, 86400); //cookie过期时间为一个30秒//86400一天
        this.setCookieFixed(this.productId, index, "00:00:00");
      } catch (error) {
        // console.log(error);
      }
      // console.log("没cookie,创建了一个cookie");
    } else {
      // console.log("有cookie");
      //判斷是否有pmbid
      if (this.$route.query.pmb_id) {
        var pmbidName = this.getCookie(this.pmb_id);
        //判斷pmbid是否重複
        if (pmbidName == "" || pmbidName != this.pmb_id) {
          //获取随机生成的cookie
          var pmbidIndex = this.randomString(20);
          //调用储存点击量接口
          try {
            const res = await this.$http.post("/wesupromo/web/addClicks", {
              //trx_id: this.MerchantId + this.rendomNum,
              merchant_id: this.MerchantId,
              product_id: this.productId,
              device_session_id: pmbidIndex,
              device_platform: this.facility,
              pmb_id: this.pmb_id
            });
            //设置cookie
            //this.setCookie(this.productId, index, 86400); //cookie过期时间为一个30秒//86400一天
           if(res.status==100){
           this.setCookieFixed(this.pmb_id, pmbidIndex, "00:00:00");
            console.log("有產品pmbid或者pmbid不重複");
           }
          } catch (error) {
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
        } else {
          console.log("產品id重複,pmbid重複");
        }
      } else {
        console.log("產品id重複,pmbid不存在");
      }
    }
  },
  methods: {
    ...mapMutations([
      "setLogo",
      "setPlan",
      "reset",
      "setChildAge",
      "setCurrencyDesc",
      "setProductId",
      "setLanguage",
      "setMerchantId",
      "setProgressLogo",
      "setSessionId",
      "setProductType",
      "setInsureAges",
      "setCaegoryName",
      "setName",
      "setOwnedByDetail",
      "setOwnedBy",
      "setCouponCode",
      "setIndexPath"

    ]),

    clickmore() {
      this.flag = !this.flag;
    },
    handleScroll() {
      clearTimeout(this.timer); //清除定时器
      this.timer = setTimeout(this.ScrollEnd, 1500);
      this.scrollT =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.isshowFootertext = true;
    },
    ScrollEnd() {
      this.stopscroll =
        document.documentElement.scrollTop || document.body.scrollTop; //获取滚动停止后的scrollTop
      if (this.stopscroll == this.scrollT) {
        this.isshowFootertext = false;
      }
    },
    change(value, index, text) {
      // console.log("change", value, index, text);
      this.Language = localStorage.getItem("lang") || "eng";
      // console.log(this.Language)
      if (this.Language === "idn") {
        this.Language = "eng";
        this.$i18n.locale = this.Language;
      } else {
        this.Language = "idn";
        this.$i18n.locale = this.Language;
      }
      localStorage.setItem("lang", this.Language);
      //判讀優惠卷
      if (this.couponCode == undefined) {
        //判讀pmb_id
        if (this.$route.query.pmb_id) {
          this.$router.push(
            `/index/${this.MerchantId}/${this.productId}/${this.Language}?pmb_id=${this.$route.query.pmb_id}`
          );
        } else {
          this.$router.push(
            `/index/${this.MerchantId}/${this.productId}/${this.Language}`
          );
        }
      } else {
        //判讀pmb_id
        if (this.$route.query.pmb_id) {
          this.$router.push(
            `/index/${this.MerchantId}/${this.productId}/${this.Language}/${this.couponCode}?pmb_id=${this.$route.query.pmb_id}`
          );
        } else {
          this.$router.push(
            `/index/${this.MerchantId}/${this.productId}/${this.Language}/${this.couponCode}`
          );
        }
      }
      window.location.reload();
    },
    //判断是PC端还是移动端------------------------------------------
    IsPC() {
      var userAgentInfo = navigator.userAgent;
      // console.log(userAgentInfo);

      var Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      ];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          // console.log("移动端");
          this.phoneType();
          break;
        }
      }
      if (flag) {
        // console.log("PC端");
        this.facility = "PC";
      }
      return flag;
    },
    //判断用户移动端使用的系统平台
    phoneType() {
      var u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        // console.log("Android");
        this.facility = "Android";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // console.log("iPhone");
        this.facility = "iPhone";
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        // console.log("Windows Phone");
        this.facility = "Windows Phone";
      } else if (u.indexOf("iPad") > -1) {
        //iPan
        // console.log("iPad");
        this.facility = "tPC";
      }
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
          // return unescape(document.cookie.substring(c_start, c_end));
          return c_name;
        }
      }
      return "";
    },
    //设置cookie在指定的时间失效
    setCookieFixed(name, value, Deadline) {
      // console.log(name, value, Deadline);
      var curDate = new Date(); // 获取当前日期对象
      var curTime = curDate.getTime(); // 获取当前日期对应的时间戳
      var endTime = this.convertTime(curDate, Deadline); // 获取指定时间的时间戳
      // console.log(endTime);
      var disTime = endTime - curTime; // 计算出指定时间与当前时间的时间差
      // console.log(disTime);
      //如果指定日期为明天指定时间
      if (disTime < 0) {
        var tom_date = new Date(curTime + 1000 * 86400); //获取到明天的时间戳
        tom_date = this.getToday(tom_date); //转出YYYY-MM-DD
        endTime = new Date(`${tom_date} ${Deadline}`).getTime(); //转成时间戳
        // console.log(endTime);
      }
      var exp = new Date();
      exp.setTime(endTime); // 设置cookie过期时间(endTime为时间戳)
      document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
    },
    // 获取指定时间的时间戳------------------------------------------
    convertTime(nowDate, Deadline) {
      // 分割参数Deadline
      var _dateArr = Deadline.split(":");
      // 分别获取参数中对应的时、分、秒
      var hours = parseInt(_dateArr[0]);
      var minutes = parseInt(_dateArr[1]);
      var seconds = parseInt(_dateArr[2]);
      // 设置对应时分秒
      nowDate.setHours(hours);
      nowDate.setMinutes(minutes);
      nowDate.setSeconds(seconds);
      // 获取当前天中指定时分秒对应的毫秒数
      var result = Date.parse(nowDate);
      return result;
    },
    // 获取当天的天数-------------------------------------------
    getToday(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "/" + m + "/" + d;
    },
    //生成随机cookie-----------------------------------
    randomString(STRlen) {
      var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = STRlen;
      var randomstring = "";
      for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
      }
      return randomstring;
    },

    coverage() {
      const { href } = this.$router.resolve({
        path: "/CoverageDetails"
      });
      window.open(href, "_blank");
    },
    proceed() {
      // console.log(window.location.href);
      var iPathStr = window.location.href;
      var iPath = iPathStr.indexOf("#");
      iPathStr = iPathStr.substring(iPath + 2, iPathStr.length);
      // console.log(iPathStr);
      this.setIndexPath(iPathStr);
      this.$router.push({ path: "/Login" });
    },
    ReplaceUrl(text) {
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
    },
    getData() {
      const params = {
        language: this.Language,
        product_id: this.productId,
        merchant_id: this.MerchantId
      };

      this.$http
        .post("/wesupromo/web/tpc/getProductDetails", params)
        .then(res => {
          this.data = res.data;
          // console.log(this.data);
          this.data.customer_service = this.ReplaceUrl(
            res.data.customer_service
          );
          this.setChildAge(res.data.child_age_definition);
          this.setCurrencyDesc(res.data.currency_desc);
          this.setProgressLogo(res.data.progress_logo);
          this.setProductType(res.data.product_type);
          this.setLogo(res.data.insurers_banner);
          this.setCaegoryName(res.data.category_name);
          this.setName(res.data.name);
          this.setOwnedByDetail(res.data.displayed_owned_by_details);
          this.setOwnedBy(res.data.displayed_owned_by);
          this.$nextTick(() => {
           this.loading = false;
            this.isShow = false;
          });
          const planData = {
            period_type: this.data.period_type,
            period_value: this.data.period_value,
            price_desc: this.data.price_desc,
            product_id: this.data.product_id,
            product_type: this.data.product_type,
            company_plan_id: this.data.company_plan_id
          };
          if (this.data.plan_list[0]) {
            this.setPlan(this.data.plan_list[0]);
          } else {
            this.setPlan(planData);
          }

          const ages = {
            max_age: res.data.max_age,
            min_age: res.data.min_age,
            max_pp_age: res.data.max_pp_age,
            min_pp_age: res.data.min_pp_age
          };
          this.setInsureAges(ages);
        })
        .catch(error=>{
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
        })
    },
    //生成8位随机数,调接口把数据传给后端
    getRamNumber() {
      var result = "";
      for (var i = 0; i < 8; i++) {
        result += Math.floor(Math.random() * 16).toString(16); //获取0-15并通过toString转16进制
      }
      //默认字母小写，手动转大写
      this.rendomNum = result.toUpperCase();
    },
    //头部感叹号
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
  },
  created() {}
};
</script>

<style lang="less" scoped>
@import "~style/mixin.less";
@deep: ~">>>";

.page-wrap {
  padding: 34px;
  padding-bottom: 60px;
  .page-wraps {
    // padding-bottom: 200px;
    position: relative;
  }
  .title {
    color: rgb(155, 155, 155);
    font-size: 30px;
    margin-bottom: 30px;

    .title_img {
      width: 35px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
  .travelead {
    color: #000;
    font-weight: 700;
    font-size: 44px;
    line-height: 52px;
    margin-bottom: 15px;
    margin-top: 32px;
  }

  .cubeSelect {
    position: absolute;
    margin-right: 34px;
    top: -10px;
    right: 0;
    // width: 170px;
    background-color: #fff;
    color: rgb(109, 107, 107);
  }

  .budget {
    color: #000;
    font-weight: 600;
    font-size: 34px;
    line-height: 42px;
    margin-bottom: 10px;
  }
  .travel-insurance {
    color: rgb(142, 142, 147);
    font-size: 30px;
    margin-bottom: 10px;
  }
  .headerimgs {
    width: 428px;
    height: 194px;
    // width: 320px;
    // height: 150px;
    // margin:30px 0px;
  }
  .headerimg {
    width: 100%;
    height: 100%;
  }
  .price {
    text-align: right;
    color: rgb(12, 129, 255);
    font-size: 35px;
    font-weight: bold;
    margin-bottom: 35px;
    margin-top: 20px;
  }
  .box {
    border-radius: 22px;
    width: 100%;
    height: 100%;
  }

  .cubeic-arrow {
    color: rgba(0, 0, 0, 0.25);
    font-size: 32px;
    font-weight: bold;
  }
  .sum-insured {
    border-top: 1px solid rgb(209, 208, 208);
    padding-top: 15px;
    // border-bottom: 0.2px solid rgb(209, 208, 208);
    margin-top: 20px;
    p {
      color: rgb(142, 142, 147);
      font-size: 30px;
    }
  }
  .buttons {
    line-height: 100px;
    margin: 12px 0 18px 0;
  }

  .btn {
    background: rgb(224, 223, 223);
    touch-action: none;
    margin: 0 4px;
    width: 32%;
    height: 65px;
    border-radius: 35px;
    color: rgb(177, 175, 175);
    font-weight: 550;
    font-size: 25px;
    outline: none;
    border: none;
  }
  .isActive {
    background: rgb(12, 129, 255);
    color: white;
  }

  .trip {
    color: rgb(12, 129, 255);
    font-weight: 500;
    border-bottom: 1px solid rgb(209, 208, 208);
    line-height: 65px;
  }
  .key {
    font-size: 34px;
    font-weight: 550;
    line-height: 100px;
    border-top: 1px solid rgb(209, 208, 208);
    margin-top: 20px;
    // padding-bottom: 20px;
  }
  .key-content {
    border-bottom: 1px solid rgb(209, 208, 208);
    padding-bottom: 45px;
    p {
      font-size: 30px;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 45px;
      // padding-bottom: 60px;
    }
  }
  .features-wrap {
    white-space: pre-line;
    position: relative;
    .more {
      position: absolute;
      right: 0;
      bottom: -35px;
      color: rgb(12, 129, 255);
      cursor: pointer;
      font-size: 26px;
    }
  }
  .features {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // /* autoprefixer:off */
    // -webkit-box-orient: vertical;
    // /* autoprefixer:on */
    // -webkit-line-clamp: 3;
    font-size: 28px;
    color: #000;
    overflow: hidden;
    line-height: 32px;
    // position: relative;
    height: 97px;
  }
  .features:after {
    content: "...";
    text-align: left;
    position: absolute;
    bottom: -15px;
    left: 0;
    // width: 30px;
    // height: 30px;
    font-size: 40px;
    // background: linear-gradient(
    //   to right,
    //   rgba(255, 255, 255, 0),
    //   rgba(255, 255, 255, 1) 50%
    // );
    // background-color: #fff;
  }
  .customers {
    line-height: 75px;
    border-bottom: 1px solid rgb(209, 208, 208);
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .starrs {
      display: inline-block;
      width: 65px;
      height: 65px;
      .starr {
        width: 100%;
        height: 100%;
        vertical-align: middle;
        margin-left: 20px;
      }
    }
    .customer {
      font-size: 35px;
      font-family: Arial, Helvetica, sans-serif;
      margin-left: -220px;
    }
  }
  .coverages {
    line-height: 75px;
    border-bottom: 1px solid rgb(209, 208, 208);
    padding-bottom: 15px;
    display: flex;
    color: #000;
    justify-content: space-between;
    cursor: pointer;
    .covers {
      display: inline-block;
      width: 65px;
      height: 65px;
      .cover {
        width: 100%;
        height: 100%;
        vertical-align: middle;
        margin-left: 20px;
      }
    }
    .coverage {
      font-size: 35px;
      font-family: Arial, Helvetica, sans-serif;
      margin-left: -220px;
    }
  }

  .button-bar {
    text-align: center;
    width: 100%;
    // height: 270px;
    height: 200px;
    // position: fixed;
    // text-align: center;
    // bottom: 0px;
    // left: 50%;
    // transform: translateX(-50%);
    background: white;
    // border-top: 2px solid rgba(211, 209, 209, 0.25);
    margin-top: 40px;
  }
  .quato {
    cursor: pointer;
    background: rgb(2, 164, 71);
    width: 500px;
    height: 100px;
    line-height: 100px;
    // width: 288px;
    // height: 120px;
    // line-height: 120px;
    // margin-top: 70px;
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
    z-index: 1;
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
  .CustomerService {
    width: 600px;
    // height: 600px;
    position: fixed;
    z-index: 888;
    left: 50%;
    top: 50%;
    transform: translate(calc(-50% - 2px), calc(-50% - 2px));
    //padding: 30px;
    text-align: center;
    background-color: #fff;
    border-radius: 20px;
    padding: 50px 30px;
    box-sizing: border-box;
    p {
      font-size: 35px;
      line-height: 40px;
    }
    .button_back {
      width: 50%;
      height: 80px;
      border-radius: 20px;
      line-height: 80px;
      color: #fff;
      margin: 0 auto;
      font-size: 30px;
      margin-top: 100px;
      background-color: #00a738;
    }
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
  .footerText {
    position: fixed;
    bottom: 0;
    height: 60px;
    line-height: 50px;
    color: #9d9d9d;
    text-align: center;
    background: #fff;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  .bounce-enter-active {
    animation: bounce-in 1s;
  }
  .bounce-leave-active {
    animation: bounce-in 1s reverse;
  }
  @keyframes bounce-in {
    0% {
      height: 0px;
    }
    50% {
      height: 30px;
    }
    100% {
      height: 60px;
    }
  }
  /deep/.cube-select-text {
    font-size: 26px;
  }
}


</style>
