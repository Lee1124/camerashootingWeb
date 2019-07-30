<!-- 收款退回 -->
<template>
  <el-dialog
    title="退回提示"
    :visible.sync="DiaLoga.dialogVisible"
    width="480px"
    :before-close="handleClose">
    <div style="padding: 1px 0">
      <p style="color: #4C4C4C;font-size: 22px;text-align: left">是否确认要退回收款?</p>
      <ul>
        <li>•<span style="margin-left: 10px">{{ DiaLoga.data.orderremark }}</span></li>
        <li>•<span style="margin-left: 10px">{{ DiaLoga.data.Amount + ' - ' + DiaLoga.data.typename }}</span></li>
      </ul>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="说说为什么要退回..."
        style="border: none;margin-top: 27px;"
        v-model="FORM_DATA[0].val">
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="DiaLoga.dialogVisible = false" class="btn">取 消</el-button>
    <el-button style="width: 100px;background: #5996F8" type="primary" @click="handlerDiaLogVisible()">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "ShouKuanTuiHui",
        props:{
          DiaLoga:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        data(){
          return {
            FORM_DATA:[
              {val:'',name:"说明"}
            ]
          }
        },
        methods:{
          //确认
          handlerDiaLogVisible(){
            this.DiaLoga.callblack(this.FORM_DATA)
          },
          //取消
          handleClose(){
            this.DiaLoga.dialogVisible = false
          }
        }

    }
</script>

<style scoped>
  .btn{
    border: none !important;
    color: #4c4c4c !important;
  }
  .btn:hover{
    background: none !important;
  }
  ul{
    padding: 15px 0;
    border-bottom: 1px dashed #808080;
    margin: 2px 0;
  }
  ul li{
    text-align: left;
    font-size: 14px;
    color: #808080;
    margin-bottom: 5px;
  }
  /deep/ .el-dialog__body{
    padding: 30px 48px;
  }
  /deep/ .el-dialog__title{
    color: #9DB3D7;
    font-size: 17px;
  }
  /deep/ .el-input__inner{
    height: 100%;
    padding-right: 30px;
  }
  /deep/ .el-textarea__inner{
    resize: none;
    background: #F6F6F6;
    border: none;
  }
  /deep/ .el-dialog__footer{
    padding: 10px 48px 30px;
  }
</style>
