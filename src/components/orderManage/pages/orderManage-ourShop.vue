<!--本店订单-->
<template>
  <div id="orderManageTable" ref="orderManageTable" :style="{position:myPosition}">
    <noData msg="暂无订单相关数据" v-if="tableArr.length==0"></noData>
    <div style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;z-index: 9999;" v-if="isShowMyLoading"
         v-loading="isShowMyLoading"></div>
    <div ref="tableBox" :class="['tableBox']">
      <el-table
        :data="tableData"
        border
        :summary-method="getSummaries"
        show-summary
        v-if="isShowTable"
        sum-text="合计："
        :max-height="tableHeight"
        :style="{border:0,borderTop:'1px solid #DDD'}"
        :header-row-class-name="headerClassName"
        :row-class-name="rowClassName"
        ref="table"
        @cell-mouse-leave="hideRightClickMenu"
        style="width: 100%;text-align: center">
        <template v-if="menuId!=6">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="90">
            <template slot-scope='scope'>
              <span class="stateIcon" v-if="scope.row.OrderIsUrgent"><img src="../../../../static/img/order/jiaji.png"
                                                                          alt="加急" title="订单加急"></span>
              <!--v-if="scope.row.OrderIsUrgent"-->
              <span class="stateIcon" v-if="scope.row.OrderIsChaoQi"><img src="../../../../static/img/order/chaoqi.png"
                                                                          alt="超级" :title="'订单超期'+scope.row.CQDays+'天'"></span>
              <!--v-if="scope.row.OrderIsChaoQi"-->
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            width="90px"
            align="center">
            <template slot-scope=scope>
              <span v-if="scope.row.isHeJi==undefined"><a href="javascript:void(0)"
                                                          @click="openOrderDetails(scope.row)">详情</a></span>
              <span v-if="scope.row.isHeJi==undefined"><a href="javascript:void(0)" class="delOrder"
                                                          @click="delOrder(scope.row)">删除</a></span>
              <span v-if="scope.row.isHeJi">合计：</span>
            </template>
          </el-table-column>

          <el-table-column
            label="日期"
            show-overflow-tooltip
            width="180px"
            align="center">
            <template slot-scope=scope>
              <!--<span style="font-weight: 700;color: red;">!</span>&lt;!&ndash; v-if="scope.row.isCQ"&ndash;&gt;-->
              <span v-cloak ref="spanPosition" style="position: relative;">
                {{scope.row.OrderDateStr|OrderDateStr}}-{{scope.row.OrderTimeType|OrderTimeType}}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="酒店"
            show-overflow-tooltip
            min-width="120px"
            align="center">
            <template slot-scope=scope>
              <span v-cloak v-if="scope.row.HotelName_New&&scope.row.HotelName_New!=''&&scope.row.OrderType==1">({{scope.row.CityName}}){{scope.row.HotelName}}</span>
              <span style="color: #BBB;"
                    v-if="(!scope.row.HotelName_New||scope.row.HotelName_New=='')&&scope.row.OrderType==1">暂无酒店</span>
              <span v-cloak v-if="scope.row.HotelOtherRemark&&scope.row.HotelOtherRemark!=''&&scope.row.OrderType==2">{{scope.row.HotelOtherRemark}}</span>
              <span style="color: #BBB;"
                    v-if="(!scope.row.HotelOtherRemark||scope.row.HotelOtherRemark=='')&&scope.row.OrderType==2">暂无拍摄地点</span>
            </template>
          </el-table-column>


          <el-table-column
            label="婚庆"
            show-overflow-tooltip
            align="center">
            <template slot-scope=scope>
              <span v-cloak v-if="scope.row.WeddingName&&scope.row.WeddingName!=''&&scope.row.OrderType==1">{{scope.row.WeddingName}}</span>
              <span style="color: #BBB;"
                    v-if="(!scope.row.WeddingName||scope.row.WeddingName=='')&&scope.row.OrderType==1">暂无婚庆公司</span>
              <span v-cloak v-if="scope.row.OrderType==2" title="活动订单无婚庆公司">---</span>
            </template>
          </el-table-column>

          <el-table-column
            label="客户"
            show-overflow-tooltip
            align="center">
            <template slot-scope=scope>
              <span v-cloak v-if="scope.row.CustomerName&&scope.row.CustomerName!=''">{{scope.row.CustomerName}}</span>
              <span style="color: #BBB;" v-if="!scope.row.CustomerName||scope.row.CustomerName==''">暂无姓名</span>
            </template>
          </el-table-column>

          <el-table-column
            label="项目"
            show-overflow-tooltip
            sortable="custom"
            align="center">
            <template slot-scope=scope>
              <span v-cloak>{{scope.row.ProjectName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            sortable="custom"
            width='120px'
            align="center">
            <template slot-scope=scope>
              <!--待回馈订单--><span class="click_hover" @click="openDiaLog(scope.row,0)"
                                v-if="scope.row.OrderState==null||scope.row.OrderState==0" title="点击打开意向表">{{scope.row.OrderState | filterOrderState}}</span>
              <!--拍摄待交接--> <span class="click_hover" @click="openDiaLog(scope.row,1)" title="点击打开回馈表"
                                 v-if="scope.row.OrderState==1">{{scope.row.OrderState | filterOrderState}}</span>
              <!--后期制作--><span class="click_hover" @click="openDiaLog(scope.row,4)" title="点击打开上传初稿"
                               v-if="scope.row.OrderState==2">{{scope.row.OrderState | filterOrderState}}</span>
              <!--待审核--><span class="click_hover" @click="openDiaLog(scope.row,3)" v-if="scope.row.OrderState==3">{{scope.row.OrderState | filterOrderState}}</span>
              <!--退回--><span class="click_hover" @click="openDiaLog(scope.row,4)" title="点击打开上传初稿"
                             v-if="scope.row.OrderState==4">{{scope.row.OrderState | filterOrderState}}</span>
              <!--待移交客户--><span class="click_hover" @click="openDiaLog(scope.row,5)" title="点击打开邮寄碟片"
                                v-if="scope.row.OrderState==5">{{scope.row.OrderState | filterOrderState}}</span>
              <!--订单完成--><span v-if="scope.row.OrderState==6">{{scope.row.OrderState | filterOrderState}}</span>

            </template>
          </el-table-column>

          <!--销售-->
          <el-table-column
            label="销售"
            width="100px"
            align="center">
            <template slot-scope=scope>
              <span :class="{notMoreList:scope.row.XSList.length==1}">
                <template v-for="(items,index) in scope.row.XSList">
                  <span v-if="index<1" class="hover" title="点击修改"
                        @click="personManage(scope.row)">{{items.UserName}}</span>
                </template>
                <span v-if="scope.row.XSList.length==0"><a href="javascript:void(0)" class="commonColor"
                                                           @click="openPersonDiaLog(scope.row)">添加</a></span>
              </span>
              <div class="moreImg" title="点击修改" v-if="scope.row.XSList.length>1" @click="showMoreList($event,'XS')">
                <div class="moreList" v-show="scope.row.isShowSaleMenu" :style="{top:moreMenuTop,left:moreMenuLeft}">
                  <ul>
                    <li v-for="(items,index) in scope.row.XSList" v-if="index>0">{{items.UserName}}</li>
                    <li class="change" @click="personManage(scope.row)">修改</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-table-column>
          <!--拍摄-->
          <el-table-column
            label="拍摄"
            sortable="custom"
            width="180px"
            align="center">
            <template slot-scope=scope>
              <span :class="{notMoreList:scope.row.PSList.length<=2&&scope.row.PSList.length>0}">
                <span class="hover">
                  <template v-for="(item2,index) in scope.row.PSList">
                      <span class="morePS" title="点击修改" @click="personManage(scope.row)"
                            v-if="scope.row.PSList.length==1">{{item2.UserName}}</span>
                      <span class="morePS" title="点击修改" @click="personManage(scope.row)"
                            v-if="scope.row.PSList.length==2">{{item2.UserName}}<i>、</i></span>
                      <span class="morePS " v-if="scope.row.PSList.length>2&&index<2">{{item2.UserName}}<i>、</i></span>
                  </template>
                </span>
              </span>
              <span v-if="scope.row.PSList.length==0"><a href="javascript:void(0)" class="commonColor"
                                                         @click="openPersonDiaLog(scope.row)">添加</a></span>
              <div class="moreImg" title="点击修改" @click="showMoreList($event,'PS')"
                   v-if="scope.row.PSList.length>2">

                <div class="moreList" v-show="scope.row.isShowShotMoreMenu"
                     :style="{top:moreMenuTop,left:moreMenuLeft}">
                  <ul>
                    <li v-for="(items,index) in scope.row.PSList" v-if="index>1">{{items.UserName}}</li>
                    <li class="change" @click="personManage(scope.row)">修改</li>
                  </ul>
                </div>
              </div>

            </template>
          </el-table-column>
          <!--后期-->
          <el-table-column
            label="后期"
            width="100px"
            align="center">
            <template slot-scope=scope>
              <span :class="{notMoreList:scope.row.HQList.length==1}">
                 <template v-for="(items,index) in scope.row.HQList">
                  <span v-if="index<1" title="点击修改" class="hover"
                        @click="personManage(scope.row)">{{items.UserName}}</span>
                </template>
                <span v-if="scope.row.HQList.length==0"><a href="javascript:void(0)" class="commonColor"
                                                           @click="openPersonDiaLog(scope.row)">添加</a></span>
              </span>

              <div class="moreImg" title="点击修改" @click="showMoreList($event,'HQ')"
                   v-if="scope.row.HQList.length>1">
                <div class="moreList" v-show="scope.row.isShowLastTimeMenu"
                     :style="{top:moreMenuTop,left:moreMenuLeft}">
                  <ul>
                    <li v-for="(items,index) in scope.row.HQList" v-if="index>0">{{items.UserName}}</li>
                    <li class="change" @click="personManage(scope.row)">修改</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-table-column>
          <!--客服-->
          <el-table-column
            label="客服"
            width="100px"
            align="center">
            <template slot-scope=scope>
            <span :class="{notMoreList:scope.row.KFList.length==1}">
              <template v-for="(items,index) in scope.row.KFList">
                  <span v-if="index<1" title="点击修改" class="hover"
                        @click="personManage(scope.row)">{{items.UserName}}</span>
                </template>
                <span v-if="scope.row.KFList.length==0"><a href="javascript:void(0)" class="commonColor"
                                                           @click="openPersonDiaLog(scope.row)">添加</a></span>
              </span>

              <div class="moreImg" title="点击修改" @click="showMoreList($event,'KF')"
                   v-if="scope.row.KFList.length>1">
                <div class="moreList" v-show="scope.row.isShowCustomerMenu"
                     :style="{top:moreMenuTop,left:moreMenuLeft}">
                  <ul>
                    <li v-for="(items,index) in scope.row.KFList" v-if="index>0">{{items.UserName}}</li>
                    <li class="change" @click="personManage(scope.row)">修改</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-table-column>

          <!--已收金额-->
          <el-table-column
            label="已收金额"
            show-overflow-tooltip
            sortable="custom"
            v-if="menuId!=7&&this.$store.state.IsCanUpdateAmountInfo"
            width="105px"
            align="center">
            <template slot-scope=scope>
              <span style="cursor: pointer;display: inline-block; width: 100%;min-height: 23px;"
                    @click="openPriceDetails(scope.row)" title="点击查看已收金额" v-cloak
                    v-if="scope.row.PaymentAmount&&scope.row.PaymentAmount!=''">{{scope.row.PaymentAmount}}</span>
              <span @click="openPriceDetails(scope.row)" title="点击查看已收金额"
                    v-if="!scope.row.PaymentAmount||scope.row.PaymentAmount==''"
                    style="color: #BBB;cursor: pointer;display: inline-block; width: 100%;min-height: 23px;">暂无</span>
            </template>
          </el-table-column>
          <!--合同金额-->
          <el-table-column
            label="合同金额"
            show-overflow-tooltip
            sortable="custom"
            width="105px"
            v-if="menuId!=7&&this.$store.state.IsCanUpdateAmountInfo"
            align="center">
            <template slot-scope=scope>
              <span v-cloak>{{scope.row.Amount}}</span>
            </template>
          </el-table-column>

          <!--已拍摄(天)-->
          <el-table-column
            label="已拍摄(天)"
            show-overflow-tooltip
            sortable="custom"
            width="120px"
            v-if="menuId==7"
            align="center">
            <template slot-scope=scope>
              <span v-cloak>22</span>
            </template>
          </el-table-column>
        </template>
        <template v-if="menuId==6">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="90">
            <template slot-scope=scope>
              <span class="stateIcon" v-if="scope.row.OrderIsUrgent"><img src="../../../../static/img/order/jiaji.png"
                                                                          alt="加急" title="订单加急"></span>
              <!--v-if="scope.row.OrderIsUrgent"-->
              <span class="stateIcon" v-if="scope.row.OrderIsChaoQi"><img src="../../../../static/img/order/chaoqi.png"
                                                                          alt="超级" :title="'订单超期'+scope.row.CQDays+'天'"></span>
              <!--v-if="scope.row.OrderIsChaoQi"-->
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <!--待回馈订单-->
          <el-table-column
            label="操作"
            v-if="menuId==6"
            show-overflow-tooltip
            width="200px"
            align="center">
            <template slot-scope=scope>
              <span class="btn btn1" v-if="scope.row.isHeJi==undefined"><a href="javascript:void(0)"
                                                                           @click="openOrderDetails(scope.row)">查看详情</a></span>
              <span class="btn btn2" @click="openIntentionTable(scope.row)">填写意向表</span>
              <span class="btn btn2 delOrder" @click="delOrder(scope.row)">删除</span>
            </template>
          </el-table-column>

          <el-table-column
            label="日期"
            show-overflow-tooltip
            width="180px"
            align="center">
            <template slot-scope=scope>
              <span v-if="scope.row.isCQ" style="font-weight: 700;color: red;">!</span>
              <span v-cloak style="position: relative;">
                 <!--<span class="stateIcon"><img src="../../../../static/img/order/jiaji.png" alt="加急" title="订单加急"></span>-->
                <!--&lt;!&ndash;v-if="scope.row.isJJ"&ndash;&gt;-->
                <!--<span class="stateIcon"><img src="../../../../static/img/order/chaoqi.png" alt="超级" title="订单超期"></span>-->
                <!--&lt;!&ndash;v-if="scope.row.isCQ"&ndash;&gt;-->
                {{scope.row.OrderDateStr|OrderDateStr}}-{{scope.row.OrderTimeType|OrderTimeType}}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="地址"
            show-overflow-tooltip
            align="center">
            <template slot-scope=scope>
              <!--<span v-cloak>({{scope.row.CityName}}){{scope.row.HotelName_New}}</span>-->
              <span v-cloak v-if="scope.row.HotelName_New&&scope.row.HotelName_New!=''&&scope.row.OrderType==1">({{scope.row.CityName}}){{scope.row.HotelName_New}}</span>
              <span style="color: #BBB;"
                    v-if="(!scope.row.HotelName_New||scope.row.HotelName_New=='')&&scope.row.OrderType==1">暂无酒店</span>
              <span v-cloak v-if="scope.row.HotelOtherRemark&&scope.row.HotelOtherRemark!=''&&scope.row.OrderType==2">{{scope.row.HotelOtherRemark}}</span>
              <span style="color: #BBB;"
                    v-if="(!scope.row.HotelOtherRemark||scope.row.HotelOtherRemark=='')&&scope.row.OrderType==2">暂无拍摄地点</span>
            </template>
          </el-table-column>


          <el-table-column
            label="姓名"
            show-overflow-tooltip
            align="center">
            <template slot-scope=scope>
              <span v-cloak v-if="scope.row.CustomerName&&scope.row.CustomerName!=''">{{scope.row.CustomerName}}</span>
              <span style="color: #BBB;" v-if="!scope.row.CustomerName||scope.row.CustomerName==''">暂无姓名</span>
            </template>
          </el-table-column>

          <el-table-column
            label="项目"
            show-overflow-tooltip
            align="center">
            <template slot-scope=scope>
              <span v-cloak>{{scope.row.ProjectName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            align="center">
            <template slot-scope=scope>
              <span class="click_hover"
                    @click="openDiaLog(scope.row,0.2)">{{scope.row.OrderState | filterOrderState}}</span>
              <!--<div class="rightClickShadow" @contextmenu.prevent="stateRightClick($event,scope.row)"></div>-->

            </template>
          </el-table-column>

          <!--销售-->
          <el-table-column
            label="销售"
            width="160px"
            align="center">
            <template slot-scope=scope>
              <span :class="{notMoreList:scope.row.XSList.length<=2&&scope.row.XSList.length>0}">
                <span class="hover">
                  <template v-for="(item2,index) in scope.row.XSList">
                      <span class="morePS" title="点击修改" @click="personManage(scope.row)"
                            v-if="scope.row.XSList.length==1">{{item2.UserName}}</span>
                      <span class="morePS" title="点击修改" @click="personManage(scope.row)"
                            v-if="scope.row.XSList.length==2">{{item2.UserName}}<i>、</i></span>
                      <span class="morePS " v-if="scope.row.XSList.length>2&&index<2">{{item2.UserName}}<i>、</i></span>
                  </template>
                </span>
              </span>
              <span v-if="scope.row.XSList.length==0"><a href="javascript:void(0)" class="commonColor"
                                                         @click="openPersonDiaLog(scope.row)">添加</a></span>
              <div class="moreImg" title="点击修改" @click="showMoreList($event,'XS')"
                   v-if="scope.row.XSList.length>2">

                <div class="moreList" v-show="scope.row.isShowSaleMenu"
                     :style="{top:moreMenuTop,left:moreMenuLeft}">
                  <ul>
                    <li v-for="(items,index) in scope.row.XSList" v-if="index>1">{{items.UserName}}</li>
                    <li class="change" @click="personManage(scope.row)">修改</li>
                  </ul>
                </div>
              </div>

            </template>
          </el-table-column>
          <!--拍摄-->
          <el-table-column
            label="拍摄"
            sortable="custom"
            width="180px"
            align="center">
            <template slot-scope=scope>
              <span :class="{notMoreList:scope.row.PSList.length<=2&&scope.row.PSList.length>0}">
                <span class="hover">
                  <template v-for="(item2,index) in scope.row.PSList">
                      <span class="morePS" title="点击修改" @click="personManage(scope.row)"
                            v-if="scope.row.PSList.length==1">{{item2.UserName}}</span>
                      <span class="morePS" title="点击修改" @click="personManage(scope.row)"
                            v-if="scope.row.PSList.length==2">{{item2.UserName}}<i>、</i></span>
                      <span class="morePS " v-if="scope.row.PSList.length>2&&index<2">{{item2.UserName}}<i>、</i></span>
                  </template>
                </span>
              </span>
              <span v-if="scope.row.PSList.length==0"><a href="javascript:void(0)" class="commonColor"
                                                         @click="openPersonDiaLog(scope.row)">添加</a></span>
              <div class="moreImg" title="点击修改" @click="showMoreList($event,'PS')"
                   v-if="scope.row.PSList.length>2">

                <div class="moreList" v-show="scope.row.isShowShotMoreMenu"
                     :style="{top:moreMenuTop,left:moreMenuLeft}">
                  <ul>
                    <li v-for="(items,index) in scope.row.PSList" v-if="index>1">{{items.UserName}}</li>
                    <li class="change" @click="personManage(scope.row)">修改</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-table-column>

          <!--添加时间-->
          <el-table-column
            label="添加时间"
            show-overflow-tooltip
            align="center">
            <template slot-scope=scope>
              <span v-cloak>{{scope.row.AddTime | AddTime}}</span>
            </template>
          </el-table-column>
          <!--已拍摄(天)-->
          <el-table-column
            label="已拍摄(天)"
            show-overflow-tooltip
            sortable="custom"
            width="120px"
            v-if="menuId==7"
            align="center">
            <template slot-scope=scope>
              <span v-cloak>22</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!--人员查看弹框-->
    <personManageDiaLog type="list" :showPersonManageDiaLog="showPersonManageDiaLog"></personManageDiaLog>
    <!--金额明细界面-->
    <priceDetailsDiaLog :showPriceDetailsDiaLog="showPriceDetailsDiaLog" ref="priceDetailsDiaLog"></priceDetailsDiaLog>

    <!--删除提示-->
    <deleteTipDig @confirmDelete="confirmDelete" :showDeleteDig="showDeleteDig" dataName="订单"
                  otherText=""></deleteTipDig>

    <!--审核提示-->
    <returnOrSendDiscDiaLog @closeDiaLog="closeDialog" @nextEvent="nextEvent"
                            :showReturnOrSendDiscDiaLog="showReturnOrSendDiscDiaLog"></returnOrSendDiscDiaLog>

    <!--退回弹框-->
    <returnChongZuoDiaLog @closeDiaLog="showReturnChongZuoDiaLog = false" @confirm="confirmReturn"
                          :showReturnChongZuoDiaLog="showReturnChongZuoDiaLog"></returnChongZuoDiaLog>

  </div>
</template>
<script>
  import personManageDiaLog from '../diaLog/personManageDiaLog';//人员查看
  import priceDetailsDiaLog from '../diaLog/priceDetailsDiaLog';//金额明细
  import deleteTipDig from '../diaLog/deleteDiaLog';//删除提示
  import returnOrSendDiscDiaLog from '../diaLog/returnOrSendDiscDiaLog';//审核提示
  import returnChongZuoDiaLog from '../diaLog/returnChongZuo';//退回提示

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
    openIntentionTable(obj) {
      this.$parent.showIntentionTableDiaLog = true;
      this.$parent.orderId = obj.OrderId;
      this.$parent.intentionTableType = 2;//2代表从表格中点进去的
    },
    //获取本店订单表格数据
    getOrderData(obj, type) {
      this.$parent.$refs.orderNav.getNavNews();//更新菜单
      if (type == undefined) {
        this.isShowMyLoading = true;
      }
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraOrderInfoList';
      let data = {
        SearchStartTime: this.SearchStartTime,
        SearchEndTime: this.SearchEndTime,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.isShowTable = true;
            this.tableArr = res.data.data;
            res.data.data.forEach((items, index, arr) => {
              arr[index].isShowRightMenu = false;
              arr[index].isShowShotMoreMenu = false;
              arr[index].isShowSaleMenu = false;
              arr[index].isShowLastTimeMenu = false;
              arr[index].isShowCustomerMenu = false;
              if (arr[index].OrderState == null) {
                arr[index].OrderState = '0'
              }
            });
            this.sortFn(res.data);
            this.tableData = res.data.data;
            this.tableData2 = res.data;
            this.$parent.$refs.inputSelectSearch.searchNews();
            this.$parent.isShowOrderDetailsPage = false;
            if (this.$parent.$refs.orderDetailsPage != undefined) {
              this.$parent.$refs.orderDetailsPage.returnFlag = false;
            }
            this.tableHeight = $(this.$parent.$refs.orderManageCt).height();
            setTimeout(() => {
              this.isShowMyLoading = false;
            })
          }
        }
      })
    },

    /*根据菜单Id获取数据*/
    getOrderData2() {
      this.isShowMyLoading = true;
      this.$parent.$refs.orderNav.getNavNews();//更新菜单
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetCameraOrderInfoListByMenuId';
      let data = {
        MenuId: this.menuId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.isShowTable = true;
            this.tableArr = res.data.data;
            res.data.data.forEach((items, index, arr) => {
              arr[index].isShowRightMenu = false;
              arr[index].isShowShotMoreMenu = false;
              arr[index].isShowSaleMenu = false;
              arr[index].isShowLastTimeMenu = false;
              arr[index].isShowCustomerMenu = false;
              if (arr[index].OrderState == null) {
                arr[index].OrderState = '0'
              }
            });
            this.sortFn(res.data);
            this.tableData = res.data.data;
            this.tableData2 = res.data;
            // this.$parent.$refs.inputSelectSearch.searchNews();
            this.$parent.isShowOrderDetailsPage = false;
            if (this.$parent.$refs.orderDetailsPage != undefined) {
              this.$parent.$refs.orderDetailsPage.returnFlag = false;
            }
            this.tableHeight = $(this.$parent.$refs.orderManageCt).height();
            setTimeout(() => {
              this.isShowMyLoading = false;
            })
          }
        }
      })
    },

    //获取查询时间段
    getSearchTime(type) {
      setTimeout(() => {
        if (type == 1) {
          this.SearchStartTime = this.$parent.$refs.childSelectTime.value1;
          this.SearchEndTime = this.$parent.$refs.childSelectTime.value2;
        } else {
          this.SearchStartTime = this.SearchStartTime;
          this.SearchEndTime = this.SearchEndTime;
        }
        if (this.SearchStartTime == null) {
          this.SearchStartTime = '';
        } else if (this.SearchEndTime == null) {
          this.SearchEndTime = '';
        }
        this.getOrderData();
      });
    },

    //路由变化清除查询条件
    clearSearchCase() {
      this.$parent.$refs.inputSelectSearch.tags = [];
      this.$parent.$refs.inputSelectSearch.searchText = '';
    },

    //JSON数据按照订单时间进行排序
    sortFn(arr) {
      arr.data.sort(function (a, b) {
        return new Date(a.OrderDate).getTime() - new Date(b.OrderDate).getTime()
      });
    },

    //打开金额详情
    openPriceDetails(rowObj) {
      this.rowObj = rowObj;
      this.showPriceDetailsDiaLog = true;
    },
    //打开详情
    openOrderDetails(rowObj) {
      // this.$router.push({path: '/orderManage/orderManageDetails'})
      this.$parent.isShowOrderDetailsPage = true;
      this.$parent.orderDetailsRowObj = rowObj;
      this.$store.commit('keepOrderNews', rowObj)
    },

    /*删除订单*/
    delOrder(rowObj) {
      this.showDeleteDig = true;
      this.delRowObj = rowObj;
    },
    /*删除确认*/
    confirmDelete() {
      // console.log(this.menuId)
      // return
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/DeleteCameraOrderInfo';
      let data = {
        OrderId: this.delRowObj.OrderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          console.log(res)
          if (res.data.status) {
            if (this.menuId == 5) {
              this.getOrderData(1, 1);//更新数据
            } else {
              this.getOrderData2();//更新数据
            }
            this.showDeleteDig = false;
            this.$message({
              message: res.data.msg,
              customClass: 'msgTips',
              type: 'success'
            });
            return false;
          }
        }
      })
    },

    //打开人员安排界面
    openPersonDiaLog(rowObj) {
      // console.log(rowObj)
      this.rowObj = rowObj;
      this.showPersonManageDiaLog = true;
    },
    //关闭弹框
    closeDialog(type) {
      this.showReturnOrSendDiscDiaLog = false;
      // this.showReturnChongZuoDiaLog=false;
      this.showDeleteDig = false;
      this.showPriceDetailsDiaLog = false;
      if (type == 'selectPerson') {
        this.showPersonManageDiaLog = true;
      }
      this.showPersonManageDiaLog = false;
    },
    //获取合计
    getSummaries(param) {
      // console.log(param)
      const {columns, data} = param;
      const sums = [];
      if (this.menuId == 7 || this.menuId == 6) {
        let sums = '';
        return sums
      }
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计：';
          return;
        }
        let values;
        if (index == 12) {
          values = data.map(item => Number(item.PaymentAmount));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += 0;
        }

        if (index == 13) {
          values = data.map(item => Number(item.Amount));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += 0;
        }
      });

      return sums;
    },
    //鼠标移出单元格隐藏右击菜单
    hideRightClickMenu(row, column, cell, event) {
      $('.moreList').hide();
    },


    //状态--单元格的右击显示菜单
    stateRightClick(e, rowObj) {
      rowObj.isShowRightMenu = true;
      this.menuTop = $(e.target).offset().top + 40 + 'px';
      this.menuLeft = $(e.target).offset().left + 25 + 'px';
    },
    headerClassName({row, rowIndex}) {
      return 'orderTableHeaderStyle'
    },
    rowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'orderTableRowStyle orderTableRow2nStyle'
      } else {
        return 'orderTableRowStyle orderTableRow1nStyle'
      }
    },

    loadResize() {
      let that = this;
      $(window).resize(() => {
        that.tableHeight = $(that.$parent.$refs.orderManageCt).height();
      })
    },

    // 弹框初始化
    reloadDiaLog() {
      this.showPersonManageDiaLog = false;
      /*金额明细*/
      this.showPriceDetailsDiaLog = false;
    },

    showMoreList(e, type) {
      this.moreMenuTop = $(e.target).offset().top + 25 + 'px';
      this.moreMenuLeft = $(e.target).offset().left - 8 + 'px';
      $(e.target).find('.moreList').show();
    },
    /*打开人员安排*/
    personManage(rowObj) {
      this.openPersonDiaLog(rowObj);
    },

    /*打开各种弹框*/
    openDiaLog(rowObj, type) {
      this.$parent.orderId = rowObj.OrderId;
      this.orderId = rowObj.OrderId;
      if (type == 0) {
        this.$parent.showIntentionTableDiaLog = true;
        this.$parent.intentionTableType = 2.1;//2表示从表中点开
        this.$parent.orderId = rowObj.OrderId;
      } else if (type == 0.2) {
        this.$parent.showIntentionTableDiaLog = true;
        this.$parent.intentionTableType = 2;//2表示从表中点开
        this.$parent.orderId = rowObj.OrderId;
      } else if (type == 1) {
        this.$parent.showFeedbackTableDiaLog = true;
        this.$parent.showFeedbackTableType = 2;//2表示从表中点开
        this.$parent.orderId = rowObj.OrderId;
      } else if (type == 3) {
        this.$parent.showUploadVideoDiaLog = true;
        this.$parent.orderDetailsRowObj = rowObj;
        this.$parent.myType = 2;
        this.$parent.showUpVideoAddress = 2;//2表示从表中点开
      } else if (type == 4) {
        this.$parent.showUploadVideoDiaLog = true;
        this.$parent.orderDetailsRowObj = rowObj;
        this.$parent.myType = 1;
        this.$parent.showUpVideoAddress = 2;//2表示从表中点开
      } else if (type == 5) {
        this.showReturnOrSendDiscDiaLog = true;
      }
    },

    /*下一步操作*/
    nextEvent(type) {
      if (type == 1) {
        this.showReturnOrSendDiscDiaLog = false;
        this.$parent.showSendDiscDiaLog = true;
        this.$parent.showSendDiscAddress = 2;//2表示从表中点开
      } else {
        this.showReturnChongZuoDiaLog = true;
      }
    },

    /*获取退回初稿需要的FileId*/
    getReturnFileId(val) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/GetOrderCGFileModelByOrderId';
      let data = {
        OrderId: this.orderId,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            if (res.data.data.FileId) {
              let returnFileId = res.data.data.FileId;
              this.returnRequest(returnFileId, val)
            }
          }
        }
      })
    },

    /*退回请求*/
    returnRequest(returnFileId, val) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraFileInfo/CheckCGByOrderId';
      let data = {
        OrderId: this.orderId,
        FileId: returnFileId,
        SHState: 2,
        SHRemark: val,
        FromType: 2,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.showTip('退回成功', 'success');
            this.showReturnOrSendDiscDiaLog = false;
            this.showReturnChongZuoDiaLog = false;
            if (this.menuId == 5) {
              this.getOrderData();
            } else {
              this.getOrderData2();
            }
          }
        }
      })
    },

    /*退回操作*/
    confirmReturn(val) {
      if (val == '') {
        this.showTip('请输入退回理由');
        return false;
      }
      this.getReturnFileId(val);
    },

    //  判断路由
    getRouter() {
      let $path = this.$route.path;
      this.menuId = this.$route.query.id;//菜单Id
      if (this.menuId == 5) {
        this.getSearchTime(1);
      } else {
        this.getOrderData2();
      }
    },
    /*判断用户是否有新增编辑基本信息修改金额权限*/
    getUserPower() {
      let url = '/xlapi/CameraManage/CameraUserInfoManage/CameraUserInfo/GetBranchUserUpdateBasicInfoPermission';
      let data = {
        SearchUserId: getkevalue().userid
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.$store.commit('keepIsCanUpdateAmountInfo', res.data.data.IsCanUpdateAmountInfo);
            this.$store.commit('keepIsCanUpdateBasicInfo', res.data.data.IsCanUpdateBasicInfo);
          }
        }
      })
    }
  };
  export default {
    name: "orderManageTable",
    data() {
      return {
        moreMenuTop: '0',
        moreMenuLeft: '0',
        isShowNoData: false,
        /*弹框显示*/
        showPersonManageDiaLog: false,
        /*金额明细*/
        showPriceDetailsDiaLog: false,
        /*加载图标*/
        isShowMyLoading: false,
        //表格的最外层高度
        orderManageTableBoxHeight: 0,
        tableBoxHeight: 0,
        tableHeight: '',
        menuTop: 0,
        menuLeft: 0,
        moreShotMenuTop: 0,
        moreShotMenuLeft: 0,
        moreSmallMenuTop: 0,
        moreSmallMenuLeft: 0,
        menuData: [],
        menuType: 'xs',
        shotMenuData: [],
        rowObj: {},
        /*orderId 订单Id*/
        orderId: '',
        /*表格数据*/
        tableData: [],
        tableArr: [],
        tableData2: {},
        SearchStartTime: '',
        SearchEndTime: '',
        isShowTable: false,
        /*路由类型,菜单Id*/
        menuId: '',
        showDeleteDig: false,
        delRowObj: Object,
        myPosition: 'relative',
        showReturnOrSendDiscDiaLog: false,
        showReturnChongZuoDiaLog: false,
        returnFileId: '',//退回文件id
      };
    },
    methods: myMethods,
    created() {
      this.getRouter();
      this.reloadDiaLog();
      // window.openPersonDiaLog = this.openPersonDiaLog;
      this.loadResize();
      this.$nextTick(() => {
        this.$parent.isShowOrderDetailsPage = false;
      })
    },
    mounted() {
      this.getUserPower();
      // this.tableScrollListener();
    },

    watch: {
      $route(to, from) {
        this.tableData = [];
        this.tableArr = [];
        this.isShowTable = false;
        this.menuId = this.$route.query.id;//5,6,7,8,21,22,23,24,25,26/*本店订单,待回馈订单,拍摄待交接,待安排拍摄,后期制作, 待审核,退回,待移交客户,订单完成*/
        if (this.menuId == 5) {
          this.getSearchTime(1);
          this.clearSearchCase();
        } else {
          this.getOrderData2();
        }
      },
      tableArr(val) {
        if (val == '') {
          this.myPosition = 'relative'
        } else {
          this.myPosition = 'static'
        }
      }
    },

    filters: {
      OrderDateStr(val) {
        if (val) {
          if (val.indexOf('-') != -1) {
            return val.replace(/-/g, '.');
          }
        }
      },
      OrderTimeType(val) {
        if (val) {
          return val.indexOf('-') != -1 ? val.replace(/-/g, '.') : val
        }
      },
      filterOrderState(val) {
        if (val == null || val == 0) {
          return '待回馈订单'
        } else if (val == 1) {
          return '拍摄待交接'
        } else if (val == 2) {
          return '后期制作'
        } else if (val == 3) {
          return '待审核'
        } else if (val == 4) {
          return '退回'
        } else if (val == 5) {
          return '待移交客户'
        } else if (val == 6) {
          return '订单完成'
        }
      },
      AddTime(val) {
        return getFormatTime(val, '.')
      }
    },
    components: {
      personManageDiaLog: personManageDiaLog,
      priceDetailsDiaLog: priceDetailsDiaLog,
      deleteTipDig,
      returnOrSendDiscDiaLog,
      returnChongZuoDiaLog
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/orderTableStyle.css";

  /*>>> .el-dialog__wrapper {*/
  /*position: fixed!important;*/
  /*left: 14.2%;*/
  /*}*/

  #orderManageTable {
    height: 100%;
    /*position: relative;*/
  }

  #noData {
    height: 96% !important;
  }

  #orderManageTable >>> .deleteDialog {
    margin-top: -35px !important;
  }

  >>> .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 5px;
    background: #E7EEF9;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #CED8EA;
    width: 6px;
    height: 5px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  >>> .orderTableRowStyle td:last-of-type {
    border-right: 0;
  }

  >>> .el-table--border::after, .el-table--group::after {
    height: auto;
    background: #DDD;
    bottom: 72px;
  }

  .tableBox {
    max-height: 100%;
  }

  >>> .moreList ul li {
    transition: all .2s;
    height: 28px;
    line-height: 28px;
  }

  >>> .moreList ul li.change {
    cursor: pointer;
  }

  >>> .moreList ul li.change:hover {
    text-decoration: underline;
    color: #5996F8;
  }

  /*======动画======*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    height: 0;
  }

  /*人员安排弹框*/
  >>> .personManageDiaLog {
    width: 610px;
    height: 400px;
    padding: 30px;
  }

  >>> .personManageDiaLog .el-dialog__header .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  .personManageBox .list {
    width: 49%;
    height: 46%;
    float: left;
  }

  .personManageBox .list:nth-of-type(2n) {
    float: right;
  }

  .personManageBox .list:nth-of-type(3), .personManageBox .list:nth-of-type(4) {
    margin-bottom: 0;
  }

  .personManageBox .list ul li {
    height: 48px;
    line-height: 48px;
    text-align: left;
    padding-left: 15px;
    color: #808080;
    font-size: 14px;
    transition: all .2s;
  }

  .personManageBox .list ul li:hover {
    background: #F5F5F5;
  }

  .personManageBox .list ul li:nth-of-type(1) {
    padding-left: 0;
  }

  .personManageBox .list ul li:nth-of-type(1):hover {
    background: transparent;
  }

  .personManageBox .list ul li .personBox {
    display: inline-block;
    overflow-x: auto;
    line-height: 20px;
    max-width: 140px;
    white-space: nowrap;
    vertical-align: -5px;
    padding-top: 10px;
    box-sizing: border-box;
  }

  .personManageBox .list ul li span {
    color: #4C4C4C;
    font-weight: 700;
    position: relative;
    margin-right: 12px;
  }

  .personManageBox .list ul li span .close {
    position: absolute;
    right: -8px;
    top: -8px;
    visibility: hidden;
    transition: all .2s;
    cursor: pointer;
  }

  .personManageBox .list ul li span:hover .close {
    visibility: visible;
  }

  .personManageBox .list ul li span.add {
    vertical-align: -3px;
    cursor: pointer;
    transition: all .2s;
    width: 17px;
    height: 17px;
    display: inline-block;
    background: url("../../../../static/img/order/add0.png") no-repeat center center;
    visibility: hidden;
  }

  .personManageBox .list ul li span.add:hover {
    background: url("../../../../static/img/order/add1.png") no-repeat center center;
  }

  .personManageBox .list ul li:hover .add {
    visibility: visible;
  }

  .colorZIndex {
    height: 4%;
    width: 100%;
    background: #F6F6F6;
    position: absolute;
    z-index: 9999;
    bottom: 0;
  }

  .btn {
    text-decoration: underline;
    cursor: pointer;
  }

  .btn1 {
    margin-right: 10px;
    color: #5996F8;
  }

  .btn2 {
    color: #E97A03;
  }

  .morePS2:last-of-type i {
    display: none;
  }

  .notMoreList .hover {
    cursor: pointer;
    transition: all .2s;
  }

  .notMoreList .hover:hover {
    text-decoration: underline;
  }

  .click_hover {
    transition: all .2s;
    cursor: pointer;
  }

  .click_hover:hover {
    text-decoration: underline;
  }

  .stateIcon img {
    vertical-align: -3px;
  }


</style>
