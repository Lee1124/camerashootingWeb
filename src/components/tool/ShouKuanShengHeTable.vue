<!--报账申请 报账审核 报账支付-->
<template>
  <div style="position: relative;">
    <noData msg="暂无数据" v-if="dataSet.list.length == 0"></noData>
    <el-table
      :data="dataSet.list"
      style="width: 100%"
      class="tav-column"
      height="450px"
      :header-row-class-name="headerClassName"
      :row-class-name="handlertableRowClassName"
      show-summary
      :summary-method="handlergetSummaries"
      v-loading="loading"
    >
      <el-table-column
        label="序号"
        type="index"
        prop="id"
        width="80">
      </el-table-column>
      <el-table-column
        label="编号"
        prop="NO">
      </el-table-column>
      <el-table-column
        label="客户"
        width="300"
        prop="orderremark">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="typename">
      </el-table-column>
      <el-table-column
        label="金额"
        prop="Amount">
      </el-table-column>
      <el-table-column
        label="账号"
        prop="toaddress">
      </el-table-column>
      <el-table-column
        label="添加时间"
      width="150">
        <template slot-scope="props">
          <span>{{ props.row.addtime.substring(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加人"
        prop="addusername">
      </el-table-column>
      <el-table-column
        label="说明"
        prop="addusername">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="props">
          <span style="color: red" v-if="props.row.state == 1">待审核</span>
          <span style="color: #5996F8;" v-if="props.row.state == 2">审核通过</span>
          <span style="color: #1BC000" v-if="props.row.state == 0">退回</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="props">
          <span style="text-decoration: underline;color: #1BC000;cursor: pointer" v-if="props.row.state == 1" @click="handleReturn(props.$index, props.row)">退回</span>
          <span style="text-decoration: underline;color: #5996F8;cursor: pointer" v-if="props.row.state == 1" @click="handleAdopt(props.$index, props.row)">确认</span>
          <span style="color: #4c4c4c;cursor: pointer" v-else>当前无法操作</span>
        </template>
      </el-table-column>
    </el-table>


    <!--分页-->
    <div v-if="total > 8" style="position: absolute;bottom: 0px;left: 0px;right: 0;" class="clearfloat">
      <span style="position: absolute;
      left: 350px;
      right: 0;
      bottom: 8px;
      width: max-content;font-size: 14px;color: #4c4c4c;">共{{ total }}条内容</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="8"
        @current-change="handleSizeChange"
        :current-page="1"
      >
      </el-pagination>
    </div>

    <!--DiaLog-->
    <DiaLog :DiaLog="DiaLog" v-if="DiaLog.dialogVisible"></DiaLog>
    <DiaLoga :DiaLoga="DiaLoga" v-if="DiaLoga.dialogVisible"></DiaLoga>
  </div>
</template>

<script>
  import DiaLog from '../../components/caiwu/shoukuanshenghe/ShouKuanDiaLog'
  import DiaLoga from '../../components/caiwu/shoukuanshenghe/ShouKuanTuiHui'
  export default {
    name: "ShouKuanShengHeTable",
    components:{DiaLog,DiaLoga},
    data(){
        return{
          dataSet:{
            list:[]
          },
          total:0,
          sum:0,            //金额合计
          DiaLog:{          //确认收款弹窗所需参数
            dialogVisible:false,
            callblack:this.handlerDialog,
            data:{},              //所需数据
          },
          DiaLoga:{         //退回
            dialogVisible:false,
            callblack:this.handlerDialoga,
            data:{},              //所需数据
          },
          row:null,         //当前列信息
          loading:true
        }
    },
    methods:{
      //当前页
      handleSizeChange(index){
        this.$ThisParent({
          variable:'PAGE_INDEX',
          callblack(res){
            res.switchSet.menulist[res.PAGE_INDEX].page = index;
            res.handlderInitAjax()
          }
        })
      },
      //确认
      handleAdopt( index,row ){
        this.row = row
        this.DiaLog.dialogVisible = true
        this.DiaLog.data = row
      },
      //确认退款
      handlerDialog(data){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/AmountOrder/addamountlog',
          data:{
            id:this.row.id,
            amount:data[0].val,
            remark:data[1].val
          },
          success(res){
            if(res.data.state){
              this.$tips(res.data.msg)
            }else{
              this.$warning(res.data.msg)
            }
            this.DiaLog.dialogVisible = false
            this.handlerUpData()
          },
          error(err){
            console.log(err)
          }
        });
      },
      //退回
      handleReturn( index,row ){
        this.row = row
        this.DiaLoga.dialogVisible = true
        this.DiaLoga.data = row
      },
      //确认退回
      handlerDialoga( data ){
        console.log(data)
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/AmountOrder/backamounrlog',
          data:{
            id:this.row.id,
            remark:data[0].val
          },
          success(res){
            if(res.data.state){
              this.$tips(res.data.msg)
            }else{
              this.$warning(res.data.msg)
            }
            this.DiaLoga.dialogVisible = false
            this.handlerUpData()
          },
          error(err){
            console.log(err)
          }
        });
      },
      //初始化表格数据
      handlerInit(total,data){
        this.dataSet.list = data.list
        this.loading = false
        this.sum = data.sum
        this.total = total
      },
      //表头样式
      headerClassName({row, rowIndex}) {
        return 'orderTableHeaderStyles'
      },
      //合计
      handlergetSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          if(index === 4){
            sums[index] = this.sum;
            return;
          }
        })
        return sums
      },
      //外层表格样式
      handlertableRowClassName({row, rowIndex}){
        //奇数行
        if(rowIndex % 2 == 1){
          return 'warning-row'
        }else{
          return 'success-row'
        }
      },
    //  刷新数据
      handlerUpData(){
        //调用父级方法查询表格数据
        this.$ThisParent({
          variable:'PAGE_INDEX',
          callblack(_that){
            _that.handlderInitAjax()
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import "../../../static/css/orderTableStyle.css";
  /deep/ .el-table--border td{
    border-right: 1px solid #DDDDDD;
  }
  /deep/ .el-table__footer td:nth-child(1){
    color: red !important;
  }
  /deep/ .el-table__footer td:nth-child(5){
    color: red !important;
  }
  /deep/.warning-row {
    background: #FFFFFF !important;
  }

  /deep/ .success-row {
    background: #F7F7F7 !important;
  }
  /deep/ .el-dialog__wrapper{
    position: fixed !important;
  }
  /deep/ .el-table__expand-icon>.el-icon{
    transition: all .5s  !important;
    transform: rotateZ(90deg)  !important;
  }
  /deep/ .el-table__expand-icon--expanded{
    transition: all .5s  !important;
    transform: rotate(180deg) !important;
  }
  .tav-column /deep/ .has-gutter th{
    text-align: center  !important;
  }
  /deep/ td{
    text-align: center  !important;
    font-size: 14px  !important;
    color: #4c4c4c  !important;
  }
  /deep/ .el-table__expanded-cell{
    padding: 0  !important;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active{
    background: #5996F8 !important;
    color: #fff !important;
  }
  /deep/ .el-pagination.is-background .el-pager li{
    color: #999999  !important;
  }
  /deep/.el-pagination.is-background .btn-next,
  /deep/.el-pagination.is-background .btn-prev{
    background: #EAEAEA  !important;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover{
    color: #BB9860  !important;
  }
  .tav-column /deep/ tbody .el-table__expand-column{
    border-right: 1px solid #EBEEF5  !important;
  }
  .tav-column /deep/ .el-table__expand-icon--expanded{
    color: #5996F8  !important;
  }
  /deep/ .el-button--default {
    border: none  !important;
  }
</style>
