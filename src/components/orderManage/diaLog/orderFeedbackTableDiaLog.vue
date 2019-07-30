<!--订单回馈表弹框-->
<template>
  <div id="feedbackTableDiaLog">
    <el-dialog
      title=""
      :visible.sync="showFeedbackTableDiaLog"
      custom-class="commonDiaLog feedbackTableDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="closeTip"></i>
      <!--打印图标-->
      <div class="iconBox">
        <i class="fixedIcon printingIcon" @click="printTest"></i>
      </div>
      <!--/打印图标-->
      <div id="intentionTable" class="commonScrollStyle" v-loading="isShowLoading" element-loading-text="正在加载...">
        <!--内容-->
        <div class="section" ref="print" v-if="isShowContent">
          <!--打印图标-->
          <div class="iconBox">
            <i class="fixedIcon printingIcon" @click="printTest"></i>
          </div>
          <!--/打印图标-->

          <table class="table table1" border="1" cellpadding="0" cellspacing="0">
            <tbody>
            <template v-for="(items,index) in table1Data">
              <tr>
                <td v-text="items.left" class="label alignCenter"></td>
                <td class="ct"><input type="text" v-model="items.ct1" :disabled="isReadonly"
                                      @blur="inputBlur($event,items.key1)"></td>
                <td v-text="items.right" class="label alignCenter"></td>
                <td class="ct"><input type="text" v-model="items.ct2" :disabled="isReadonly"
                                      @blur="inputBlur($event,items.key2)"></td>
              </tr>
            </template>
            </tbody>
          </table>
          <table class="table table2" border="1" cellpadding="0" cellspacing="0">
            <tbody>
            <template v-for="(items,index) in table2Data">
              <tr>
                <td v-text="items.left" class="label alignCenter"></td>
                <td class="ct">
                  <textarea class="textArea" :disabled="isReadonly" v-model="items.ct"
                            @blur="inputBlur($event,items.key)"></textarea>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
          <table class="table table3" border="1" cellpadding="0" cellspacing="0">
            <tbody>
            <tr>
              <td class="label">备份名称</td>
              <td>迎 亲</td>
              <td>迎 宾</td>
              <td>仪 式</td>
              <td>敬 酒</td>
              <td>婚 前</td>
              <td>航 拍</td>
            </tr>
            <tr>
              <td class="label">备份人员</td>
              <template v-for="(items,index) in table3Data">
                <td class="ct" style="position: relative;">
                  <div :contenteditable="!isReadonly" class="input" v-cloak @blur="inputBlur($event,items.key)">
                    {{items.ct}}
                  </div>
                </td>
              </template>
            </tr>
            </tbody>
          </table>
          <P class="footerPerson">
            <template v-for="(items,index) in footData">
              <span v-cloak>{{items.name}}<input type="text" v-model="items.ct" :disabled="isReadonly"
                                                 @blur="inputBlur($event,items.key)"></span>
            </template>
          </P>
          <div class="footer" v-if="!isReadonly">
            <button @click="submit" v-if="flag">确认提交</button>
            <button v-if="!flag"><i class="el-icon-loading"></i>正在提交...</button>
          </div>
        </div>
        <!--/内容-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*方法*/
  let myMethods = {
    closeTip() {
      this.$parent.closeDialog();
      if (this.showFeedbackTableType==2){//从表格点出
        if (this.$route.query.id==5){
          this.$parent.reloadOrderData1();
        } else {
          this.$parent.reloadOrderData2();
        }
      }
    },
    openEvent() {
      this.flag = true;
      this.isShowLoading=true;
      this.isShowContent = false;
      this.orderId = this.$parent.orderId;
    },
    openedEvent() {
      this.isShowContent = true;
      this.getFeedBackData(1);
    },

    /*打印*/
    printTest() {
      this.$print(this.$refs.print) // 使用
    },
    /*提交*/
    submit() {
      if (this.flag) {
        this.flag = false;
        let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderStateByOrderId';
        let data = {
          OrderId: this.orderId,
          NextState: 2,
        };
        this.$Axios({
          method: 'POST',
          url: url,
          data: data,
          success(res) {
            this.getFeedBackData(1);
            this.$message({
              message: '保存成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            if (this.showFeedbackTableType == 1) {//从详情中点出
              if (this.isFormCalendar){
                this.$parent.getOrderState();//刷新状态
                this.$parent.getOrderStateList();//刷新状态列表
              }else {
                this.$parent.$refs.orderDetailsPage.getOrderState();//刷新状态
                this.$parent.$refs.orderDetailsPage.getOrderStateList();//刷新状态列表
              }
            }
          }
        })
      }
    },
    /*获取订单状态*/
    getOrderState() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetOrderStateByOrderId';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res.data.data)
            if (res.data.data.OrderState == '1') { //0 待回馈订单  1拍摄待交接   2后期制作   3待审核  4退回  5待移交客户  6订单完成
              this.isReadonly = false;
            } else {
              this.isReadonly = true;
            }
          }
        }
      })
    },
    /*获取订单信息*/
    getOrderData() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderInfoByCustomerInfoList';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            for (let i = 0; i < 4; i++) {
              if (i == 0 && this.table1Data[0].ct1 != '') {
                continue;
              } else if (i == 1 && this.table1Data[0].ct2 != '') {
                continue;
              } else if (i == 2 && this.table1Data[1].ct1 != '') {
                continue;
              } else if (i == 3 && this.table1Data[1].ct2 != '') {
                continue;
              }
              this.setDefaultData(res.data.data, i);
            }
          }
        }
      })
    },
    /*将订单信息保存到后台*/
    setDefaultData(obj, index) {//index:0=客户1,1=客户1电话,2=客户2,3=客户2电话
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderIntentionTableInfo';
      let MessageKey;
      let MessageContent;
      if (obj.OrderType == 1) {
        if (index == 0) {
          MessageKey = 'ct1name1';
          MessageContent = obj.CustomerModel.XLName;
        } else if (index == 1) {
          MessageKey = 'ct2tel1';
          MessageContent = obj.CustomerModel.XLPhone;
        } else if (index == 2) {
          MessageKey = 'ct1name2';
          MessageContent = obj.CustomerModel.XNName;
        } else if (index == 3) {
          MessageKey = 'ct2tel2';
          MessageContent = obj.CustomerModel.XNPhone;
        }
      } else {
        if (index == 0) {
          MessageKey = 'ct1name1';
          MessageContent = obj.CustomerModel.CompanyName;
        } else if (index == 1) {
          MessageKey = 'ct2tel1';
          MessageContent = '';
        } else if (index == 2) {
          MessageKey = 'ct1name2';
          MessageContent = obj.CustomerModel.ContactName;
        } else if (index == 3) {
          MessageKey = 'ct2tel2';
          MessageContent = obj.CustomerModel.ContactPhone;
        }
      }

      let data = {
        OrderId: this.orderId,
        Type: 'hkb',
        MessageKey: MessageKey,
        MessageContent: MessageContent,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          this.getFeedBackData();
        }
      })
    },
    /*失去焦点*/
    inputBlur(e, type) {
      if (type.indexOf('backups') != -1) {
        this.blurRequest({value: $(e.target).text(), key: type})
      } else {
        this.blurRequest({value: $(e.target).val(), key: type})
      }
    },
    /*失去焦点请求*/
    blurRequest(obj) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderIntentionTableInfo';
      let data = {
        OrderId: this.orderId,
        Type: 'hkb',
        MessageKey: obj.key,
        MessageContent: obj.value,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          console.log(res)
        }
      })
    },
    /*获取回馈表数据*/
    getFeedBackData(type) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetOrderIntentionTableInfo';
      let data = {
        OrderId: this.orderId,
        Type: 'hkb',
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res.data.data);
            this.flag = true;
            this.isShowLoading=false;
            this.defaultData(res.data.data);
            if (type == 1) {
              this.getOrderData();
              this.getOrderState();
            }
          } else {
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },
    /*进入页面默认数据*/
    defaultData(objArr) {
      objArr.forEach((item, index, arr) => {
        this.table1Data.forEach((item2, index2, arr2) => {
          if (arr[index].MessageKey == arr2[index2].key1) {
            arr2[index2].ct1 = arr[index].MessageContent;
          } else if (arr[index].MessageKey == arr2[index2].key2) {
            arr2[index2].ct2 = arr[index].MessageContent;
          }
        });
        this.table2Data.forEach((item3, index3, arr3) => {
          if (arr[index].MessageKey == arr3[index3].key) {
            arr3[index3].ct = arr[index].MessageContent;
          }
        });
        this.table3Data.forEach((item4, index4, arr4) => {
          if (arr[index].MessageKey == arr4[index4].key) {
            arr4[index4].ct = arr[index].MessageContent;
          }
        });
        this.footData.forEach((item5, index5, arr5) => {
          if (arr[index].MessageKey == arr5[index5].key) {
            arr5[index5].ct = arr[index].MessageContent;
          }
        })
      })
    }


  };
  export default {
    name: "feedbackTableDiaLog",
    props: ['showFeedbackTableDiaLog','showFeedbackTableType','isFormCalendar'],
    data() {
      return {
        orderId: '',
        isShowContent: true,
        isShowLoading: false,
        table1Data: [
          {left: '客 户 一', right: '联系电话', ct1: '', ct2: '', key1: 'ct1name1', key2: 'ct2tel1'},
          {left: '客 户 二', right: '联系电话', ct1: '', ct2: '', key1: 'ct1name2', key2: 'ct2tel2'},
          {left: '婚 期', right: '酒 店', ct1: '', ct2: '', key1: 'ct1orderTime', key2: 'ct2hotel'},
          {left: '拍摄质量', right: '备 份 盘', ct1: '', ct2: '', key1: 'ct1quality', key2: 'ct2disc'},
          {left: '备 份 机', right: '备份日期', ct1: '', ct2: '', key1: 'ct1machine', key2: 'ct2copyTime'},
        ],
        table2Data: [
          {left: '总 监', key: 'ZJ', ct: ''},
          {left: '摄  影 师', key: 'SYS', ct: ''},
          {left: '助 理', key: 'ZL', ct: ''},
          {left: '后期构架', key: 'HQ', ct: ''},
        ],
        table3Data: [
          {ct: '444', key: 'backupsYQ'},
          {ct: '', key: 'backupsYB'},
          {ct: '', key: 'backupsYS'},
          {ct: '', key: 'backupsJJ'},
          {ct: '', key: 'backupsHQ'},
          {ct: '', key: 'backupsHP'}
        ],

        footData: [
          {name: '总监签字：', key: 'ZJSign', ct: ''},
          {name: '摄影师签字：', key: 'SYSSign', ct: ''},
          {name: '助理签字：', key: 'ZLSign', ct: ''},
        ],
        name1: '44',
        isReadonly: false,
        flag: true,
      };
    },
    methods: myMethods,
    created() {
    },
    mounted() {

    },
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .feedbackTableDiaLog .closeIcon {
    right: 40px;
    top: 28px;
  }

  /*新增酒店弹框样式*/
  .commonBox {
    display: inline-block;
    width: 200px;
    height: 32px;
  }

  >>> .feedbackTableDiaLog {
    width: 900px;
    height: 90%;
  }

  >>> .feedbackTableDiaLog .el-dialog__header {
    height: 60px;
    line-height: 60px;
  }

  >>> .feedbackTableDiaLog .el-dialog__body {
    height: 87%;
  }

  /*悬浮图标样式*/
  .iconBox {
    width: 124px;
    height: 272px;
    position: fixed;
    right: 0;
    top: 80px;
    z-index: 999;
  }

  .iconBox .fixedIcon {
    width: 124px;
    height: 124px;
    display: block;
    cursor: pointer;
  }

  .smallRoutineIcon {
    margin-bottom: 28px;
    background: url("../../../../static/img/order/smallRoutineIcon1.png") no-repeat center center;
    background-size: 100%;
  }

  .printingIcon {
    background: url("../../../../static/img/order/printingIcon1.png") no-repeat center center;
    background-size: 100%;
  }

  .smallRoutineIcon:hover {
    background: url("../../../../static/img/order/smallRoutineIcon2.png") no-repeat center center;
  }

  .printingIcon:hover {
    background: url("../../../../static/img/order/printingIcon2.png") no-repeat center center;
  }

  /*内容区*/
  #intentionTable {
    overflow: auto;
    height: 100%;
  }

  #intentionTable .timeSelectStyle1 >>> .el-input__icon {
    line-height: 36px !important;
  }

  .alignCenter {
    text-align: center;
  }

  .table {
    border-collapse: collapse;
    width: 100%;
    border-style: dashed;
    border-color: #DDDDDD;
  }

  .table .label {
    color: #4C4C4C;
    font-size: 14px;
    width: 130px;
  }

  .table .ct input {
    color: #4C4C4C;
    font-size: 14px;
    font-weight: 700;
    background: #FFF;
  }

  .table td {
    border-style: dashed;
    border-color: #DDDDDD;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .section {
    padding: 50px 60px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .table1 tbody tr td {
    height: 54px;
  }

  .table1 tbody tr td.ct {
    padding: 0 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .table1 tbody tr td input {
    width: 100%;
    height: 32px;
  }

  .table2 {
    margin-top: -1px;
  }

  .table2 tbody tr td {
    height: 100px;
    padding: 20px 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .table2 tbody tr td .textArea {
    width: 100%;
    height: 100%;
    font-weight: 700;
    color: #4c4c4c;
    font-size: 14px;
    resize: none;
    background: #FFF;
  }

  .table3 {
    margin-top: -1px;
  }

  .table3 tbody tr td {
    height: 54px;
    text-align: center;
    color: #666666;
    font-size: 14px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
  }

  .table3 tbody tr td.ct {
    font-weight: 700;
    color: #4C4C4C;
    width: 107px;
  }

  .footerPerson {
    font-size: 14px;
    color: #666666;
    text-align: center;
    margin-top: 35px;
  }

  .footerPerson input {
    font-size: 14px;
    color: #666666;
    background: #FFF;
  }

  .footer {
    text-align: center;
    margin-top: 80px;
  }

  .footer button {
    cursor: pointer;
  }

  .footer button {
    width: 136px;
    height: 50px;
    background: rgba(89, 150, 248, 1);
    border-radius: 10px;
    outline: none;
    border: 0;
    color: #FFF;
    font-size: 16px;
  }

  @media print {
    .section {
      padding: 50px 20px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .iconBox {
      display: none;
    }

    .ddBlock {
      display: block;
    }

    .footer {
      display: none;
    }
  }


</style>
