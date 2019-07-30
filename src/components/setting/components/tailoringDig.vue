<template>
  <el-dialog
    :modal="false"
    top="0"
    :visible.sync="showTailoringDig"
    width="900px"
    :close-on-click-modal="false"
    :center="true"
    :show-close="false"
    @close="closeDig"
    @opened="urlTobase64"
    custom-class="tailor-dialog"
  >
    <div class="tailor-main">
      <div class="tailor-img">
        <img v-if="!isTailor" :src="option.img" />
        <vueCropper
          v-else
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox"
        ></vueCropper>
      </div>
      <div class="tailor-bottom">
        <div>
          <el-button v-if="!isTailor" @click="tailorImg">裁剪图片</el-button>
          <el-button v-else @click="saveTailorImg">确认裁剪</el-button>
          <el-button @click="finish">编辑完成</el-button>
        </div>
        <div class="noSelect">
          <span class="span-page1">&lt;</span>
          <span class="span-page">{{index+1}}</span>
          <span class="span-progress">/{{[curStaff].length}}&gt;</span>
          <span class="up-page" @click="upImg">
            <i class="el-icon-arrow-left"></i>
          </span>
          <span class="up-page" @click="downImg">
            <i class="el-icon-arrow-right"></i>
          </span>
          <span class="close-span" @click="closeDig">
            <i class="el-icon-close"></i>
          </span>
        </div>
      </div>
      <deleteTipDig
        :showDeleteDig="showDeleteDig"
        :dataName="dataName"
        :dataClass="dataClass"
        :tipText="tipText"
        @closeDeleteDig="showDeleteDig=false"
        @confirmDelete="giveUpTailor"
      ></deleteTipDig>
    </div>
  </el-dialog>
</template>

<script>
import deleteTipDig from "../../device/components/deleteTipDig"; //提示弹窗
export default {
  props: ["showTailoringDig", "curStaff", "isNewImg"],
  data() {
    return {
      curFileDetail: {},
      fileList: [],
      index: 0,
      isTailor: false, //是否裁剪中
      isTailored: false, //该图片是否裁剪过
      showDeleteDig: false,
      dataName: "放弃",
      dataClass: "当前图片裁剪中，是否放弃裁剪",
      tipText: "放弃裁剪后将不保存当前裁切，是否确认放弃？",
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    };
  },
  components: { deleteTipDig },
  methods: {
    /**
     * 剪裁图片
     */
    tailorImg() {
      this.urlTobase64();
      this.isTailor = true;
    },

    /**
     *编辑完成
     */
    finish() {
      if (this.isTailor) {
        this.showDeleteDig = true;
        return;
      }
      if (this.isTailored || this.isNewImg)
        this.uploadImg([this.dataURLtoFile(this.option.img, this.newGuid())]);
      this.closeDig();
    },
    /**
     * 保存裁剪图片并替换原图
     */
    saveTailorImg() {
      this.$refs.cropper.getCropData(data => {
        //保存裁剪图片
        this.option.img = data;
        this.isTailored = true;
        this.isTailor = false;
      });
    },
    /**
     * 放弃裁剪
     */
    giveUpTailor() {
      this.showDeleteDig = false;
      if (this.isTailored)
        this.uploadImg([this.dataURLtoFile(this.option.img, this.newGuid())]);
      this.closeDig();
    },
    /**
     * 关闭弹窗
     */
    closeDig() {
      this.option.img = "";
      this.$emit("closeDig");
    },
    /**
     * 网络图片转base64
     */
    urlTobase64() {
      let that = this;
      this.option.img = this.curStaff.ImgSrc;
      // this.$Axios({
      //   method: "get",
      //   url: `${
      //     getkevalue().apiurl
      //   }/xlapi/Mini/Ins/Img/getbase64?imgurl=${src}`,
      //   data: {},
      //   success(res) {
      //     let type = src.split(".").pop();
      //     let database64 = "data:image/" + type + ";base64," + res.data;
      //     that.option.img = database64;
      //   },
      //   error(err) {
      //     console.log(err);
      //   }
      // });
    },

    /**
     * 生成唯一文件名
     */
    newGuid() {
      var guid = "";
      for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
      }
      return guid;
    },

    //将base64转换为文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    /**
     * 上传图片到腾讯云
     */
    uploadImg(flieList) {
      this.$parent.isUpload = false;
      console.log("111", flieList[0]);
      this.$UpImgFile({
        file: flieList,
        ys: 1,
        path: `${getkevalue().branchid}/Camera/HeadImg`,
        callback: (that, res) => {
          this.uploadCallback(that);
        }
      });
    },
    /**
     * 上传成功回调操作
     */
    uploadCallback(that) {
      this.$emit("uploadCallback", that);
    },
    /**
     * 上一张图片
     */
    upImg() {
      // if (this.index > 0) {
      //   this.index--;
      // } else {
      //   this.index = this.fileList.length - 1;
      // }
      // this.curStaff = this.fileList[this.index];
      // // this.urlTobase64();
      // this.isTailor = false;
      // this.option.img = "";
    },
    /**
     * 下一张图片
     */
    downImg() {
      // if (this.index < this.fileList.length - 1) {
      //   this.index++;
      // } else {
      //   this.index = 0;
      // }
      // this.curStaff = this.fileList[this.index];
      // // this.urlTobase64();
      // this.isTailor = false;
      // this.option.img = "";
    }
  }
};
</script>

<style scoped>
/*详情弹窗*/
.tailor-main {
  width: 855px;
  height: 600px;
  margin: auto;
}
.tailor-img {
  width: 100%;
  height: 522px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.tailor-img img {
  max-width: 100%;
  max-height: 522px;
}
.tailor-bottom {
  width: 80%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
}
.tailor-bottom .el-button {
  width: 92px;
  height: 34px;
  background-color: transparent;
  border-radius: 5px;
  border: solid 1px #bb9860;
  color: #bb9860;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  padding: 0;
}
.el-button:active {
  border: 1px solid #bb9860;
}
.span-progress {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0px;
  margin-right: 10px;
  color: #999999;
}
.span-page1 {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0px;
  color: #999999;
}
.span-page {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0px;
  color: #bb9860;
}
.up-page,
.close-span {
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  cursor: pointer;
  color: #bbbbbb;
  line-height: 30px;
  border-radius: 50%;
  background: #ededed;
  margin-left: 15px;
}
.close-span {
  background: #cacaca;
  color: #ffffff;
  margin-left: 35px;
}
</style>
<style>
/*文件详情弹窗*/
.tailor-dialog {
  width: 900px;
  height: 650px;
  margin-bottom: 0px !important;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.24);
}

.tailor-dialog .el-dialog__header {
  padding-top: 20px;
}

.tailor-dialog .el-dialog__title {
  width: 101px;
  height: 18px;
  font-size: 17px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(157, 179, 215, 1);
  line-height: 26px;
}

.tailor-dialog .el-dialog__body {
  padding: 0px !important;
}

.tailor-dialog .el-dialog__headerbtn {
  top: 15px;
  font-size: 25px;
}
/*设置页面弹窗居中*/
.tailor-dialog .el-dialog__wrapper {
  position: absolute !important;
  display: flex;
  align-items: center;
}
</style>

