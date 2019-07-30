<!--订单详情-->
<template>
  <div id="orderManage-details" class="commonScrollStyle">
    <!--面包屑-->
    <div class="details-crumbs">
      <ul class="clearfloat" v-if="!isFormCalendar">
        <li>订单<i class="el-icon-arrow-right"></i></li>
        <li @click="returnListPage" class="returnListPage"><span class="return">本店订单<i class="el-icon-arrow-right"></i></span>
        </li>
        <li>订单详情</li>
      </ul>
      <ul class="clearfloat" v-if="isFormCalendar">
        <li class="returnListPage" @click="returnListPage" title="返回日程"><span class="return">日程</span><i
          class="el-icon-arrow-right"></i></li>
        <li>订单详情</li>
      </ul>
      <button class="returnList" @click="returnListPage" title="返回列表" v-if="!isFormCalendar">
        <span v-show="!returnFlag" class="return"><i class="el-icon-arrow-left"></i>返回列表</span>
        <span v-show="returnFlag"><i class="el-icon-loading"></i>正在返回,请稍后...</span>
      </button>
      <button class="returnList" @click="returnListPage" title="返回日程" v-if="isFormCalendar">
        <span v-show="!returnFlag" class="return"><i class="el-icon-arrow-left"></i>返回日程</span>
        <span v-show="returnFlag"><i class="el-icon-loading"></i>正在返回,请稍后...</span>
      </button>
    </div>
    <!--/面包屑-->

    <!--板块1-酒店信息-->
    <div class="details01"><!--板块1,酒店名称-->
      <div class="details01-hotelName">
        <span v-if="baseInInformation.OrderIsUrgent"><img style="vertical-align: -2px"
                                                          src="../../../../static/img/order/jiaji2.png" alt="加急"
                                                          title="订单加急"></span>
        <span v-if="baseInInformation.OrderIsChaoQi"><img style="vertical-align: -2px"
                                                          src="../../../../static/img/order/chaoqi2.png" alt="超期"
                                                          :title="'订单超期'+baseInInformation.CQDays+'天'"></span>
        {{orderTitle}}
      </div>
      <div class="details01-btText">
        <div class="state">
          <span>状态：</span>
          <span v-cloak style="color: #FF0000;" v-if="orderState==null||orderState==0||orderState==1">{{orderState|orderState}}</span>
          <span v-cloak style="color: orange;"
                v-if="orderState==2||orderState==3||orderState==4||orderState==5">{{orderState|orderState}}</span>
          <span v-cloak style="color: blue" v-if="orderState==6">{{orderState|orderState}}</span>
        </div>
        <div class="myRole">
          <span>我的角色：</span>
          <span v-cloak>{{roleName|filterRoleName}}</span>
        </div>
      </div>
    </div>
    <!--/板块1-酒店信息-->

    <!--内容区-->
    <!--状态  6个快-->
    <div class="listContent clearfloat">
      <div class="listContent-left">
        <div class="leftBox listContent-orderState">
          <p class="title">订单状态</p>
          <p style="display: none;" :msg="msg"></p>
          <ul>
            <template v-for="(items,index) in orderStateData">
              <li>
                <i class="el-icon-caret-bottom" v-show="items.isShowState"></i>
                <span v-cloak v-if="items.StateColor==0" style="color: #FFA04D;background: #FFF6EB;"
                      @click="openThisContent(items)">{{items.StateId|stateTitle}}</span>
                <span v-cloak v-if="items.StateColor==1" style="color: #5996F8;background: #EFF5FF;"
                      @click="openThisContent(items)">{{items.StateId|stateTitle}}</span>
                <span v-cloak v-if="items.StateColor==2" style="color: #FF4200;background: #FFF1F1;"
                      @click="openThisContent(items)">{{items.StateId|stateTitle}}</span>
                <span v-cloak v-if="items.StateColor==3" style="color: #BBBBBB;background: #F6F6F6;"
                      @click="openThisContent(items)">{{items.StateId|stateTitle}}</span>
                <span v-cloak v-if="items.StateColor==0" style="color:#FF9F2E;">{{items.StateColor|StateName}}</span>
                <span v-cloak v-if="items.StateColor==1&&orderState==4&&items.StateId==3"
                      style="color:#FF4200;">重新提交</span>
                <span v-cloak v-if="items.StateColor==1&&orderState==4&&items.StateId!=3" style="color:#4C4C4C;">{{items.StateColor|StateName}}</span>
                <span v-cloak v-if="items.StateColor==1&&orderState!=4" style="color:#4C4C4C;">{{items.StateColor|StateName}}</span>
                <span v-cloak v-if="items.StateColor==2" style="color:#FF4200;">{{items.StateColor|StateName}}</span>
                <span v-cloak v-if="items.StateColor==3" style="color:#4C4C4C;">{{items.StateColor|StateName}}</span>
                <span v-cloak>{{items.UserName}}</span>
              </li>
            </template>
          </ul>
        </div>
        <div class="leftBox listContent-baseNews">
          <p class="title">基本信息
            <i class="el-icon-more moreIcon" v-if="this.$store.state.IsCanUpdateBasicInfo" @click.stop="isShowEditMenu(1)">
              <transition name="slide-fade">
                <span class="editMenu" v-show="isShowEditMenu1" @click="editNews('baseNews')">编辑</span>
              </transition>
            </i>
          </p>
          <div class="contentBox">
            <ul class="baseNews clearfloat">
              <li>
                <span>订单日期：</span>
                <span
                  v-cloak>{{baseInInformation.OrderDateStr | OrderDateStrFn}}-{{baseInInformation.OrderTimeType|OrderTimeTypeFn}}</span>
              </li>
              <li>
                <span>类<i style="display: inline-block;width: 28px;"></i>型：</span>
                <span v-cloak>{{baseInInformation.OrderType | OrderTypeFn}}</span>
              </li>
              <li v-if="baseInInformation.OrderType==1">
                <span style="position: relative;">
                  <span class="clickTip" title="查看酒店详情"
                        @click="openDetails('showHotelOrHQDetailsDiaLog','hotel',baseInInformation)"><el-button>!</el-button></span>
                  拍摄酒店：
                </span>
                <span v-text="baseInInformation.HotelName_New" v-if="baseInInformation.HotelName_New&&baseInInformation.HotelName_New!=''"></span>
                <span v-if="baseInInformation.HotelName_New==''||!baseInInformation.HotelName_New" style="color: #BBB;">暂无</span>
              </li>
              <li>
                <!--<span>类<i style="display: inline-block;width: 28px;"></i>型：</span>-->
                <!--<span v-cloak>{{baseInInformation.OrderType | OrderTypeFn}}</span>-->
                <span>项<i style="display: inline-block;width: 28px;"></i>目：</span>
                <span v-text="baseInInformation.ProjectName"></span>
              </li>
              <li v-if="baseInInformation.OrderType==1">
                <span style="position: relative;">
                  <span class="clickTip" title="查看婚庆详情"
                        @click="openDetails('showHotelOrHQDetailsDiaLog','HQ',baseInInformation)"><el-button>!</el-button></span>
                  婚<i style="display: inline-block;width: 28px;"></i>庆：
                 </span>
                <span v-text="baseInInformation.WeddingName"></span>
                <span v-if="baseInInformation.WeddingName==''||baseInInformation.WeddingName==null" style="color: #BBB;">暂无</span>
              </li>
              <li>
                <span>附加项目：</span>
                <span v-if="baseInInformation.FJProjectList">
                  <template v-for="(item,index) in baseInInformation.FJProjectList">
                    <span class="FJSPAN" style="color: #4c4c4c">{{item.ProjectName}}<i>、</i></span>
                  </template>
                </span>
                <span v-if="!baseInInformation.FJProjectList||baseInInformation.FJProjectList.length==0" style="color: #bbb">
                  暂无
                </span>
              </li>
              <li>
                <span>来<i style="display: inline-block;width: 28px;"></i>源：</span>
                <span v-text="baseInInformation.SourceName"></span>
              </li>
              <li>
                <span>备<i style="display: inline-block;width: 28px;"></i>注：</span>
                <span v-text="baseInInformation.SourceRemark" v-if="baseInInformation.SourceRemark&&baseInInformation.SourceRemark!=''"></span>
                <span v-if="!baseInInformation.SourceRemark||baseInInformation.SourceRemark==''" style="color: #bbb">暂无</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="leftBox listContent-customerNews">
          <p class="title">客户信息
            <i class="el-icon-more moreIcon" v-if="this.$store.state.IsCanUpdateBasicInfo" @click.stop="isShowEditMenu(2)">
              <transition name="slide-fade">
                <span class="editMenu" v-show="isShowEditMenu2" @click="editNews('customer')">编辑</span>
              </transition>
            </i>
          </p>
          <div class="contentBox">
            <ul class="KHNews clearfloat" v-if="customerInformation.OrderType==1">
              <li>
                <span>新<i style="display: inline-block;width: 28px;"></i>郎：</span>
                <span v-text="customerInformation.CustomerModel.XLName" v-if="customerInformation.CustomerModel.XLName&&customerInformation.CustomerModel.XLName!=''"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.XLName||customerInformation.CustomerModel.XLName==''">
                  暂无
                </span>
              </li>
              <li>
                <span>新郎电话：</span>
                <span v-text="customerInformation.CustomerModel.XLPhone" v-if="customerInformation.CustomerModel.XLPhone&&customerInformation.CustomerModel.XLPhone!=''"></span>
                <span style="color: #BBB" v-if="customerInformation.CustomerModel.XLPhone==''||customerInformation.CustomerModel.XLPhone==null">暂无</span>
              </li>
              <li>
                <span>新<i style="display: inline-block;width: 28px;"></i>娘：</span>
                <span v-text="customerInformation.CustomerModel.XNName" v-if="customerInformation.CustomerModel.XNName&&customerInformation.CustomerModel.XNName!=''"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.XNName||customerInformation.CustomerModel.XNName==''">
                  暂无
                </span>
              </li>
              <li>
                <span>新娘电话：</span>
                <span v-text="customerInformation.CustomerModel.XNPhone" v-if="customerInformation.CustomerModel.XNPhone&&customerInformation.CustomerModel.XNPhone!=''"></span>
                <span style="color: #BBB" v-if="customerInformation.CustomerModel.XNPhone==''||customerInformation.CustomerModel.XLPhone==null">暂无</span>
              </li>
              <li>
                <span>邮<i style="display: inline-block;width: 28px;"></i>箱：</span>
                <span v-cloak style="word-break: break-all;" v-if="customerInformation.CustomerModel.OrderEmail&&customerInformation.CustomerModel.OrderEmail!=''">
                  {{customerInformation.CustomerModel.OrderEmail}}
                </span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.OrderEmail">
                  暂无
                </span>
              </li>
              <li>
                <span>邮寄地址：</span>
                <span style="word-break: break-all;" v-if="customerInformation.CustomerModel.OrderMailAddress&&customerInformation.CustomerModel.OrderMailAddress!=''">
                  {{customerInformation.CustomerModel.OrderMailAddress}}
                </span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.OrderMailAddress||customerInformation.CustomerModel.OrderMailAddress==''">
                  暂无
                </span>
              </li>
              <li style="width: 100%;">
                <span>客户说明：</span>
                <span v-text="customerInformation.CustomerModel.Remark" v-if="customerInformation.CustomerModel.Remark&&customerInformation.CustomerModel.Remark!=''"></span>
                <span style="color: #bbb;" v-if="customerInformation.CustomerModel.Remark==''||!customerInformation.CustomerModel.Remark">暂无</span>
              </li>
            </ul>
            <ul class="KHNews clearfloat" v-if="customerInformation.OrderType==2">
              <li style="width: 100%;">
                <span>公<i style="display: inline-block;width: 28px;"></i>司：</span>
                <span v-text="customerInformation.CustomerModel.CompanyName" v-if="customerInformation.CustomerModel.CompanyName&&customerInformation.CustomerModel.CompanyName!=''"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.CompanyName||customerInformation.CustomerModel.CompanyName==''">
                  暂无
                </span>
              </li>
              <li>
                <span>联系电话：</span>
                <span v-text="customerInformation.CustomerModel.ContactPhone" v-if="customerInformation.CustomerModel.ContactPhone&&customerInformation.CustomerModel.ContactPhone!=''"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.ContactPhone||customerInformation.CustomerModel.ContactPhone==''">
                  暂无
                </span>
              </li>
              <li>
                <span>联 &nbsp;系 &nbsp;人：</span>
                <span v-text="customerInformation.CustomerModel.ContactName" v-if="customerInformation.CustomerModel.ContactName&&customerInformation.CustomerModel.ContactName!=''"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.ContactName||customerInformation.CustomerModel.ContactName==''">
                  暂无
                </span>
              </li>
              <li>
                <span>邮寄地址：</span>
                <span v-if="customerInformation.CustomerModel.OrderMailAddress&&customerInformation.CustomerModel.OrderMailAddress!=''" v-text="customerInformation.CustomerModel.OrderMailAddress"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.OrderMailAddress||customerInformation.CustomerModel.OrderMailAddress==''">
                  暂无
                </span>
              </li>
              <li>
                <span>邮<i style="display: inline-block;width: 28px;"></i>箱：</span>
                <span v-if="customerInformation.CustomerModel.OrderEmail&&customerInformation.CustomerModel.OrderEmail!=''" v-text="customerInformation.CustomerModel.OrderEmail" style="word-break: break-all;"></span>
                <span style="color: #BBB"  v-if="!customerInformation.CustomerModel.OrderEmail||customerInformation.CustomerModel.OrderEmail==''">
                  暂无
                </span>
              </li>
              <li style="width: 100%;">
                <span>客户说明：</span>
                <span v-text="customerInformation.CustomerModel.Remark" v-if="customerInformation.CustomerModel.Remark&&customerInformation.CustomerModel.Remark!=''"></span>
                <span style="color: #bbb;" v-if="customerInformation.CustomerModel.Remark==''||!customerInformation.CustomerModel.Remark">暂无</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="leftBox listContent-personManage">
          <p class="title">人员安排
            <i class="el-icon-more moreIcon" @click.stop="isShowEditMenu(3)">
              <transition name="slide-fade">
                <span class="editMenu" v-show="isShowEditMenu3" @click="editNews('person')">编辑</span>
              </transition>
            </i>
          </p>
          <div class="content clearfloat">
            <template v-for="(items,index) in personManageListData">
              <div class="list">
                <span class="label">{{items.name}}</span>
                <ul class="commonScrollStyle">
                  <template v-for="(items2,index2) in items.positionList">
                    <li>
                      <label v-cloak>{{items2.PostName}}：</label>
                      <div class="personBox">
                        <template v-for="(items3,index3) in items2.PostUserList">
                          <span v-cloak>{{items3.UserName}}</span>
                        </template>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="listContent-right">
        <div class="rightBox orderPrice" v-if="this.$store.state.IsCanUpdateAmountInfo">
          <p class="title">订单金额</p>
          <ul class="orderPriceBox">
            <li class="clearfloat">
              <div class="heTongPrice priceBox">
                <label>合同金额：</label>
                <span v-cloak>{{orderPriceObj.amout}}</span>
              </div>
              <div class="handedPrice priceBox">
                <label>已交金额：</label>
                <span v-cloak>{{orderPriceObj.Payment}}</span>
              </div>
            </li>
            <li>
              <div class="noHandedPrice priceBox">
                <label>未交金额：</label>
                <span style="color: #FF0000;" v-cloak>{{noPayPrice}}</span>
              </div>
            </li>
            <li>
              <div class="priceDetails priceBox">
                <label>金额明细：</label>
                <div class="add" @click="addPriceDetailsFn"><span>添加</span></div>
                <div class="telescopic icon1 noSelect" v-if="orderPriceObj.objlist.length>0" v-show="isShowPriceList"
                     @click="clickIsShowPriceList(false)">
                  收起<i class="el-icon-d-arrow-left showIcon showIcon1"></i></div>
                <div class="telescopic icon2 noSelect" v-if="orderPriceObj.objlist.length>0" v-show="!isShowPriceList"
                     @click="clickIsShowPriceList(true)">
                  展开<i class="el-icon-d-arrow-left showIcon showIcon2"></i></div>
              </div>
              <div class="noDataBox" v-if="orderPriceObj.objlist.length==0">
                <noData msg="暂无金额明细"></noData>
              </div>
              <transition name="slide-fade">
                <div class="priceList" v-show="isShowPriceList">
                  <dl>
                    <template v-for="(items,index) in orderPriceObj.objlist">
                      <dd>
                        <div class="priceList-hd">
                          <span class="left" v-cloak>{{items.typename}}</span>
                          <span class="right">
                         <span v-cloak>{{items.username}}</span>
                         <span v-cloak>{{items.addtime | addtimeReturn}}</span>
                         <i class="el-icon-arrow-right"></i>
                      </span>
                        </div>
                        <div class="priceList-bt">
                          <span class="left">金额：<span v-cloak></span>{{items.amount}}</span>
                          <span class="right" v-if="items.satename=='待审核'">状态：<span v-cloak :class="['zt']"
                                                                                    style="color: #FF7E00"
                          >{{items.satename}}</span></span>
                          <span class="right" v-if="items.satename=='审核通过'">状态：<span v-cloak :class="['zt']"
                                                                                     style="color: #5996F8"
                          >{{items.satename}}</span></span>
                          <span class="right" v-if="items.satename=='退回'">状态：<span v-cloak :class="['zt']"
                                                                                   style="color: #ff0000"
                          >{{items.satename}}</span></span>
                        </div>
                      </dd>
                    </template>
                  </dl>
                </div>
              </transition>
            </li>
          </ul>
        </div>
        <div class="rightBox priceOut">
          <p class="title">
            <span>费用支出({{allPriceOut}})</span>
          </p>
          <div style="min-height: 183px;position: relative;">
            <noData msg="暂无费用支出" v-if="isShowOutNoData"></noData>
            <el-table
              :data="priceOutTableData"
              :header-row-class-name="headerClassName"
              :row-class-name="rowClassName"
              max-height="380px"
              @expand-change="expandChange"
              style="width: 100%">
              <el-table-column type="expand" width="80px">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-table
                      :data="props.row.data"
                      :header-row-class-name="headerClassName2"
                      :row-class-name="rowClassName2"
                      style="width: 100%;border-left: 0;border-right: 0;">
                      <el-table-column
                        width="80px"
                        label="操作">
                        <template slot-scope="scope">
                          <span><a style="color: #3196FA;" href="javascript:void(0)"
                                   @click="openBaoZhangDetails(scope.row)">详情</a></span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="标题"
                        show-overflow-tooltip
                        prop="name">
                      </el-table-column>
                      <el-table-column
                        label="支付对象"
                        show-overflow-tooltip
                        prop="typename">
                      </el-table-column>
                      <el-table-column
                        label="金额"
                        show-overflow-tooltip
                        prop="amount">
                      </el-table-column>
                      <!--<el-table-column-->
                        <!--label="状态"-->
                        <!--show-overflow-tooltip>-->
                        <!--<template slot-scope="scope">-->
                          <!--<span v-cloak>{{scope.row.otherstae | returnState}}</span>-->
                        <!--</template>-->
                      <!--</el-table-column>-->
                    </el-table>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="序号"
                type="index"
              >
              </el-table-column>
              <el-table-column
                label="编号"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-cloak>{{scope.row.No | returnVal}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="标题"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-cloak>{{scope.row.Title | returnVal}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="金额"
                show-overflow-tooltip
                prop="amount">
              </el-table-column>
              <el-table-column
                label="添加人"
                show-overflow-tooltip
                prop="RealName">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!--/内容区-->

    <!--客户意向表-->
    <intentionTablePage :showIntentionTableDiaLog="showIntentionTableDiaLog" :isFormCalendar='myBoolean'
                        :intentionTableType="intentionTableType"></intentionTablePage>
    <!--回馈表-->
    <feedbackTablePage :showFeedbackTableDiaLog="showFeedbackTableDiaLog" :isFormCalendar="myBoolean"
                       :showFeedbackTableType="showFeedbackTableType"></feedbackTablePage>

    <!--设备领取-->
    <getSheBei :showGetSheBeiDiaLog="showGetSheBeiDiaLog"></getSheBei>

    <!--上传初稿/审核-->
    <uploadVideoPage :showUploadVideoDiaLog="showUploadVideoDiaLog" :myType="myType"></uploadVideoPage>

    <!--邮寄碟片-->
    <sendDiscPage :showSendDiscDiaLog="showSendDiscDiaLog"></sendDiscPage>

    <!--基本信息-->
    <baseNewPage ref="editPersonManagePage" type="update"
                 :showAddOrderStep2DiaLog="baseInInformation.showAddOrderStep2DiaLog"></baseNewPage>
    <!--婚礼客户详情-->
    <customerPage ref="editCustomerPage" type="update"
                  :showAddOrderStep3DiaLog="showAddOrderStep3_1DiaLog"></customerPage>
    <!--活动客户详情-->
    <customerPage2 ref="editCustomerPage2" type="update"
                   :showAddOrderStep3DiaLog="showAddOrderStep3_2DiaLog"></customerPage2>
    <!--人员安排-->
    <personManagePage type="details" :showPersonManageDiaLog="showPersonManageDiaLog"></personManagePage>

    <!--添加金额明细-->
    <addPriceDetailsPage :showAddPaymentRecordDiaLog="showAddPaymentRecordDiaLog" showType="true"
                         type="details"></addPriceDetailsPage>

    <baoZhangDetailsPage :baoZhangObj="baoZhangObj"></baoZhangDetailsPage>

    <!--酒店/婚庆详情-->
    <hotelDetails :showHotelOrHQDetailsDiaLog="showHotelOrHQDetailsDiaLog" :hotelOrHQObj="hotelOrHQObj"></hotelDetails>
  </div>
</template>

<script>
  import intentionTablePage from '../diaLog/orderIntentionTableDiaLog';//客户意向表
  import feedbackTablePage from '../diaLog/orderFeedbackTableDiaLog';//回馈表
  import getSheBei from '../diaLog/getSheBei';//设备领取
  import uploadVideoPage from '../diaLog/uploadVideoDiaLog';//上传初稿
  import sendDiscPage from '../diaLog/sendDiscDiaLog';//邮寄碟片
  import baseNewPage from '../diaLog/addOrderStep2DiaLog';//基本信息
  import customerPage from '../diaLog/addOrderStep3-1DiaLog';//婚礼客户详情
  import customerPage2 from '../diaLog/addOrderStep3-2DiaLog';//活动客户详情
  import personManagePage from '../diaLog/personManageDiaLog';//人员安排
  import addPriceDetailsPage from '../diaLog/addPaymentRecordDiaLog';//添加金额明细
  import baoZhangDetailsPage from '../diaLog/baoZhangDetailsDiaLog';//报账详情
  import hotelDetails from '../diaLog/hotelOrHQDetails';//酒店/婚庆详情

  /*数据*/
  let dataObj = {
    showHotelOrHQDetailsDiaLog: false,
    hotelOrHQObj: {},
    myBoolean: true,
    returnFlag: false,
    orderDetailsRowObj: {},//点开订单详情保存的该行的信息
    orderTitle: '',//订单标题
    orderTitle2: '',//订单标题
    /*订单id*/
    orderId: '',
    /*订单状态*/
    orderState: '',
    /*订单状态列表*/
    orderStateList: [],
    orderStateData: [
      {
        StateId: 0, /*0意向表  1拍摄回传  2上传初稿   3审核确认  5邮寄碟片    没有返出来都改为等待完成*/
        StateColor: 0, /*0超期完成  1正常完成  2超时未完成  3等待完成*/
        UserName: '', /*执行人*/
      },
      {
        StateId: 6, /*6 领取设备*/
        StateColor: 3,
        UserName: '',
      },
      {
        StateId: 1,
        StateColor: 1,
        UserName: '',
      },
      {
        StateId: 2,
        StateColor: 2,
        UserName: '',
      },
      {
        StateId: 3,
        StateColor: 3,
        UserName: '',
      },
      {
        StateId: 5,
        StateColor: 3,
        UserName: '',
      },
    ],
    /*角色*/
    roleName: '',

    showIntentionTableDiaLog: false,
    showFeedbackTableDiaLog: false,
    intentionTableType: 0,
    showFeedbackTableType: 0,
    /*===设备领取===*/
    showGetSheBeiDiaLog: false,

    /*===上传初稿===*/
    showUploadVideoDiaLog: false,
    uploadVideoObj: {},//上传初稿传输的数据
    myType: '',

    /*===邮寄碟片===*/
    showSendDiscDiaLog: false,
    /*===基本信息===*/
    baseInInformation: {
      showAddOrderStep2DiaLog: false,
      OrderDateStr: '',//订单日期
      HotelName: '',//酒店
      OrderType: '',//类型
      WeddingName: '',//婚庆
      ProjectName: '',//项目
      SourceName: '',//来源
    },
    /*===客户信息===*/
    customerInformation: {
      // showAddOrderStep3DiaLog: false,
      CustomerModel: {
        Remark: "",
        XLName: "",
        XLPhone: "",
        XNName: "",
        XNPhone: "",
      }
    },

    showAddOrderStep3_1DiaLog: false,
    showAddOrderStep3_2DiaLog: false,

    /*===人员安排===*/
    showPersonManageDiaLog: false,

    /*===订单金额===*/
    orderPriceObj: {
      amout: '',   //合同金额
      Payment: '',   //已支付金额
      objlist: []  //交款明细列表
    },
    showAddPaymentRecordDiaLog: false,

    isShowEditMenu1: false,//是否显示基本信息编辑按钮
    isShowEditMenu2: false,//是否显示客户信息编辑按钮
    isShowEditMenu3: false,//是否显示人员安排编辑按钮

    /*人员安排列表数据*/
    personManageListData: [
      {name: '销售', positionList: []},
      {name: '拍摄', positionList: []},
      {name: '后期', positionList: []},
      {name: '客服', positionList: []}
    ],
    /*收起 展示金额明细*/
    isShowPriceList: true,

    /*费用支出*/
    priceOutTableData: [],
    isShowOutNoData: false,
    showPriceOutDetailsDiaLog: false,
    baoZhangObj: {
      showPriceOutDetailsDiaLog: false
    },
    msg: 1,

  };
  /*方法*/
  let myMethods = {
    /*打开酒店或婚庆详情*/
    openDetails(type, key, itemObj) {
      if (key == 'hotel') {
        if (!itemObj.HotelId||itemObj.HotelId==''){
          return false
        }
        this[type] = true;
        this.hotelOrHQObj = {
          type: 'hotel',
          obj: itemObj
        }
      } else {
        if (!itemObj.WeddingId||itemObj.WeddingId==''){
          return false
        }
        this[type] = true;
        this.hotelOrHQObj = {
          type: 'HQ',
          obj: itemObj
        }
      }
    },
    /*打开报账详情*/
    openBaoZhangDetails(rowObj) {
      this.baoZhangObj.showPriceOutDetailsDiaLog = true;
      this.baoZhangObj.baoZhangRowObj = rowObj;
    },

    //进入详情清除弹出的弹框
    clearDiaLog() {
      this.showPersonManageDiaLog = false;
      this.showAddPaymentRecordDiaLog = false;
      this.showGetSheBeiDiaLog = false;
      this.showUploadVideoDiaLog = false;
      this.showSendDiscDiaLog = false;
    },


    //订单状态处弹出内容
    openThisContent(itemObj) {
      if (itemObj.StateId == 0) {/*客户意向表*/
        if (this.isFormCalendar) {
          this.showIntentionTableDiaLog = true;
          this.intentionTableType = 1;
        } else {
          this.$parent.showIntentionTableDiaLog = true;//打开客户意向表
          this.$parent.intentionTableType = 1;//1代表从详情中点进去的
          this.$parent.orderId = this.orderId;
        }
      } else if (itemObj.StateId == 6) {/*设备领取*/
        this.showGetSheBeiDiaLog = true;
      } else if (itemObj.StateId == 1) {/*拍摄回传*/
        if (this.isFormCalendar) {
          this.showFeedbackTableDiaLog = true;
          this.showFeedbackTableType = 1;
        } else {
          this.$parent.showFeedbackTableDiaLog = true;//打开回馈表
          this.$parent.orderId = this.orderId;
          this.$parent.showFeedbackTableType = 1;//1表示从详情中点开
        }
      } else if (itemObj.StateId == 2) {/*上传初稿*/
        this.showUploadVideoDiaLog = true;
        this.myType = 1;
        this.$parent.showUpVideoAddress = 1;//1表示从详情中点开
      } else if (itemObj.StateId == 3) {/*审核确认*/
        this.showUploadVideoDiaLog = true;
        this.myType = 2;
        this.$parent.showUpVideoAddress = 1;//1表示从详情中点开
      } else if (itemObj.StateId == 5) {/*邮寄碟片*/
        this.showSendDiscDiaLog = true;
        this.$parent.showSendDiscAddress = 1;//1表示从详情中点开
      }
    },

    //添加金额明细
    addPriceDetailsFn() {
      this.showAddPaymentRecordDiaLog = true;
      // this.$parent.$refs.ourOrderRouterView.$refs.priceDetailsDiaLog.$refs.addPaymentRecordPage.isAdd = true;
      this.$store.commit('keepPriceIsAdd', true)
    },
    closeDialog(type) {
      this.showHotelOrHQDetailsDiaLog = false;
      if (type == 'orderStep3DiaLog') {
        this.showAddOrderStep3_1DiaLog = false;
      } else if (type == 'baseNew') {
        this.baseInInformation.showAddOrderStep2DiaLog = false;
      }
      this.showPersonManageDiaLog = false;
      this.showAddPaymentRecordDiaLog = false;
      this.showGetSheBeiDiaLog = false;
      this.showUploadVideoDiaLog = false;
      this.showSendDiscDiaLog = false;
      this.showAddOrderStep3_2DiaLog = false;

      this.showIntentionTableDiaLog = false;
      this.showFeedbackTableDiaLog = false;

      this.baoZhangObj.showPriceOutDetailsDiaLog = false;
    },
    //编辑
    editNews(type) {
      if (type == 'customer') {
        if (this.customerInformation.OrderType == 1) {
          this.showAddOrderStep3_1DiaLog = true;
          this.$refs.editCustomerPage.editOpenFn(this.customerInformation);
        } else if (this.customerInformation.OrderType == 2) {
          this.showAddOrderStep3_2DiaLog = true;
          this.$refs.editCustomerPage2.editOpenFn(this.customerInformation);
        }
      } else if (type == 'baseNews') {
        this.baseInInformation.showAddOrderStep2DiaLog = true;
        this.$refs.editPersonManagePage.editOpenFn(this.baseInInformation);
      } else if (type == 'person') {
        this.showPersonManageDiaLog = true;
      }
    },
    //返回列表
    returnListPage() {
      if (!this.returnFlag) {
        this.returnFlag = true;
        if (!this.isFormCalendar) {
          let menuId = this.$route.query.id;
          if (menuId == 5) {
            this.$parent.$refs.ourOrderRouterView.getSearchTime(2);//刷新数据1
          } else {
            this.$parent.$refs.ourOrderRouterView.getOrderData2();//刷新数据2
          }
        } else {
          this.$emit('closeOrderDetailsPage')
        }
      }
    },
    //点击显示编辑按钮
    isShowEditMenu(type) {
      if (type == 1) {
        this.isShowEditMenu1 = true;
        this.isShowEditMenu2 = false;
        this.isShowEditMenu3 = false;
      } else if (type == 2) {
        this.isShowEditMenu2 = true;
        this.isShowEditMenu1 = false;
        this.isShowEditMenu3 = false;
      } else if (type == 3) {
        this.isShowEditMenu3 = true;
        this.isShowEditMenu2 = false;
        this.isShowEditMenu1 = false;
      }
    },

    //费用支出展开行时
    expandChange(row) {
      this.getPriceOutDetails(row);
    },

    //点击展示 或收起金额明细列表
    clickIsShowPriceList(type) {
      // console.log(type)
      this.isShowPriceList = type;
    },
    //费用支出表头类名
    headerClassName() {
      return 'priceOutTableHeaderStyle'
    },
    //费用支出表格类名
    rowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'priceOutTableRowStyle priceOutTableRow2nStyle'
      } else {
        return 'priceOutTableRowStyle priceOutTableRow1nStyle'
      }
    },
    //费用支出表头类名2
    headerClassName2() {
      return 'priceOutTableHeaderStyle2'
    },
    //费用支出表格类名2
    rowClassName2({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'priceOutTableRowStyle2 priceOutTableRow2nStyle2'
      } else {
        return 'priceOutTableRowStyle2 priceOutTableRow1nStyle2'
      }
    },
    //初始化事件
    loadEvent() {
      let that = this;
      $('body').click((e) => {
        that.isShowEditMenu1 = false;
        that.isShowEditMenu2 = false;
        that.isShowEditMenu3 = false;
      })
    },
    //获取订单状态列表(6个小方块)
    getOrderStateList() {
      this.orderStateList = [];
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetOrderStateListByOrderId';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log('6个小方块状态',res)
            /*StateId: 0意向表  1拍摄回传  2上传初稿   3审核确认  5邮寄碟片    没有返出来都改为等待完成*/
            /*StateColor: 0超期完成  1正常完成  2超时未完成  3等待完成*/
            /*将所有状态全部重置等待完成*/
            this.orderStateData.forEach((item, index, arr) => {
              arr[index].StateColor = 3;
              arr[index].UserName = '';
            });
            this.orderStateList = res.data.date;
            if (res.data.date.length == 0) {
              this.orderStateData.forEach((item, index, arr) => {
                arr[index].StateColor = 3;
                arr[index].UserName = '';
              })
            } else {
              res.data.date.forEach((item, index, arr) => {
                this.orderStateData.forEach((item2, index2, arr2) => {
                  if (arr[index].StateId == arr2[index2].StateId) {
                    arr2[index2] = arr[index];
                    this.msg++;
                  }
                });
              })
            }
          }
        }
      })
    },
    //获取该订单的角色
    getOrderRole() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraIntentionTable/GetMyOrderPostNameByOrderId';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.roleName = res.data.date
          }
        }
      })
    },
    //获取订单状态
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
            this.orderState = res.data.data.OrderState;
            // console.log(this.orderState)
          }
        }
      })
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
            this.orderTitle2 = res.data.data;
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
    /*根据订单获取基本信息*/
    getBaseInformation() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderBasicInfoByOrderId';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.showHotelOrHQDetailsDiaLog = false;
            res.data.data.showAddOrderStep2DiaLog = false;
            this.baseInInformation = res.data.data;
            this.orderDetailsRowObj = res.data.data;//保存获取的某行信息
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
    /*根据订单获取客户信息*/
    getCustomerInformation() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderInfoByCustomerInfoList';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res.data.data)
            this.customerInformation = res.data.data;
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
    /*根据订单获取人员安排列表*/
    getPersonManageList() {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderPostUserList';
      let data = {
        OrderId: this.orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res.data.data)
            this.personManageListData[0].positionList = res.data.data.XSList;
            this.personManageListData[1].positionList = res.data.data.PSList;
            this.personManageListData[2].positionList = res.data.data.HQList;
            this.personManageListData[3].positionList = res.data.data.KFList;
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
    /*根据订单获取订单金额*/
    getOrderPrice() {
      let url = '/xlapi/CameraManage/AmountManage/AmountOrder/showorderamount';
      let data = {
        strorderid: this.orderId
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.status == 200) {
            this.orderPriceObj = res.data;
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
    /*根据订单获取报账支出*/
    getPriceOut() {
      this.isShowOutNoData = true;
      let url = '/xlapi/CameraManage/AmountManage/Amount/getorderapplylist';
      let data = {
        strorderid: this.orderId
        // strorderid: '15b5b8a8-2387-403a-9ad0-5101e3580cd6'
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            // console.log(res.data)
            res.data.forEach((item, index, arr) => {
              arr[index].data = [];
            });
            this.priceOutTableData = res.data;
            if (res.data.length == 0) {
              this.isShowOutNoData = true;
            } else {
              this.isShowOutNoData = false;
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
    /*获取报账支出里表数据*/
    getPriceOutDetails(obj) {
      let url = '/xlapi/CameraManage/AmountManage/Amount/getprojectlist';
      let data = {
        orderid: this.orderId,
        applyid: obj.ID,
        stae: '',
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.status == 200) {
            obj.data = res.data;
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
    }
  };
  export default {
    name: "orderManage-details",
    props: {
      isFormCalendar: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return dataObj;
    },
    components: {
      getSheBei: getSheBei,
      uploadVideoPage: uploadVideoPage,
      sendDiscPage: sendDiscPage,
      baseNewPage: baseNewPage,
      customerPage: customerPage,
      customerPage2: customerPage2,
      personManagePage: personManagePage,
      addPriceDetailsPage: addPriceDetailsPage,
      baoZhangDetailsPage: baoZhangDetailsPage,
      hotelDetails: hotelDetails,
      intentionTablePage,
      feedbackTablePage
    },
    methods: myMethods,
    created() {
      this.clearDiaLog();
      this.orderId = this.$parent.orderDetailsRowObj.OrderId;//保存获取的某行orderId
      this.loadEvent();
    },
    mounted() {
      this.returnFlag = false;
      this.getOrderTitle();
      this.getOrderState();
      this.getOrderStateList();
      this.getOrderRole();
      this.getBaseInformation();
      this.getCustomerInformation();
      this.getPersonManageList();
      this.getOrderPrice();
      this.getPriceOut();
    },
    filters: {
      OrderTypeFn(val) {
        if (val == 1) {
          return '婚礼拍摄';
        } else if (val == 2) {
          return '活动拍摄';
        }
      },
      orderState(val) {//0 待回馈订单  1拍摄待交接   2后期制作   3待审核  4退回   5待移交客户  6订单完成
        if (val == 0) {
          return '待回馈订单';
        } else if (val == 1) {
          return '拍摄待交接';
        } else if (val == 2) {
          return '后期制作';
        } else if (val == 3) {
          return '待审核';
        } else if (val == 4) {
          return '退回';
        } else if (val == 5) {
          return '待移交客户';
        } else if (val == 6) {
          return '订单完成';
        }
      },
      filterRoleName(val) {
        if (val == '') {
          return '无';
        } else {
          return val;
        }
      },
      stateTitle(val) {
        if (val == 0) {
          return '客户意向表';
        } else if (val == 6) {
          return '领取设备';
        } else if (val == 1) {
          return '拍摄回传';
        } else if (val == 2) {
          return '上传初稿';
        } else if (val == 3) {
          return '审核确认';
        } else if (val == 5) {
          return '邮寄碟片';
        }
      },
      StateName(val) {
        if (val == 0) {
          return '超期完成';
        } else if (val == 1) {
          return '正常完成';
        } else if (val == 2) {
          return '超时未完成';
        } else if (val == 3) {
          return '等待完成';
        }
      },
      OrderDateStrFn(val) {
        // return val.replace(/-/g, '.');
        return val!=null&&val!=''?val.replace(/-/g, '.'):'';
      },
      OrderTimeTypeFn(val) {
        return val!=null&&val!=''?val.replace(/-/g, '.'):'';
      },
      addtimeReturn(val) {
        return val.replace(/\//g, '.');
      },
      returnVal(val) {
        if (val == null || val == '') {
          return '无';
        } else {
          return val;
        }
      },
      returnState(val) {
        if (val == null || val == '') {
          return '无';
        } else {
          return val;
        }
      }
    },
    computed: {
      //未支付金额计算
      noPayPrice() {
        return this.orderPriceObj.amout - this.orderPriceObj.Payment
      },
      //费用支出金额计算
      allPriceOut() {
        let num = 0;
        this.priceOutTableData.forEach((item, index, arr) => {
          num += arr[index].amount;
        });
        return '￥' + num.toFixed(2);
      }
    },

  }
</script>

<style scoped>
  @import "../../../../static/css/orderTableStyle.css";

  #orderManage-details {
    height: 100%;
    padding: 20px;
    overflow: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .details-crumbs {
    text-align: left;
    position: relative;
  }

  .details-crumbs .returnList {
    position: absolute;
    right: 5px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    outline: none;
    background: transparent;
    border: 0;
    color: #999999;
    font-size: 14px;
    cursor: pointer;
  }

  .details-crumbs .returnList i {
    font-size: 16px;
    font-weight: 700;
    vertical-align: -1px;
    margin-right: 2px;
  }

  .details-crumbs .returnList:hover {
    color: #5996F8;
  }

  .details-crumbs ul li {
    float: left;
    font-size: 13px;
    color: #4C4C4C;
  }

  .details-crumbs ul li:first-of-type {
    color: #B2B2B2;
  }

  .details01 {
    width: 100%;
    height: 135px;
    margin: 20px 0;
    padding: 25px 40px;
    text-align: left;
    background: #fff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .details01 .details01-hotelName {
    font-size: 26px;
    color: #4C4C4C;
    margin-bottom: 30px;
  }

  .details01-btText div {
    display: inline-block;
    margin-right: 30px;
    font-size: 14px;
    color: #4C4C4C;
  }

  .details01-btText div span:first-of-type {
    color: #808080;
  }

  .details01-btText div.state span:last-of-type {
    color: #5996F8;
  }

  .listContent-left {
    height: 500px;
    width: 49.2%;
    float: left;
  }

  .listContent-right {
    height: 700px;
    width: 49.2%;
    float: right;
  }

  .listContent-left .leftBox {
    height: auto;
    /*min-height: 300px;*/
    background: #fff;
    margin-bottom: 20px;
    padding: 50px 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .listContent-left .leftBox .title,
  .listContent-right .rightBox .title {
    text-align: left;
    font-size: 14px;
    color: #4C4C4C;
    position: relative;
    font-weight: 700;
    margin-bottom: 28px;
  }

  .listContent-right .rightBox {
    background: #fff;
    margin-bottom: 20px;
    padding: 50px 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .listContent-orderState ul {
    display: flex;
    justify-content: space-between;
    padding: 0 1%;
    width: 100%;
    flex-wrap: wrap;
    padding-top: 30px;
  }

  .listContent-orderState ul li {
    width: 90px;
    margin-bottom: 30px;
    position: relative;
  }

  .listContent-orderState ul li i {
    position: absolute;
    top: -16px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .listContent-orderState ul li span {
    font-size: 14px;
  }

  .listContent-orderState ul li span:first-of-type {
    width: 90px;
    height: 90px;
    background: #FFF6EB;
    border-radius: 10px;
    display: inline-block;
    line-height: 90px;
    color: #FFA04D;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .listContent-orderState ul li span:nth-of-type(2) {
    margin: 20px 0 10px;
    display: inline-block;
    width: 100%;
  }

  .listContent-orderState ul li span:nth-of-type(3) {
    color: #BBBBBB;
  }

  .moreIcon {
    position: absolute;
    right: 0;
    cursor: pointer;
    font-size: 20px;
    color: #BBBBBB;
  }

  .moreIcon:hover {
    color: #5996F8;
  }

  .contentBox {
    padding: 20px 10%;
    text-align: left;
  }

  .contentBox ul li {
    width: 48%;
    margin-bottom: 20px;
    margin-right: 10px;
    float: left;
    font-size: 14px;
    color: #4C4C4C;
    text-align: left;
  }

  .contentBox ul li:nth-of-type(2n) {
    margin-right: 0;
    float: right;
  }

  .contentBox ul li:last-of-type {
    margin-bottom: 0;
  }

  .contentBox ul li span:first-of-type {
    color: #808080;
    display: inline-block;
  }

  .contentBox .KHNews li:last-of-type {
    width: auto;
  }

  /*人员安排样式*/
  .list {
    width: 50%;
    float: left;
    text-align: left;
  }

  .list .label {
    color: #808080;
    font-size: 14px;
  }

  .list:nth-of-type(2n) {
    float: right;
  }

  .list:nth-of-type(3), .list:nth-of-type(4) {
    margin-bottom: 0;
  }

  .list ul {
    height: 100px;
    overflow: auto;
    margin-top: 10px;
  }

  .list ul li {
    height: 30px;
    line-height: 30px;
    text-align: left;
    padding-left: 15px;
    color: #808080;
    font-size: 14px;
    transition: all .2s;
  }

  .list ul li .personBox {
    display: inline-block;
    overflow-x: auto;
    line-height: 20px;
    max-width: 55%;
    white-space: nowrap;
    vertical-align: -5px;
    box-sizing: border-box;
  }

  .list ul li span {
    color: #4C4C4C;
    font-weight: 700;
    position: relative;
    margin-right: 12px;
  }

  .listContent-personManage .content {
    padding: 20px 10%;
  }

  /*订单金额*/
  .orderPriceBox {
    padding: 20px 16%;
  }

  .priceBox {
    font-size: 14px;
    color: #4C4C4C;
  }

  .priceBox label {
    color: #808080;
  }

  .heTongPrice {
    float: left;
  }

  .handedPrice {
    float: right;
  }

  .noHandedPrice {
    text-align: left;
    margin: 20px 0 40px;
  }

  .priceDetails {
    text-align: left;
    margin-bottom: 25px;
  }

  .priceDetails .add {
    display: inline-block;
    color: #BBBBBB;
    width: 17px;
    height: 17px;
    background: url("../../../../static/img/order/add0.png") no-repeat center center;
    vertical-align: -3px;
    cursor: pointer;
    margin: 0 8px 0 20px;
    position: relative;
  }

  .priceDetails span {
    position: absolute;
    right: -40px;
    width: 30px;
    top: -2px;
  }

  .priceDetails .add:hover {
    background-image: url("../../../../static/img/order/add1.png");
  }

  .priceDetails .add:hover span {
    color: #5996F8;
  }

  .priceDetails .telescopic {
    float: right;
    cursor: pointer;
  }

  i.showIcon {
    font-size: 18px;
    vertical-align: -1px;
    margin-left: 10px;
  }

  i.showIcon1 {
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  i.showIcon2 {
    font-size: 18px;
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }

  .icon1 {
    color: #5996F8;
    cursor: pointer;
  }

  .icon1:hover, .icon2:hover {
    color: #5996F8;
  }

  .icon2 {
    color: #BBB;
    cursor: pointer;
  }

  .priceList dl dd {
    /*width: 376px;*/
    height: 100px;
    background: rgba(246, 246, 246, 1);
    border-radius: 5px;
    padding: 0 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0 auto 14px;
  }

  .priceList-hd {
    border-bottom: 1px solid #DDDDDD;
    height: 45px;
    line-height: 44px;
    text-align: left;
    font-size: 14px;
    color: #808080;
    font-weight: 700;
  }

  .priceList-hd .right {
    color: #BBBBBB;
    font-size: 13px;
    float: right;
    font-weight: 400;
  }

  .priceList-bt {
    height: 55px;
    line-height: 55px;
    text-align: left;
    font-size: 14px;
    color: #808080;
  }

  .priceList-bt .right {
    float: right;
  }

  .priceList-hd .right span:nth-of-type(2) {
    margin: 0 12px 0 5px;
  }

  .priceList-bt .zt {
    color: #FF7E00;
  }

  /*======动画======*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    /*height: 0;*/
  }

  /*费用支出表格样式*/

  .priceOut >>> .el-table {
    border: 1px solid #DDD;
  }

  .priceOut >>> .el-table__header {
    border: 0;
  }

  .priceOut >>> .el-table__body-wrapper {
    border: 0;
    background-color: #fff;
  }

  .priceOut >>> .el-table__body {
    border: 0;
    border-right: 1px solid #DDD;
  }

  .priceOut >>> .priceOutTableHeaderStyle th {
    background: #E6E6E6;
    height: 46px;
    text-align: center;
    font-size: 14px;
    color: #808080;
    padding: 11px 0;
  }

  .priceOut >>> .priceOutTableRowStyle td {
    text-align: center;
    height: 55px;
    line-height: 55px;
    font-size: 14px;
    color: #4C4C4C;
    border-bottom: 0;
  }

  >>> .priceOutTableRowStyle:hover td {
    background: #F0F4FA !important;
    color: #5996F8;
  }

  .priceOut >>> .priceOutTableRowStyle td:first-of-type {
    border-right: 1px solid #DDDDDD;
  }

  .priceOut >>> .expanded td:first-of-type {
    background: rgba(238, 238, 238, 1);
  }

  .priceOut >>> .priceOutTableRowStyle:last-of-type td {
    border-bottom: 0;
  }

  .priceOut >>> .priceOutTableRow2nStyle td {
    background: rgba(247, 247, 247, 1);
  }

  .priceOut >>> .el-table__expand-icon > .el-icon {
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    transition: all .1s;
    font-size: 18px;
    margin-left: -10px;
    margin-top: -8px;
  }

  .priceOut >>> .el-table__expand-icon--expanded .el-icon {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
    color: #3196FA;
  }

  .priceOut >>> .el-table__expanded-cell {
    padding: 0;
  }

  >>> .priceOutTableHeaderStyle2 th {
    padding: 8px 0;
    text-align: center;
    background: #EEEEEE;
    color: #808080;
    border-right: 1px solid #DDD;
  }

  >>> .priceOutTableHeaderStyle2 th:nth-last-of-type(2) {
    border-right: 0;
  }

  >>> .priceOutTableRowStyle2 td {
    padding: 7px 0;
    text-align: center;
    border-right: 1px solid #DDD;
    color: #808080;
  }

  >>> .priceOutTableRowStyle2:hover td {
    color: #5996F8;
  }

  >>> .priceOutTableRowStyle2 td:last-of-type {
    border-right: 0;
  }

  >>> .priceOutTableRow1nStyle2 td {
    background: #FAFAFA;
  }

  >>> .priceOutTableRow2nStyle2 td {
    background: #F4F4F4;
  }

  >>> .priceOutTableRow1nStyle2:hover td {
    background: #FAFAFA !important;
  }

  >>> .priceOutTableRow2nStyle2:hover td {
    background: #F4F4F4 !important;
  }

  /*编辑图标*/
  .editMenu {
    position: absolute;
    right: -28px;
    top: 20px;
    width: 50px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
    color: #5996F8;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(154, 182, 228, 1);
    border-radius: 5px;
    cursor: pointer;
  }

  .editMenu::before {
    content: '';
    position: absolute;
    top: -4px;
    width: 6px;
    height: 6px;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    background: #fff;
    border-top: 1px solid rgba(154, 182, 228, 1);
    border-left: 1px solid rgba(154, 182, 228, 1);
  }

  .returnListPage {
    transition: all .2s;
  }

  .returnListPage:hover .return {
    color: #5996F8;
    cursor: pointer;
  }

  .noDataBox {
    min-height: 125px;
    position: relative;
  }

  .clickTip {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    font-size: 12px;
    transition: all .2s;
    padding: 0;
    position: absolute;
    left: -25px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .clickTip >>> .el-button {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    font-size: 12px;
    transition: all .2s;
    padding: 0;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
    border-color: #BBB;
    color: #BBB;
  }

  .clickTip >>> .el-button:hover {
    border-color: #5996F8;
    color: #5996F8;
  }

  .FJSPAN:last-of-type i {
    display: none;
  }
</style>
