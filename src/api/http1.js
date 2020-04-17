/*
 * @Author: gavin
 * @Date: 2019-08-27 17:17:24
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-22 16:37:23
 */
// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import domain from './domainConfig';
import { Toast } from 'cube-ui';

let toast = null;

const service = axios.create({
    baseURL: domain[process.env.ENV_CONFIG],
    // 设置超时时间
    timeout: 10000,
  })
// post请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
service.interceptors.request.use(
  config => {
      if(process.env.NODE_ENV === 'development') {
          config.url = `/api${config.url}`
      }
      if(!toast) {
        toast = Toast.$createToast({
            time: 0,
            txt: '加载中...',
            mask: true
        })
      }
      toast.show()
      if(config.method === 'post') {
        config.data = QS.stringify(config.data)
      }
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
      const token = store.state.token;
      token && (config.headers.Authorization = token);
      return config;
  },
  error => {
      toast.hide()
      toast = null
      return Promise.error(error);
  })

// 响应拦截器
service.interceptors.response.use(
  response => {
      toast.hide()
      if (response.status === 200) {
          return Promise.resolve(response);
      } else {
          return Promise.reject(response);
      }
  },
  // 服务器状态码不是200的情况
  error => {
      /* if (error.response.status) {
          loading.hide();
          switch (error.response.status) {
              // 401: 未登录
              // 未登录则跳转登录页面，并携带当前页面的路径
              // 在登录成功后返回当前页面，这一步需要在登录页操作。
              case 401:
                  break;
              // 403 token过期
              // 登录过期对用户进行提示
              // 清除本地token和清空vuex中token对象
              // 跳转登录页面
              case 403:
                    Toast.$createToast({
                        type:'error',
                        time: 3000,
                        txt: '登录过期，请重新登录',
                        mask: true
                    }).show()               
                  // 清除token
                  localStorage.removeItem('token');
                  break;
              // 404请求不存在
              case 404:
                    Toast.$createToast({
                        type:'error',
                        time: 3000,
                        txt: '网络请求不存在',
                        mask: true
                    }).show()
              break;
              // 其他错误，直接抛出错误提示
              default:
                  Toast.$createToast({
                    type:'error',
                    time: 3000,
                    txt: error.response.data.message,
                    mask: true
                }).show()
          }
          return Promise.reject(error.response);
      } */
      return Promise.reject(error.response)
  }
);


export default service

