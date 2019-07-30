<!--设备领取-->
<template>
  <div id="getSheBei">
    <el-dialog
      title="设备领取"
      :visible.sync="showGetSheBeiDiaLog"
      custom-class="commonDiaLog getSheBeiDiaLog"
      :modal="false"
      @open="openEvent"
      @opened="openedEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="close"></i>
      <!--设备领取-->
      <div class="content">
        <ul>
          <li>
            <span class="label">订&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单：</span>
            <span v-cloak>{{sheBeiList.ordertitle}}</span>
          </li>
          <li>
            <span class="label">领取时间：<span class="timeBox timeBox1"><timeSelect1
              timePlaceholderText="请选择领取时间" @changeTime="changeTime1"
              :timeVal="sheBeGetTime"></timeSelect1></span></span>
            <span class="label">归还时间：<span class="timeBox timeBox2"><timeSelect1
              timePlaceholderText="请选择归还时间" @changeTime="changeTime2" :timeVal="sheBeReturnTime"></timeSelect1></span> </span>
          </li>
          <li>
            <span class="label label2">设备领取</span>
            <span class="add" @click="addSheBei" v-if="sheBeiList.islock==0"><i></i>添加</span>
            <div class="table" style="position: relative;">
              <noData msg="暂无相关数据" v-if="sheBeiList.Orderlibs.length==0"></noData>
              <el-table
                :data="sheBeiList.Orderlibs"
                border
                max-height="220px"
                :style="{border:0,borderTop:'1px solid #DDD'}"
                :header-row-class-name="headerClassName"
                :row-class-name="rowClassName"
                ref="table"
                v-loading="isShowLoading"
                style="width: 100%;text-align: center">
                <el-table-column
                  label="序号"
                  type="index"
                  width="50px"
                  show-overflow-tooltip
                  align="center">
                </el-table-column>
                <el-table-column
                  label="设备"
                  prop="equiName"
                  width="170px"
                  show-overflow-tooltip
                  align="center">
                </el-table-column>
                <el-table-column
                  label="状态"
                  width="160px"
                  show-overflow-tooltip
                  align="center">
                  <template slot-scope="scope">
                    <span v-cloak v-if="scope.row.ToState=='待出库'" style="color:#FF0000;">{{scope.row.ToState}}</span>
                    <span v-cloak v-if="scope.row.ToState=='待归还'" style="color:#FF9C00;">{{scope.row.ToState}}</span>
                    <span v-cloak v-if="scope.row.ToState=='已归还'" style="color:#808080;">{{scope.row.ToState}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="180px"
                  show-overflow-tooltip
                  align="center">
                  <template slot-scope=scope>
                    <span class="btn btn1" @click="deleteThis(scope.row)" v-if="scope.row.ToState=='待出库'"
                          style="color: #0FCE00;">删除</span>
                    <span class="btn btn1" v-if="scope.row.ToState=='待归还'" style="color: #DDD;"><el-button
                      disabled>删除</el-button></span>
                    <span class="btn btn1" @click="deleteThis(scope.row)" v-if="scope.row.ToState=='已归还'"
                          style="color: #BBBBBB;">删除</span>
                    <span class="btn btn2" @click="openDetails(scope.row)">详情</span>
                    <span class="btn btn3" @click="openDaily(scope.row)">日志</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </li>
          <li class="person">
            <span class="label">
              <span class="title">申请人：</span>
              <span class="name" v-cloak>
                <template v-for="(items,index) in sheBeiList.applyUser">
                  <span class="innerPerson" v-cloak>{{items}}</span>
                  <i></i>
                </template>
              </span>
            </span>
            <span class="label">
              <span class="title">出库人：</span>
              <span class="name" v-cloak>
                 <template v-for="(items,index) in sheBeiList.outUser">
                  <span class="innerPerson" v-cloak>{{items}}</span>
                   <i></i>
                </template>
              </span>
            </span>
            <span class="label">
             <span class="title">归还人：</span>
              <span class="name" v-cloak>
                  <template v-for="(items,index) in sheBeiList.retUser">
                  <span class="innerPerson" v-cloak>{{items}}</span>
                    <i></i>
                </template>
              </span></span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="close">取 消</el-button>
           <el-button type="primary" @click="confirmChange()">确 定</el-button>
        </span>
    </el-dialog>

    <!--添加设备-->
    <addSheBeiPage :showAddSheBeiDiaLog="showAddSheBeiDiaLog" @selectedThis="selectedThisSheBei"></addSheBeiPage>
    <!--设备日志-->
    <sheBeiDailyPage :showSheBeiDailyDiaLog="showSheBeiDailyDiaLog"></sheBeiDailyPage>
    <!--设备详情-->
    <sheBeiDetailsDiaLog :showSheBeiDetailsDiaLog="showSheBeiDetailsDiaLog"></sheBeiDetailsDiaLog>
    <!--删除提示-->
    <deleteTipDig @confirmDelete="confirmDelete" :showDeleteDig="showDeleteDig" dataName="设备"
                  otherText=""></deleteTipDig>
    <!--提示-->
    <tipsDiaLog :tipsObj="tipsObj"></tipsDiaLog>

    <!--设备被占用提示-->
    <sheBeiOccupyPage @closeDiaLog="closeDialog" @getOrderSheBeiList="getOrderSheBeiList" :showSheBeiOccupyDiaLog="showSheBeiOccupyDiaLog" :sheBeiOccupyObj="sheBeiOccupyObj"></sheBeiOccupyPage>
  </div>
</template>

<script>
  import addSheBeiPage from '../diaLog/addSheBeiDiaLog';//添加设备
  import sheBeiOccupyPage from '../diaLog/sheBeiOccupyDiaLog';//设备被占用提示
  import sheBeiDailyPage from '../diaLog/sheBeiDailyDiaLog';//设备日志
  import sheBeiDetailsDiaLog from '../diaLog/sheBeiDetailsDiaLog';//设备详情
  import deleteTipDig from './deleteDiaLog';//删除提示
  import tipsDiaLog from '../../common/tips/tipsDiaLog';//删除提示
  /*方法*/
  let myMethods = {
    close() {
      this.$parent.closeDialog();
    },
    closeDialog() {
      this.showAddSheBeiDiaLog = false;
      this.showSheBeiDailyDiaLog = false;
      this.showDeleteDig = false;
      this.tipsObj.showTipsDiaLog = false;
      this.showSheBeiOccupyDiaLog=false;
    },
    openEvent() {
      this.flag1 = true;
      this.orderId = this.$parent.orderId;
    },
    openedEvent() {
      this.getOrderSheBeiList();
    },
    /*获取订单详情中的设备列表*/
    getOrderSheBeiList() {
      this.isShowLoading = true;
      let url = '/xlapi/CameraManage/EquiManage/EquiOrder/GetEquiOrder';
      let data = {
        orderid: this.orderId,
        type: ''
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res);
          if (res.status == 200) {
            this.isShowLoading = false;
            this.sheBeiList = res.data;
            this.sheBeGetTime = getFormatTime(res.data.Receivedate, '.')
            this.sheBeReturnTime = getFormatTime(res.data.Returndate, '.')
          } else {
            this.$message({
              message: res.statusText,
              customClass: 'msgTips',
              type: 'error'
            });
            return false;
          }
        }
      })
    },
    headerClassName({row, rowIndex}) {
      return 'orderTableHeaderStyle orderTableHeaderStyle2'
    },
    rowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'orderTableRowStyle orderTableRowStyle2 orderTableRow2nStyle'
      } else {
        return 'orderTableRowStyle orderTableRowStyle2 orderTableRow1nStyle'
      }
    },
    //打开添加设备
    addSheBei() {
      let compareNum = compareTime(this.sheBeGetTime, this.sheBeReturnTime);//比较两时间段的大小
      if (this.sheBeGetTime == '' || this.sheBeReturnTime == ''||this.sheBeGetTime == null || this.sheBeReturnTime == null) {
        this.$message({
          message: '请选择领取时间和归还时间!',
          customClass: 'msgTips',
          type: 'error'
        });
      } else {
        this.changeTime('add');
      }
    },

    //确认
    confirmChange() {
      if (this.flag1) {
        this.flag1 = false;
        this.changeTime('change');
      }
    },

    /*改变领取时间*/
    changeTime1(val) {
      this.sheBeGetTime = val;
      if (this.sheBeGetTime&&this.sheBeReturnTime){
        this.changeTime();
      }
    },
    /*改变归还时间*/
    changeTime2(val) {
      this.sheBeReturnTime = val;
      if (this.sheBeGetTime&&this.sheBeReturnTime){
        this.changeTime();
      }
    },

    //修改订单领取和归还时间
    changeTime(val) {
      let url = '/xlapi/CameraManage/EquiManage/EquiOrder/UpdateEquiOrder';
      let data = {
        orderid: this.orderId,
        stime: this.sheBeGetTime,
        etime: this.sheBeReturnTime
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            // console.log(res)
            if (val == 'change') {
              this.$message({
                message: '保存成功！',
                customClass: 'msgTips',
                type: 'success'
              });
              this.$parent.closeDialog();
            }else if (val=='add') {
              this.showAddSheBeiDiaLog = true;
            }
          } else {
            if (res.data.msg.indexOf('交叉')!=-1){
              this.showSheBeiOccupyDiaLog=true;
              this.sheBeiOccupyObj={
                time:this.sheBeGetTime+'-'+this.sheBeReturnTime,
                getTime:this.sheBeGetTime,
                returnTime:this.sheBeReturnTime,
                tableData:res.data.data,
                orderId:this.orderId,
                num:res.data.data.length,
              };
            }else {
              this.$message({
                message: res.data.msg,
                customClass: 'msgTips',
                type: 'error'
              });
              return false;
            }
          }
        }
      })
    },

    /*选择设备*/
    selectedThisSheBei(rowObj) {
      this.selectedObj = rowObj;
      this.selectedSheBeiRequest();
    },

    /*选择后的请求*/
    selectedSheBeiRequest() {
      let url = '/xlapi/CameraManage/EquiManage/EquiOrder/InsEquiOrderlib';
      let data = {
        orderid: this.orderId,
        eid: this.selectedObj.id,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data.status) {
            this.$message({
              message: '领取设备成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            this.showAddSheBeiDiaLog = false;
            this.getOrderSheBeiList();
          } else {
            this.showAddSheBeiDiaLog = true;
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

    //打开日志
    openDaily(itemObj) {
      this.keepRowObj = itemObj;
      this.showSheBeiDailyDiaLog = true;
    },

    // 删除
    deleteThis(itemObj) {
      this.keepRowObj = itemObj;
      this.showDeleteDig = true;
    },

    /*打开详情*/
    openDetails(itemObj) {
      this.keepRowObj = itemObj;
      this.showSheBeiDetailsDiaLog = true;
    },

    /*删除确认*/
    confirmDelete() {
      let url = '/xlapi/CameraManage/EquiManage/EquiOrder/DelEquiOrderlib';
      let data = {
        equilid: this.keepRowObj.id,
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          // console.log(res)
          if (res.data) {
            this.$message({
              message: '删除设备成功！',
              customClass: 'msgTips',
              type: 'success'
            });
            this.getOrderSheBeiList();
            this.showDeleteDig = false;
          }
        }
      })
    },
    /*领取，归还设备设置默认时间*/
    setGetAndReturnTime() {
      this.sheBeGetTime = getTimeSlot(30, '.').startTime;
      this.sheBeReturnTime = getTimeSlot(30, '.').endTime;
    },

  };
  export default {
    name: "getSheBei",
    props: ['showGetSheBeiDiaLog'],
    data() {
      return {
        /*订单Id*/
        orderId: '',
        tipsObj: {
          showTipsDiaLog: false,//提示显示隐藏
          tipMsg: '',//提示文字
          tipsType: '',//提示类型
        },
        /*添加设备列表数据*/
        sheBeiList: {
          ordertitle: '',
          Orderlibs: [],//列表
          applyUser: [],//申请人
          outUser: [],//出库人
          retUser: [],//归还人
          islock: 0,//是否锁定 0解锁 1锁定
        },
        sheBeGetTime: '',//设备领取时间
        sheBeReturnTime: '',//设备归还时间
        tableData: [],//表格数据
        showAddSheBeiDiaLog: false,//添加设备
        showSheBeiDailyDiaLog: false,//设备日志
        showSheBeiDetailsDiaLog: false,//设备日志
        showDeleteDig: false,//设备日志
        showSheBeiOccupyDiaLog:false,
        sheBeiOccupyObj:{},

        selectedObj: '',//选择设备后的数据
        keepRowObj: {},//该行需要的数据
        isShowLoading: false,
        flag1: true,
        allowAddSheBei:false,
      };
    },
    methods: myMethods,
    created() {
      // this.setGetAndReturnTime();//领取，归还设备设置默认时间
    },
    mounted() {

    },
    components: {
      sheBeiDailyPage: sheBeiDailyPage,
      sheBeiDetailsDiaLog: sheBeiDetailsDiaLog,
      addSheBeiPage: addSheBeiPage,
      deleteTipDig: deleteTipDig,
      tipsDiaLog: tipsDiaLog,
      sheBeiOccupyPage,
    },

  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  #noData {
    margin-top: -15px !important;
  }

  /*新增酒店弹框样式*/
  >>> .getSheBeiDiaLog {
    width: 720px;
    height: 550px;
    padding: 0 80px 35px;
  }

  >>> .getSheBeiDiaLog .el-dialog__header {
    height: 15%;
    line-height: 85px;
  }

  >>> .getSheBeiDiaLog .el-dialog__header .el-dialog__title {
    color: #9DB3D7;
    font-size: 17px;
  }

  >>> .getSheBeiDiaLog .el-dialog__body {
    max-height: 400px;
    height: 400px;
  }

  >>> .getSheBeiDiaLog .el-dialog__body .closeIcon {
    right: 30px;
    top: 30px;
  }

  >>> .getSheBeiDiaLog .el-dialog__footer .el-button {
    width: 104px;
    height: 38px;
    background: rgba(89, 150, 248, 1);
    border-radius: 5px;
    font-size: 15px;
    padding: 0;
  }

  >>> .getSheBeiDiaLog .el-dialog__footer .el-button:first-of-type {
    background: transparent;
    color: #808080;
    border: 0;
  }

  /*内容区样式*/
  .content {
    font-size: 14px;
    color: #4C4C4C;
    text-align: left;
  }

  .content ul li {
    /*min-height: 32px;*/
    height: auto;
    padding: 10px 0;
  }

  .content .label {
    color: #808080;
  }

  .content .label2 {
    font-weight: 700;
  }

  .content .timeBox {
    display: inline-block;
    width: 180px;
    height: 32px;
  }

  .content .timeBox1 {
    margin-right: 48px;
  }

  .content li.person {
    display: flex;
  }

  .content li.person span {
    display: inline-block;
    width: 180px;
  }

  .content li.person span.name {
    color: #4C4C4C;
    width: 116px;
    display: inline-block;
  }

  .content li.person span.title {
    display: inline-block;
    width: auto;
    vertical-align: top;
  }

  .content li.person span.name .innerPerson {
    width: auto;
  }

  .content li .add {
    color: #808080;
    margin-left: 30px;
    cursor: pointer;
  }

  .content li .add i {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url("../../../../static/img/order/add0.png") no-repeat center center;
    vertical-align: -3px;
    margin-right: 10px;
  }

  .content li .add:hover {
    color: #5996F8;
  }

  .content li .add:hover i {
    background: url("../../../../static/img/order/add1.png") no-repeat center center;
  }

  >>> .orderTableHeaderStyle2 th {
    height: 42px;
    line-height: 42px;
  }

  >>> .orderTableRowStyle2 td {
    height: 42px;
    line-height: 42px;
  }

  >>> .orderTableRow1nStyle td {
    background: #FFF;
  }

  >>> .orderTableRow2nStyle td {
    background: #F2F2F2;
  }

  .content .table {
    padding-top: 18px;
  }

  .table .btn {
    cursor: pointer;
    text-decoration: underline;
  }

  .table .btn1 {
    position: relative;
  }

  .table .btn1 .el-button {
    padding: 0;
    border: 0;
    background: transparent;
  }

  .table .btn1 i {
    position: absolute;
    width: 12px;
    height: 12px;
    background: red;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .table .btn2 {
    margin: 0 10px;
    color: #5996F8;
  }

  .table .btn3 {
    color: #4E00FF;
  }
</style>
