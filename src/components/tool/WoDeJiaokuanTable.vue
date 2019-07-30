<!--报账申请 报账审核 报账支付-->
<template>
  <div style="position: relative">
    <noData msg="暂无数据" v-if="dataSet.list.length == 0"></noData>
    <el-table
      :data="dataSet.list"
      style="width: 100%"
      height="430px"
      class="tav-column"
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
        label="订单"
        prop="orderremark"
      width="300">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="typename">
      </el-table-column>
      <el-table-column
        label='金额'
        prop="Amount">
      </el-table-column>
      <el-table-column
        label='状态'
        prop="Amount">
        <template slot-scope="props">
          <span v-if="props.row.state == 1" style="color: red">待审核</span>
          <span v-if="props.row.state == 2" style="color: #5996F8;">审核通过</span>
          <span v-if="props.row.state == 0" style="color: #1BC000">退回</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提交人"
        prop="addusername">
      </el-table-column>
      <el-table-column
        label="添加时间">
        <template slot-scope="props">
          <span>{{ props.row.addtime.substring(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      width="150">
        <template slot-scope="props">
          <div v-if="props.row.state != 1 && props.row.state != 2">
            <span style="text-decoration: underline;color: #B73CF0;cursor: pointer" @click="handleDeletes(props.$index, props.row)">删除</span>
            <span style="text-decoration: underline;color: #1BC000;cursor: pointer"  @click="handleEdit(props.$index, props.row)">编辑</span>
            <span style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handleUptede(props.$index, props.row)">提交</span>
          </div>
          <!--<div v-if="props.row.state == 2">-->
            <!--<span style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handlelook(props.$index, props.row)">查看</span>-->
          <!--</div>-->
          <div v-else>
            当前不可操作
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-if="total > 8"  style="position: absolute;bottom: 0px;left: 0px;right: 0;" class="clearfloat">
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
        :current-page="currentPge"
      >
      </el-pagination>
    </div>
    <!--Dialog-->
    <tip width="500px" :tip="tip" v-if="tip.dialogVisible">
      <p>{{ tip.bodyTitle }}</p>
    </tip>
    <MyAdd :diaLog="diaLog" ref="diaLogs" v-if="diaLog.dialogVisible"></MyAdd>
  </div>
</template>

<script>
  import tip from '../tool/DetelTips'
  import MyAdd from '../../components/caiwu/wodejiaokuan/wodejiaokuan'
  export default {
    name: "WoDeJiaokuanTable",
    components:{tip,MyAdd},
    data(){
      return{
        dataSet:{
          list:[]
        },
        currentPge:1,
        total:0,
        tip:{
          dialogVisible:false,
          primary:this.handlerPrimary,
          title:'删除提示',
          footer:['取消','确认删除'],
          bodyTitle:null,
        },
        row:{},                         //当前列信息
        diaLog:{
          dialogVisible:false,
          title:'编辑我的交款信息',
          actiontype:'edit'
        },
        sum:0,        //合计
        loading:true
      }
    },
    methods:{
      handlelook( index, row ){
        console.log( index , row)
      },
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
      //表头样式
      headerClassName({row, rowIndex}) {
        return 'orderTableHeaderStyles'
      },
      //初始化数据
      handlerInit(data,FromData,total,sum){
        this.dataSet.list = data
        this.loading = false
        this.currentPge = FromData.page;
        this.total = total
        this.sum = sum
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
      //编辑
      handleEdit(index,row){
        this.diaLog.dialogVisible = true;
        this.$Axios({
          method:'GET',
          url:'/xlapi/CameraManage/AmountManage/AmountOrder/getamountlog',
          data:{
            id:row.id
          },
          success(res){
            this.handlerdiaLogs(res.data)
          },
          error(err){
            console.log(err)
          }
        })
      },
      //编辑框渲染
      handlerdiaLogs(data){
        console.log(this.$refs.diaLogs)
        this.$refs.diaLogs.FOROM_DATA.NO = data.NO;
        this.$refs.diaLogs.optiona.options = [{
          label:data.orderremark,
          value:data.Order_ID
        }]
        this.$refs.diaLogs.optiona.label = data.orderremark
        this.$refs.diaLogs.optiona.value = data.Order_ID
        this.$refs.diaLogs.FOROM_DATA.id = data.id;
        this.$refs.diaLogs.FOROM_DATA.type = data.Type;
        this.$refs.diaLogs.FOROM_DATA.user = data.ToAddress;
        this.$refs.diaLogs.FOROM_DATA.amouent = data.amount;
        this.$refs.diaLogs.FOROM_DATA.beizhu = data.Remark;
        this.$refs.diaLogs.FOROM_DATA.orderremark = data.orderremark
      },
      //删除
      handleDeletes(index,row){
        this.row = row
        this.tip = {
            dialogVisible:true,
            primary:this.handlerPrimary,
            title:'删除',
            footer:['取消','确认删除'],
            bodyTitle:'请确认是否删除当前交款信息?'
        }

      },
      //确认删除我的交款
      handlerPrimary(){
        this.$Axios({
          method:'GET',
          url:'/xlapi/CameraManage/AmountManage/AmountOrder/deletelog',
          data:{
            striid:this.row.id
          },
          success(res){
            if(res.data.state){
              this.$tips(res.data.msg)
              //调用父级方法查询表格数据
              this.$ThisParent({
                variable:'PAGE_INDEX',
                callblack(_that){
                  _that.handlderInitAjax()
                }
              })
            }else{
              this.$warning(res.data.msg)
            }
            this.tip.dialogVisible = false
          },
          error(err){
            console.log(err)
          }
        })
      },
      //提交
      handleUptede(index,row){
        this.row = row
        if(row.state != 0){
          this.$warning('当前交款状态异常!')
          return
        }
        this.tip = {
          dialogVisible:true,
          primary:this.handlerUptedePrimary,
          title:'提交',
          footer:['取消','确认删除'],
          bodyTitle:'请确认提交当前交款?'
        }
      },
      //确认提交
      handlerUptedePrimary(){
        this.$Axios({
          method:'GET',
          url:'/xlapi/CameraManage/AmountManage/AmountOrder/updateamountlog',
          data:{
            id:this.row.id
          },
          success(res){
            console.log(res)
          },
          error(err){
            console.log(err)
          }
        })
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
    },
    created(){
      console.log(this)
    }
  }
</script>

<style scoped>
  @import "../../../static/css/orderTableStyle.css";
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
    transition: all .5s !important;
    transform: rotateZ(90deg) !important;
  }
  /deep/ .el-table__expand-icon--expanded{
    transition: all .5s !important;
    transform: rotate(180deg) !important;
  }
  .tav-column /deep/ .has-gutter th{
    text-align: center !important;
  }
  /deep/ td{
    text-align: center !important;
    font-size: 14px !important;
    color: #4c4c4c !important;
  }
  /deep/ .el-table__expanded-cell{
    padding: 0 !important;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active{
    background:  #5996F8 !important;
    color: #fff !important;
  }
  /deep/ .el-pagination.is-background .el-pager li{
    color: #999999 !important;
  }
  /deep/.el-pagination.is-background .btn-next,
  /deep/.el-pagination.is-background .btn-prev{
    background: #EAEAEA !important;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover{
    color: #BB9860 !important;
  }
  .tav-column /deep/ tbody .el-table__expand-column{
    border-right: 1px solid #EBEEF5 !important;
  }
  .tav-column /deep/ .el-table__expand-icon--expanded{
    color: #5996F8 !important;
  }
  /deep/ .el-button--default {
    border: none !important;
  }
</style>
