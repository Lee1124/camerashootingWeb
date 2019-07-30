<!--新增城市-->
<template>
  <div>
    <el-dialog
      title="新增城市"
      :visible.sync="add_City.visible"
      :modal="false"
      :close-on-click-modal="false"
      width="600px">
      <div style="width: 100%;height: 100px;box-sizing: border-box;padding: 30px 0px;">
        <span style="color: #4c4c4c;font-size: 17px;padding-right: 10px">城市名称 :</span><el-input v-model="add_City.val" style="width: 300px;" placeholder="添加城市"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_City.visible = false" class="btn-1" style="border: none;">取 消</el-button>
        <el-button type="primary" @click="handlerAdd_City()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "addCity_DiaLog",
        props:{
          add_City:{
            type:Object,
            default:function () {
              return {}
            }
          }
        },
      methods:{
        //新增城市
        handlerAdd_City(){
          this.add_City.callblck()
        }
      }
    }
</script>

<style scoped>
/deep/ .el-dialog__header{
  width: 100%;
  padding: 20px 0;
}
.btn-1:hover{
  background: transparent !important;
  color: #4c4c4c !important;
}
  /deep/ .el-dialog__footer{
    padding: 20px;
  }
</style>
