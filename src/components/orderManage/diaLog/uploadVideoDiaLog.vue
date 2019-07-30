<!--上传初稿页面-->
<template>
  <div id="uploadVideoDiaLog">
    <el-dialog
      :title="myTitle"
      :visible.sync="showUploadVideoDiaLog"
      custom-class="commonDiaLog uploadVideoDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--设备领取-->
      <div class="content" v-loading="isShowLoading" element-loading-text="正在上传...">
        <div class="content-left floatL">
          <div class="list list01">
            <ul>
              <li style="width: 100%;">
                <span class="label">订单：</span>
                <span v-cloak>{{orderTitle}}</span>
              </li>
              <li>
                <span class="li-span PS">
                  <span class="label">拍摄：</span>
                  <span class="person">
                    <template v-for="(items,index) in uploadVideoObj.PSList">
                      <span v-cloak>{{items.UserName}}<i class="dawn">、</i></span>
                    </template>
                    <span v-cloak v-if="uploadVideoObj.PSList.length==0" style="color: #BBBBBB;">暂无</span>
                  </span>
                </span>
                <span class="li-span HQ">
                  <span class="label">后期：</span>
                  <span class="person">
                     <template v-for="(items,index) in uploadVideoObj.HQList">
                      <span v-cloak>{{items.UserName}}<i class="dawn">、</i></span>
                    </template>
                    <span v-cloak v-if="uploadVideoObj.HQList.length==0" style="color: #BBBBBB;">暂无</span>
                  </span>
                </span>
              </li>
              <li>
                <span class="li-span SH">
                  <span class="label">审核：</span>
                  <span style="color: #BBBBBB;" v-if="auditorArr.length==0||auditorArr==null">暂无</span>
                  <template v-for="(item,index) in auditorArr">
                    <span class="SHUserName">{{item.SHUserName}} <i>、</i></span>
                  </template>
                </span>
                <span class="li-span ZT">
                  <span class="label">状态：</span>
                  <span style="color: #FF0000;" v-cloak v-if="firstDraftData.FileState==null&&myType==1||
firstDraftData.FileState==0&&myType==1">{{firstDraftData.FileState | FileState}}</span>
                  <span v-if="firstDraftData.FileState==1&&myType==1" style="color: green;" v-cloak>{{firstDraftData.FileState | FileState}}</span>

                  <span style="color: #ff4e00;" v-cloak v-if="firstDraftData.FileState==2&&myType==1">{{firstDraftData.FileState | FileState}}</span>

                  <span style="color: #FF0000;" v-cloak v-if="firstDraftData.FileState==null&&myType==2||
firstDraftData.FileState==0&&myType==2">{{firstDraftData.FileState | FileState2}}</span>
                  <span v-if="firstDraftData.FileState==1&&myType==2" style="color: green;" v-cloak>{{firstDraftData.FileState | FileState2}}</span>
                  <span style="color: #ff4e00;" v-cloak v-if="firstDraftData.FileState==2&&myType==2">{{firstDraftData.FileState | FileState2}}</span>

                </span>

              </li>
            </ul>
          </div>
          <div class="list list02">
            <div class="uploadBox uploadBox1 floatL">
              <p>文件上传</p>
              <div class="videoBox">
                <div class="fileBtnBox fileBtnBox1" v-if="!isShowVideo1&&myType==1">
                  <input type="file" class="fileInput" @change="changeFile($event,0)"/>
                  <button>选择视频</button>
                </div>
                <span v-if="myType==2" class="noVideo">无视频</span>
                <div class="showVideoBox" v-if="isShowVideo1">
                  <i class="closeVideo" @click="delVideo(video1Obj)" v-if="!isDisabled&&myType==1"></i>
                  <video id="myVideo1" :src="video1Obj.videoUrl" controls="controls"
                         style="width: 100%;height: 100%;background: #F7F7F7"></video>
                </div>
                <span class="line"></span>
              </div>
            </div>
            <div class="uploadBox uploadBox2 floatR">
              <p>预告片上传</p>
              <div class="videoBox">
                <div class="fileBtnBox" v-if="!isShowVideo2&&myType==1">
                  <input type="file" class="fileInput" @change="changeFile($event,1)" :disabled="isDisabled"/>
                  <button>选择视频</button>
                </div>
                <span v-if="myType==2" class="noVideo">无视频</span>
                <div class="showVideoBox" v-if="isShowVideo2">
                  <i class="closeVideo" @click="delVideo(video2Obj)" v-if="!isDisabled&&myType==1"></i>
                  <video id="myVideo2" :src="video2Obj.videoUrl" controls="controls"
                         style="width: 100%;height: 100%;background: #F7F7F7"></video>
                </div>
              </div>
            </div>
          </div>
          <div class="list list03">
            <textarea class="textArea" v-model="firstDraftData.FileRemark" :disabled="isDisabled" v-if="myType==1"
                      placeholder="说明..."
                      v-cloak></textarea>
            <textarea class="textArea" v-if="myType==2" :disabled="isDisabled" v-model="myFileRemark"
                      placeholder="说明..."
                      v-cloak></textarea>
          </div>

          <div class="btnBox" v-if="firstDraftData.FileState!=1&&myType==1">
            <button class="btn btn1" @click="close">取 消</button>
            <button class="btn btn2" @click="keepFirstDraft" v-if="isShowConfirm">提 交</button>
            <button class="btn btn2" v-if="!isShowConfirm"><i class="el-icon-loading"></i>正在保存...</button>
          </div>

          <div class="btnBox" v-if="myType==2&&firstDraftData.FileState!=1&&firstDraftData.FileState!=2&&firstDraftData.FileState!=null">
            <button class="btn btn1" @click="returnOrPass(2)" v-if="isShowReturnFlag">退 回</button>
            <button class="btn btn2" v-if="!isShowReturnFlag"><i class="el-icon-loading"></i>正在退回...</button>
            <button class="btn btn2" @click="returnOrPass(1)" v-if="isShowPassFlag">通 过</button>
            <button class="btn btn2" v-if="!isShowPassFlag"><i class="el-icon-loading"></i>正在通过...</button>
          </div>
        </div>
        <div class="content-right floatR" style="position: relative;">
          <noData msg="暂无相关数据" v-if="firstDraftData.FileLogList.length==0"></noData>
          <div class="title">日志记录</div>
          <div class="contentBox commonScrollStyle">
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(items, index) in firstDraftData.FileLogList"
                  :key="index"
                  :icon="items.icon"
                  :type="items.type"
                  :color="items.shadowBgColor"
                  :size="items.size"
                >
                  <span class="time" v-cloak :style="{color:items.smallIconColor}">{{items.AddTimeStr}}</span>
                  <p v-cloak class="content">{{items.CZ}}</p>
                  <p v-cloak class="content" style="color: #808080;">{{items.Remark}}</p>
                  <span v-cloak class="smallIcon" :style="{backgroundColor:items.smallIconColor}"></span><!--自定义的图标-->
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--删除提示-->
    <deleteTipDig @confirmDelete="confirmDelete" :showDeleteDig="showDeleteDig" dataName="视频"
                  otherText=""></deleteTipDig>
  </div>
</template>

<script>
  import deleteTipDig from './deleteDiaLog';//删除提示
  /*方法*/
  let myMethods = {
    close() {
      this.$parent.closeDialog();
      if (this.showUpVideoAddress == 2) {//从表格点出
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
      this.reloadParentData = false;
      this.uploadVideoObj = this.$parent.orderDetailsRowObj;
      this.orderId = this.$parent.orderId;
      this.myFileRemark = '';
      this.isShowConfirm = true;
      this.isShowReturnFlag = true;
      this.isShowPassFlag = true;
      this.isShowVideo1 = false;
      this.isShowVideo2 = false;
    },
    openedEvent() {
      this.getOrderTitle();
      this.getAuditor();
      this.getFirstDraftData();
      if (this.myType == 1) {
        this.myTitle = '上传初稿';
      } else {
        this.myTitle = '审核初稿';
      }
    },
    /*根据订单获取订单标题*/
    getOrderTitle() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderTitleByOrderId';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.orderTitle = res.data.data;
          }
        }
      })
    },
    /*退回或通过*/
    returnOrPass(type) {
      if (type == 2) {
        if (this.myFileRemark == '') {
          this.$message({
            message: '退回说明不能为空！',
            customClass: 'msgTips',
            type: 'error'
          });
          return false;
        }
        this.isShowReturnFlag = false;
      } else {
        this.isShowPassFlag = false;
      }
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/CheckCGByOrderId';
      let data = {
        OrderId: this.orderId,
        FileId: this.firstDraftData.FileId,
        SHState: type,
        SHRemark: this.myFileRemark,
      };
      // console.log(this.firstDraftData)
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.reloadParentData = true;
            this.isShowReturnFlag = true;
            this.isShowPassFlag = true;
            this.close();
            this.$message({
              message: '操作成功！',
              customClass: 'msgTips',
              type: 'success'
            });
          }else {
            this.isShowReturnFlag = true;
            this.isShowPassFlag = true;
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'error'
            });
          }
        }
      })
    },
    /*清除缓存的数据*/
    clearData() {
      for (let i = 0; i < this.firstDraftData.FileList.length; i++) {
        this.firstDraftData.FileList[i].videoUrl = '';
      }
    },
    /*获取当前订单初稿的文件列表和日志记录*/
    getFirstDraftData() {
      this.clearData();
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/GetFileListByOrderId';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res.data.data)
          if (res.data.status) {
            this.isShowLoading = false;
            this.firstDraftData = res.data.data;
            if (this.firstDraftData.FileState == 1) {
              this.isDisabled = true;
            } else {
              this.isDisabled = false;
            }
            for (let i = 0; i < this.firstDraftData.FileLogList.length; i++) {
              this.firstDraftData.FileLogList[i].size = 'large';
              this.firstDraftData.FileLogList[i].type = 'primary';
              if (this.firstDraftData.FileLogList[i].Remark.indexOf('通过') != -1) {
                this.firstDraftData.FileLogList[i].smallIconColor = '#5996F8';
                this.firstDraftData.FileLogList[i].shadowBgColor = '#DDEAFF';
              } else if (this.firstDraftData.FileLogList[i].Remark.indexOf('退回') != -1) {
                this.firstDraftData.FileLogList[i].smallIconColor = '#ff4e00';
                this.firstDraftData.FileLogList[i].shadowBgColor = '#ffe4d4';
              }
            }

            /*activities: [{
          content: '任达华审核通过了审核',
          time: '2018.04.12 20:46',
          size: 'large',
          type: 'primary',
          smallIconColor: '#5996F8',
          shadowBgColor: '#DDEAFF',
          remark: '“背景音乐是新人要求的”',
        }*/
            for (let i = 0; i < this.firstDraftData.FileList.length; i++) {
              if (this.firstDraftData.FileList[i].OtherType == '0') {
                this.firstDraftData.FileList[i].videoUrl = cosIp + this.firstDraftData.FileList[i].URLOriginal;
                this.video1Obj = this.firstDraftData.FileList[i];
                this.isShowVideo1 = true;
              } else if (this.firstDraftData.FileList[i].OtherType == '1') {
                this.firstDraftData.FileList[i].videoUrl = cosIp + this.firstDraftData.FileList[i].URLOriginal;
                this.video2Obj = this.firstDraftData.FileList[i];
                this.isShowVideo2 = true;
              }
            }
          }
        }
      })
    },
    // 获取审核人
    getAuditor() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/GetOrderInfoSource';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.auditorArr = res.data.data
          }
        }
      })
    },
    /*上传视频1*/
    changeFile(e, type) {//type:0文件 1预告片
      this.files = e.target.files;
      this.type = type;
      this.isSetTenCent();
    },
    /*上传视频*/
    uploadVideo() {
      this.isShowLoading = true;
      let files = this.files;
      var filename = files[0].name;
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      var postf = filename.substring(index1, index2);//获取文件后缀名
      if (postf == '.m4v' || postf == '.mp4' || postf == '.avi' || postf == '.mov' || postf == '.flv' || postf == '.mpg') {
        let videoArr = [files[0]];
        // 上传
        this.$UpVideoFile({
          file: videoArr,
          path: getkevalue().branchid + '/' + this.orderId,
          callback: (that, res) => {
            this.keepVideo(that, this.type);
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
    /*将视频存入数据库*/
    keepVideo(obj, type) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/UploadCGByOrderId';
      let key;
      if (obj.key.substring(0, 1) == '/') {
        key = obj.key.substr(1);
      }
      let data = {
        OrderId: this.orderId,
        Title: obj.fileName,
        OtherType: type,
        UrlOriginal: key,
        Type: 1,
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
            this.getFirstDraftData();
          }
        }
      })
    },
    /*上传视频前判断是否配置腾讯云*/
    isSetTenCent() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/IsCanUploadCGByOrderId';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // this.isCanUpload=res.data.data.IsCanUpload;
            if (res.data.data.IsCanUpload) {
              this.uploadVideo();
            } else {
              this.$message({
                message: '您所在的店铺未配置腾讯云，请联系管理员！',
                customClass: 'msgTips',
                type: 'error'
              });
            }
          }
        }
      })
    },
    /*删除确认*/
    confirmDelete() {
      this.$DetelImg({
        file: [{key: '/'+this.selectVideoObj.URLOriginal}],
        callback: (that, res) => {
          if (that.key != '') {
            this.delVideoData(this.selectVideoObj)
          }
        }
      });
    },
    /*删除第1步---删除腾讯云视频*/
    delVideo(videoObj) {
      this.showDeleteDig = true;
      this.selectVideoObj = videoObj;
    },
    /*删除第2步---删除后台视频*/
    delVideoData(videoObj) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/DeleteCGByOrderId';
      let data = {
        OrderId: this.orderId,
        Id: videoObj.Id,
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
            this.getFirstDraftData();
            if (videoObj.OtherType == '0') {
              this.isShowVideo1 = false;
            } else if (videoObj.OtherType == '1') {
              this.isShowVideo2 = false;
            }
          }
        }
      })
    },
    /*保存提交*/
    keepFirstDraft() {
      let FileRemark;
      if (this.firstDraftData.FileRemark == null) {
        FileRemark = '';
      } else {
        FileRemark = this.firstDraftData.FileRemark;
      }
      this.isShowConfirm = false;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/SaveCGByOrderId';
      let data = {
        OrderId: this.orderId,
        Remark: FileRemark,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.reloadParentData = true;
            this.isShowConfirm = true;
            this.close();
            this.$message({
              message: '保存成功！',
              customClass: 'msgTips',
              type: 'success'
            });
          }
        }
      })
    }
  };
  export default {
    name: "uploadVideoDiaLog",
    props: ['showUploadVideoDiaLog', 'myType', 'showUpVideoAddress'],
    data() {
      return {
        selectVideoObj: {},
        showDeleteDig: false,
        myFileRemark: '',
        myTitle: '',
        isDisabled: false,
        files: {},
        type: '',
        isCanUpload: false,
        isShowLoading: false,
        isShowVideo1: false,//显示视频1
        isShowVideo2: false,//显示视频2
        video1Obj: {},//视频1
        video2Obj: {},//视频2
        uploadVideoObj: {
          PSList: [],
          HQList: [],
        },
        orderTitle: '',
        orderId: '',
        firstDraftData: {//初稿数据
          FileState: '',
          FileRemark: '',
          FileList: [],
          FileLogList: [],
        },
        auditorArr: [],//审核人信息

        textAreaText: '',
        isShowConfirm: true,
        isShowReturnFlag: true,
        isShowPassFlag: true,

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
    },
    filters: {
      FileState(val) {
        if (val == null) {
          return '待提交审核';
        } else if (val == 0) {
          return '待审核(可以修改)';
        } else if (val == 1) {
          return '通过(不能修改)';
        } else if (val == 2) {
          return '退回(可以修改)';
        }
      },
      FileState2(val) {
        if (val == null) {
          return '待提交审核';
        } else if (val == 0) {
          return '待审核';
        } else if (val == 1) {
          return '通过';
        } else if (val == 2) {
          return '退回';
        }
      },

    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  #noData {
    right: 30px;
    left: 30px;
    width: auto !important;
    height: auto !important;
    background: #F7F7F7 !important;
    bottom: 30px;
    top: 50px;
  }

  #noData >>> .msg {
    color: #BBBBBB;
  }

  /*新增酒店弹框样式*/
  >>> .uploadVideoDiaLog {
    width: 69.5%;
    height: 84.5%;
    min-width: 770px;
    min-height: 560px;
    max-width: 960px;
    max-height: 925px;
    padding: 0 50px 38px;
  }

  >>> .uploadVideoDiaLog .el-dialog__header {
    height: 15%;
    line-height: 85px;
  }

  >>> .uploadVideoDiaLog .el-dialog__header .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .uploadVideoDiaLog .el-dialog__body {
    height: 85%;
  }

  >>> .uploadVideoDiaLog .el-dialog__body .closeIcon {
    right: 30px;
    top: 30px;
  }

  >>> .uploadVideoDiaLog .el-dialog__footer .el-button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    padding: 0;
  }

  >>> .uploadVideoDiaLog .el-dialog__footer .el-button:first-of-type {
    background: transparent;
    color: #808080;
    border: 0;
  }

  /*内容区样式*/
  .content {
    height: 100%;
  }

  .content-left {
    width: 62.5%;
    height: 100%;
    position: relative;
  }

  .content-left .list {
    font-size: 14px;
    margin-bottom: 10px;
    background: #F7F7F7;
    border-radius: 5px;
  }

  .content-left .list01 {
    height: 22.4%;
    padding: 4% 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content-left .list01 ul {
    position: relative;
    height: 100%;
  }

  .content-left .list01 ul li {
    text-align: left;
    position: absolute;
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  .content-left .list01 ul li:first-of-type {
    top: 0;
  }

  .content-left .list01 ul li:nth-of-type(2) {
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .content-left .list01 ul li:last-of-type {
    bottom: 0;
  }

  .content-left .list01 ul li .label {
    color: #808080;
  }

  .content-left .list01 ul li span {
    color: #4C4C4C;
  }
  .content-left .list01 ul li span.li-span {
    flex-basis: 50%;
  }
  .content-left .list01 ul li span.PS,
  .content-left .list01 ul li span.SH {
    /*display: inline-block;*/
  }

  .person span:last-of-type i {
    display: none;
  }

  .content-left .list02 {
    height: 43%;
    padding: 15px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content-left .list02 .uploadBox {
    width: 50%;
    height: 100%;
  }

  .content-left .list02 .uploadBox p {
    color: #808080;
    font-weight: 700;
    margin-top: 4%;
    font-size: 14px;
  }

  .content-left .list02 .uploadBox .videoBox {
    height: 88%;
    position: relative;
    padding: 20px 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content-left .list02 .uploadBox .videoBox .line {
    position: absolute;
    width: 1px;
    height: 78%;
    background: #E5E5E5;
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .content-left .list02 .uploadBox .videoBox .fileBtnBox {
    width: 124px;
    height: 42px;
    background: #5996F8;
    position: absolute;
    border-radius: 5px;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .content-left .list02 .uploadBox .videoBox .fileInput {
    width: 100%;
    height: 100%;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    opacity: 0;
  }

  .content-left .list02 .uploadBox .videoBox .fileBtnBox button {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 8;
    background: transparent;
    outline: none;
    border: 0;
    color: #FFF;
    border-radius: 5px;
  }

  .content-left .list02 .uploadBox .videoBox .showVideoBox {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 35px;
    right: 35px;
    border-radius: 5px;
    /*background: red;*/
  }

  .content-left .list02 .uploadBox .videoBox .showVideoBox .closeVideo {
    width: 23px;
    height: 23px;
    background: url("/static/img/order/largeClose.png") no-repeat center center;
    position: absolute;
    right: -12px;
    top: -12px;
    cursor: pointer;
    visibility: hidden;
    transition: all .2s;
    z-index: 999;
  }

  .content-left .list02 .uploadBox .videoBox .showVideoBox:hover .closeVideo {
    visibility: visible;
  }

  .content-left .list03 {
    height: 20.6%;
  }

  .content-left .list03 .textArea {
    width: 100%;
    height: 100%;
    border: 0;
    resize: none;
    background: transparent;
    padding: 20px;
    font-size: 14px;
    color: #4C4C4C;
  }

  .content-left .list03 .textArea::-webkit-input-placeholder {
    color: #BBB;
  }

  .content-right {
    width: 35.5%;
    height: 100%;
    background: #F7F7F7;
    border-radius: 5px;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  >>> .el-timeline-item__wrapper {
    text-align: left;
    padding-top: 3px;
  }

  >>> .el-timeline-item__tail {
    border-left: 1px dashed #DDD;
    height: 200%;
  }

  >>> .el-timeline-item__node {
    background: #EEEEEE;
    width: 22px;
    height: 22px;
    left: -6px;
  }

  .content-right .smallIcon {
    position: absolute;
    width: 9px;
    height: 9px;
    background: #CCCCCC;
    border-radius: 50%;
    left: 0.09%;
    top: 10px;
  }

  .content-right .time {
    color: #BBB;
  }

  .content-right .content {
    color: #4C4C4C;
    margin-top: 10px;
  }

  .content-right .title {
    color: #808080;
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    margin-bottom: 50px;
  }

  .content-right .contentBox {
    max-height: 88%;
    overflow: auto;
    padding-left: 10px;
  }

  .btnBox {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .btnBox .btn {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    border: 0;
    outline: none;
    color: #FFF;
    font-size: 15px;
    cursor: pointer;
    transition: all .2s;
  }

  .btnBox .btn1 {
    background: transparent;
    color: #808080;
  }

  .btnBox .btn2:hover {
    background: rgba(89, 150, 248, .9);
  }

  .noVideo {
    position: absolute;
    top: 45%;
    left: 50%;
    color: #BBB;
    -webkit-transform: translate(-50%);
    -moz-transform: translate(-50%);
    -ms-transform: translate(-50%);
    -o-transform: translate(-50%);
    transform: translate(-50%);
  }
  .SHUserName:last-of-type i{
    display: none;
  }
</style>
