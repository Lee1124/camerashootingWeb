<!-- 收款审核 -->
<template>
  <el-dialog
    title="确认收款"
    :visible.sync="DiaLog.dialogVisible"
    width="480px"
    :before-close="handleClose">
      <ul>
        <li>
          <span>金额 : </span>
          <span>{{ DiaLog.data.Amount }}</span>
        </li>
        <li style="position: relative;" class="clearfloat">
          <span style="float: left;">手续费 : </span>
          <el-input type="number"  style="float: left;width:190px;height:32px;" v-model="FORM_DATA[0].val" placeholder="请输入输入标题"></el-input>
          <span style="position: absolute;right: 135px;top: 8px;bottom: 0;margin: 0 auto;line-height: 32px;color: #BBBBBB">元</span>
        </li>
        <li class="clearfloat" style="height: max-content;">
          <span style="float: left">说明 : </span>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            style="float: left;width: 80%;height:60px;margin-top: 18px"
            v-model="FORM_DATA[1].val">
          </el-input>
        </li>
      </ul>
    <span slot="footer" class="dialog-footer">
    <el-button @click="DiaLog.dialogVisible = false" class="btn">取 消</el-button>
    <el-button style="width: 100px;background: #5996F8" type="primary" @click="handlerDiaLogVisible()">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "ShouKuanDiaLog",
        props:{
          DiaLog:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        data(){
          return {
            FORM_DATA:[
              {val:"",name:'手续费'},
              {val:"",name:'说明'}
              ]
          }
        },
        methods:{
          handleClose(){
            this.handlerClearl();
            this.DiaLog.dialogVisible = false
          },
          //数据清空处理
          handlerClearl(){
            this.FORM_DATA.forEach(res => {
              res.val = ''
            })
          },
          // 确认
          handlerDiaLogVisible(){
            this.DiaLog.callblack(this.FORM_DATA)
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
  box-sizing: border-box;
  padding: 10px 35px;
}
ul li {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
}
ul li span:nth-child(1){
  display: inline-block;
  width: 50px;
  text-align: right;
  padding-right: 5px;
  color: #808080;
  font-size: 14px;
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
  }
  /deep/ .el-dialog__footer{
    padding: 10px 75px 30px;
  }
</style>
