<template>
  <div>
    <!-- 标题 -->
    <el-row :gutter="10">
        <el-col :xs="24">
           <div class="grid-content bg-purple">
             <div class="title">KLOOK</div>
           </div>
    </el-col>  
   </el-row>

    <!-- Welcome -->
    <el-row>
      <el-col :xs="6">
        <h4>Welcome!</h4>       
      </el-col>
      <!-- <el-col :xs="18">
      </el-col> -->
    </el-row>

    <!-- enter -->
    <el-row :justify="start">
      <el-col :xs="23">       
        <p style="text-align:justify;">Enter your mobile number and email to continue.</p>
      </el-col>
    </el-row>
    
    <!-- 表单 -->
    <el-row>
      <el-col>
        <p>Enter you mobile number</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  color: orangered;
  font-weight: bold;
  font-size: 25px;
}
</style>
