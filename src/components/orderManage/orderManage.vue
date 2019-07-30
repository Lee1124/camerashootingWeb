<!--订单管理-->
<template>
  <div id="orderManage" ref="orderManageHeight">
    <div class="orderManage-hd" ref="orderManageHd" v-show="orderManageHd">
      <div class="orderManage-nav">
        <orderNav ref="orderNav"></orderNav>
      </div>
      <div class="orderManage-search">
        <div class="searchBox clearfloat">
          <selectTime @getStartTime="getStartTime" @getEndTime="getEndTime" num="30" class="floatL"
                      ref="childSelectTime" v-show="isShowTimeSearch"></selectTime>
          <inputSelect class="floatL" :isShowInputSearch="isShowInputSearch" ref="inputSelectSearch"></inputSelect>
        </div>
        <span class="checkBox">
            <el-checkbox v-model="todayArrangeChecked" v-if="isShowChecked">显示已安排订单</el-checkbox>
        </span>
      </div>
    </div>
    <div class="orderManage-ct" ref="orderManageCt"><!-- v-loading="isShowMyLoading"-->
      <keep-alive>
        <router-view ref="ourOrderRouterView"></router-view>
      </keep-alive>
    </div>
    <!--其他公用-->
    <commonDiaLog :commonDiaLogObj="commonDiaLogObj">
      <template slot="commonDiaLog">
        <!--类型-->
        <div class="selectType">
          <div class="weddingShot">
            <button @click="selectThisType(1)">婚礼拍摄</button>
          </div>
          <div class="businessShot">
            <button @click="selectThisType(2)">活动拍摄</button>
          </div>
        </div>
        <!--/类型-->
      </template>
    </commonDiaLog>

    <!--新增订单第二步-->
    <addOrderStep2DiaLog :showAddOrderStep2DiaLog="showAddOrderStep2DiaLog" ref="addOrderStep2DiaLog" type="add"></addOrderStep2DiaLog>
    <!--新增婚礼订单下一步-->
    <addOrderStep3_1DiaLog :showAddOrderStep3DiaLog="showAddOrderStep3_1DiaLog" type="add"></addOrderStep3_1DiaLog>
    <!--新增活动订单下一步-->
    <addOrderStep3_2DiaLog :showAddOrderStep3DiaLog="showAddOrderStep3_2DiaLog" type="add"></addOrderStep3_2DiaLog>
    <!--新增订单成功-->
    <addOrderSuccessDiaLog :showAddOrderSuccessDiaLog="showAddOrderSuccessDiaLog"></addOrderSuccessDiaLog>
    <!--&lt;!&ndash;新增酒店&ndash;&gt;-->
    <!--<addHotelDiaLog :showAddHotelDiaLog="showAddHotelDiaLog" ref="addHotelDiaLog"></addHotelDiaLog>-->

    <!--订单详情页面-->
    <transition name="slide-fade">
      <div class="orderDetailsPage" v-if="isShowOrderDetailsPage">
        <orderDetailsPage ref="orderDetailsPage"></orderDetailsPage>
      </div>
    </transition>


    <!--客户意向表-->
    <intentionTablePage :showIntentionTableDiaLog="showIntentionTableDiaLog"
                        :intentionTableType="intentionTableType"></intentionTablePage>
    <!--回馈表-->
    <feedbackTablePage :showFeedbackTableDiaLog="showFeedbackTableDiaLog"
                       :showFeedbackTableType="showFeedbackTableType"></feedbackTablePage>

    <!--表格中的弹框-->

    <!--上传初稿/审核-->
    <uploadVideoPage :showUploadVideoDiaLog="showUploadVideoDiaLog" :myType="myType"
                     :showUpVideoAddress="showUpVideoAddress"></uploadVideoPage>
    <!--邮寄碟片-->
    <sendDiscPage :showSendDiscDiaLog="showSendDiscDiaLog" :showSendDiscAddress="showSendDiscAddress"></sendDiscPage>
  </div>
</template>

<script>
  import selectTime from '../common/selectTime/selectTime';
  import inputSelect from '../common/inputSelect/inputSelect';
  import orderNav from './orderNav/orderNav';
  import commonDiaLog from '../orderManage/diaLog/commonDiaLog';
  import addOrderStep2DiaLog from '../orderManage/diaLog/addOrderStep2DiaLog';
  import addOrderStep3_1DiaLog from './diaLog/addOrderStep3-1DiaLog';
  import addOrderStep3_2DiaLog from './diaLog/addOrderStep3-2DiaLog';
  import addOrderSuccessDiaLog from '../orderManage/diaLog/addOrderSuccessDiaLog';
  // import addHotelDiaLog from '../orderManage/diaLog/addHotelDiaLog';

  import orderDetailsPage from '../orderManage/pages/orderManage-details';
  import intentionTablePage from '../orderManage/diaLog/orderIntentionTableDiaLog';//客户意向表
  import feedbackTablePage from '../orderManage/diaLog/orderFeedbackTableDiaLog';//回馈表
  import uploadVideoPage from '../orderManage/diaLog/uploadVideoDiaLog';//上传初稿
  import sendDiscPage from '../orderManage/diaLog/sendDiscDiaLog';//邮寄碟片

  /*数据*/
  let dataObj = {
    menuId: '',
    isShowTimeSearch: true,//是否显示时间搜索
    isShowChecked: false,//显示已安排订单
    todayArrangeChecked: false,//显示已安排订单
    /*新增订单第二步*/
    showAddOrderStep2DiaLog: false,
    /*新增婚礼订单下一步*/
    showAddOrderStep3_1DiaLog: false,
    /*新增活动订单下一步*/
    showAddOrderStep3_2DiaLog: false,
    /*成功界面*/
    showAddOrderSuccessDiaLog: false,
    // /*新增酒店界面*/
    // showAddHotelDiaLog: true,


    /*===客户意向表===*/
    showIntentionTableDiaLog: false,
    intentionTableType: 0,
    /*===回馈表===*/
    showFeedbackTableDiaLog: false,
    showFeedbackTableType: 0,

    /*===邮寄碟片===*/
    showSendDiscDiaLog: false,
    showSendDiscAddress: 0,
    /*===上传初稿===*/
    showUploadVideoDiaLog: false,
    myType: '',
    showUpVideoAddress: 0,

    /*加载图标*/
    isShowMyLoading: false,

    isShowOrderDetailsPage: false,

    orderManageHd: true,
    isAddNewOrderSuccess: false,//显示新增订单成功
    checked: true,
    commonDiaLogObj: {
      showDiaLog: false,
      isShowBtn1: false,
      isShowBtn2: false,
      title: '选择新增订单类型',
      btn1Text: '',
      btn2Text: '',
      type: 'addNewOrder',
      className: 'commonDiaLog addNewOrderDiaLogSelectType'
    },
    selectedTypeId: '',//选择增加的类型
    orderId: '',//添加成功后生成的orderId
    searchStartTime: '',//查询开始时间
    searchEndTime: '',//查询结束时间

    /*点开订单详情保存的该行的信息*/
    orderDetailsRowObj: {},
    isShowInputSearch: true,//是否显示高级查询

  };
  /*方法*/
  let myMethods = {
    /*刷新表格中1的数据*/
    reloadOrderData1() {
      this.$refs.ourOrderRouterView.getOrderData();
    },
    /*刷新表格中2的数据*/
    reloadOrderData2() {
      this.$refs.ourOrderRouterView.getOrderData2();
    },
    //开始时间修改查询
    getStartTime(val) {
      this.$refs.ourOrderRouterView.getSearchTime(1);
    },
    //截止时间修改查询
    getEndTime(val) {
      this.$refs.ourOrderRouterView.getSearchTime(1);
    },
    //设置订单查询时间并请求第一次数据
    setOrderTime() {
      this.searchStartTime = this.$refs.childSelectTime.value1;
      this.searchEndTime = this.$refs.childSelectTime.value2;
      this.requestData();
    },
    //请求数据
    requestData() {
      // this.$refs.ourOrderRouterView.tableData = [];
      // let data = {
      //   startTime: this.searchStartTime,
      //   endTime: this.searchEndTime,
      // };
      // this.$refs.ourOrderRouterView.getOrderData(data);
    },
    //打开成功界面
    openSuccessDiaLog() {
      this.showAddOrderSuccessDiaLog = true;
      this.showAddOrderStep2DiaLog = false;
      this.showAddOrderStep3_1DiaLog = false;
      this.showAddOrderStep3_2DiaLog = false;
    },
    //上一步
    openPrevStep() {
      this.showAddOrderStep2DiaLog = true;
      this.showAddOrderStep3_1DiaLog = false;
      this.showAddOrderStep3_2DiaLog = false;
    },
    //打开新增婚礼订单下一步
    openAddNewOrderNext() {
      this.showAddOrderStep3_1DiaLog = true;
    },
    //打开新增活动订单下一步
    openAddNewOrderNext2() {
      this.showAddOrderStep3_2DiaLog = true;
    },
    //打开新增弹框
    openDiaLog(type) {
      this.commonDiaLogObj.showDiaLog = true;
    },
    //关闭弹框
    closeDialog(type, dataObj) {
      if (type == 'addHotel') {
        // this.showAddHotelDiaLog = false;
      } else {
        this.commonDiaLogObj.showDiaLog = false;
        this.showAddOrderStep2DiaLog = false;
        this.showAddOrderStep3_1DiaLog = false;
        this.showAddOrderStep3_2DiaLog = false;
        this.showAddOrderSuccessDiaLog = false;
      }
      if (type == 'orderStep3DiaLog' || type == 'update') {
        if (this.menuId == 5) {
          this.$refs.ourOrderRouterView.getOrderData();
        } else {
          this.$refs.ourOrderRouterView.getOrderData2();
        }
      }

      this.showIntentionTableDiaLog = false;//关闭客户意向表
      this.showFeedbackTableDiaLog = false;//关闭回馈表
      this.showUploadVideoDiaLog = false;//关闭上传初稿弹框
      this.showSendDiscDiaLog = false;//关闭邮寄碟片弹框
    },

    //初始化弹框
    reloadDiaLog() {
      this.commonDiaLogObj.showDiaLog = false;
      this.showAddOrderStep2DiaLog = false;
      this.showAddOrderStep3_1DiaLog = false;
      this.showAddOrderStep3_2DiaLog = false;
      this.showAddOrderSuccessDiaLog = false;
      this.showIntentionTableDiaLog = false;//关闭客户意向表
      this.showFeedbackTableDiaLog = false;//关闭回馈表
      this.showUploadVideoDiaLog = false;//关闭上传初稿弹框
      this.showSendDiscDiaLog = false;//关闭邮寄碟片弹框
      setTimeout(()=>{
        this.$refs.addOrderStep2DiaLog.showHotelOrHQDetailsDiaLog=false;
        this.$refs.addOrderStep2DiaLog.showAddHotelDiaLog=false;
        this.$refs.addOrderStep2DiaLog.showAddWeddingCompanyDiaLog=false;

      })
    },
    //选择类型进行跳转
    selectThisType(typeVal) {
      this.$store.commit('keepOrderType',typeVal);
      this.selectedTypeId = typeVal;
      this.isShowSelectType = false;
      this.commonDiaLogObj.showDiaLog = false;
      this.showAddOrderStep2DiaLog = true;
    },
    //设置订单内容区的高度
    setOrderManageCtStyle() {
      let $height = $(this.$refs.orderManageHd).outerHeight() + 'px';
      $(this.$refs.orderManageCt).css({
        height: 'calc(100% - ' + $height + ')',
      })
    },
    //根据是否显示订单安排进行筛选数据
    filterTableData(type) {
      if (this.menuId == 8) {
        if (type) {
          let url='/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraOrderInfoListByMenuId';
          let data={
            MenuId:this.menuId,
            StartTime:'',
            EndTime:'',
            IsShowYAP:type,
          };
          this.$Axios({
            method:'POST',
            url:url,
            data:data,
            success(res){
              // console.log(res)
              if (res.data.status){
                this.$refs.ourOrderRouterView.tableData=res.data.data;
                this.$refs.ourOrderRouterView.tableArr=res.data.data;
              }
            }
          })
        } else {
          this.$refs.ourOrderRouterView.tableData = this.$refs.ourOrderRouterView.tableData2.data;
          this.$refs.ourOrderRouterView.tableArr = this.$refs.ourOrderRouterView.tableData2.data;
        }
      } else if (this.menuId == 21) {
        if (type) {
          let url='/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraOrderInfoListByMenuId';
          let data={
            MenuId:this.menuId,
            StartTime:'',
            EndTime:'',
            IsShowYAP:type,
          };
          this.$Axios({
            method:'POST',
            url:url,
            data:data,
            success(res){
              // console.log(res)
              if (res.data.status){
                this.$refs.ourOrderRouterView.tableData=res.data.data;
                this.$refs.ourOrderRouterView.tableArr=res.data.data;
              }
            }
          });
        } else {
          this.$refs.ourOrderRouterView.tableData = this.$refs.ourOrderRouterView.tableData2.data;
          this.$refs.ourOrderRouterView.tableArr = this.$refs.ourOrderRouterView.tableData2.data;
        }
      }
    },
    //判断路由
    getRouter() {
      let $path = this.$route.path;
      this.menuId = this.$route.query.id;//菜单Id
      if (this.menuId == undefined) {
        this.$router.push({path: '/orderManage/orderManageOurShop?id=5&&no=2'})
      }
      if (this.menuId == 5) {
        this.isShowTimeSearch = true;
        this.isShowInputSearch = true;
      } else {
        this.isShowTimeSearch = false;
        this.isShowInputSearch = false;
      }
      if (this.menuId == 8 || this.menuId == 21) {
        this.isShowChecked = true;//显示已安排订单
      } else {
        this.isShowChecked = false;//显示已安排订单
      }
    },

  };
  export default {
    name: "orderManage",
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
      this.reloadDiaLog();//初始化弹框
      this.getRouter();
      // document.title = '订单管理';
    },
    mounted() {
      this.setOrderManageCtStyle();
      setTimeout(() => {
        // this.setOrderTime();
      })
    },
    updated() {
      this.setOrderManageCtStyle();
    },
    components: {
      selectTime: selectTime,
      inputSelect: inputSelect,
      orderNav: orderNav,
      commonDiaLog: commonDiaLog,
      addOrderStep2DiaLog: addOrderStep2DiaLog,
      addOrderStep3_1DiaLog: addOrderStep3_1DiaLog,
      addOrderStep3_2DiaLog: addOrderStep3_2DiaLog,
      addOrderSuccessDiaLog: addOrderSuccessDiaLog,
      // addHotelDiaLog: addHotelDiaLog,
      orderDetailsPage: orderDetailsPage,
      uploadVideoPage: uploadVideoPage,//上传初稿
      sendDiscPage: sendDiscPage,//邮寄碟片
      intentionTablePage: intentionTablePage,//客户意向表
      feedbackTablePage: feedbackTablePage,//回馈表
    },
    watch: {
      $route(to, from) {
        this.reloadDiaLog();//初始化弹框
        this.todayArrangeChecked = false;
        this.menuId = this.$route.query.id;//菜单Id
        if (this.menuId == undefined) {
          this.$router.push({path: '/orderManage/orderManageOurShop?id=5&&no=2'})
        }
        if (this.menuId == 5) {
          this.isShowTimeSearch = true;
          this.isShowInputSearch = true;
        } else {
          this.isShowTimeSearch = false;
          this.isShowInputSearch = false;
        }

        if (this.menuId == 6) {
          this.isShowSearch = false;
        } else {
          this.isShowSearch = true;
          this.orderManageHd = true;
        }

        if (this.menuId == 8 || this.menuId == 21) {
          this.isShowChecked = true;//显示已安排订单
        } else {
          this.isShowChecked = false;//显示已安排订单
        }
      },
      todayArrangeChecked(val) {
        this.filterTableData(val);
      }
    }
  }
</script>

<style scoped>
  #selectTime {
    margin-right: 25px !important;
  }

  #orderManage {
    height: 100%;
    /*position: absolute;*/
    /*bottom: 0;*/
  }

  .orderManage-hd {
    /*height: 20%;*/
    padding: 2.2% 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
  }

  .orderManage-ct {
    padding: 30px 35px 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .orderManage-nav {
    height: 35px;
  }

  .orderManage-search {
    height: 32px;
    margin-top: 2%;
    position: relative;
  }

  .searchBox {
    position: absolute;
    bottom: 0;
  }

  /*选择类型样式*/
  >>> .addNewOrderDiaLogSelectType .el-dialog__wrapper {
    overflow: hidden;
  }

  >>> .addNewOrderDiaLogSelectType .el-dialog__body {
    height: 90%;
  }

  >>> .addNewOrderDiaLogSelectType .content {
    height: 100%;
  }

  .selectType {
    height: 100%;
  }

  .selectType .weddingShot, .selectType .businessShot {
    height: 50%;
    position: relative;
  }

  .selectType button {
    width: 65%;
    height: 45%;
    background: #E4EEFF;
    border-radius: 35px;
    border: 0;
    outline: none;
    font-size: 18px;
    color: #5996F8;
    position: absolute;
    top: 60%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all .2s;
  }
  @media (max-width: 1600px) {
    .selectType button {
      font-size: 15px;
    }
  }

  .selectType .weddingShot button {
    top: 70%;
  }

  .selectType button:hover {
    background: #5996F8;
    color: #fff;
  }

  /*新增订单选择类型样式*/
  >>> .addNewOrderDiaLogSelectType {
    width: 36%;
    height: 50%;
    padding: 40px;
  }

  >>> .addNewOrderDiaLogSelectType .el-dialog__header .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .addNewOrderDiaLogSelectType .el-dialog__footer .el-button {
    padding: 0;
    width: 140px;
    height: 42px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
  }

  >>> .addNewOrderDiaLogSelectType .el-dialog__footer .el-button:hover {
    background: rgba(89, 150, 248, .9);
  }

  /*订单详情页面*/
  .orderDetailsPage {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #F6F6F6;
    z-index: 998;
  }

  >>> .el-loading-mask {
    z-index: 997;
  }

  .checkBox {
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 325px;
  }

  .checkBox >>> .el-checkbox__inner {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    text-align: center;
    line-height: 22px;
  }

  .checkBox >>> .el-checkbox__label {
    color: #B2B2B2;
  }

  .checkBox >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409EFF;
  }

  .checkBox >>> .el-checkbox__inner::after {
    left: 9px;
    top: 5px;
    -webkit-transform: rotate(45deg) scale(1.2);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg) scale(1.2);
  }

  .checkBox >>> .el-checkbox__input {
    margin-top: -2px;
  }

  /*======动画======*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

</style>


