<!--新增报账类型-->
<template>
  <el-dialog
    :title="AddDiaLog.title"
    :visible.sync="AddDiaLog.dialogVisible"
    width="542px"
    :before-close="handleClose">
    <ul class="item-ul">
      <li class="clearfloat">
        <span style="float: left">报账类型 : </span>
        <el-select v-model="FROM_DATA.BAOZHANG" style="height: 32px;float: left;width: 190px" placeholder="请选择报账类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li class="clearfloat">
        <span style="float: left">业务类型 : </span>
        <el-input v-model="FROM_DATA.TYPEYWU" style="float: left;width: 190px;height: 32px;" placeholder="请输入业务类型"></el-input>
      </li>
      <li class="clearfloat">
        <span style="float: left">说明 : </span>
        <el-input
          style="float: left;width: 80%;"
          type="textarea"
          :rows="3"
          v-model="FROM_DATA.SHYOMING"
          placeholder="请输入业务类型说明...">
        </el-input>

      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button  class="btn-1" style="border: none;" @click="AddDiaLog.dialogVisible = false">取 消</el-button>
      <el-button type="primary" style="width: 102px;" @click="handlerAddDiaLog()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "AddBaoZhangLeiXing",
        props:{
          AddDiaLog:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        data(){
          return {
            options:[{value:2,label:'行政报账'},{value:1,label:'业务报账'}],
            FROM_DATA:{
              BAOZHANG:'',      //报账类型
              TYPEYWU:"",       //业务类型
              SHYOMING:'',      //业务说明
            }
          }
        },
        methods:{
          //关闭
          handleClose(){
            this.AddDiaLog.dialogVisible = false
          },
          //  确定添加
          handlerAddDiaLog(){
            this.AddDiaLog.callblack(this.FROM_DATA)
          },
          handklerMeRen(){
            this.FROM_DATA.BAOZHANG = this.AddDiaLog.index
          }
        },
      created(){
          this.handklerMeRen()
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
