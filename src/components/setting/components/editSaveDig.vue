<template>
  <el-dialog
    title="系统存储编辑"
    :modal="false"
    top="0"
    :visible.sync="showEditDig"
    width="900px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="editSave-dialog"
  >
    <div class="edit-main">
      <div style="display: flex;justify-content: space-between;">
        <div class="main-left">
          <div class="edit-item">
            <span>区域：</span>
            <textarea v-model="curInfo.Region"></textarea>
          </div>
          <div class="edit-item">
            <span>存储桶：</span>
            <textarea v-model="curInfo.Bucket"></textarea>
          </div>
          <div class="edit-item">
            <span>腾讯云密钥：</span>
            <textarea v-model="curInfo.SecretKey"></textarea>
          </div>
        </div>
        <div class="main-right">
          <div class="edit-item">
            <span>AppId：</span>
            <textarea v-model="curInfo.AppId"></textarea>
          </div>
          <div class="edit-item">
            <span>腾讯云ID：</span>
            <textarea v-model="curInfo.SecretId"></textarea>
          </div>
          <div class="edit-item">
            <span>腾讯云CDN加速地址：</span>
            <textarea v-model="curInfo.BranchCosCdnUrl"></textarea>
          </div>
        </div>
      </div>
      <div class="edit-button">
        <el-button type="text" @click="handleClose" class="btn-cancel">取消</el-button>
        <el-button @click="updateBranchInfoDetail">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
//定义一个放图片信息的数组
export default {
  props: ["showEditDig", "curInfo"],
  data() {
    return {};
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeEditDig");
    },
    /**
     * 修改店铺配置信息
     */
    updateBranchInfoDetail() {
      this.$Axios({
        method: "POST",
        url: `/xlapi/CameraManage/CameraBranchManage/CameraBranch/UpdateBranchInfoDetail`,
        data: {
          SecretId: this.curInfo.SecretId,
          AppId: this.curInfo.AppId,
          Bucket: this.curInfo.Bucket,
          Region: this.curInfo.Region,
          SecretKey: this.curInfo.SecretKey,
          BranchCosCdnUrl: this.curInfo.BranchCosCdnUrl
        },
        success(res) {
          if (res.data.status) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$parent.getNowBranchInfo();
            this.$emit("closeEditDig");
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
/*编辑弹窗*/
.edit-main {
  width: 800px;
  height: 500px;
  padding-top: 40px;
  margin: auto;
}
.edit-item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.main-left,
.main-right {
  width: 386px;
}
.edit-item span {
  display: inline-block;
  /* width: 100%; */
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #808080;
  line-height: 35px;
}
textarea {
  width: 360px;
  height: 40px;
  border: 1px solid #dddddd;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  padding: 16px 12px;
  border-radius: 5px;
}
.edit-button {
  margin-top: 38px;
  float: right;
}
/*保存按钮*/
.editSave-dialog .el-button {
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
.editSave-dialog {
  width: 500px;
  height: 550px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.editSave-dialog .el-dialog__header {
  padding-top: 35px;
}

.editSave-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.editSave-dialog .el-dialog__body {
  padding: 0px !important;
}

.editSave-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*编辑弹窗*/
.editSave-dialog .edit-value .el-textarea__inner {
  height: 100px;
}
</style>

