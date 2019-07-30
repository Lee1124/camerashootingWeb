<!--订单金额 明细-->
<template>
  <div id="priceDetailsDiaLog">
    <el-dialog
      :title="orderTitle"
      :visible.sync="showPriceDetailsDiaLog"
      custom-class="commonDiaLog priceDetailsDiaLog"
      :modal="false"
      @open="openEvent"
      :close-on-click-modal="false"
      :show-close="false">
      <i class="closeIcon" @click="closeDialog"></i>
      <div class="content">
        <!--交款统计-->
        <div class="payStatistics">
          <p class="title">交款统计</p>
          <ul class="content">
            <li>
              <span>合同金额：</span>
              <span v-cloak>{{priceDetailsData.amout}}</span>
            </li>
            <li>
              <span>已交金额：</span>
              <span v-cloak>{{priceDetailsData.Payment}}</span>
            </li>
            <li>
              <span>未交金额：</span>
              <span style="color: #FF0000;">{{reversedMessage}}</span>
            </li>
          </ul>
        </div>
        <div class="payDetails">
          <p class="title">
            交款明细
            <span class="add" @click="addPaymentRecord"><i></i> 添加</span>
          </p>
          <div class="table" style="position: relative;">
            <noData msg="暂无相关数据" v-if="isShowNoData"></noData>
            <el-table
              :data="priceDetailsData.objlist"
              border
              max-height="180"
              :style="{borderColor:'#DDD',borderBottom:'1px solid #DDD'}"
              :header-row-class-name="payDetailsHeaderClassName"
              :row-class-name="payDetailsRowClassName"
              style="width: 100%">
              <el-table-column
                prop="typename"
                align="center"
                width="97px"
                show-overflow-tooltip
                label="类型">
              </el-table-column>
              <el-table-column
                prop="amount"
                align="center"
                width="97px"
                show-overflow-tooltip
                label="金额">
              </el-table-column>
              <el-table-column
                prop="no"
                width="97px"
                align="center"
                show-overflow-tooltip
                label="编号">
              </el-table-column>
              <el-table-column
                prop="addressname"
                width="97px"
                align="center"
                show-overflow-tooltip
                label="账号">
              </el-table-column>
              <el-table-column
                width="96px"
                align="center"
                show-overflow-tooltip
                label="添加时间">
                <template slot-scope="scope">
                  <span v-cloak>{{scope.row.addtime | returnAddtime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                width="95px"
                show-overflow-tooltip
                align="center"
                label="添加人">
              </el-table-column>
              <el-table-column
                prop="satename"
                width="95px"
                show-overflow-tooltip
                align="center"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="state"
                width="95px"
                align="center"
                label="操作">
                <template slot-scope=scope>
                  <span style="cursor:pointer;" v-if="scope.row.satename!='已退回'"
                        @click="look(scope.row,false)">查看</span>
                  <span style="cursor:pointer;color: #FF0000;" v-if="scope.row.satename=='已退回'"
                        @click="look(scope.row,true)">编辑</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="closeDiaLog($event,'personSelect')" v-if="commonDiaLogObj.isShowBtn1">{{commonDiaLogObj.btn1Text}}</el-button>-->
        <!--<el-button type="primary" @click="Confirm(commonDiaLogObj.type)"-->
        <!--v-if="commonDiaLogObj.isShowBtn2">{{commonDiaLogObj.btn2Text}}</el-button>-->
      </span>
    </el-dialog>

    <!--添加交款记录弹框-->
    <addPaymentRecordPage ref="addPaymentRecordPage" :showType="showType" type="list"
                          :showAddPaymentRecordDiaLog="showAddPaymentRecordDiaLog"></addPaymentRecordPage>
  </div>
</template>

<script>
  import addPaymentRecordPage from '../diaLog/addPaymentRecordDiaLog'
  /*数据*/
  let dataObj = {
    isShowNoData: false,
    /*交款明细表格数据*/
    payDetailsTableData: [
      {
        type: '定金',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
      {
        type: '一期款',
        price: '2000',
        no: 'MZ0014500',
        number: '建行(1212)',
        addTime: '2019.06.08',
        addPerson: '周杰伦',
        state: '已审核'
      },
    ],
    /*是否显示添加交款记录弹框*/
    showAddPaymentRecordDiaLog: false,
    /*订单*/
    orderId: '',
    /*订单标题*/
    orderTitle: '',
    orderTitle2: '',
    /*金额明细数据*/
    priceDetailsData: {},
    /*打开增加弹框权限*/
    showType: true,
    priceRowObj:{},
  };
  /*方法*/
  let myMethods = {
    /*打开时*/
    openEvent() {
      this.orderId = this.$parent.rowObj.OrderId;
      this.getOrderTitle(this.orderId);
      this.getPriceDetails(this.orderId);
    },
    closeDialog() {
      this.$parent.closeDialog();
    },
    /*添加交款记录*/
    addPaymentRecord() {
      this.showType = true;
      this.showAddPaymentRecordDiaLog = true;
      this.$store.commit('keepPriceIsAdd',true)
    },
    /*查看交款记录*/
    look(obj, type) {
      this.priceRowObj=obj;
      this.showType = type;
      this.showAddPaymentRecordDiaLog = true;
      if (type){
        this.$store.commit('keepPriceIsAdd',true)
      }else {
        this.$store.commit('keepPriceIsAdd',false)
      }
    },
    //交款金额表头类名
    payDetailsHeaderClassName() {
      return 'payDetailsHeaderStyle'
    },
    //交款金额表格类名
    payDetailsRowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'payDetailsTableRowStyle payDetailsTableRow2nStyle'
      } else {
        return 'payDetailsTableRowStyle payDetailsTableRow1nStyle'
      }
    },
    /*根据订单获取标题*/
    getOrderTitle(orderId) {
      let url = '/xlapi/CameraManage/CameraOrderInfoManage/CameraOrderInfo/GetOrderTitleByOrderId';
      let data = {
        OrderId: orderId
      };
      this.$Axios({
        method: 'POST',
        url: url,
        data: data,
        success(res) {
          if (res.data.status) {
            this.orderTitle = res.data.data + '--金额明细';
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
    /*根据订单获取金额明细*/
    getPriceDetails(orderId) {
      this.isShowNoData = true;
      let url = '/xlapi/CameraManage/AmountManage/AmountOrder/showorderamount';
      let data = {
        strorderid: orderId
      };
      this.$Axios({
        method: 'GET',
        url: url,
        data: data,
        success(res) {
          if (res.status == 200) {
            this.priceDetailsData = res.data;
            if (this.priceDetailsData.objlist.length == 0) {
              this.isShowNoData = true;
            } else {
              this.isShowNoData = false;
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
    }
  };
  export default {
    name: "priceDetailsDiaLog",
    props: ['showPriceDetailsDiaLog'],
    data() {
      return dataObj;
    },
    methods: myMethods,
    created() {
    },
    mounted() {
    },
    computed: {
      reversedMessage() {
        return this.priceDetailsData.amout - this.priceDetailsData.Payment
      }
    },
    filters: {
      returnAddtime(val) {
        return val.replace(/\//g, '.');
      }
    },
    components: {
      addPaymentRecordPage: addPaymentRecordPage
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/commonDiaLogStyle.css";

  >>> .el-table {
    border-right: 1px solid #DDD;
  }

  /*金额明细*/
  #noData {
    height: 200% !important;
    margin-top: -5px !important;
  }

  >>> .priceDetailsDiaLog {
    width: 850px;
    height: 485px;
    padding: 40px;
    margin-top: 0 !important;
  }

  >>> .priceDetailsDiaLog .el-dialog__title {
    font-size: 17px;
    color: #9DB3D7;
  }

  >>> .priceDetailsDiaLog .content .title {
    text-align: left;
    font-size: 14px;
    color: #5996F8;
    position: relative;
    margin: 30px 0 10px;
  }

  >>> .priceDetailsDiaLog .content .title::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 14px;
    background: rgba(89, 150, 248, 1);
    left: -10px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  >>> .priceDetailsDiaLog .payStatistics .content {
    text-align: left;
  }

  >>> .priceDetailsDiaLog .payStatistics .content li {
    margin: 13px;
  }

  >>> .payDetailsHeaderStyle th {
    background-color: #BBBBBB;
    height: 34px;
    color: #FFF;
    font-size: 14px;
    padding: 0;
    border-color: #DDD;
  }

  >>> .payDetailsHeaderStyle th:last-of-type {
    border: 0;
  }

  >>> .payDetailsTableRowStyle td {
    height: 34px;
    color: #4C4C4C;
    font-size: 14px;
    padding: 0;
    border-color: #DDD;
    border-bottom: 0;
    transition: all .2s;
  }

  >>> .payDetailsTableRowStyle td:last-of-type {
    border-right: 0;
  }

  >>> .payDetailsTableRowStyle:hover {
    background: #F0F4FA;
    color: #5996F8 !important;
  }

  >>> .payDetailsTableRowStyle:hover td {
    color: #5996F8;
  }

  >>> .payDetailsTableRow2nStyle td {
    background: #F5F5F5;
  }

  >>> .payDetailsTableRow1nStyle td {
    background: #FFF;
  }

  .payDetails .title .add {
    position: absolute;
    right: 8px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    cursor: pointer;
    color: #BBBBBB;
  }

  .payDetails .title .add i {
    width: 17px;
    height: 17px;
    display: inline-block;
    vertical-align: -3px;
    margin-right: 5px;
    background: url("../../../../static/img/order/add0.png") no-repeat center center;
  }

  .payDetails .title .add:hover {
    color: #5996F8;
  }

  .payDetails .title .add:hover i {
    background-image: url("../../../../static/img/order/add1.png");
  }
</style>
