<!--出纳账目-->
<template>
  <div>
    <el-dialog
      title="账户余额明细"
      :visible="dialogVisible"
      width="582px"
      id="dialog"
      :before-close="handleClose">
      <div class="dialog-font" style="min-height: 300px">
        <p >
          <span style="font-size: 16px;color: #4c4c4c"><span style="font-weight: bold">截止到 {{ Data_Detile.title }}  账户余额  合计：</span></span><span style="font-size: 16px;color: red">{{ Data_Detile.sumamount}}</span>
        </p>
        <div class="clearfloat dialog-font" style="margin-top: 15px">
          <div style="float: left;width: 20%;text-align: right;color: #808080;font-size: 14px">明细 : </div>
          <div style="float: left;margin-left: 15px" >
            <p  style="font-size: 14px;color: #4C4C4C" v-for="(item,index) in Data_Detile.list" :key="index">{{ item.title }}：<span style="text-align: right">{{ item.amountbalance }}</span></p>
          </div>
        </div>
      </div>
    </el-dialog>
    <upImg :dialogImg="dialogImg"></upImg>
    <tables ref="DataInit"></tables>
  </div>
</template>

<script>
  import upImg from '../../caiwu/chunazhangmu/chunazhangmu'
  import tables from '../../tool/ChuaNaZhangMuTable'
    export default {
        name: "cunazhangmu",
        components:{upImg,tables},
        data(){
          return{
            dialogVisible:false,
            dialogImg:{
              dialogVisible:false,
              callblack:this.handlerImgUpdete
            },
            FILE_ARRY:[],         //文件集合
            Data_Detile:{},         //当前明细
          }
        },
        methods:{
        //  初始化
        handlerInit(data){
          this.$refs.DataInit.handlerInit(data)
        },
        //出纳账目详情
        handlerDetails(){
          this.dialogVisible = true
        },
        //  上传图片
        handlerImgUpdete(callblack){
          this.$refs.DataInit.handlerImgUpdete(this.FILE_ARRY,callblack)
        },
        //  关闭弹框
        handleClose(){
          this.dialogVisible = false
        },
        //  当前明细
        handlerDetile(data){
          this.Data_Detile = data
        }
      }
    }
</script>

<style scoped>
#dialog /deep/ .el-dialog__title{
  color: #B7C6DD;
  font-size: 17px;
}
.dialog-font p{
    font-size: 14px;
    color: #4c4c4c;
    text-align: left;
    margin-bottom: 14px;
}
/deep/ .el-dialog__wrapper{
  position: fixed !important;
}
  /deep/ .el-dialog__body{
    padding: 40px 60px;
  }
</style>
