<!-- 财务弹框提示  -->
<template>
  <el-dialog
    :title="tip.title"
    :visible.sync="tip.dialogVisible"
    :width="width"
    @close="handlderClose">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
    <el-button style="border: none" @click="tip.dialogVisible = false">{{ tip.footer[0] }}</el-button>
    <el-button type="primary" @click="handlerDialog()" style="width: 102px;background: #5996F8">{{ tip.footer[1] }}</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "DetelTips",
        props:{
          width:{
            type:String,
            default:'30%'
          },
          tip:{
            type:Object,
            default:function () {
              return new Object()
            }
          }
        },
      methods:{
        //  打开回调
        handlerDialog(){
          this.tip.primary()
        },
      //  关闭回调
        handlderClose(){
          try {
            this.tip.Yclose()
          }catch (e) {
            console.log(e)
          }
        }
      }
    }
</script>

<style scoped>
  /deep/ .el-button:focus,
  /deep/ .el-button:hover{
    color: #4c4c4c ;
    border-color: transparent;
    background-color: transparent;
  }
  /deep/ .el-button--primary:focus{
    background: #5996F8;
    border: none;
    color: #fff;
  }
  /deep/ .el-button--primary:hover{
    background: #5996F8;
    border: none;
    color: #fff;
  }
  /deep/ .el-button--primary{
    background: #5996F8;
    border: none;
  }
</style>
