import Vue from 'vue'
import VueRouter from 'vue-router'
// const Index = () => import( /* webpackChunkName: "Index" */ 'pages/Index') // 路由推崇这种写法按需加载 中间的webpackChunkName 为分包可要可不要 官方文档有
// import Login from 'pages/Login'
// import Prompt from 'pages/Prompt'
// import AddMember from 'pages/AddMember'
// import Policyholder from 'pages/Policyholder'
// import Summary from 'pages/Summary'
// import GeneralInfo from 'pages/GeneralInfo'
// import Address from 'pages/Address'
// import YourOrder from 'pages/YourOrder'
// import Payment from 'pages/Payment'
// import Complete from 'pages/Complete'
// import CoverageDetails from 'pages/CoverageDetails'
// import Failed from 'pages/Failed'
// import Declarations from 'pages/Declarations'







Vue.use(VueRouter)
//判斷是移動還是pc端
var isPc = false;
if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
  console.log('移動端');
} else {
  console.log('pc端');
  isPc = true
}
export default new VueRouter({
  routes: [{
      path: '/index/:merchantId/:productId/:language',
      name: 'index',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/index.vue'], resolve);
        } else {
          require(['../m_pages/index.vue'], resolve);
        }
      }

    },
    {
      path: '/index/:merchantId/:productId/:language/:CouponCode',
      name: 'index',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/index.vue'], resolve);
        } else {
          require(['../m_pages/index.vue'], resolve);
        }
      }

    },
    {
      path: '/Login',
      name: 'login',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Login.vue'], resolve);
        } else {
          require(['../m_pages/Login.vue'], resolve);
        }
      }
    },

    {
      path: '/Prompt',
      name: 'prompt',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Prompt.vue'], resolve);
        } else {
          require(['../m_pages/Prompt.vue'], resolve);
        }
      }
    },
    {
      path: '/AddMember',
      name: 'addMember',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/AddMember.vue'], resolve);
        } else {
          require(['../m_pages/AddMember.vue'], resolve);
        }
      }
    },
    {
      path: '/Policyholder',
      name: 'policyholder',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Policyholder.vue'], resolve);
        } else {
          require(['../m_pages/Policyholder.vue'], resolve);
        }
      }
    },
    {
      path: '/GeneralInfo',
      name: 'generalInfo',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/GeneralInfo.vue'], resolve);
        } else {
          require(['../m_pages/GeneralInfo.vue'], resolve);
        }
      }
    },
    {
      path: '/Summary',
      name: 'summary',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Summary.vue'], resolve);
        } else {
          require(['../m_pages/Summary.vue'], resolve);
        }
      }
    },

    {
      path: '/Address',
      name: 'address',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Address.vue'], resolve);
        } else {
          require(['../m_pages/Address.vue'], resolve);
        }
      }
    },

    {
      path: '/YourOrder',
      name: 'yourOrder',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/YourOrder.vue'], resolve);
        } else {
          require(['../m_pages/YourOrder.vue'], resolve);
        }
      }
    },
    {
      path: '/Payment',
      name: 'payment',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Payment.vue'], resolve);
        } else {
          require(['../m_pages/Payment.vue'], resolve);
        }
      }
    },

    {
      path: '/Complete',
      name: 'complete',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Complete.vue'], resolve);
        } else {
          require(['../m_pages/Complete.vue'], resolve);
        }
      }
    },
    {
      path: '/CoverageDetails',
      name: 'coverageDetails',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/CoverageDetails.vue'], resolve);
        } else {
          require(['../m_pages/CoverageDetails.vue'], resolve);
        }
      }
    },
    {
      path: '/Failed',
      name: 'failed',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Failed.vue'], resolve);
        } else {
          require(['../m_pages/Failed.vue'], resolve);
        }
      }
    },
    {
      path: '/Declarations',
      name: 'declarations',
      component(resolve) {
        if (isPc) {
          require(['../p_pages/Declarations.vue'], resolve);
        } else {
          require(['../m_pages/Declarations.vue'], resolve);
        }
      }
    },

  ],
  afterEach(to, from, next) {
    return {
      x: 0,
      y: 0
    } //切换路由之后滚动条始终在最顶部
  }
})
