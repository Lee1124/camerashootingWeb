<template>
  <el-dialog
    title="设备报损"
    :modal="false"
    top="0"
    :visible.sync="showDamageDig"
    width="712px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="damageDevice-dialog"
  >
    <div class="edit-main">
      <div class="edit-item">
        <div>
          <span class="span-title">设备名称</span>
          <el-input
            size="small"
            v-model="curDamage.devName"
            class="span-value"
            :disabled="true"
            placeholder="输入设备名称"
          ></el-input>
        </div>
      </div>
      <div class="edit-item">
        <div>
          <span class="span-title">订&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单：</span>
          <el-select
            filterable
            remote
            v-model="curDamage.orderCode"
            size="small"
            clearable
            :remote-method="serachOrder"
            class="span-value"
            placeholder="输入4位日期"
          >
            <el-option
              v-for="order in orderList"
              :key="order.id"
              :label="order.name"
              :value="order.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="edit-item item-image">
        <div style="display:flex">
          <span class="span-title edit-image">损坏图片：</span>
          <div class="device-images">
            <input
              type="file"
              id="file"
              multiple
              style="opacity: 0;width: 0;height: 0;"
              @change="AppendPicture"
            />
            <p>{{msg}}</p>
            <div
              v-if="!curDamage.imgList||curDamage.imgList.length<4"
              class="add-image"
              @click="changeIcon"
            >
              <div style="text-align:center">
                <i class="el-icon-plus icon-add"></i>
                <span class="upload-span">图片上传</span>
              </div>
            </div>
            <div class="devImg-list commonScrollStyle">
              <div class="add-image device-img" v-for="devImg in curDamage.imgList">
                <img :src="cosIp+devImg.filepath" @click="handlerYuLanImg" />
                <img
                  class="remove-img"
                  src="static\img\order\largeClose.png"
                  @click="removeImg(devImg.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-item">
        <div>
          <span class="span-title edit-area">报损说明：</span>
          <el-input
            type="textarea"
            v-model="curDamage.damageRemark"
            class="edit-value"
            placeholder="请输入设备报损说明..."
          ></el-input>
        </div>
      </div>
      <div class="edit-button">
        <el-button type="text" class="btn-cancel" @click="handleClose">取消</el-button>
        <el-button @click="saveDamage">保存</el-button>
      </div>
    </div>
    <img_viewer :option="option" ref="img_viewer"></img_viewer>
  </el-dialog>
</template>

<script>
import img_viewer from "../../img-viewer/Img-viewer";
export default {
  props: ["showDamageDig", "curDamage"],
  components: {
    img_viewer
  },
  data() {
    return {
      devPTypeList: [],
      msg: "",
      cosIp: cosIp,
      option: {},
      orderList: []
    };
  },
  mounted() {},
  methods: {
    //上传图片获得图像的url地址(二进制源码)
    AppendPicture() {
      let imgArr = [];
      var imgNum = document.getElementById("file").files.length; //图片数量
      for (var i = 0; i < imgNum; i++) {
        var imgNews = document.getElementById("file").files[i];
        imgArr.push(imgNews);
      }
      //上传
      this.$UpImgFile({
        file: imgArr,
        ys: 1,
        path: `${getkevalue().branchid}/Camera/EquiImg`,
        callback: (that, res) => {
          let devImg = {
            id: "", // ""新增 "-1"删除
            filepath: that.key.substring(1)
          };
          this.curDamage.imgList.push(devImg);
          this.msg += " "; //强制刷新
        }
      });
    },
    //图片预览
    handlerYuLanImg(index) {
      let list = this.curDamage.imgList.map(res => {
        return {
          src: this.cosIp + res.filepath
        };
      });
      this.option.list = list;
      this.$nextTick(() => {
        this.$refs.img_viewer.handlerImgshow();
      });
    },
    /**
     * 移除图片
     */
    removeImg(imgId) {
      let imgIndex = this.curDamage.imgList.findIndex(img => img.id == imgId);
      if (imgIndex > -1) {
        if (
          this.curDamage.imgList[imgIndex].id &&
          this.curDamage.imgList[imgIndex].id != ""
        ) {
          this.deleteImgList.push(imgId);
        }
        this.curDamage.imgList.splice(imgIndex, 1);
        this.msg += " "; //强制刷新
      }
    },
    /**
     * 模拟点击 打开文件选择框
     */
    changeIcon() {
      $("#file").trigger("click");
    },
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("closeDamageDeviceDig");
    },
    /**
     * 根据输入查询订单
     */
    serachOrder(quertStr) {
      if (quertStr.length != 4) {
        this.orderList = [];
        return;
      }
      let that = this;
      let url = "/xlapi/CameraManage/AmountManage/Amount/getorertitle";
      this.$Axios({
        method: "GET",
        data: {
          strname: quertStr
        },
        url: url,
        success(res) {
          that.devIsLodding = false;
          if (res.status == 200) {
            //添加报损图片
            this.orderList = res.data;
          } else {
            that.$message.error("获取订单信息失败");
          }
        },
        error(err) {
          that.$message.error(err);
        }
      });
    },

    /**
     * 保存报损信息
     */
    saveDamage() {
      if (!this.curDamage.devId || this.curDamage.devId == "") {
        this.$message({
          message: "设备ID不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.curDamage.devName || this.curDamage.devName == "") {
        this.$message({
          message: "设备名称不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.curDamage.orderCode || this.curDamage.orderCode == "") {
        this.$message({
          message: "订单不能为空",
          type: "warning"
        });
        return;
      }
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/InsEquiDrop";
      this.$Axios({
        method: "POST",
        data: {
          equid: this.curDamage.devId,
          equiName: this.curDamage.devName,
          orderid: this.curDamage.orderCode,
          remark: this.curDamage.damageRemark
        },
        url: url,
        success(res) {
          this.devIsLodding = false;
          if (res.status == 200 && res.data.status) {
            //添加报损图片
            this.insEquiDropImgs(res.data.id);
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$parent.showDamageDig = false;
            this.$parent.getAllTypeList();
            //that.dataList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        },
        error(err) {
          this.$message.error(err);
        }
      });
      //this.$emit("saveDamage");
    },
    /**
     * 添加报损图片
     */
    insEquiDropImgs(dropid) {
      let that = this;
      let filepaths = "";
      this.curDamage.imgList.forEach(img => {
        filepaths += img.filepath + "/";
      });
      let url = "/xlapi/CameraManage/EquiManage/EquiBase/InsEquiDropImgs";
      this.$Axios({
        method: "POST",
        data: {
          dropid: dropid,
          filepaths: filepaths.substring(0, filepaths.length - 1)
        },
        url: url,
        success(res) {
          that.devIsLodding = false;
          if (res.status == 200) {
            //that.dataList = res.data.data;
          } else {
            that.$message.error("添加报损图片失败");
          }
        },
        error(err) {
          that.$message.error(err);
        }
      });
    },

    /**
     * 删除信息
     */
    deleteDevice() {
      this.$emit("deleteDevice");
    }
  }
};
</script>

<style scoped>
/*编辑弹窗*/
.edit-main {
  width: 555px;
  height: 500px;
  padding-top: 40px;
  margin: auto;
}
.edit-item {
  display: flex;
  justify-content: space-between;
}

.item-image {
  height: 120px;
  align-items: center;
}

.span-title {
  width: 75px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 52px;
}

.span-value {
  width: 276px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 52px;
}
.device-images {
  width: 491px;
  height: 120px;
  align-items: center;
  padding-left: 5px;
  display: flex;
}

.add-image {
  width: 126px;
  height: 90px;
  display: flex;
  margin-right: 23px;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.add-image img {
  max-width: 126px;
  max-height: 90px;
  cursor: pointer;
}
.add-image:hover .remove-img {
  visibility: visible;
}
.device-img {
  width: auto;
  margin-right: 0px;
  border: none !important;
}
.remove-img {
  width: 23px;
  height: 23px;
  position: relative;
  top: -50%;
  right: 11px;
  visibility: hidden;
}

.devImg-list {
  display: flex;
  height: 120px;
  line-height: 120px;
  max-width: 460px;
  overflow-x: auto;
  align-items: center;
}
.edit-image {
  line-height: 30px;
  height: 90px;
}
.edit-area {
  line-height: 30px;
  height: 112px; /*  */
}
.edit-value {
  width: 470px;
  height: 112px;
  margin-top: 16px;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
}
.edit-button {
  margin-top: 40px;
  float: right;
}
/*保存按钮*/
.damageDevice-dialog .el-button {
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
.damageDevice-dialog {
  width: 712px;
  height: 596px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.damageDevice-dialog .el-dialog__header {
  padding-top: 35px;
}

.damageDevice-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.damageDevice-dialog .el-dialog__body {
  padding: 0px !important;
}

.damageDevice-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*编辑弹窗*/
.damageDevice-dialog .edit-value .el-textarea__inner {
  height: 110px;
}
</style>

