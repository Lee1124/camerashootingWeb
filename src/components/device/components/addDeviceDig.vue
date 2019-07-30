<template>
  <el-dialog
    :title="isEdit?'编辑设备':'新增设备'"
    :modal="false"
    top="0"
    :visible.sync="showAddDig"
    width="712px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :center="true"
    custom-class="addDevice-dialog"
  >
    <div class="edit-main">
      <div class="edit-item">
        <div>
          <span class="span-title">设备类型：</span>
          <el-select
            v-model="curDevice.equitype"
            size="small"
            class="span-value"
            placeholder="请选择设备类型"
          >
            <el-option
              v-for="devType in devTypeList"
              :key="devType.id"
              :label="devType.name"
              :value="devType.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <span class="span-title">设备编号：</span>
          <el-input size="small" v-model="curDevice.code" class="span-value" placeholder="输入设备编号"></el-input>
        </div>
      </div>
      <div class="edit-item">
        <div>
          <span class="span-title">设备名称：</span>
          <el-input size="small" v-model="curDevice.name" class="span-value" placeholder="输入设备名称"></el-input>
        </div>
        <div>
          <span class="span-title">购买日期：</span>
          <el-date-picker
            v-model="curDevice.buytime"
            class="span-value"
            size="small"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy.MM.dd"
            placeholder="请选择日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="edit-item">
        <div>
          <span class="span-title">使用价格：</span>
          <el-input size="small" v-model="curDevice.useprice" class="span-value" placeholder="输入金额">
            <span slot="suffix">元</span>
          </el-input>
        </div>
      </div>
      <div class="edit-item item-image">
        <div style="display:flex">
          <span class="span-title edit-image">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</span>
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
              v-if="!curDevice.imgList||curDevice.imgList.length<4"
              class="add-image"
              @click="changeIcon"
            >
              <div style="text-align:center">
                <i class="el-icon-plus icon-add"></i>
                <span class="upload-span">图片上传</span>
              </div>
            </div>
            <div class="devImg-list commonScrollStyle">
              <div class="add-image device-img" v-for="devImg in curDevice.imgList">
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
          <span class="span-title edit-area">说&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明：</span>
          <el-input
            type="textarea"
            v-model="curDevice.remark"
            class="edit-value"
            placeholder="请输入设备类型说明..."
          ></el-input>
        </div>
      </div>
      <div class="edit-button">
        <el-button v-if="isEdit" type="text" class="btn-cancel" @click="handleClose">取消编辑</el-button>
        <el-button v-if="isEdit" class="btn-delete" @click="deleteDevice">删除</el-button>
        <el-button v-else type="text" class="btn-cancel" @click="handleClose">取消</el-button>
        <el-button @click="saveDevice">保存</el-button>
      </div>
      <img_viewer :option="option" ref="img_viewer"></img_viewer>
    </div>
  </el-dialog>
</template>

<script>
import img_viewer from "../../img-viewer/Img-viewer";
//定义一个放图片信息的数组
export default {
  props: ["isEdit", "showAddDig", "curDevice", "devTypeList"],
  components: {
    img_viewer
  },
  data() {
    return {
      devPTypeList: [],
      deleteImgList: [], //删除的图片id
      cosIp: cosIp,
      msg: "",
      option: {}
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
          this.curDevice.imgList.push(devImg);
          this.msg += " "; //强制刷新
        }
      });
    },
    //图片预览
    handlerYuLanImg(index) {
      let list = this.curDevice.imgList.map(res => {
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
      let imgIndex = this.curDevice.imgList.findIndex(img => img.id == imgId);
      if (imgIndex > -1) {
        if (
          this.curDevice.imgList[imgIndex].id &&
          this.curDevice.imgList[imgIndex].id != ""
        ) {
          this.deleteImgList.push(imgId);
        }
        this.curDevice.imgList.splice(imgIndex, 1);
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
      this.deleteImgList = [];
      this.$emit("closeAddDeviceDig");
    },

    /**
     * 保存信息 （移除的图片）
     */
    saveDevice() {
      this.$emit("saveDevice", this.deleteImgList);
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
  line-height: 50px;
}

.span-value {
  width: 180px !important;
  display: inline-block;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4c4c4c;
  line-height: 50px;
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
  height: 100px; /*  */
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
  margin-top: 38px;
  float: right;
}
/*保存按钮*/
.addDevice-dialog .el-button {
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
.addDevice-dialog {
  width: 712px;
  height: 626px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.17);
}

.addDevice-dialog .el-dialog__header {
  padding-top: 35px;
}

.addDevice-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.addDevice-dialog .el-dialog__body {
  padding: 0px !important;
}

.addDevice-dialog .el-dialog__headerbtn {
  top: 29px;
  font-size: 25px;
}

/*编辑弹窗*/
.addDevice-dialog .edit-value .el-textarea__inner {
  height: 100px;
}
</style>

