/*
 * @Author: Marian
 * @Date: 2019-08-30 10:53:25
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-03 18:45:40
 * 自动注册全局基础组件脚本
 */


import Vue from 'vue'


/**
 * 首字母大写
 * @param str 字符串
 * @example marian
 * @return {string} Marian
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 对符合'xx/xx.vue'组件格式的组件取组件名
 * @param str fileName
 * @example ./lxy.vue
 * @return {string} Lxy
 */
function validateFileName(str) {
  return /^\S+\.vue$/.test(str) &&
    str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => capitalizeFirstLetter($1))
}
// 当前目录深遍历.vue文件
const requireComponent = require.context('./autoRegister', true, /\.vue$/)

// 找到组件文件夹下以.vue命名的文件，如果文件名为index，那么取组件中的name作为注册的组件名
requireComponent.keys().forEach(filePath => {
  const componentConfig = requireComponent(filePath)
  const fileName = validateFileName(filePath)
  const componentName = fileName.toLowerCase() === 'index'
    ? capitalizeFirstLetter(componentConfig.default.name)
    : fileName
  Vue.component(componentName, componentConfig.default || componentConfig)
})
