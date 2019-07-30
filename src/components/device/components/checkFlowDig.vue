<template>
  <el-dialog
    title="设备报损审核"
    :modal="false"
    top="0"
    :visible.sync="showCheckFlowDig"
    width="712px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="checkFlow-dialog"
  >
    <div class="edit-main">
      <div class="edit-item">
        <div>
          <span class="span-title">设备名称：</span>
          <span class="span-value">{{curDamage.equiname}}</span>
        </div>
      </div>
      <div class="edit-item">
        <div>
          <span class="span-title">订&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单：</span>
          <span class="span-value">{{curDamage.ordertitle}}</span>
        </div>
      </div>
      <div class="edit-item item-image">
        <div style="display:flex">
          <span class="span-title edit-image">报损图片：</span>
          <div class="device-images commonScrollStyle">
            <div class="add-image" v-for="devImg in curDamage.dropimgs||[]">
              <img :src="cosIp+devImg.src" preview="0">
            </div>
          </div>
        </div>
      </div>
      <div class="edit-item">
        <div style="margin-top:15px;margin-left:5px;display: flex;">
          <span class="span-title edit-area">说&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明：</span>
          <span class="span-value span-remark">{{curDamage.remark}}</span>
        </div>
      </div>
      <div class="edit-button">
        <el-button class="btn-cancel" @click="confirmOperate(0)">确认维修</el-button>
        <el-button @click="confirmOperate(1)">确认报损</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["showCheckFlowDig", "curDamage"],
  data() {
    return { cosIp: cosIp};
  },
  mounted() {},
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeCheckFlowDig");
    },
    /**
     * 确认操作 (0 确认维修 1 确认报损 2 已经维修)
     */
    confirmOperate(status) {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/UpEquiDrop";
      this.$Axios({
        method: "POST",
        data: {
          id: this.curDamage.id,
          status: status
        },
        url: url,
        success(res) {
          if (res.status == 200 && res.data.status) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
            this.$parent.showCheckFlowDig = false;
            this.$parent.getCheckFlowList();
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error(err) {
          that.$message.error(err);
        }
      });
    }
  }
};
</script>

<style scoped>
/*编辑弹窗*/
.edit-main {
  width: 550px;
  height: 360px;
  padding-top: 40px;
  margin: auto;
}
.edit-item {
  display: flex;
  justify-content: space-between;
}

.item-image {
  height: 112px;
  align-items: center;
}

.span-title {
  width: 75px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 50px;
}

.span-value {
  width: 450px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 50px;
}
.span-remark {
  width: 460px;
  line-height: 30px;
}
.device-images {
  width: 470px;
  max-width: 470px;
  overflow-x: auto;
  height: 100px;
  padding-left: 5px;
  display: flex;
}

.add-image {
  width: auto;
  height: 90px;
  margin-right: 15px;
}
.add-image img {
  max-width: 126px;
  max-height: 90px;
}
.edit-image {
  line-height: 30px;
  height: 90px;
}
.edit-area {
  line-height: 30px;
  height: 60px; /*  */
}
.edit-value {
  width: 470px;
  height: 102px;
  margin-top: 14px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
}
.edit-button {
  text-align: right;
  margin-top: 20px;
}
/*保存按钮*/
.checkFlow-dialog .el-button {
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
  border: none;
  margin-right: 25px;
  color: #999999 !important;
}
</style>
<style>
/*弹窗样式*/
.checkFlow-dialog {
  width: 712px;
  height: 516px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.checkFlow-dialog .el-dialog__header {
  padding-top: 35px;
}

.checkFlow-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.checkFlow-dialog .el-dialog__body {
  padding: 0px !important;
}

.checkFlow-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*编辑弹窗*/
.checkFlow-dialog .edit-value .el-textarea__inner {
  height: 100px;
}
</style>

