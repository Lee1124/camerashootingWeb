<template>
  <div id="tipsDiaLog">
    <el-dialog
      title="提示"
      :modal="false"
      top="10px"
      :visible.sync="tipsObj.showTipsDiaLog"
      :close-on-click-modal="false"
      :center="true"
      :show-close="false"
      custom-class="tipsDiaLog"
    >
      <i class="closeIcon" @click="handleClose"></i>
      <div class="content">
        <div class="ctBox">
          <img src="../../../../static/img/common/tips.png" v-if="tipsObj.tipsType=='error'">
          <span v-cloak>{{tipsObj.tipMsg}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'tipsDiaLog',
    props: ["tipsObj"],
    methods: {
      handleClose() {
        this.$parent.closeDialog();
      },
    },
    created(){

    },
    watch:{
      tipsObj: {
        deep: true,
        handler: function (newVal,oldVal){

        }
      }
    }

  };
</script>

<style scoped>
  /*提示弹窗*/

  >>> .tipsDiaLog {
    width:480px;
    height:220px;
    background:rgba(255,255,255,1);
    box-shadow:0 0 9px 0 rgba(0, 0, 0, 0.2);
    padding: 25px 70px;
  }
  >>> .tipsDiaLog .el-dialog__body{
    height: 120px;
  }
  >>> .tipsDiaLog .content{
    height: 100%;
    position: relative;
  }

  >>> .tipsDiaLog .el-dialog__title{
    font-size: 17px;
    color: #B7C6DD;
  }
  >>> .tipsDiaLog .closeIcon{
    right: 22px;
    top: 22px;
    width: 18px;
    height: 18px;
    -webkit-transform: scale(.9);
    -moz-transform: scale(.9);
    -ms-transform: scale(.9);
    -o-transform: scale(.9);
    transform: scale(.9);
    background: url("../../../../static/img/common/close.png") no-repeat center center;
    z-index: 99988;
    cursor: pointer;
    display: block;
    font-style: normal;
    position: absolute;
    text-align: center;
    transition: all .2s;
    box-sizing: border-box;
  }


  >>> .tipsDiaLog .ctBox {
    font-size: 17px;
    color: #4C4C4C;
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 0;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  >>> .tipsDiaLog .ctBox img {
    margin-right: 20px;
  }

</style>

