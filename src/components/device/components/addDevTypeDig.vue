<template>
  <el-dialog
    :title="isEdit?'编辑设备类型':'新增设备类型'"
    :modal="false"
    top="0"
    :visible.sync="showAddDig"
    width="542px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="addDevClass-dialog"
  >
    <div class="edit-main">
      <div class="edit-item">
        <span class="span-title">设备分类：</span>
        <el-select v-model="curDevType.pid" size="small" class="span-value" placeholder="请选择设备类型">
          <el-option
            v-for="devType in devPTypeList"
            :key="devType.id"
            :label="devType.name"
            :value="devType.id"
          ></el-option>
        </el-select>
      </div>
      <div class="edit-item">
        <span class="span-title">设备类型：</span>
        <el-input size="small" v-model="curDevType.name" class="span-value" placeholder="输入设备类型名称"></el-input>
      </div>
      <div class="edit-item">
        <span class="span-title edit-area">说&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明：</span>
        <el-input
          type="textarea"
          v-model="curDevType.remark"
          class="edit-value"
          placeholder="请输入设备类型说明..."
        ></el-input>
      </div>
      <div class="edit-button">
        <el-button v-if="isEdit" type="text" class="btn-cancel" @click="deleteDevType">删除</el-button>
        <el-button v-else type="text" class="btn-cancel" @click="handleClose">取消</el-button>
        <el-button @click="saveDevType(isEdit)">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["isEdit", "showAddDig", "curDevType"],
  data() {
    return {
      devPTypeList: []
    };
  },
  mounted() {
    this.getEquiBaseList();
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeAddDevTypeDig");
    },

    /**
     * 保存信息
     */
    saveDevType() {
      this.$emit("saveDevType");
    },

    /**
     * 删除信息
     */
    deleteDevType() {
      this.$emit("deleteDevType");
    },
    /**
     * 获取设备基类列表
     */
    getEquiBaseList() {
      let that = this;
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/GetEquiBaseList";
      this.$Axios({
        method: "GET",
        url: url,
        success(res) {
          if (res.status == 200) {
            that.devPTypeList = res.data;
          } else {
            that.$message.error("查询设备基类列表失败");
          }
        },
        error(err) {}
      });
    }
  }
};
</script>

<style scoped>
/*编辑弹窗*/
.edit-main {
  width: 422px;
  height: 345px;
  padding-top: 40px;
  margin: auto;
}
.edit-item {
  text-align: left;
}

.span-title {
  width: 75px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 51px;
}

.span-value {
  width: 210px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 51px;
}

.edit-area {
  line-height: 30px;
  height: 100px;
}
.edit-value {
  width: 340px;
  height: 102px;
  margin-top: 11px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
}
.edit-button {
  margin-top: 48px;
  float: right;
}
/*保存按钮*/
.addDevClass-dialog .el-button {
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
>>>textarea {
  resize: none;
}
</style>
<style>
/*弹窗样式*/
.addDevClass-dialog {
  width: 542px;
  height: 476px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.addDevClass-dialog .el-dialog__header {
  padding-top: 35px;
}

.addDevClass-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.addDevClass-dialog .el-dialog__body {
  padding: 0px !important;
}

.addDevClass-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*编辑弹窗*/
.addDevClass-dialog .edit-value .el-textarea__inner {
  height: 100px;
}
</style>

