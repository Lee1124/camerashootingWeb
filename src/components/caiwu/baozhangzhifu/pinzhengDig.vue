<!-- 上传凭证 -->
<template>
  <el-dialog
    title="支付凭证"
    :visible.sync="DiaTip.dialogVisible"
    width="600px"
    :before-close="handleClose">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
    <el-button style="border: none;margin-left: 250px;" @click="DiaTip.dialogVisible = false">取消</el-button>
      <el-button style="background: #5996F8;    width: 100px;" type="primary" @click="handlerDiaLogCent()">确认</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "pinzhengDig",
        props:{
          DiaTip:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
        methods:{
          handlerDiaLogCent(){
            this.DiaTip.callback()
          },
          handleClose(){

          }
        }
    }
</script>

<style scoped>
/deep/ .el-dialog__title{
  color: #9DB3D7;
  font-size: 17px;
}
</style>
