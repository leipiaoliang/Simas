<template>
  <div v-show="title" class="header-title">
    <i class="cubeic-back back" v-on:click="back()"></i>
    <span class="wes">{{title}}</span>
    <!--TODO： 此处有一个关闭按钮-->
    <span><i v-show="hasClose"></i></span>
  </div>
</template>
<script>
export default {
  props: {
      title: {
          default: '',
          type: String
      },
      hasClose : {
          default: false,
          type: Boolean
      }
  },
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.header-title {
    padding: 10px;
  height:88px;
  display: flex;
  align-items:center;
  justify-content: space-around;
}
.back {
  color: #0c81ff;
  font-size: 55px;
  font-weight: 550;
  /* text-align: left; */
  margin-left: -95px;
}
.wes {
  font-weight: 550;
  font-size: 40px;
  /* align-items: center; */
}
</style>