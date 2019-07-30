<!--邮寄碟片-->
<template>
  <div id="sendDiscDiaLog">
    <el-dialog
      title="邮寄碟片"
      :visible.sync="showSendDiscDiaLog"
      custom-class="commonDiaLog sendDiscDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--设备领取-->
      <div class="content commonScrollStyle" v-loading="isShowLoading" :element-loading-text="myLoadTitle">
        <ul>
          <li>
            <p class="title">凭证</p>
            <dl class="clearfloat">
              <dd>
                <i class="el-icon-plus"></i>
                <p>图片上传</p>
                <input type="file" class="fileInput" @change="changeFile" multiple="multiple">
              </dd>
              <template v-for="(items,index) in sendDiscObj.FileListInfo">
                <dd class="showImgBox" :style="{background:'url('+items.imgUrl+')'}">
                  <i class="largeClose" @click="delImg(items)"></i>
                  <img :src="items.imgUrl" title="点击预览">
                </dd>
              </template>
            </dl>
          </li>
          <li>
            <p class="title">说明</p>
            <textarea class="textArea" v-model="textAreaText" placeholder="说点什么吧..."></textarea>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm" v-if="isShowBtn">保 存</el-button>
      <el-button type="primary" v-if="!isShowBtn"><i class="el-icon-loading"></i>正在保存...</el-button>
      </span>
    </el-dialog>
    <!--删除提示-->
    <deleteTipDig @confirmDelete="confirmDelete" :showDeleteDig="showDeleteDig" dataName="图片"
                  otherText=""></deleteTipDig>
  </div>
</template>

<script>
  import deleteTipDig from './deleteDiaLog';//删除提示
  /*方法*/
  let myMethods = {
    close() {
      this.$parent.closeDialog();
      this.textAreaText = '';
      if (this.showSendDiscAddress == 2) {//从列表
        if (this.$route.query.id==5){
          this.$parent.reloadOrderData1();
        } else {
          this.$parent.reloadOrderData2();
        }
      } else {
        if (this.reloadParentData) {
          this.$parent.getOrderState();//刷新状态
          this.$parent.getOrderStateList();//刷新状态列表
        }
      }
    },
    closeDialog() {
      this.showDeleteDig = false;
    },
    openEvent() {
      this.sendDiscObj.FileListInfo=[];
      this.reloadParentData = false;
      this.isShowBtn = true;
      this.orderId = this.$parent.orderId;
    },
    openedEvent() {
      this.getList();
    },

    /*获取邮寄碟片凭证列表*/
    getList() {
      this.isShowLoading = true;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/GetYJDPList';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res);
          if (res.data.status) {
            this.isShowLoading = false;
            if (res.data.data != null) {
              res.data.data.FileListInfo.forEach((item, index, arr) => {
                arr[index].imgUrl = cosIp + arr[index].URLOriginal;
              });
              this.textAreaText = res.data.data.Remark;
              this.sendDiscObj = res.data.data;
            }
          }
        }
      })
    },

    /*选择文件*/
    changeFile(e) {
      this.files = e.target.files;
      // this.isSetTenCent();
      this.uploadImg();
    },
    /*上传图片前判断是否配置腾讯云*/
    // isSetTenCent() {
    //   let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/IsCanUploadCGByOrderId';
    //   let data = {
    //     OrderId: this.orderId,
    //   };
    //   this.$Axios({
    //     method: 'POST',
    //     url: url,
    //     data: data,
    //     success(res) {
    //       if (res.data.status) {
    //         // this.isCanUpload=res.data.data.IsCanUpload;
    //         if (res.data.data.IsCanUpload) {
    //           this.uploadImg();
    //         } else {
    //           this.$message({
    //             message: '您所在的店铺未配置腾讯云，请联系管理员！',
    //             customClass: 'msgTips',
    //             type: 'error'
    //           });
    //         }
    //       }
    //     }
    //   })
    // },
    /*上传图片*/
    uploadImg() {
      this.isShowLoading = true;
      this.myLoadTitle = '正在上传...';
      let files = this.files;
      var filename = files[0].name;
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      var postf = filename.substring(index1, index2);//获取文件后缀名
      if (postf == '.bmp' || postf == '.tiff' || postf == '.gif' || postf == '.png' || postf == '.jpeg' || postf == '.jpg') {
        let imgArr = [];
        for (let i = 0; i < files.length; i++) {
          imgArr.push(files[i])
        }
        // 上传
        this.$UpImgFile({
          file: imgArr,
          path: getkevalue().branchid + '/' + this.orderId,
          callback: (that, res) => {
            this.keepImg(that);
          }
        });
      } else {
        this.isShowLoading = false;
        this.$message({
          message: '该视频格式不支持！',
          customClass: 'msgTips',
          type: 'error'
        });
      }
    },

    /*保存到数据库*/
    keepImg(obj) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/UploadYJDPByOrderId';
      let key;
      if (obj.key.substring(0,1)=='/'){
        key=obj.key.substr(1);
      }
      let data = {
        OrderId: this.orderId,
        Title: obj.fileName,
        OtherType: 3,
        UrlOriginal: key,
        Type: 0,
        FileType: '邮寄碟片',
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res);
          if (res.data.status) {
            this.$message({
              message: '上传成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            this.getList();
          }
        }
      })
    },

    /*删除图片询问*/
    delImg(obj) {
      this.showDeleteDig = true;
      this.selectDelImgObj = obj;
    },
    /*删除图片确认*/
    confirmDelete() {
      this.isShowLoading = true;
      this.myLoadTitle = '正在删除...';
      this.$DetelImg({
        file: [{key: '/'+this.selectDelImgObj.URLOriginal}],
        callback: (that, res) => {
          if (that.key != '') {
            this.delImgData()
          }
        }
      });
    },

    /*删除数据库图片*/
    delImgData() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/DeleteYJDPByOrderId';
      let data = {
        OrderId: this.orderId,
        Id: this.selectDelImgObj.Id,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.showDeleteDig = false;
            this.$message({
              message: '删除成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            this.getList();
          }
        }
      })
    },

    /*保存邮寄碟片*/
    confirm() {
      this.isShowBtn = false;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/SaveYJDPByOrderId';
      let data = {
        OrderId: this.orderId,
        Remark: this.textAreaText,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.reloadParentData = true;
            this.isShowBtn = true;
            this.$message({
              message: '保存成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            this.close();
          }
        }
      })
    }
  };
  export default {
    name: "sendDiscDiaLog",
    props: ['showSendDiscDiaLog', 'showSendDiscAddress'],
    data() {
      return {
        orderId: '',//订单Id
        sendDiscObj: {
          FileListInfo: []
        },
        files: {},
        selectDelImgObj: {},
        isShowLoading: false,
        showDeleteDig: false,
        myLoadTitle: '',
        textAreaText: '',
        isShowBtn: true,
        reloadParentData: false,
      };
    },
    methods: myMethods,
    created() {

    },
    mounted() {

    },
    components: {
      deleteTipDig: deleteTipDig
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";
  /*新增酒店弹框样式*/
  >>> .sendDiscDiaLog {
    width: 700px;
    height: 550px;
    padding: 0 45px 40px;
  }

  >>> .sendDiscDiaLog .el-dialog__header {
    height: 85px;
    line-height: 85px;
  }

  >>> .sendDiscDiaLog .el-dialog__header .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .sendDiscDiaLog .el-dialog__body {
    height: 390px;
    padding-top: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  >>> .sendDiscDiaLog .el-dialog__body .closeIcon {
    right: 30px;
    top: 30px;
  }

  >>> .sendDiscDiaLog .el-dialog__footer .el-button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    padding: 0;
  }

  >>> .sendDiscDiaLog .el-dialog__footer .el-button:first-of-type {
    background: transparent;
    color: #808080;
    border: 0;
  }

  /*内容区样式*/
  .content {
    height: 100%;
    overflow: auto;
  }

  .content .title {
    color: #808080;
    font-size: 14px;
    text-align: left;
    margin-bottom: 20px;
  }

  .content dl dd {
    float: left;
    margin-right: 22px;
    margin-bottom: 20px;
    width: 126px;
    height: 90px;
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 5px;
    position: relative;
  }

  .content dl {
    padding-bottom: 25px;
  }

  .content dl dd p {
    font-size: 13px;
    color: #CCCCCC;
  }

  .content dl dd:first-of-type {
    border-style: dashed;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 23px;
    cursor: pointer;
  }

  .content dl dd:first-of-type .el-icon-plus {
    font-size: 20px;
    color: #CCCCCC;
  }

  .content dl dd .fileInput {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }

  .showImgBox {
    position: relative;
    background-size: cover !important;
  }

  .showImgBox img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99;
    opacity: 0;
    cursor: pointer;
  }

  .largeClose {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 23px;
    height: 23px;
    background: url("/static/img/order/largeClose.png") no-repeat center center;
    cursor: pointer;
    visibility: hidden;
    transition: all .2s;
    z-index: 999;
  }

  .showImgBox:hover .largeClose {
    visibility: visible;
  }

  .textArea {
    width: 100%;
    height: 115px;
    background: rgba(242, 242, 242, 1);
    border-radius: 5px;
    resize: none;
    padding: 23px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
  }

  .textArea::-webkit-input-placeholder {
    color: #BBB;
  }
</style>
