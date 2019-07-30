<!--Popover 弹出框-->
<template>
  <el-popover
    placement="top-start"
    width="200"
    trigger="hover"
    :content="popover.content">
    <el-button slot="reference" style="display: inline-block;overflow: hidden;word-break: keep-all;white-space: nowrap;text-overflow: ellipsis;width: 100%;">{{ popover.msg }}</el-button>
  </el-popover>
</template>

<script>
    export default {
        name: "PopoverTip",
        props:{
          popover:{
            type:Object,
            default:function () {
              return {}
            }
          }
        }
    }
</script>

<style scoped>
/deep/ .el-button{
  border: none;
  background: transparent;
  color: #4c4c4c;
}
</style>
