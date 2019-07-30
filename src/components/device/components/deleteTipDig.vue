<template>
  <el-dialog
    title="操作提示"
    :modal="false"
    top="0"
    :visible.sync="showDeleteDig"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="delete-dialog"
  >
    <div class="delete-main">
      <div class="delete-tip">
        <span class="delete-tip1">{{dataClass}}？</span>
        <span class="delete-tip2">• {{tipText}}</span>
      </div>
      <div class="delete-bottom">
        <el-button type="text" class="btn-cancel" @click="handleClose">取消</el-button>
        <el-button class="btn-save" @click="confirmDelete">确认{{dataName}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["showDeleteDig", "dataName", "dataClass", "tipText"],
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeDeleteDig");
    },

    /**
     * 确认删除
     */
    confirmDelete() {
      this.$emit("confirmDelete");
    }
  }
};
</script>

<style scoped>
/*删除弹窗*/
.delete-tip {
  margin-left: 88px;
  margin-top: 35px;
}

.delete-tip1 {
  width: 100%;
  display: inline-block;
  font-size: 22px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(76, 76, 76, 1);
}
.delete-tip2 {
  width: 380px;
  display: inline-block;
  max-width: 347px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(128, 128, 128, 1);
  margin-top: 28px;
}

.delete-bottom {
  margin-top: 30px;
  margin-right: 62px;
  float: right;
}
.btn-cancel {
  background: transparent !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #999999 !important;
}
.delete-bottom .el-button {
  width: 96px;
  height: 34px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  background: #5996f8;
  padding: 0;
}
</style>
<style>
/*删除提示弹窗*/
.delete-dialog {
  width: 500px;
  height: 299px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.delete-dialog .el-dialog__header {
  padding-top: 35px;
}

.delete-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.delete-dialog .el-dialog__body {
  padding: 0px !important;
}

.delete-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}
</style>

