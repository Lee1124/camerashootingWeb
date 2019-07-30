<!--退回重做-->
<template>
  <div id="returnChongZuo">
    <el-dialog
      title="退回重做"
      :visible.sync="showReturnChongZuoDiaLog"
      custom-class="commonDiaLog returnChongZuo"
      :modal="false"
      @open="openEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <div class="content">
        <textarea class="textArea" placeholder="请输入退回重做的原因" v-model="textAreaText"></textarea>
      </div>
      <div class="btnBox">
        <button class="btn btn1" @click="close">取 消</button>
        <button class="btn btn2" @click="confirm">确 定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "returnChongZuo",
    props: {
      showReturnChongZuoDiaLog: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        textAreaText:'',
      };
    },
    methods: {
      openEvent(){
        this.textAreaText='';
      },
      close() {
        this.$emit('closeDiaLog')
      },
      confirm(){
        this.$emit('confirm',this.textAreaText)
      },

    },
    created() {

    },
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .returnChongZuo {
    width:480px;
    height:420px;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.2);
    padding: 30px 50px 50px;
  }

  >>> .returnChongZuo .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .returnOrSendDiscDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }
  .btnBox {
    position: absolute;
    bottom: 50px;
    right: 50px;
  }
  .btnBox .btn{
    width:76px;
    height:38px;
    line-height: 38px;
    border-radius:4px;
    border: 0;
    outline: none;
    font-size: 15px;
    cursor: pointer;
  }

  .btnBox .btn1 {
    color: #808080;
    background: transparent;
  }
  .btnBox .btn2 {
    color: #fff;
    background:rgba(89,150,248,1);
  }

  .textArea {
    padding: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    background: #F6F6F6;
    resize: none;
    border-radius:5px;
    height:200px;
    margin-top: 42px;
  }

  .textArea::placeholder {
    color: #BBB;
  }



</style>
