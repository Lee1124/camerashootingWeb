<!--新增报账类型-->
<template>
  <div>
    <el-dialog
      :title="EditUserDiaLog.title"
      :visible.sync="EditUserDiaLog.dialogVisible"
      width="542px"
      :before-close="handleClose">
      <div class="edit-user">
        <div>
          <span>审核人员: </span>
          <span>{{ EditUserDiaLog.data.username }}</span>
          <span style="color: #5996F8;cursor: pointer" @click="handlerSelectDiaLog()">[ 更换 ]</span>
        </div>
        <div>
          <span>审核金额:</span>
          <span> <el-input v-model="Amount" type="number" placeholder="输入审核金额"></el-input></span>
        </div>
        <div>
          <span style="color: #F66D63">注意:</span>
          <span>输入审核金额后，超过审核金额的申请才可以被该审核人员审核,审核金额为空表示不限金额，审核人员可以审核</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button  class="btn-1" style="border: none;" @click="EditUserDiaLog.dialogVisible = false">取 消</el-button>
      <el-button type="primary" style="width: 102px;" @click="handlerAddDiaLog()">确 定</el-button>
    </span>
    </el-dialog>
    <AddAudit :showPersonSelectDiaLog="showPersonSelectDiaLog"></AddAudit>
  </div>
</template>

<script>
  import AddAudit from '../../orderManage/diaLog/personSelectDiaLog';       //添加审核人员
  export default {
    name: "EditShengHeUser",
    components:{AddAudit},
    props:{
      EditUserDiaLog:{
        type:Object,
        default:function () {
          return {}
        }
      }
    },
    data(){
      return {
        showPersonSelectDiaLog:false,
        EditUser:null,
        Amount:''   //金额
      }
    },
    methods:{
      //关闭
      handleClose(){
        this.EditUserDiaLog.dialogVisible = false
      },
      //  确定添加
      handlerAddDiaLog(){
        console.log( this )
        this.EditUserDiaLog.callblack( this.EditUser , this.Amount )
      },
      //打开审核人员
      handlerSelectDiaLog(){
        this.showPersonSelectDiaLog = true
      },
      //选择审核人员
      getSelectedNews( data ){
        this.EditUser = data
        this.EditUserDiaLog.data.username = data.UserName
      },
      closeDialog(){
        this.showPersonSelectDiaLog = false
      },
      handklerMeRen(){
        let data = this.EditUserDiaLog.data
        this.EditUser = {
          UserId:data.useriid,
          userName:data.username,
        }
      }
    },
    created(){
      this.handklerMeRen()
    }
  }
</script>

<style scoped>
  .edit-user div{
    width: fit-content;
  }
  .edit-user div:nth-child(1){
    margin-bottom: 15px;
  }
  .edit-user div span{
    font-size: 14px;
  }
  .edit-user div span:nth-child(1){
    color: #808080;
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .item-ul{
    margin-bottom: 53px;
  }
  .item-ul li > span{
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 5px;
  }
  .item-ul li{
    text-align: left;
    line-height: 50px;
    height: 50px;
    margin: 10px 0;
  }
  .btn-1:hover{
    background: transparent !important;
    color: #4c4c4c !important;
  }
  /deep/ .el-dialog__title{
    font-size: 17px !important;
    color: #B7C6DD !important;
  }
  /deep/ .el-input__inner{
    height: 32px !important;
  }
  /deep/ .el-textarea__inner{
    resize: none !important;
    padding-top: 14px !important;
  }
  /deep/ .el-input{
    width: 210px !important;
    height: 32px !important;
  }
</style>
