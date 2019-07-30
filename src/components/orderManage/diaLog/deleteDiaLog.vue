<template>
  <el-dialog
    title="删除提示"
    :modal="false"
    top="0"
    :visible.sync="showDeleteDig"
    width="500px"
    :close-on-click-modal="false"
    :center="true"
    :show-close="false"
    @open="openEvent"
    custom-class="commonDiaLog deleteDialog"
  >
    <i class="closeIcon" @click="handleClose"></i>
    <div class="delete-main">
      <div class="delete-tip">
        <span class="delete-tip1">是否确定删除该{{dataName}}？</span>
        <p class="smallTip" v-if="otherText==''">{{otherText}}</p>
        <p class="smallTip" v-if="otherText!=''">• {{otherText}}</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
           <el-button type="primary" @click="confirmDelete">确认删除</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ["showDeleteDig", "dataName", "otherText"],
    data(){
      return {
        flag:true
      }
    },
    methods: {
      /**
       * 关闭弹窗
       */
      handleClose() {
        this.$parent.closeDialog();
      },

      /**
       * 确认删除
       */
      confirmDelete() {
        if (this.flag){
          this.flag=false;
          this.$emit("confirmDelete");
        }
      },
      openEvent(){
        this.flag=true;
      }
    }
  };
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  /*删除弹窗*/
  >>> .deleteDialog {
    width: 500px;
    height: 298px;
    background: rgba(255, 255, 255, 1);
    padding: 40px 70px 35px;
  }

  >>> .deleteDialog .closeIcon {
    right: 40px;
    top: 40px;
  }

  >>> .deleteDialog .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .delete-main {
    color: #4C4C4C;
    font-size: 22px;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  >>> .deleteDialog .el-button:first-of-type {
    background: transparent;
    color: #808080;
    border: 0;
  }

  >>> .deleteDialog .el-button {
    padding: 0;
    font-size: 15px;
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    color: #FFF;
  }

  >>> .deleteDialog .dialog-footer {
    position: absolute;
    right: 60px;
    bottom: 35px;
  }

  .smallTip {
    color: #808080;
    font-size: 14px;
    margin-top: 28px;
  }

</style>

