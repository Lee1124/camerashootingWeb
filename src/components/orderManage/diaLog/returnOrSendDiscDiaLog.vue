<!--退回或者邮寄碟片-->
<template>
    <div id="returnOrSendDiscDiaLog">
      <el-dialog
        title=""
        :visible.sync="showReturnOrSendDiscDiaLog"
        custom-class="commonDiaLog returnOrSendDiscDiaLog"
        :modal="false"
        :close-on-click-modal="false"
        :show-close="false">
        <i class="closeIcon" @click="close"></i>
        <div class="content">
          <div>
            <button class="btn btn1" @click="nextEvent(0)" title="退回重做">退回重做</button>
          </div>
          <div>
            <button class="btn btn2" @click="nextEvent(1)" title="邮寄客户">邮寄客户</button>
          </div>
        </div>
        <!--<span slot="footer" class="dialog-footer">-->
           <!--<el-button @click="close">取 消</el-button>-->
           <!--<el-button type="primary" @click="confirmAddHotel('add')">确 定</el-button>-->
        <!--</span>-->
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "returnOrSendDiscDiaLog",
      props:{
        showReturnOrSendDiscDiaLog:{
          type:Boolean,
          default(){
            return false
          }
        }
      },
        data() {
            return {};
        },
        methods: {
          close(){
            this.$emit('closeDiaLog')
          },
          /*下一步操作*/
          nextEvent(type){
            this.$emit('nextEvent',type)
          }
        },
        created() {

        },
    }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  >>> .returnOrSendDiscDiaLog {
    width:410px;
    height:300px;
    box-shadow:0 0 9px 0 rgba(0, 0, 0, 0.2);
  }

  >>> .returnOrSendDiscDiaLog .el-dialog__header .el-dialog__title {
    font-size: 17px;
    color: #B7C6DD;
  }

  >>> .returnOrSendDiscDiaLog .el-dialog__footer {
    bottom: 40px;
    padding: 0 40px;
    position: absolute;
    right: 40px;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
  .btn {
    width:175px;
    height:56px;
    line-height: 56px;
    border-radius: 28px;
    background:#E4EEFF;
    font-size: 17px;
    color: #5996F8;
    transition: all .2s;
    outline: none;
    border: 0;
    cursor: pointer;
  }
  .btn1 {
    margin-bottom: 44px;
  }

  .btn:hover {
    color: #FFF;
    background: #5996F8;
  }


</style>
