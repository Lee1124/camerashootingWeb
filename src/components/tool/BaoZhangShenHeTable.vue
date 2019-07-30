<!--报账申请 报账审核 报账支付-->
<template>
  <div style="position: relative">
    <noData msg="暂无数据" v-if="dataSet.list.length == 0"></noData>
    <el-table
      :data="dataSet.list"
      style="width: 100%"
      class="tav-column"
      height="450px"
      :header-row-class-name="headerClassName"
      @expand-change="handlerExpand"
      @selection-change="handleSelectionChange"
      :row-class-name="handlertableRowClassName"
      show-summary
      :summary-method="handlergetSummaries"
      v-loading="loading"
    >
      <el-table-column type="expand" prop="index" width="102" style="border: 1px solid" >
        <template slot-scope="props">
          <el-table
            :data="props.row.childrenData"
            border
            style="width: 100%"
            :row-class-name="handlertableRowClassNames"
            :header-row-class-name="headerClassName"
            lazy>
            <el-table-column
              label="操作">
              <template slot-scope="props">
                <span style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handleEnLook(props.row)">详情</span>
              </template>
            </el-table-column>
            <el-table-column
              label="标题"
              prop="name">
            </el-table-column>
            <el-table-column
              label="订单"
              prop="orderremark"
             width="300">
            </el-table-column>
            <el-table-column
              label="支付对象"
              prop="palyename">
            </el-table-column>
            <el-table-column
              label="金额(元)"
              prop="amount">
            </el-table-column>
            <el-table-column
              label="类型"
              prop="typename">
            </el-table-column>
            <el-table-column
              label="是否摊销"
              prop="otherstae">
            </el-table-column>
            <el-table-column
              label="附件">
              <template slot-scope="props">
                <span style="text-decoration: underline;color: #5996F8;cursor: pointer" v-if="props.row.filelist.length > 0"  @click="handleEnFileLook(props.row)">点击查看</span>
                <span style="text-decoration: underline;color: #5996F8;cursor: pointer" v-else>暂无附件</span>
              </template>
            </el-table-column>
            <el-table-column
              label="说明"
              prop="remark">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        prop="id"
        width="80">
      </el-table-column>
      <el-table-column
        label="编号"
        prop="No">
      </el-table-column>
      <el-table-column
        label="标题">
        <template slot-scope="props">
          <tips :popover="{content:props.row.Title,msg:props.row.Title}"></tips>
        </template>
      </el-table-column>
      <el-table-column
        label="金额(元)"
        prop="amount">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="props">
        <span v-if="props.row.state == '待提交'" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '待测试审核'" style="color: #EF7A4B;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '待支付'" style="color: #5996F8;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '已支付'" style="color: #4c4c4c;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="props.row.state == '退回'" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-if="
          props.row.state != '待提交' && props.row.state != '待测试审核'
          &&
           props.row.state != '待支付' && props.row.state != '已支付'
           &&  props.row.state != '退回'
" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
        </template>
      </el-table-column>
      <el-table-column
        label="提交人"
        prop="RealName">
      </el-table-column>
      <el-table-column
        label="添加时间">
        <template  slot-scope="props">
          <span>{{ props.row.addtime.substring(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="props">
          <span style="text-decoration: underline;color: #B73CF0;cursor: pointer" @click="handleLookNode(props.$index, props.row)">查看</span>
          <span v-if="props.row.state != '退回' && props.row.state != '' && props.row.state != '待支付'" style="text-decoration: underline;color: #1BC000;cursor: pointer" @click="handleReturn(props.$index, props.row)">退回</span>
          <span v-if="userID == props.row.nowcheckid && props.row.state != '' && props.row.state != '待支付'" style="text-decoration: underline;color: #5996F8;cursor: pointer" @click="handleAdopt(props.$index, props.row)">通过</span>
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
        :current-page="currentPge"
      >
      </el-pagination>
    </div>
    <!--Dialog-->
    <tip width="500px" :tip="tip" v-if="tip.dialogVisible">
      <textarea v-if="Statr_Index == 1" name="" style="width: 100%;background: #F6F6F6;resize: none;border-radius: 5px;box-sizing: border-box;padding: 10px;" v-model="TuiText" placeholder="请输入退回原因" id="" cols="30" rows="10"></textarea>
      <p v-if="Statr_Index == 2">账户审核是否通过?</p>
      <p v-if="Statr_Index == 3">({{ TonRow.length }}条)账户审核是否通过?</p>
    </tip>
    <DiaLog ref="DiaLogs" v-if="DiaLog.centerDialogVisible" :DiaLog="DiaLog"></DiaLog>
    <!--图片预览-->
    <img_viewer :option="option" ref="img_viewer"></img_viewer>
  </div>
</template>

<script>
  import tip from '../tool/DetelTips';
  import DiaLog from '../../components/caiwu/wodebaozhangshenqing/AddReimbursement';
  import tips from '../tool/PopoverTip'
  import img_viewer from '../img-viewer/Img-viewer'
  export default {
    name: "BaoZhangShenHeTable",
    components:{tip,DiaLog,tips,img_viewer},
    data(){
      return{
        cosIp:cosIp,
        dataSet:{
          list:[]
        },
        childrenData:[],
        currentPge:1,
        total:0,
        //误操作提示框
        tip:{
          dialogVisible:false,
          primary:this.handlerPrimary,
          title:'退回提示',
          footer:['取消','退回'],
          bodyTitle:null,
        },
        row:{},                             //当前列信息
        TuiText:'',                           //退回原因
        Statr_Index:1,                              //退回 or 通过
        TonRow:[],                        //多选通过报账
        DiaLog:{
          centerDialogVisible:false
        },
        list:[],
        userID:getkevalue().userid,
        sum:0,
        loading:true,
        option:{} //配置参数
      }
    },
    methods:{
      //当前列详情
      handleEnLook(data){
        this.$Axios({
          method:'GET',
          url:'/xlapi/CameraManage/AmountManage/Amount/getprojectmodel',
          data:{
            strid:data.id,
          },
          success(res){
            this.DiaLog.centerDialogVisible = true;
            this.DiaLog.applayId = data.id;
            this.DiaLog.IsEeditState = false
            this.handleEditSell(res.data)
          },
          error(err){
            console.log(err)
          }
        });
      },
      //附件查看
      handleEnFileLook(data){
        this.list = data.filelist.map(res => {
          return {
            src:this.cosIp + res.fpaht
          }
        })
        this.option.list = this.list
        this.$refs.img_viewer.handlerImgshow()

      },
      //当前列详情 v2
      handleEditSell(data){
        this.$nextTick(()=>{
          let arr = data.filsit.map(res => {
            let url = this.cosIp + res.path
            return {
              path:url,
              id:res.id,
              Byid:1
            }
          })
          this.$refs.DiaLogs.imgRight = arr
          this.$refs.DiaLogs.optiona.options = [{
            value:data.OrderID,
            label:data.OrderRemark
          }]
          this.$refs.DiaLogs.FromData = {
            title:data.Name,
            Amount: data.Amoumt,
            type1:data.pid,
            type2:data.Type,
            actiontype:'edit',
            id:data.ID,
            orderid:data.OrderID,
            orderremark:data.OrderRemark,
            remark:data.Reamrk,
            applyid:data.ApplyID,
            orderid:data.OrderID,
            chackdate:data.checkdatae,
            date:data.checkdatae,
            dates:[data.amortizationStartDate,data.amortizationEndDate],
            begintime:data.amortizationStartDate,
            endtime:data.amortizationEndDate,
            costtype:data.costType,
            play:data.PlayID,
            Explain:data.Reamrk
          };
          if(data.costType == 1){
            this.$refs.DiaLogs.Reimbur[1].start = true
            this.$refs.DiaLogs.Reimbur[0].start = false
          }else if(data.costType == 2){
            this.$refs.DiaLogs.Reimbur[0].start = true
            this.$refs.DiaLogs.Reimbur[1].start = false
          }
          this.$refs.DiaLogs.$refs.childInputSearch_hotel.inputValue = data.playname
          this.$refs.DiaLogs.$refs.childInputSearch_hotel.isSelectedItemObj[{id:data.PlayID}]
          this.$refs.DiaLogs.handlerOptions()
          this.$refs.DiaLogs.FromData.type2 = data.Type
          this.$refs.DiaLogs.optiona.value = data.OrderID
        })
      },
      //确定批量审核通过已勾选
      handleSelectionChange( val ){
        this.TonRow = val
      },
      //批量审核通过
      handlderAddNoderSell(){
        if(  this.TonRow.length == 0 ){
          this.$warning('当前审核条数为0!')
          return
        }
        this.Statr_Index = 3
        this.tip = {
          dialogVisible:true,
          primary:this.handleAdoptsNoder,
          title:'提示',
          footer:['取消','确定'],
          bodyTitle:null,
        }
      },
      //批量确定通过
      handleAdoptsNoder(){
        let str = ''
        this.TonRow.forEach(res => {
          str = res.ID + ',' + str
        })
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/checkupdate',
          data:{
            ids:str,
          },
          success(res){
            this.$tips(res.data.msg)
            this.tip.dialogVisible = false
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                //更新数据请求
                _that.handlderInitAjax()
              }
            })
          },
          error(err){
            console.log(err)
          }
        });
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
      //查看
      handleLookNode( index,row ){
        this.$ThisParent({
          variable:'SHOW_PAGE',
          callblack(_that){
            _that.SHOW_PAGE = 1;
            _that.ISaddBaoZhang.is = true;
            _that.ISaddBaoZhang.ROWEdit = row;
          }
        })
      },
      //退回
      handleReturn( index,row ){
        this.Statr_Index = 1
        this.row = row
        this.tip = {
            dialogVisible:true,
            primary:this.handlerPrimary,
            title:'退回提示',
            footer:['取消','退回'],
            bodyTitle:null,
        }
      },
      //确认退回
      handlerPrimary(){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/backapply',
          data:{
            id:this.row.ID,
            remark:this.TuiText
          },
          success(res){
            this.$tips(res.data.msg)
            this.tip.dialogVisible = false
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                //更新数据请求
                _that.handlderInitAjax()
              }
            })
          },
          error(err){
            console.log(err)
          }
        });
      },
      //通过
      handleAdopt(index,row){
        this.Statr_Index = 2
        if(row.nowcheckid !=  getkevalue().userid){
          return
        }
        this.row = row
        this.tip = {
          dialogVisible:true,
          primary:this.handleAdopts,
          title:'提示',
          footer:['取消','确定'],
          bodyTitle:null,
        }
      },
      //确定通过
      handleAdopts(){
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/checkupdate',
          data:{
            ids:this.row.ID,
          },
          success(res){
            this.$tips(res.data.msg)
            this.tip.dialogVisible = false
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                //更新数据请求
                _that.handlderInitAjax()
              }
            })
          },
          error(err){
            console.log(err)
          }
        });
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
      //获取当前列报账详情
      handlerExpand(row,a){
        if(a.length == 0){
          return
        }
        this.$Axios({
          method:'POST',
          url:'/xlapi/CameraManage/AmountManage/Amount/getprojectlist',
          data:{
            applyid:row.ID,
            stae:row.state
          },
          success(res){
            this.dataSet.list[row.index].childrenData = res.data

          },
          error(err){
            console.log(err)
          }
        });
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
      //  内层
      handlertableRowClassNames({row, rowIndex}){
        //奇数行
        if(rowIndex % 2 == 1){
          return 'warning-rows'
        }else{
          return 'success-rows'
        }
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
          if(index === 5){
            sums[index] = this.sum;
            return;
          }
        })
        return sums
      },
    },
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
  /deep/ .el-table__footer td:nth-child(6){
    color: red !important;
  }
  /deep/  .warning-rows {
    background: #F7F7F7 !important;
  }

  /deep/ .success-rows {
    background: #F2F2F2 !important;
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
