<template>
  <el-dialog
    title="添加充值记录"
    :modal="false"
    top="0"
    :visible.sync="showAddDig"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="addRecharge-dialog"
  >
    <div class="edit-main">
      <div class="edit-item">
        <span>充值金额：</span>
        <el-input size="small" class="span-value" placeholder="输入充值金额"></el-input>
      </div>
      <div class="edit-item">
        <span>充值账户：</span>
        <el-select size="small" class="span-value" v-model="value" placeholder="请选择充值账户">
          <el-option label="李正文001"></el-option>
          <el-option label="李正文002"></el-option>
          <el-option label="李正文003"></el-option>
        </el-select>
      </div>
      <div class="edit-button">
        <el-button type="text" @click="handleClose" class="btn-cancel">取消</el-button>
        <el-button>保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
//定义一个放图片信息的数组
export default {
  props: ["showAddDig"],
  data() {
    return { value: "李正文001" };
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeAddDeviceDig");
    }
  }
};
</script>

<style scoped>
/*编辑弹窗*/
.edit-main {
  width: 290px;
  height: 500px;
  padding-top: 40px;
  margin: auto;
}
.edit-item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.edit-item span {
  display: inline-block;
  width: 90px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  line-height: 50px;
}
.span-value {
  width: 200px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 50px;
}
.edit-button {
  margin-top: 38px;
  float: right;
}
/*保存按钮*/
.addRecharge-dialog .el-button {
  width: 96px;
  height: 34px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  background: #5996f8;
  padding: 0;
  margin: auto;
}

.btn-cancel {
  background: transparent !important;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #999999 !important;
}

.btn-delete {
  background: transparent !important;
  border: 1px #5996f8 solid !important;
  margin-right: 20px;
  color: #5996f8 !important;
}
.icon-add {
  color: #dddddd;
  font-size: 30px;
}
.upload-span {
  color: #cccccc;
  display: inline-block;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
}
>>> textarea {
  resize: none;
}
</style>
<style>
/*弹窗样式*/
.addRecharge-dialog {
  width: 500px;
  height: 360px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.addRecharge-dialog .el-dialog__header {
  padding-top: 35px;
}

.addRecharge-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.addRecharge-dialog .el-dialog__body {
  padding: 0px !important;
}

.addRecharge-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*编辑弹窗*/
.addRecharge-dialog .edit-value .el-textarea__inner {
  height: 100px;
}
</style>

