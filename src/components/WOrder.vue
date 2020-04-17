<template>
<div>
    <div class="members">
        <span>
            <p class="memb">Member <span>1</span></p>
            <p>Relationship</p>
            <p>Gender</p>
            <p>Surname (English)</p>
            <p>Given Name (English)</p>
            <p>Date of Birth</p>
            <p>HKID Number</p>

        </span>
        <span class="members-right">
           <p class="edit">Edit</p>
           <p>Myself</p>
           <p>Male</p>
           <p>Cheng</p>
           <p>Andy</p>
           <p>1988-12-08</p>
           <p>Y088819(4)</p>

        </span>
    </div>

    
</div>
</template>
<script>
export default {
    name:"order",
    data(){
       return{

       }
    }
    
}
</script>
<style lang="less" scoped>
@import "~style/mixin.less";
.members{
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    span{
        line-height: 40px;
        .memb{
            color:rgb(221, 219, 219) ;
            margin-bottom: 20px;
        }
        .edit{
            margin-bottom: 20px;
            text-align: right;
            color: @blue;
        }
    }
    .members-right{
            text-align: right;

    }
}
</style>