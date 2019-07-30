<template>
  <el-dialog
    title="新增支付对象"
    :visible.sync="AddObject.dialogVisible"
    width="542px"
    :before-close="handleClose">
    <ul class="item-ul">
      <li class="clearfloat">
        <span style="float: left">名称 : </span>
        <el-input v-model="FROM_DATA.name" style="float: left;width: 190px;height: 32px;" placeholder="请输入业务类型"></el-input>
      </li>
      <li class="clearfloat">
        <span style="float: left">地址 : </span>
        <el-input v-model="FROM_DATA.address" style="float: left;width: 190px;height: 32px;" placeholder="请输入地址"></el-input>
      </li>
      <li class="clearfloat">
        <span style="float: left">联系方式 : </span>
        <el-input type="number" v-model="FROM_DATA.phone" style="float: left;width: 190px;height: 32px;" placeholder="请输入联系方式"></el-input>
      </li>
      <li class="clearfloat">
        <span style="float: left">备注 : </span>
        <el-input
          style="float: left;width: 80%;"
          type="textarea"
          :rows="3"
          v-model="FROM_DATA.remark"
          placeholder="请输入支付对象说明...">
        </el-input>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button  class="btn-1" style="border: none;" @click="AddObject.dialogVisible = false">取 消</el-button>
      <el-button type="primary" style="width: 102px;" @click="handlerAddDiaLog()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "AddZhiFuDuiXiang",
        props:{
          AddObject:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        data(){
          return {
            FROM_DATA:{
              name:'',
              address:'',
              phone:'',
              remark:'',
            }
          }
        },
        methods:{
          //关闭
          handleClose(){
            this.AddObject.dialogVisible = false
          },
          //确认添加
          handlerAddDiaLog(){
            let a = this.FROM_DATA
            if(a.name == ''){
              this.$warning('请输入名称')
              return
            }
            if(a.address == ''){
              this.$warning('请输入地址')
              return
            }
            if(a.phone == ''){
              this.$warning('请输入联系电话')
              return
            }
            if(a.remark == ''){
              this.$warning('请输入备注')
              return
            }
            this.AddObject.callback(this.FROM_DATA)
          }
        }
    }
</script>

<style scoped>
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
</style>
