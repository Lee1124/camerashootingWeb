<!--新增订单第2步-->
<!--人员管理查看界面-->
<template>
  <div id="addOrderStep2DiaLog">
    <el-dialog
      :title="addTitle"
      :visible.sync="showAddOrderStep2DiaLog"
      custom-class="commonDiaLog addOrderStep2DiaLog"
      :modal="false"
      :before-close="closeBefore"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="closeTip"></i>
      <div class="content addNewOrder" v-show="isShowContent">
        <!--新增订单-->
        <div class="title"><span>基本信息</span></div>
        <ul class="form commonScrollStyle">
          <li class="form-inner">
            <div class="formLeft" v-if="this.orderType==1">
              <label>日<span style="display: inline-block;width: 28px;"></span>期：</label>
              <div class="commonBox" style="width: 250px;">
                <div class="timeSelect1">
                  <timeSelect1 ref="selectTimeChild" timePlaceholderText="请选择时间"></timeSelect1>
                </div>
                <div class="timeSelect2">
                  <dropSelect1 @clearDropVal="clearDropVal_time" @selectBoxVisible="selectBoxVisible"
                               :options="timeOptions"
                               ref="dropSelectChild_time"
                               dropSelect1Placeholder="请选择"></dropSelect1>
                </div>
              </div>
            </div>

            <div class="formLeft" v-if="this.orderType==2"><!--活动拍摄-->
              <label>拍摄日期：</label>
              <div class="commonBox">
                <div class="timeSelect1" style="width: auto;">
                  <timeSelect1 ref="selectTimeChild_startTime" timePlaceholderText="请选择拍摄日期"></timeSelect1>
                </div>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==1">
              <label>城<span style="display: inline-block;width: 28px;"></span>市：</label>
              <div class="commonBox">
                <inputSearch :listData="cityData" @inputFocus="getCityNews" ref="childInputSearch_city"
                             inputSearchPlaceholder="请选择城市" @createNewContent="handlerCity_new"></inputSearch>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==2"><!--活动拍摄-->
              <label>结束日期：</label>
              <div class="commonBox">
                <div class="timeSelect1" style="width: 200px;">
                  <timeSelect1 ref="selectTimeChild_endTime" timePlaceholderText="请选择结束日期"></timeSelect1>
                </div>
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft" v-if="this.orderType==1"><!--婚礼拍摄-->
              <label>酒<span style="display: inline-block;width: 28px;"></span>店：</label>
              <div class="commonBox">
                <inputSearch2 @inputFocus="getHotelData" @createNewContent="createNewContent"
                              ref="childInputSearch_hotel" @changeValue="changeValue_hotel"
                              :listData="hotelListData" :isReadonly="false" inputSearchPlaceholder=" 请选择酒店
                "></inputSearch2>
                <div class="tip">
                  <el-button title="选择酒店点击查看详情" @click="openDetails('showHotelOrHQDetailsDiaLog','hotel')">!</el-button>
                </div>
              </div>
            </div>
            <div class="formLeft" v-if="this.orderType==2"><!--活动拍摄-->
              <label>城<span style="display: inline-block;width: 28px;"></span>市：</label>
              <div class="commonBox">
                <inputSearch :listData="cityData" @inputFocus="getCityNews" ref="childInputSearch_city"
                             inputSearchPlaceholder="请选择城市" @createNewContent="handlerCity_new"></inputSearch>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==1"><!--婚礼拍摄-->
              <label>宴<span style="display: inline-block;width: 7px;"></span>会<span
                style="display: inline-block;width: 7px;"></span>厅：</label>
              <div class="commonBox">
                <commonInput :isReadonly="false" ref="inputChild_hotel" inputPlaceholderText="请输入宴会厅"></commonInput>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==2"><!--活动拍摄-->
              <label>拍摄地点：</label>
              <div class="commonBox">
                <commonInput :isReadonly="false" ref="inputChild_shotAddress"
                             inputPlaceholderText="请输入拍摄地点"></commonInput>
              </div>
            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>项<span style="display: inline-block;width: 28px;"></span>目：</label>
              <div class="commonBox">
                <dropSelect1 @selectBoxVisible="selectBoxVisible" :options="xmOptions"
                             @changeDropSelect="changeDropSelect_xm" ref="dropSelectChild_xm"
                             @clearDropVal="clearDropVal_xm"
                             dropSelect1Placeholder="请选择项目"></dropSelect1>
              </div>
              <div class="tip">
                <el-tooltip popper-class="orderTips" class="item" effect="dark" :content="XMObj.remark"
                            placement="top">
                  <el-button>!</el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==1"><!--婚礼拍摄-->
              <label>婚<span style="display: inline-block;width: 28px;"></span>庆：</label>
              <div class="commonBox">
                <inputSearch2 @inputFocus="getHQData" ref="childInputSearch_HQ" @createNewContent="createNewContent_HQ"
                              @changeValue="changeValue_HQ" :listData="hqOptions" inputSearchPlaceholder="请选择婚庆
                "></inputSearch2>

              </div>
              <div class="tip">
                <el-button title="选择婚庆点击查看详情" @click="openDetails('showHotelOrHQDetailsDiaLog','HQ')">!</el-button>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==2"><!--活动拍摄-->
              <label>是否加急：</label>
              <div class="commonBox">
                <dropSelect1 @selectBoxVisible="selectBoxVisible" :options="fastOptions" ref="dropSelectChild_fast"
                             @clearDropVal="clearDropVal_fast"
                             dropSelect1Placeholder="订单是否加急"></dropSelect1>
              </div>

            </div>
          </li>
          <li class="form-inner">
            <div class="formLeft">
              <label>金<span style="display: inline-block;width: 28px;"></span>额：</label>
              <div class="commonBox">
                <commonInput :isReadonly="false" ref="inputChild_price" inputPlaceholderText="请输入金额"></commonInput>
              </div>
              <div class="tip">
                <el-tooltip popper-class="orderTips" class="item" effect="dark" content="'金额'确认后修改需要权限"
                            placement="top">
                  <el-button>!</el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="formRight" v-if="this.orderType==1">
              <label>是否加急：</label>
              <div class="commonBox">
                <dropSelect1 @selectBoxVisible="selectBoxVisible" :options="fastOptions" ref="dropSelectChild_fast"
                             @clearDropVal="clearDropVal_fast"
                             dropSelect1Placeholder="订单是否加急"></dropSelect1>
              </div>

            </div>
          </li>
          <!--附加项目-->
          <li class="form-inner" style="min-height: 32px;height: auto;">
            <div class="formLeft">
              <label>附<span style="display: inline-block;width: 28px;"></span>加：</label>
              <div class="commonBox fuJiaBox">
                <dropMoreSelect :selectList="selectList" @changeTagsValue="changeFuJiaXMValue"
                                ref="fuJiaTags"></dropMoreSelect>
              </div>
            </div>
          </li>
          <li class="form-inner" style="min-height: 32px;height: auto;align-items:flex-start;text-align:left;">
            <label style="width: 72px;vertical-align: top;display: inline-block;">来<span
              style="display: inline-block;width: 28px;"></span>源：</label>
            <span class="checkBox" style="width: 90%;display: inline-block;">
            <template v-for="(items,index) in sourceData">
            <el-checkbox v-model="items.isChecked" v-cloak>{{items.Name}}</el-checkbox>
            </template>
        </span>
          </li>
          <li class="form-inner textAreaLi">
            <div class="textAreaBox">
              <textArea ref="textAreaChildText" textAreaPlaceholderText="请输入来源说明"></textArea>
            </div>
          </li>

        </ul>
        <!--/新增订单-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTip" v-if="type=='update'">取 消</el-button>
        <el-button type="primary" @click="openAddNewOrderNext(type)" :class="{addBtn:type=='add'}" v-if="type=='add'">下一步</el-button>
        <el-button type="primary" @click="openAddNewOrderNext(type)" v-if="type=='update'">确 认</el-button>
      </span>
    </el-dialog>

    <!--新增酒店-->
    <addHotelDiaLog :showAddHotelDiaLog="showAddHotelDiaLog" ref="addHotelDiaLog"></addHotelDiaLog>
    <!--新增婚庆-->
    <createNewContent_HQ :showAddWeddingCompanyDiaLog="showAddWeddingCompanyDiaLog"
                         ref="addWeddingCompanyDiaLog"></createNewContent_HQ>

    <!--酒店/婚庆详情-->
    <!--<hotelDetails :showHotelOrHQDetailsDiaLog="showHotelOrHQDetailsDiaLog" :myType="myType"-->
    <!--:hotelDetailsArr="hotelDetailsArr" :HQDetailsArr="HQDetailsArr"></hotelDetails>-->
    <hotelDetails :showHotelOrHQDetailsDiaLog="showHotelOrHQDetailsDiaLog" :hotelOrHQObj="hotelOrHQObj"></hotelDetails>

    <!--新增城市-->
    <addCity :add_City="add_City"></addCity>
  </div>
</template>

<script>
  import addHotelDiaLog from '../diaLog/addHotelDiaLog';
  import createNewContent_HQ from '../diaLog/addWeddingCompanyDiaLog'
  import hotelDetails from './hotelOrHQDetails';//酒店详情
  import addCity from './addCity_DiaLog'
  /*数据*/
  let dataObj = {
    showHotelOrHQDetailsDiaLog: false,
    isShowContent: true,
    /*时间（早中晚）*/
    timeOptions: [
      {label: '全天', value: 1},
      {label: '早宴', value: 2},
      {label: '午宴', value: 3},
      {label: '晚宴', value: 4}
    ],
    /*来源多选数据*/
    sourceData: [
      // {Id: 2, Name: "微信咨询", ParentId: 1, BranchId: 1, Remark: "", ImgUrl: "",isChecked:false},
    ],
    /*酒店列表数据*/
    hotelListData: [],
    hotelInputText: '',
    HQInputText: '',
    /*城市数据*/
    cityData: [],
    /*项目信息*/
    xmOptions: [],
    /*附加项目*/
    selectList: [],
    selectFJXMStr: '',//附加项目
    XMObj: {
      remark: '暂无项目说明',
    },
    /*是否加急*/
    fastOptions: [
      {label: '是', value: true},
      {label: '否', value: false},
    ],
    /*婚庆类型数据*/
    hqOptions: [],
    /*新增酒店界面*/
    showAddHotelDiaLog: false,
    /*添加成功后保存订单orderId*/
    showAddWeddingCompanyDiaLog: false,
    orderId: '',
    addTitle: '新增订单',
    baseInformation: {},//编辑时保存的数据
    selectedTypeId: '',//订单类型(婚庆/活动)
    flag: true,//限流
    hotelDetailsArr: [],
    HQDetailsArr: [],
    myType: 0,
    add_City: {
      visible: false,
      val: ''
    },      //新增城市
    hotelOrHQObj: {},
    orderType: 0,
    ProjectAmount: '',
    FJProjectAmount:0,
  };
  /*方法*/
  let myMethods = {
    /*提示*/
    showTip(msg, type = 'error') {
      this.$message({
        message: msg + '!',
        customClass: 'msgTips',
        type: type
      });
    },
    /*附加项目*/
    changeFuJiaXMValue(obj) {
      this.$refs.inputChild_price.inputValue = this.FJProjectAmount;
      this.FJProjectAmount = obj.ProjectAmount;
      this.selectFJXMStr = obj.strVal;
      if (obj.ProjectAmount != 0) {
        this.$refs.inputChild_price.inputValue = Number(this.ProjectAmount) + obj.ProjectAmount;
      } else {
        this.FJProjectAmount = '';
        if (this.ProjectAmount == '') {
          this.$refs.inputChild_price.inputValue = '';
        } else {
          this.$refs.inputChild_price.inputValue = Number(this.ProjectAmount) + '';
        }
      }
    },
    //城市创建
    handlerCity_new() {
      this.add_City = {
        visible: true,
        callblck: this.handlerAdd_Citys
      }
    },
    //确认创建城市
    handlerAdd_Citys() {
      let CityName = this.add_City.val;
      this.$Axios({
        method: 'POST',
        url: '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/InsCity',
        data: {
          CityName
        },
        success(res) {
          if (res.data.status) {
            this.$tips('新增成功')
            this.$refs.childInputSearch_city.inputValue = CityName
            this.$refs.childInputSearch_city.isSelectedItemObj = [{
              id: res.data.CityId,
              name: CityName
            }]
          } else {
            this.$warning('添加失败')
          }
          this.add_City.visible = false
        }
      })
    },
    closeTip() {
      this.$parent.closeDialog('baseNew');
    },
    closeDialog(type, resData) {
      this.showHotelOrHQDetailsDiaLog = false;
      this.showAddHotelDiaLog = false;
      this.showAddWeddingCompanyDiaLog = false;
      if (type == 'addHotel' && resData.HotelName != undefined) {
        resData.id = resData.HotelId;
        if (this.$refs.childInputSearch_hotel != undefined) {
          this.$refs.childInputSearch_hotel.inputValue = resData.HotelName;
          this.$refs.childInputSearch_hotel.isSelectedItemObj = [resData];
          this.hotelDetailsArr = [resData];
        } else {
          this.$parent.$refs.orderDetailsPage.$refs.editPersonManagePage.$refs.childInputSearch_hotel.inputValue = resData.HotelName;
          this.$parent.$refs.orderDetailsPage.$refs.editPersonManagePage.$refs.childInputSearch_hotel.isSelectedItemObj = [resData];
          this.hotelDetailsArr = [resData];
        }

      } else if (type == 'addHQ' && resData.WeddingName != undefined) {
        resData.id = resData.WeddingId;
        if (this.$refs.childInputSearch_HQ != undefined) {
          this.$refs.childInputSearch_HQ.inputValue = resData.WeddingName;
          this.$refs.childInputSearch_HQ.isSelectedItemObj = [resData];
          this.HQDetailsArr = [resData];
        } else {
          this.$parent.$refs.orderDetailsPage.$refs.editPersonManagePage.$refs.childInputSearch_HQ.inputValue = resData.WeddingName;
          this.$parent.$refs.orderDetailsPage.$refs.editPersonManagePage.$refs.childInputSearch_HQ.isSelectedItemObj = [resData];
          this.HQDetailsArr = [resData];
        }
      }

    },
    closeBefore() {
      this.$parent.closeDialog();
    },
    //打开时回调
    openEvent() {
      this.orderType = this.$store.state.orderType;
      this.selectFJXMStr = '';
      this.XMObj.remark = '暂无项目说明';
      this.isShowContent = false;
      this.orderId = '';
      this.flag = true;
      this.getSourceData();//获取来源信息
      this.getXMData();//获取项目信息
      setTimeout(() => {
        this.clearOldData(this.type);//清除所有缓存数据
      })
    },
    openedEvent() {
      if (this.orderType == 1) {
        /*将搜索查询的列表重置初始状态*/
        this.$refs.childInputSearch_city.isShowList = false;
        this.$refs.childInputSearch_hotel.isShowList = false;
        this.$refs.childInputSearch_HQ.isShowList = false;
      }

      this.isShowContent = true;
    },


    //下拉选择触发事件
    changeDropSelect_xm(XMArrObj) {
      if (XMArrObj.length == 0) {
        this.XMObj.remark = '暂无项目说明';
        this.$refs.inputChild_price.inputValue = this.FJProjectAmount;
        this.ProjectAmount = '';
      } else {
        this.ProjectAmount = XMArrObj[0].ProjectAmount;
        this.$refs.inputChild_price.inputValue = Number(this.ProjectAmount) + this.FJProjectAmount;
        this.XMObj.remark = XMArrObj[0].Remark;
      }
    },

    /*清除下拉选择的值*/
    clearDropVal_time(val) {
      if (val == '') {
        this.$refs.dropSelectChild_time.dropSelectObj = [];
      }
    },
    /*清除下拉选择的值*/
    clearDropVal_xm(val) {
      if (val == '') {
        this.$refs.dropSelectChild_xm.dropSelectObj = [];
      }
    },
    /*清除下拉选择的值*/
    clearDropVal_fast(val) {
      if (val == '') {
        this.$refs.dropSelectChild_fast.dropSelectObj = [];
      }
    },
    /*下拉框显示时候*/
    selectBoxVisible(val) {
      if (val) {
        this.$refs.childInputSearch_city.isShowList = false;
        if (this.orderType == 1) {
          this.$refs.childInputSearch_hotel.isShowList = false;
          this.$refs.childInputSearch_HQ.isShowList = false;
        }
      }
    },
    /*打开酒店和婚庆详情*/
    openDetails(type, key) {
      // console.log(this.hotelDetailsArr)
      // console.log(this.HQDetailsArr)
      if (this.hotelDetailsArr.length != 0 && key == 'hotel') {
        this.hotelOrHQObj = {
          type: 'hotel',
          obj: {HotelId: this.hotelDetailsArr[0].id}
        };
        // console.log(this.hotelOrHQObj)
        // return
        this[type] = true;
      } else if (this.HQDetailsArr.length != 0 && key == 'HQ') {
        this.hotelOrHQObj = {
          type: 'HQ',
          obj: {WeddingId: this.HQDetailsArr[0].id}
        };
        this[type] = true;
      }
    },
    //inputSearch2的change事件
    changeValue_hotel(itemObj) {
      this.hotelInputText = itemObj.val;
      this.hotelDetailsArr = itemObj.obj;
    },
    changeValue_HQ(itemObj) {
      this.HQInputText = itemObj.val;
      this.HQDetailsArr = itemObj.obj;
    },
    //下一步
    openAddNewOrderNext(type) {
      let selectedTypeId;//选择的类型
      if (type == 'add') {
        selectedTypeId = this.orderType;
        this.selectedTypeId = this.$parent.selectedTypeId;
      } else if (type == 'update') {
        selectedTypeId = this.baseInformation.OrderType
      }

      let timeValue;//第一个时间(婚礼拍摄时间/活动拍摄时间)
      if (selectedTypeId == 1) {
        if (this.$refs.selectTimeChild.timeValue != '' && this.$refs.selectTimeChild.timeValue) {
          timeValue = getFormatTime(this.$refs.selectTimeChild.timeValue, '-');//选取的时间的值
        } else {
          timeValue = '';//选取的时间的值
        }
      } else if (selectedTypeId == 2) {
        if (this.$refs.selectTimeChild_startTime.timeValue != '' && this.$refs.selectTimeChild_startTime.timeValue) {
          timeValue = getFormatTime(this.$refs.selectTimeChild_startTime.timeValue, '-');//选取的时间的值
        } else {
          timeValue = '';//选取的时间的值
        }
      }

      let timeValue2;//第二个时间(婚礼拍摄全天，早，中，晚时间/活动拍摄结束时间)
      if (selectedTypeId == 1) {
        if (this.$refs.dropSelectChild_time.dropSelectObj.length != 0) {
          timeValue2 = this.$refs.dropSelectChild_time.dropSelectObj[0].label;//时间段：全天、早、中、晚
        } else {
          timeValue2 = ''
        }
      } else {
        if (this.$refs.selectTimeChild_endTime.timeValue != '' && this.$refs.selectTimeChild_endTime.timeValue) {
          timeValue2 = getFormatTime(this.$refs.selectTimeChild_endTime.timeValue, '-');//选取的时间的值
        } else {
          timeValue2 = '';//选取的时间的值
        }
      }

      let cityNameAndId = this.$refs.childInputSearch_city.isSelectedItemObj;//输入的城市名字和id

      let hotelID;//婚礼订单所选的酒店的ID
      if (selectedTypeId == 1) {
        if (this.$refs.childInputSearch_hotel.isSelectedItemObj.length != 0) {
          hotelID = this.$refs.childInputSearch_hotel.isSelectedItemObj[0].id;
        } else {
          hotelID = '';
        }
      } else if (selectedTypeId == 2) {
        hotelID = '';
      }

      let shotAddress;//婚礼--宴会厅  活动--拍摄地点
      if (selectedTypeId == 1) {
        shotAddress = this.$refs.inputChild_hotel.inputValue;//输入的宴会厅
      } else if (selectedTypeId == 2) {
        shotAddress = this.$refs.inputChild_shotAddress.inputValue;//输入的拍摄地点
      }

      let XMChoiceArr = this.$refs.dropSelectChild_xm.dropSelectObj;//婚礼/活动--项目
      let priceValue = this.$refs.inputChild_price.inputValue;//输入的金额

      let HQCompanyID;//选择的婚庆公司Id
      if (selectedTypeId == 1) {
        if (this.$refs.childInputSearch_HQ.isSelectedItemObj.length != 0) {
          HQCompanyID = this.$refs.childInputSearch_HQ.isSelectedItemObj[0].id;
        } else {
          HQCompanyID = '';
        }
      } else if (selectedTypeId == 2) {
        HQCompanyID = '';
      }

      let fastValue;//获取选择的加急 true/false
      if (this.$refs.dropSelectChild_fast.dropSelectValue == '') {
        fastValue = false;
      } else {
        fastValue = this.$refs.dropSelectChild_fast.dropSelectValue;
      }

      let selectFJXMStr = this.selectFJXMStr;//附加项目

      let sourceStr = this.getCheckBoxTrue();//获取来源选择的ID，大于1的用‘，’隔开

      let remarkText = this.$refs.textAreaChildText.textAreaText;//获取说明
      if (timeValue == '' && selectedTypeId == 1) {
        this.showTip('请选择时间');
        return false;
      }
      if (timeValue == '' && selectedTypeId == 2) {
        this.showTip('请选择拍摄时间');
        return false;
      }
      if (timeValue2 == '' && selectedTypeId == 1) {
        this.showTip('请选择具体时间段');
        return false;
      }
      if (timeValue2 == '' && selectedTypeId == 2) {
        this.showTip('请选择拍摄结束时间');
        return false;
      }

      if (cityNameAndId.length == 0) {
        this.showTip('请选择城市');
        return false;
      }
      if (XMChoiceArr.length == 0) {
        this.showTip('请选择项目');
        return false;
      }

      if (priceValue == '') {
        this.showTip('请输入金额');
        return false;
      } else if (priceValue != '') {
        if (!(/^[0-9]+\.?[0-9]+?$/.test(priceValue)) && !(/^[0-9]+$/.test(priceValue))) {
          this.showTip('请输入正确金额');
          return false;
        }
      }
      if (sourceStr === '') {
        this.showTip('请选择来源');
        return false;
      }

      let data;
      if (type == 'add') {
        if (this.orderId === '') {
          data = {
            OrderDate: timeValue,//时间1
            OrderTimeType: timeValue2,//时间2
            CityId: cityNameAndId[0].id,
            CityName: cityNameAndId[0].name,
            HotelId: hotelID,
            HotelOtherRemark: shotAddress,
            ProjectId: XMChoiceArr[0].value,
            ProjectName: XMChoiceArr[0].label,
            AdditionalProject: selectFJXMStr,//附加项目
            Amount: priceValue,
            WeddingId: HQCompanyID,
            OrderIsUrgent: fastValue,//是否加急
            Source: sourceStr,
            SourceRemark: remarkText,
            OrderType: selectedTypeId,
            Type: 'add',
          };
        } else {
          data = {
            OrderDate: timeValue,//时间1
            OrderTimeType: timeValue2,//时间2
            CityId: cityNameAndId[0].id,
            CityName: cityNameAndId[0].name,
            HotelId: hotelID,
            HotelOtherRemark: shotAddress,
            ProjectId: XMChoiceArr[0].value,
            ProjectName: XMChoiceArr[0].label,
            AdditionalProject: selectFJXMStr,//附加项目
            Amount: priceValue,
            WeddingId: HQCompanyID,
            OrderIsUrgent: fastValue,//是否加急
            Source: sourceStr,
            SourceRemark: remarkText,
            OrderType: selectedTypeId,
            Type: 'update',
            OrderId: this.orderId,
          };
        }
      } else if (type == 'update') {
        data = {
          OrderDate: timeValue,//时间1
          OrderTimeType: timeValue2,//时间2
          CityId: cityNameAndId[0].id,
          CityName: cityNameAndId[0].name,
          HotelId: hotelID,
          HotelOtherRemark: shotAddress,
          ProjectId: XMChoiceArr[0].value,
          ProjectName: XMChoiceArr[0].label,
          AdditionalProject: selectFJXMStr,//附加项目
          Amount: priceValue,
          WeddingId: HQCompanyID,
          OrderIsUrgent: fastValue,//是否加急
          Source: sourceStr,
          SourceRemark: remarkText,
          OrderType: selectedTypeId,
          Type: type,
          OrderId: this.baseInformation.OrderId,
        };
      }
      // console.log(data)
      // return false;
      if (this.flag) {
        this.flag = false;
        this.addOrderStep1Request(data, type);
      }
    },
    //新增订单第一步请求
    addOrderStep1Request(data, type) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/AddCameraOrderInfo';
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            this.flag = true;
            if (type == 'add') {
              if (this.orderType == 1) {
                this.$parent.openAddNewOrderNext();//打开婚礼订单下一步操作
              } else if (this.orderType == 2) {
                this.$parent.openAddNewOrderNext2();//打开活动订单下一步操作
              }
              this.orderId = res.data.data.OrderId;//保存orderId
              this.$parent.orderId = res.data.data.OrderId;//保存到父级的orderId
            } else if (type == 'update') {
              this.showTip('修改成功', 'success');
              this.$parent.getBaseInformation();//使详情页更新数据
              this.$parent.baseInInformation.showAddOrderStep2DiaLog = false;
            }
          }
        }
      })
    },
    //获取来源选中项
    getCheckBoxTrue() {
      let sourceStr = '';
      let sourceArr = [];
      this.sourceData.forEach((item, index, arr) => {
        if (arr[index].isChecked) {
          sourceArr.push(arr[index]);
          if (sourceArr.length == 1) {
            sourceStr = arr[index].Id;
          } else if (sourceArr.length > 1) {
            sourceStr += ',' + arr[index].Id;
          }
        }
      });
      return sourceStr;
    },
    //创建酒店
    createNewContent() {
      this.showAddHotelDiaLog = true;
    },
    //创建婚庆公司
    createNewContent_HQ() {
      this.showAddWeddingCompanyDiaLog = true;
    },
    //编辑时点开所调用的函数
    editOpenFn(obj) {
      this.baseInformation = obj;
    },
    //打开弹框时清除所有缓存数据
    clearOldData(type) {
      if (type == 'add') {
        this.addTitle = '新增订单';
        this.$refs.childInputSearch_city.inputValue = '';//选择的城市
        this.$refs.dropSelectChild_fast.dropSelectValue = '';//加急
        this.$refs.inputChild_price.inputValue = '';//金额
        this.$refs.dropSelectChild_xm.dropSelectValue = '';//项目文字
        this.$refs.dropSelectChild_xm.dropSelectObj = [];//项目选择的数组
        this.$refs.fuJiaTags.tags = [];//附加项目
        this.$refs.textAreaChildText.textAreaText = '';//说明
        if (this.orderType == 1) {
          this.$refs.selectTimeChild.timeValue = '';//时间
          this.$refs.dropSelectChild_time.dropSelectValue = '';//时间2
          this.$refs.dropSelectChild_time.dropSelectObj = [];//时间2
          this.$refs.childInputSearch_hotel.inputValue = '';//选择的酒店
          this.$refs.inputChild_hotel.inputValue = '';//宴会厅
          this.$refs.childInputSearch_HQ.inputValue = '';//婚礼公司
        } else {
          this.$refs.selectTimeChild_startTime.timeValue = '';//拍摄时间
          this.$refs.selectTimeChild_endTime.timeValue = '';//结束时间
          this.$refs.inputChild_shotAddress.timeValue = '';//拍摄地点
        }
      } else if (type == 'update') {
        // console.log(this.baseInformation)
        this.orderType = this.baseInformation.OrderType;//订单类型

        this.addTitle = '编辑基本信息';
        setTimeout(() => {
          /*两者公用*/
          this.getSourceData(this.baseInformation.Source);//来源
          this.$refs.dropSelectChild_xm.dropSelectValue = this.baseInformation.ProjectName;//项目
          this.$refs.dropSelectChild_xm.dropSelectObj = [{
            label: this.baseInformation.ProjectName,
            value: this.baseInformation.ProjectId,
          }];//项目选中项
          this.selectFJXMStr = this.baseInformation.AdditionalProject;//附加项目
          let Amount2 = 0;
          if (this.baseInformation.FJProjectList) {
            this.baseInformation.FJProjectList.forEach(item => {
              Amount2 += item.ProjectAmount;
            });
          }
          this.ProjectAmount=parseInt(this.baseInformation.Amount)-parseInt(Amount2);
          this.FJProjectAmount=Amount2;
          this.$refs.inputChild_price.inputValue = this.ProjectAmount+this.FJProjectAmount;//金额
          this.$refs.textAreaChildText.textAreaText = this.baseInformation.SourceRemark;//说明
          this.fastValue = this.baseInformation.OrderIsUrgent;//是否加急
          this.$refs.dropSelectChild_fast.dropSelectValue = this.baseInformation.OrderIsUrgent;
          this.$refs.childInputSearch_city.inputValue = this.baseInformation.CityName;//选择的城市
          this.$refs.childInputSearch_city.isSelectedItemObj = [{
            id: this.baseInformation.CityId,
            name: this.baseInformation.CityName
          }];//城市选中项
          /*/两者公用*/

          if (this.orderType == 1) {
            this.hotelDetailsArr = [{
              HotelId: this.baseInformation.HotelId,
            }];
            this.HQDetailsArr = [{
              WeddingId: this.baseInformation.WeddingId,
            }];
            this.$refs.selectTimeChild.timeValue = this.baseInformation.OrderDateStr;//时间
            this.$refs.dropSelectChild_time.dropSelectValue = this.baseInformation.OrderTimeType;//时间
            this.$refs.dropSelectChild_time.dropSelectObj = [{value: '', label: this.baseInformation.OrderTimeType}];//时间
            this.$refs.childInputSearch_hotel.inputValue = this.baseInformation.HotelName_New;//选择的酒店名称
            this.$refs.childInputSearch_hotel.isSelectedItemObj = [{id: this.baseInformation.HotelId}];//酒店选中项HotelOtherRemark
            this.$refs.inputChild_hotel.inputValue = this.baseInformation.HotelOtherRemark;//宴会厅
            this.$refs.childInputSearch_HQ.inputValue = this.baseInformation.WeddingName;//婚礼公司
            this.$refs.childInputSearch_HQ.isSelectedItemObj = [{id: this.baseInformation.WeddingId}];//婚礼公司id
          } else if (this.orderType == 2) {
            this.$refs.selectTimeChild_startTime.timeValue = this.baseInformation.OrderDateStr;//拍摄时间
            this.$refs.selectTimeChild_endTime.timeValue = this.baseInformation.OrderTimeType;//结束时间
            this.$refs.inputChild_shotAddress.inputValue = this.baseInformation.HotelOtherRemark;//拍摄地点
          }
        })
      }
    },
    /*====获取来源信息====*/
    getSourceData(obj) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderInfoSource';
      this.$Axios({
        method: 'POST',
        url: url,
        success(res) {
          if (res.data.status) {
            res.data.data.forEach((item, index, arr) => {
              arr[index].isChecked = false;
            });
            if (obj != undefined) {
              let selectArr = obj.split(',');
              res.data.data.forEach((item, index, arr) => {
                selectArr.forEach((item2, index2, arr2) => {
                  if (arr2[index2] == arr[index].Id) {
                    arr[index].isChecked = true;
                  }
                })
              });
            }

            this.sourceData = res.data.data;
          } else {
            this.sourceData = [];
          }
        }
      })
    },
    /*====获取酒店列表====*/
    getHotelData(obj) {
      this.$refs.childInputSearch_city.isShowList = false;
      this.$refs.childInputSearch_HQ.isShowList = false;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraHotelListInfo';
      let data = {
        HotelName: obj.val,
        PageIndex: 1,//第1页 （固定）
        PageSize: 10,//每次返回10条数据
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            // console.log(res)
            res.data.data.forEach((item, index, arr) => {
              arr[index].isChecked = false;
            });
            let newRes = res.data.data.map((item) => {
              return {
                name: item.HotelName,
                id: item.HotelId,
                HotelName: item.HotelName,
                CityName: item.CityName,
                HotelAddress: item.HotelAddress,
                Remark: item.Remark,
              }
            });
            newRes.unshift({id: -1, name: "没有合适的酒店?"});
            this.hotelListData = newRes;
          }
        },
      })
    },
    /*====获取婚庆公司====*/
    getHQData(obj) {
      this.$refs.childInputSearch_city.isShowList = false;
      this.$refs.childInputSearch_hotel.isShowList = false;
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderWeddingInfo';
      let data = {
        WeddingName: obj.val,
        PageIndex: 1,//第1页 （固定）
        PageSize: 10,//每次返回10条数据
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            // console.log(res)
            let newRes = res.data.data.map((item) => {
              return {
                name: item.WeddingName,
                id: item.WeddingId,
                CityName: item.CityName,
                WeddingAddress: item.WeddingAddress,
                WeddingName: item.WeddingName,
                Remark: item.Remark
              }
            });
            newRes.unshift({id: -1, name: "没有合适的婚庆公司?"});
            this.hqOptions = newRes;
          }
        },
      })
    },
    /*====获取城市列表====*/
    getCityNews(obj) {
      if (this.orderType == 1) {
        this.$refs.childInputSearch_hotel.isShowList = false;
        this.$refs.childInputSearch_HQ.isShowList = false;
      }
      if (obj.type == 'inputFocus') {
        let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCityList';
        this.$Axios({
          method: 'POST',
          url: url,
          success(res) {
            if (res.status == 200) {

              let newRes = res.data.data.map((item) => {
                return {
                  name: item.CityName,
                  id: item.CityId
                }
              });
              this.filterCity(newRes, obj.val);
            }
          },
        })
      } else if (obj.type == 'searchText') {

        this.filterCity(this.cityData, obj.val)
      }
    },
    //搜索筛选
    filterCity(data, searchVal) {
      let filterData = data.filter(item => {
        if (item.name.indexOf(searchVal) != -1) {
          return item;
        }
      });
      filterData.unshift({id: -1, name: "没有找到?"});
      this.cityData = filterData;
    },
    /*====获取项目信息====*/
    getXMData() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderProjectInfo';
      this.$Axios({
        method: 'POST',
        url: url,
        success(res) {
          if (res.data.status) {
            // console.log(res)
            let newRes = res.data.data.map((item) => {
              return {
                label: item.ProjectName,
                value: item.ProjectId,
                ProjectAmount: item.ProjectAmount,
                Remark: item.Remark,
              }
            });
            this.xmOptions = newRes;
            if (this.baseInformation.ProjectId) {
              this.xmOptions.forEach(item => {
                if (item.value == this.baseInformation.ProjectId) {
                  this.XMObj.remark = item.Remark
                }
              })
            }

            if (res.data.fjdata.length != 0) {
              res.data.fjdata.forEach(item => {
                item.id = item.ProjectId;
                item.name = item.ProjectName;
                item.isSelected = false;
              });
              this.selectList = res.data.fjdata
            }
            // console.log(this.selectFJXMStr)
            if (this.selectFJXMStr != '') {
              let selectFJXMArr = this.selectFJXMStr.split(',');
              this.selectList.forEach(item => {
                selectFJXMArr.forEach(item2 => {
                  if (item.id == item2) {
                    item.isSelected = true;
                  }
                });
              });
              let newArr = this.selectList.filter(item => selectFJXMArr.find(item2 => item.id == item2));
              this.$refs.fuJiaTags.tags = newArr;
            }
          }
        }
      })
    },
  };
  export default {
    name: "addOrderStep2DiaLog",
    props: ['showAddOrderStep2DiaLog', 'type'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
    },
    components: {
      addHotelDiaLog: addHotelDiaLog,
      createNewContent_HQ: createNewContent_HQ,
      hotelDetails: hotelDetails,
      addCity
    },
    watch: {}
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .el-dialog__wrapper {
    overflow: hidden;
  }

  >>> .el-dialog__body {
    height: 90%;
  }

  .content {
    height: 100%;
  }

  /*新增*/
  .addNewOrder {
    height: 100%;
    /*padding: 6% 10% 5%;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  @media (max-width: 1600px) {
    .addNewOrder {
      /*padding: 6% 4%;*/
    }
  }

  .addNewOrder .title {
    color: #5996F8;
    font-size: 14px;
    text-align: left;
  }

  .addNewOrder .title span {
    position: relative;
  }

  .addNewOrder .title span::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 17px;
    background: rgba(89, 150, 248, 1);
    left: -10px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .addNewOrder .form {
    min-height: 300px;
    overflow: auto;
    height: 100%;
  }

  .addNewOrder .form li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .addNewOrder .form li:nth-of-type(5) {
    justify-content: flex-start;
  }

  .addNewOrder .form li label {
    color: #808080;
    font-size: 14px;
  }

  .addNewOrder .form li input {
    width: 200px;
    height: 32px;
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 4px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #4C4C4C;
  }

  .addNewOrder .form li input::-webkit-input-placeholder {
    color: #BBB;
  }

  .addNewOrder >>> .el-checkbox {
    margin-right: 22px;
  }

  .addNewOrder .textArea {
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 4px;
  }

  .formLeft, .formRight {
    display: flex;
    align-items: center;
    position: relative;
  }

  .form-inner .tip {
    position: absolute;
    width: 15px;
    height: 15px;
    right: -20px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .form-inner .tip >>> .el-button {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 50%;
    font-size: 12px;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
    transition: all .2s;
    border-color: #BBB;
    color: #BBB;
  }

  .form-inner .tip >>> .el-button:hover {
    border-color: #5996F8;
    color: #5996F8;
  }

  .commonBox {
    display: inline-block;
    width: 200px;
    height: 32px;
    text-align: left;
  }

  .fuJiaBox {
    min-height: 32px;
    height: auto;
    width: auto;
    min-width: 200px;
  }

  .timeSelect1 {
    display: inline-block;
    width: 150px;
    height: 100%;
  }

  .timeSelect2 {
    display: inline-block;
    height: 100%;
    width: 90px;
  }

  .addNewOrder li.textAreaLi {
    height: auto;
  }

  .textAreaBox {
    width: 310px;
    height: 70px;
    margin-left: 70px;
  }

  /*新增订单弹框样式*/
  >>> .addOrderStep2DiaLog {
    padding: 40px;
  }

  >>> .addOrderStep2DiaLog .el-dialog__header .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .addOrderStep2DiaLog .el-dialog__footer {
    text-align: center;
  }

  >>> .addOrderStep2DiaLog .el-dialog__footer button {
    width: 140px;
    height: 42px;
    line-height: 42px;
    padding: 0;
    font-size: 15px;
  }

  >>> .addOrderStep2DiaLog .el-dialog__footer button:first-of-type {
    border-color: rgba(89, 150, 248, 1);
    background: transparent;
    color: #5996F8;
    margin-right: 50px;
  }

  >>> .addOrderStep2DiaLog .el-dialog__footer .addBtn {
    background: rgba(89, 150, 248, 1) !important;
    color: #FFF !important;
    margin-right: 0 !important;
  }

  @media (min-width: 1600px) {
    >>> .addOrderStep2DiaLog {
      width: 880px;
      height: 698px;
    }

    .fuJiaBox {
      max-width: 560px
    }

    .addNewOrder {
      padding: 40px 60px;
    }

    .addNewOrder .form li {
      margin: 25px;
    }

  }

  @media (min-width: 1400px)and (max-width: 1600px) {
    >>> .addOrderStep2DiaLog {
      width: 730px;
      height: 580px;
    }

    .fuJiaBox {
      max-width: 525px
    }

    .addNewOrder {
      padding: 30px 0;
    }

    .addNewOrder .form li {
      margin: 25px;
    }

  }

  @media (max-width: 1400px) {
    >>> .addOrderStep2DiaLog {
      width: 730px;
      height: 500px;
    }

    .fuJiaBox {
      max-width: 525px
    }

    .addNewOrder {
      padding: 30px 0;
    }

    .addNewOrder .form li {
      margin: 25px;
    }
  }


</style>
