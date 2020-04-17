/*
 * @Author: your name
 * @Date: 2019-10-24 10:27:06
 * @LastEditTime: 2019-10-24 10:36:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hospitalc:\Users\LiJiaQin\Desktop\新建文件夹 (5)\src\store\index.js
 */
/**
 * @des: 全局状态机制作用页面传参及保存返回态
 *
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate" //引入vuex状态持久化（页面刷新状态依然保存）


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    product_info: {},
    plan: {},
    product_id: '', //5d71ceb947e5a01196f71387
    userId: '',
    login: {},
    language: '',
    areacode: '852',
    child_age_definition: 0,
    addMember: {},
    inPerson: "Myself",
    maleData: [],
    addressList: {},
    address: {},
    summary: [],
    orderDate: {},
    currency_desc: "",
    progressLogo: "",
    merchantId: "",
    policyholder: {},
    sessionId: "",
    productType: "",
    logo: '',
    applicationID: "",
    commonKey: "", //公钥
    insureAges: {},
    caegoryName: "",
    name: '',
    ownedByDetail: "",
    ownedBy: "",
    CouponCode: "",
    indexPath:""
  },

  mutations: {
    setIndexPath(state, payload) {
      state.indexPath = payload
    },
    setMerchantId(state, payload) {
      state.merchantId = payload
    },
    setProductId(state, payload) {
      state.product_id = payload
    },
    setLanguage(state, payload) {
      state.language = payload
    },
    setSessionId(state, payload) {
      state.sessionId = payload
    },
    setProductType(state, payload) {
      state.productType = payload
    },
    setProduct(state, payload) {
      state.product_info = payload
    },
    setPlan(state, payload) {
      state.plan = payload
    },
    setUser(state, payload) {
      state.userId = payload
    },
    setLogin(state, payload) {
      state.login = payload
    },
    setChildAge(state, payload) {
      state.child_age_definition = payload
    },
    setCurrencyDesc(state, payload) {
      state.currency_desc = payload
    },
    setProgressLogo(state, payload) {
      state.progressLogo = payload
    },
    setAddMember(state, payload) {
      state.addMember = payload
    },
    setInPerson(state, payload) {
      state.inPerson = payload
    },
    setMale(state, payload) {
      state.maleData = payload
    },
    setAddressList(state, payload) {
      state.addressList = payload
    },
    setAddress(state, payload) {
      state.address = payload
    },
    setSummary(state, payload) {
      state.summary = payload
    },
    setOrderDate(state, payload) {
      state.orderDate = payload
    },
    setPolicyholder(state, payload) {
      state.policyholder = payload
    },
    SetApplicationID(state, payload) {
      state.applicationID = payload
    },
    setCommonKey(state, payload) {
      state.commonKey = payload
    },
    setInsureAges(state, payload) {
      state.insureAges = payload
    },
    setLogo(state, payload) {
      state.logo = payload
    },
    setCaegoryName(state, payload) {
      state.caegoryName = payload
    },
    setName(state, payload) {
      state.name = payload
    },
    setOwnedByDetail(state, payload) {
      state.ownedByDetail = payload
    },
    setOwnedBy(state, payload) {
      state.ownedBy = payload
    },
    setCouponCode(state, payload) {
      state.CouponCode = payload
    },
    /**
     *  重置方法
     * @param { Any } state
     * @param { Array } payload  表示要重置的字段必须为数组字符串类型 eg: ['plan', 'userId']
     */
    reset(state, payload) { //  payload
      if (Array.isArray(payload) && payload.length > 0) {
        payload.forEach(item => {
          state[item] = null
        })
      }
    }
  },

  getters: {

  },

  actions: { //此项目用不到


  },
  plugins: [createPersistedState({ //注册持久化插件
    key: 'vuex',
    storage: window.sessionStorage, //使用会话缓存机制
    reducer(val) {
      return { //需要持久化的某些全局状态
        product_info: val.product_info,
        travelInfo: val.travelInfo,
        userId: val.userId,
        login: val.login,
        product_id: val.product_id,
        language: val.language,
        plan: val.plan,
        areacode: val.areacode,
        child_age_definition: val.child_age_definition,
        addMember: val.addMember,
        inPerson: val.inPerson,
        maleData: val.maleData,
        addressList: val.addressList,
        address: val.address,
        summary: val.summary,
        orderDate: val.orderDate,
        currency_desc: val.currency_desc,
        progressLogo: val.progressLogo,
        merchantId: val.merchantId,
        policyholder: val.policyholder,
        productType: val.productType,
        sessionId: val.sessionId,
        applicationID: val.applicationID,
        commonKey: val.commonKey,
        insureAges: val.insureAges,
        caegoryName: val.caegoryName,
        name: val.name,
        ownedByDetail: val.ownedByDetail,
        ownedBy: val.ownedBy,
        CouponCode: val.CouponCode,
        indexPath:val.indexPath
      }
    }
  })]
})
