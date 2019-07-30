<!--通用弹框-->
<template>
  <div id="commonDiaLog">
    <el-dialog
      :title="commonDiaLogObj.title"
      :visible.sync="commonDiaLogObj.showDiaLog"
      :custom-class="commonDiaLogObj.className"
      :modal="false"
      :before-close="closeBefore"
      :width="commonDiaLogObj.diaLogWidth"
      :modal-append-to-body="false"
      :show-close="false">
      <i class="closeIcon" @click="closeDiaLog(commonDiaLogObj.type)"></i>
      <div class="content">
        <slot name="commonDiaLog"></slot>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDiaLog($event,commonDiaLogObj.type)" v-if="commonDiaLogObj.isShowBtn1">{{commonDiaLogObj.btn1Text}}</el-button>
        <el-button type="primary" @click="Confirm(commonDiaLogObj.type)"
                   v-if="commonDiaLogObj.isShowBtn2">{{commonDiaLogObj.btn2Text}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*数据*/
  let dataObj = {
  };
  /*方法*/
  let myMethods = {
    //确定
    Confirm(type){
      this.$parent.Confirm(type);
    },
    //关闭弹框
    closeDiaLog(type) {
      this.$parent.closeDialog(type);
    },
    closeBefore() {

    }
  };
  export default {
    name: "commonDiaLog",
    props: ['commonDiaLogObj'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
    },
    mounted() {
    },
    updated(){
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";



  >>> .el-dialog__footer {
    position: absolute;
    left: 50%;
    bottom: 35px;
    width: 100%;
    text-align: center;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  >>> .el-dialog__footer .el-button {
    padding: 0;
    width: 140px;
    height: 42px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
  }

  >>> .el-dialog__footer .el-button:hover {
    background: rgba(89, 150, 248, .9);
  }

</style>
