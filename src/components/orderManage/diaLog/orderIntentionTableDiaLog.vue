<!--订单意向表弹框-->
<template>
  <div id="intentionTableDiaLog">
    <el-dialog
      title
      :visible.sync="showIntentionTableDiaLog"
      custom-class="commonDiaLog intentionTableDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div slot="title" class="nav-build">
        <div :class="{'nav-build-item':is_show}" @click="handlerQIhuan(1)">客户意向表</div>
        <div :class="{'nav-build-item':!is_show}" @click="handlerQIhuan(0)">员工确认意向</div>
      </div>

      <!--打印、小程序图标-->
      <div class="iconBox">
        <i class="fixedIcon smallRoutineIcon" @click="showQRCodeBox"></i>
        <i class="fixedIcon printingIcon" @click="printTest"></i>
      </div>
      <i class="closeIcon" @click="closeTip"></i>
      <div v-show="is_show" style="width: 100%;height: 100%;">
        <!--二维码框-->
        <transition name="slide-fade">
          <div class="QR-code-box" v-show="isShowQRCodeBox">
            <i class="close" @click="closeQRCode"></i>
            <img :src="QRCodeImgUrl" alt="微信小程序二维码" />
            <p>扫描小程序码，转发给客户</p>
          </div>
        </transition>

        <!--/打印、小程序图标-->
        <div
          id="intentionTable"
          class="commonScrollStyle"
          v-loading="isShowLoading"
          element-loading-text="正在加载..."
        >
          <!--内容-->
          <div class="section" ref="print" v-if="isShowContent">
            <ul>
              <li>
                <p class="title">新郎信息</p>
                <dl>
                  <dd class="clearfloat">
                    <div class="commonLeftBox">
                      <span class="label">
                        姓
                        <span class="spacing"></span>名：
                      </span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('name1')"
                          inputPlaceholderText="请输入姓名"
                          ref="name1"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                    <div class="commonRightBox">
                      <span class="label">联系电话：</span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('tel1')"
                          inputPlaceholderText="请输入联系电话"
                          ref="tel1"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                  </dd>
                  <dd class="clearfloat">
                    <div class="commonLeftBox">
                      <span class="label">
                        年
                        <span class="spacing"></span>龄：
                      </span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('age1')"
                          inputPlaceholderText="请输入年龄"
                          ref="age1"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                    <!-- <div class="commonRightBox">
                      <span class="label">星<span class="spacing"></span>座：</span>
                      <div class="formBox">
                        <dropSelect1 @changeDropSelect="changeDropSelect('xingZuo1')" :options="constellationData"
                                     dropSelect1Placeholder="请选择" ref="xingZuo1" :isReadonly="isReadonly"></dropSelect1>
                      </div>
                    </div>-->
                  </dd>
                </dl>
              </li>
              <li>
                <p class="title">新娘信息</p>
                <dl>
                  <dd class="clearfloat">
                    <div class="commonLeftBox">
                      <span class="label">
                        姓
                        <span class="spacing"></span>名：
                      </span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('name2')"
                          inputPlaceholderText="请输入姓名"
                          ref="name2"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                    <div class="commonRightBox">
                      <span class="label">联系电话：</span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('tel2')"
                          inputPlaceholderText="请输入联系电话"
                          ref="tel2"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                  </dd>
                  <dd class="clearfloat">
                    <div class="commonLeftBox">
                      <span class="label">
                        年
                        <span class="spacing"></span>龄：
                      </span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('age2')"
                          inputPlaceholderText="请输入年龄"
                          ref="age2"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                    <!-- <div class="commonRightBox">
                      <span class="label">星<span class="spacing"></span>座：</span>
                      <div class="formBox">
                        <dropSelect1 @changeDropSelect="changeDropSelect('xingZuo2')" :options="constellationData"
                                     dropSelect1Placeholder="请选择" ref="xingZuo2" :isReadonly="isReadonly"></dropSelect1>
                      </div>
                    </div>-->
                  </dd>
                </dl>
              </li>
              <li>
                <p class="title">订单信息</p>
                <dl>
                  <dd class="clearfloat">
                    <div class="commonLeftBox">
                      <span class="label">
                        婚
                        <span class="spacing"></span>期：
                      </span>
                      <div class="formBox">
                        <timeSelect1
                          @changeTime="changeTime('orderTime')"
                          ref="orderTime"
                          timePlaceholderText="请选择婚期"
                          :isReadonly="isReadonly"
                        ></timeSelect1>
                      </div>
                    </div>
                    <div class="commonRightBox">
                      <span class="label">
                        酒
                        <span class="spacing"></span>店：
                      </span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('hotel')"
                          inputPlaceholderText="请输入酒店"
                          ref="hotel"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                  </dd>
                  <dd class="clearfloat">
                    <div class="commonLeftBox">
                      <span class="label">
                        城
                        <span class="spacing"></span>市：
                      </span>
                      <div class="formBox">
                        <commonInput
                          @inputBlur="inputBlur('city')"
                          inputPlaceholderText="请输入城市"
                          ref="city"
                          :isReadonly="isReadonly"
                        ></commonInput>
                      </div>
                    </div>
                    <!-- <div class="commonRightBox">
                      <span class="label">星<span class="spacing"></span>座：</span>
                      <div class="formBox">
                        <dropSelect1 @changeDropSelect="changeDropSelect('xingZuo2')" :options="constellationData"
                                     dropSelect1Placeholder="请选择" ref="xingZuo2" :isReadonly="isReadonly"></dropSelect1>
                      </div>
                    </div>-->
                  </dd>
                </dl>
              </li>
              <li class="otherItems">
                <p class="title">其他信息</p>
                <dl>
                  <dd>
                    <p class="title">如何相识、相知、相恋？恋爱中印象最深的事是什么？</p>
                    <div class="textAreaBox">
                      <textArea
                        :isReadonly="isReadonly"
                        @TextAreaBlur="TextAreaBlur('1')"
                        ref="1"
                        textAreaPlaceholderText="输入内容..."
                      ></textArea>
                    </div>
                  </dd>
                  <dd>
                    <p class="title">对自己什么地方最满意</p>
                    <div class="textAreaBox">
                      <textArea
                        :isReadonly="isReadonly"
                        @TextAreaBlur="TextAreaBlur('7')"
                        ref="7"
                        textAreaPlaceholderText="输入内容..."
                      ></textArea>
                    </div>
                  </dd>
                  <dd>
                    <p class="title">有无拍摄禁忌？</p>
                    <div class="textAreaBox">
                      <textArea
                        :isReadonly="isReadonly"
                        @TextAreaBlur="TextAreaBlur('3')"
                        ref="3"
                        textAreaPlaceholderText="输入内容..."
                      ></textArea>
                    </div>
                  </dd>
                  <dd>
                    <p class="title">对拍摄有什么特别的要求？或者有无特别指定拍摄的物件或者人物</p>
                    <div class="textAreaBox">
                      <textArea
                        :isReadonly="isReadonly"
                        @TextAreaBlur="TextAreaBlur('4')"
                        ref="4"
                        textAreaPlaceholderText="输入内容..."
                      ></textArea>
                    </div>
                  </dd>
                  <dd class="ddBlock"></dd>
                  <dd>
                    <p class="title">对后期制作有什么要求?（MV整体风格，有无指定的婚礼MV背景音乐）</p>
                    <div class="textAreaBox">
                      <textArea
                        :isReadonly="isReadonly"
                        @TextAreaBlur="TextAreaBlur('5')"
                        ref="5"
                        textAreaPlaceholderText="输入内容..."
                      ></textArea>
                    </div>
                  </dd>
                  <dd>
                    <p class="title">对我们有什么意见和建议</p>
                    <div class="textAreaBox">
                      <textArea
                        :isReadonly="isReadonly"
                        @TextAreaBlur="TextAreaBlur('8')"
                        ref="8"
                        textAreaPlaceholderText="输入内容..."
                      ></textArea>
                    </div>
                  </dd>
                </dl>
              </li>
            </ul>

            <div class="footer" v-if="false">
              <button @click="submit" v-if="flag">确认提交</button>
              <button v-if="!flag">
                <i class="el-icon-loading"></i>正在提交...
              </button>
            </div>
          </div>
          <!--/内容-->
        </div>
      </div>
      <div
        v-show="!is_show"
        class="section commonScrollStyle"
        style="overflow: auto;
    height: 100%;"
      >
        <ul>
          <li class="otherItems">
            <p class="title">拍摄信息</p>
            <dl>
              <dd>
                <p class="title">拍摄风格</p>
                <div class="textAreaBox">
                  <textArea
                    :isReadonly="isReadonly"
                    @TextAreaBlur="TextAreaBlurs('textAreaa1')"
                    ref="textAreaa1"
                    textAreaPlaceholderText="输入内容..."
                  ></textArea>
                </div>
              </dd>
              <dd>
                <p class="title">拍摄要求</p>
                <div class="textAreaBox">
                  <textArea
                    :isReadonly="isReadonly"
                    @TextAreaBlur="TextAreaBlurs('textAreaa2')"
                    ref="textAreaa2"
                    textAreaPlaceholderText="输入内容..."
                  ></textArea>
                </div>
              </dd>
              <dd>
                <p class="title">拍摄时注意事项</p>
                <div class="textAreaBox">
                  <textArea
                    :isReadonly="isReadonly"
                    @TextAreaBlur="TextAreaBlurs('textAreaa3')"
                    ref="textAreaa3"
                    textAreaPlaceholderText="输入内容..."
                  ></textArea>
                </div>
              </dd>
            </dl>
          </li>
        </ul>
        <div class="footer" v-if="!isReadonly">
          <button @click="submit" v-if="flag">确认提交</button>
          <button v-if="!flag">
            <i class="el-icon-loading"></i>正在提交...
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*方法*/
let myMethods = {
  //菜单切换
  handlerQIhuan(type) {
    this.is_show = Boolean(type);
    if (!this.is_show) {
      this.handlerYugong();
    }
  },
  //获取员工意向
  handlerYugong(sum) {
    let data = {
      OrderId: this.orderId,
      Type: "ygyx"
    };
    this.initIntentionTableInfo();
    this.$Axios({
      method: "POST",
      url:
        "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetOrderIntentionTableInfo",
      data,
      success(res) {
        let val = res.data.data;
        val.forEach(res => {
          this.$refs[res.MessageKey].textAreaText = res.MessageContent;
        });
      }
    });
  },
  /**
   * 初始化员工意向值
   */
  initIntentionTableInfo() {
    this.$refs["textAreaa1"].textAreaText = "";
    this.$refs["textAreaa2"].textAreaText = "";
    this.$refs["textAreaa3"].textAreaText = "";
  },
  /*显示小程序二维码*/
  showQRCodeBox() {
    this.isShowQRCodeBox = true;
  },
  /*关闭小程序二维码*/
  closeQRCode() {
    this.isShowQRCodeBox = false;
  },
  closeTip() {
    this.$parent.closeDialog();
    if (this.intentionTableType == 2) {
      //从表格中点出
      this.$parent.reloadOrderData2();
    } else if (this.intentionTableType == 2.1) {
      this.$parent.reloadOrderData1();
    }
  },
  openEvent() {
    this.isShowQRCodeBox = false;
    this.flag = true;
    this.isShowLoading = true;
    this.isShowContent = false;
    this.orderId = this.$parent.orderId;
    this.QRCodeImgUrl =
      loginApi +
      "/xlapi/CameraManage/CameraUserInfoManage/UserLogin/GetCameraOrderYXBQRCode?" +
      "content=orderId=" +
      this.orderId +
      "%26share=true%26url=yixiangbiao&scence=";
  },
  openedEvent() {
    this.isShowContent = true;
    this.getIntentionData(1);
    this.is_show = true;
  },

  /*打印*/
  printTest() {
    this.$print(this.$refs.print); // 使用
  },

  /*提交*/
  submit() {
    if (this.flag) {
      this.flag = false;
      let url =
        "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderStateByOrderId";
      let data = {
        OrderId: this.orderId,
        NextState: 1
      };
      this.$Axios({
        method: "POST",
        url: url,
        data: data,
        success(res) {
          this.getIntentionData(1);
          this.$message({
            message: "保存成功！",
            customClass: "msgTips",
            type: "success"
          });
          if (this.intentionTableType == 1) {
            //从详情中点出
            if (this.isFormCalendar) {
              this.$parent.getOrderState(); //刷新状态
              this.$parent.getOrderStateList(); //刷新状态列表
            } else {
              this.$parent.$refs.orderDetailsPage.getOrderState(); //刷新状态
              this.$parent.$refs.orderDetailsPage.getOrderStateList(); //刷新状态列表
            }
          }
        }
      });
    }
  },
  /*客户一信息选择星座*/
  changeDropSelect(type) {
    let returnVal = this.$refs[type].dropSelectObj[0].value;
    this.blurRequest({ inputValue: returnVal, key: type });
  },
  /*时间选择*/
  changeTime(type) {
    let returnVal = this.$refs[type].timeValue;
    returnVal = getFormatTime(returnVal, "-");
    if (returnVal) {
      this.blurRequest({ inputValue: returnVal, key: type });
    }
  },
  /*文本框失去焦点事件*/
  inputBlur(type) {
    let returnVal = this.$refs[type].inputValue;
    this.blurRequest({ inputValue: returnVal, key: type });
  },
  /*文本域失去焦点事件*/
  TextAreaBlur(type) {
    let returnVal = this.$refs[type].textAreaText;
    this.blurRequest({ inputValue: returnVal, key: type });
  },
  /*文本域失去焦点事件*/
  TextAreaBlurs(type) {
    let returnVal = this.$refs[type].textAreaText;
    this.blurRequests({ inputValue: returnVal, key: type });
  },
  /*失去焦点请求*/
  blurRequests(obj) {
    if (obj.inputValue != "") {
      let url =
        "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderIntentionTableInfo";
      let data = {
        OrderId: this.orderId,
        Type: "ygyx",
        MessageKey: obj.key,
        MessageContent: obj.inputValue
      };
      this.$Axios({
        method: "POST",
        url: url,
        data: data,
        success(res) {
          // console.log(res)
        }
      });
    }
  },
  /*失去焦点请求*/
  blurRequest(obj) {
    if (obj.inputValue != "") {
      let url =
        "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderIntentionTableInfo";
      let data = {
        OrderId: this.orderId,
        Type: "yxb",
        MessageKey: obj.key,
        MessageContent: obj.inputValue
      };
      this.$Axios({
        method: "POST",
        url: url,
        data: data,
        success(res) {
          // console.log(res)
        }
      });
    }
  },
  /*获取订单状态*/
  getOrderState() {
    let url =
      "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetOrderStateByOrderId";
    let data = {
      OrderId: this.orderId
    };
    this.$Axios({
      method: "POST",
      url: url,
      data: data,
      success(res) {
        if (res.data.status) {
          if (res.data.data.OrderState == "0") {
            //0 待回馈订单  1拍摄待交接   2后期制作   3待审核  4退回   5待移交客户  6订单完成
            this.isReadonly = false;
          } else {
            this.isReadonly = true;
          }
        }
      }
    });
  },
  /*获取订单客户信息*/
  getOrderData() {
    let url =
      "/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderInfoByCustomerInfoList";
    let data = {
      OrderId: this.orderId
    };
    this.$Axios({
      method: "POST",
      url: url,
      data: data,
      success(res) {
        if (res.data.status) {
          for (let i = 0; i < 4; i++) {
            if (i == 0 && this.$refs.name1.inputValue != "") {
              continue;
            } else if (i == 1 && this.$refs.tel1.inputValue != "") {
              continue;
            } else if (i == 2 && this.$refs.name2.inputValue != "") {
              continue;
            } else if (i == 3 && this.$refs.tel2.inputValue != "") {
              continue;
            }
            this.setDefaultData(res.data.data, i);
          }
        }
      }
    });
  },
  /*将订单信息保存到后台*/
  setDefaultData(obj, index) {
    //index:0=客户1,1=客户1电话,2=客户2,3=客户2电话
    let url =
      "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/UpdateOrderIntentionTableInfo";
    let MessageKey;
    let MessageContent;
    if (obj.OrderType == 1) {
      if (index == 0) {
        MessageKey = "name1";
        MessageContent = obj.CustomerModel.XLName;
      } else if (index == 1) {
        MessageKey = "tel1";
        MessageContent = obj.CustomerModel.XLPhone;
      } else if (index == 2) {
        MessageKey = "name2";
        MessageContent = obj.CustomerModel.XNName;
      } else if (index == 3) {
        MessageKey = "tel2";
        MessageContent = obj.CustomerModel.XNPhone;
      }
    } else {
      if (index == 0) {
        MessageKey = "name1";
        MessageContent = obj.CustomerModel.CompanyName;
      } else if (index == 1) {
        MessageKey = "tel1";
        MessageContent = "";
      } else if (index == 2) {
        MessageKey = "name2";
        MessageContent = obj.CustomerModel.ContactName;
      } else if (index == 3) {
        MessageKey = "tel2";
        MessageContent = obj.CustomerModel.ContactPhone;
      }
    }

    let data = {
      OrderId: this.orderId,
      Type: "yxb",
      MessageKey: MessageKey,
      MessageContent: MessageContent
    };

    this.$Axios({
      method: "POST",
      url: url,
      data: data,
      success(res) {
        // console.log(res)
        this.getIntentionData();
      }
    });
  },
  /*获取意向表数据*/
  getIntentionData(type) {
    let url =
      "/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetOrderIntentionTableInfo";
    let data = {
      OrderId: this.orderId,
      Type: "yxb"
    };
    this.$Axios({
      method: "POST",
      url: url,
      data: data,
      success(res) {
        if (res.data.status) {
          this.flag = true;
          this.isShowLoading = false;
          if (type == 1) {
            this.getOrderData();
            this.getOrderState();
          }
          this.defaultData(res.data.data);
          console.log("意向表", res.data.data);
        }
      }
    });
  },
  /*进入页面默认数据*/
  defaultData(objArr) {
    objArr.forEach((item, index, arr) => {
      let key = arr[index].MessageKey;
      if (
        key == "bloodType1" ||
        key == "bloodType2" ||
        key == "xingZuo1" ||
        key == "xingZuo2"
      ) {
        // this.$refs[arr[index].MessageKey].dropSelectValue = parseInt(
        //   arr[index].MessageContent
        // );
      } else if (key == "orderTime") {
        this.$refs[arr[index].MessageKey].timeValue = arr[index].MessageContent;
      } else if (
        key == 1 ||
        key == 3 ||
        key == 4 ||
        key == 5 ||
        key == 7 ||
        key == 8
      ) {
        this.$refs[arr[index].MessageKey].textAreaText =
          arr[index].MessageContent;
      } else {
        if (this.$refs[arr[index].MessageKey].inputValue)
          this.$refs[arr[index].MessageKey].inputValue =
            arr[index].MessageContent;
      }
    });
  }
};
export default {
  name: "intentionTableDiaLog",
  props: ["showIntentionTableDiaLog", "intentionTableType", "isFormCalendar"],
  data() {
    return {
      /*血型*/
      bloodType: [
        { label: "A型", value: 1, type: "1" },
        { label: "B型", value: 2, type: "1" },
        { label: "AB型", value: 3, type: "1" },
        { label: "O型", value: 4, type: "1" },
        { label: "其他", value: 5, type: "1" }
      ],
      /*星座*/
      constellationData: [
        { label: "白羊座", value: 1, type: "2" },
        { label: "金牛座", value: 2, type: "2" },
        { label: "双子座", value: 3, type: "2" },
        { label: "巨蟹座", value: 4, type: "2" },
        { label: "狮子座", value: 5, type: "2" },
        { label: "室女座", value: 6, type: "2" },
        { label: "天秤座", value: 7, type: "2" },
        { label: "天蝎座", value: 8, type: "2" },
        { label: "人马座", value: 9, type: "2" },
        { label: "摩羯座", value: 10, type: "2" },
        { label: "宝瓶座", value: 11, type: "2" },
        { label: "双鱼座", value: 12, type: "2" }
      ],
      orderId: "",
      isReadonly: true,
      flag: true,
      isShowContent: true,
      isShowLoading: false,
      isShowQRCodeBox: false,
      QRCodeImgUrl: "",
      is_show: true //页面切换
    };
  },
  methods: myMethods,
  created() {},
  mounted() {}
};
</script>

<style scoped>
@import "../../../../static/css/commonDiaLogStyle.css";

.nav-build-item:after {
  content: "";
  display: inline-block;
  width: 50%;
  height: 2px;
  background: #5996f8;
  position: relative;
  top: -45px;
}

.nav-build-item {
  color: #5996f8;
}

.nav-build {
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 330px;
  position: relative;
  height: 60px;
}

.nav-build div {
  float: left;
  width: 100px;
  text-align: center;
  cursor: pointer;
  height: inherit;
}

/*======动画======*/
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}

>>> .intentionTableDiaLog .closeIcon {
  right: 40px;
  top: 28px;
}

.closeIcon {
  width: 18px;
  height: 18px;
  text-align: center;
  display: block;
  font-style: normal;
  position: absolute;
  right: 18px;
  top: 18px;
  cursor: pointer;
  z-index: 99988;
  box-sizing: border-box;
  transition: all 0.2s;
  background: url("../../../../static/img/common/close.png") no-repeat center;
}

.QR-code-box {
  width: 307px;
  height: 307px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 27px 0 rgba(0, 0, 0, 0.14);
  position: absolute;
  z-index: 999;
  top: 150px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  transform: translateX(-50%);
  padding: 45px 65px 85px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.QR-code-box .close {
  width: 20px;
  height: 20px;
  position: absolute;
  background: url("../../../../static/img/common/close.png") no-repeat center
    center;
  right: 20px;
  top: 20px;
  cursor: pointer;
}

.QR-code-box img {
  width: 100%;
  height: 100%;
}

.QR-code-box p {
  color: #808080;
  font-size: 14px;
  margin-top: 20px;
}

/*新增酒店弹框样式*/
.commonBox {
  display: inline-block;
  width: 200px;
  height: 32px;
}

>>> .intentionTableDiaLog {
  width: 900px;
  height: 90%;
}

>>> .intentionTableDiaLog .el-dialog__header {
  height: 60px;
  line-height: 60px;
}

>>> .intentionTableDiaLog .el-dialog__body {
  height: 80%;
}

/*内容区*/
#intentionTable {
  overflow: auto;
  height: 100%;
}

#intentionTable .timeSelectStyle1 >>> .el-input__icon {
  line-height: 36px !important;
}

/*悬浮图标样式*/
.iconBox {
  width: 124px;
  height: 272px;
  position: absolute;
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
  background: url("../../../../static/img/order/smallRoutineIcon1.png")
    no-repeat center center;
  background-size: 100%;
}

.printingIcon {
  background: url("../../../../static/img/order/printingIcon1.png") no-repeat
    center center;
  background-size: 100%;
}

.smallRoutineIcon:hover {
  background: url("../../../../static/img/order/smallRoutineIcon2.png")
    no-repeat center center;
}

.printingIcon:hover {
  background: url("../../../../static/img/order/printingIcon2.png") no-repeat
    center center;
}

/*===客户一信息===*/
.commonLeftBox {
  float: left;
}

.commonRightBox {
  float: right;
}

.section {
  padding: 50px 60px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.section ul li .title {
  color: #4c4c4c;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
}

.section ul li dl {
  padding: 22px 55px 30px;
}

.section ul li dd .label {
  color: #808080;
  font-size: 14px;
}

.section ul li dd .label .spacing {
  width: 28px;
  display: inline-block;
}

.section ul li dd {
  margin-bottom: 20px;
}

.section ul li dd .formBox {
  width: 230px;
  height: 36px;
  display: inline-block;
}

.otherItems dl dd .title {
  color: #808080;
  font-size: 14px;
  font-weight: 400;
}

.otherItems dl dd .textAreaBox {
  width: 100%;
  height: 126px;
  margin-top: 15px;
}

.ddBlock {
  height: 50px;
  display: none;
}

.footer button {
  cursor: pointer;
}

@media print {
  .section {
    padding: 50px 30px;
    width: 900px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .iconBox {
    display: none;
  }

  .footer button {
    display: none;
  }

  .ddBlock {
    display: block;
  }
}

.footer {
  text-align: center;
}

.footer button {
  width: 136px;
  height: 50px;
  background: rgba(89, 150, 248, 1);
  border-radius: 10px;
  outline: none;
  border: 0;
  color: #fff;
  font-size: 16px;
}
</style>
