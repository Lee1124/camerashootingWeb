<!--报账申请 报账审核 报账支付-->
<template>
  <div style="position: relative">
    <noData msg="暂无数据" v-if="dataSet.list.length == 0"></noData>
    <el-table
      :data="dataSet.list"
      style="width: 100%"
      class="tav-column"
      height="430px"
      :header-row-class-name="headerClassName"
      :row-class-name="handlertableRowClassName"
      @expand-change="handlerExpand"
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
            :header-row-class-name="headerClassName"
            :row-class-name="handlertableRowClassNames"
            class="tav-column-item"
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
            width="250">
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
              prop="otherstae"
              width="200">
            </el-table-column>
            <el-table-column
              label="附件">
              <template slot-scope="props">
                <span style="color: #00C70E;cursor: pointer" v-if="props.row.filelist.length > 0"  @click="handleEnFileLook(props.row)">点击查看</span>
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
        label="标题"
        prop="Title">
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
          <span v-else-if="props.row.state == '待审核'" style="color: #EF7A4B;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-else-if="props.row.state == '待支付'" style="color: #5996F8;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-else-if="props.row.state == '已支付'" style="color: #4c4c4c;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-else-if="props.row.state == '退回'" style="color: #FF0000;cursor: pointer" >
          {{ props.row.state }}
        </span>
          <span v-else style="color: #FF0000;cursor: pointer" >
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
        <template slot-scope="props">
          <span>{{ props.row.addtime.substring(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="props">
          <span v-if="props.row.state == '待提交' || props.row.state == '退回'" style="text-decoration: underline;color: #B73CF0;cursor: pointer" @click="handleDeletes(props.$index, props.row)">删除</span>
          <span style="text-decoration: underline;color: #1BC000;cursor: pointer" v-if="props.row.state == '待提交' || props.row.state == '退回' "   @click="handleEdit(props.$index, props.row)">编辑</span>
          <span v-if="props.row.state == '退回' || props.row.state == '待提交'" style="text-decoration: underline;color: #5996F8;cursor: pointer"  @click="handleUptede(props.$index, props.row)">提交</span>
          <span v-else style="color: #4c4c4c;cursor: pointer" >当前订单状态无法操作</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div  v-if="total > 8" style="position: absolute;bottom: 0px;left: 0px;right: 0;" class="clearfloat">
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
      <p>{{ tip.bodyTitle }}?</p>
    </tip>
    <DiaLog ref="DiaLogs" v-if="DiaLog.centerDialogVisible" :DiaLog="DiaLog"></DiaLog>

    <!--图片预览-->
    <img_viewer :option="option" ref="img_viewer"></img_viewer>
  </div>
</template>

<script>
  import tip from '../tool/DetelTips'
  import DiaLog from '../../components/caiwu/wodebaozhangshenqing/AddReimbursement'
  import img_viewer from '../img-viewer/Img-viewer'
    export default {
        name: "ToolTableform",
        components:{tip,DiaLog,img_viewer},
        data(){
          return{
            cosIp:cosIp,
            dataSet:{
              list:[]
            },
            childrenData:[],
            currentPge:1,
            total:0,
            tip:{
              dialogVisible:false,
              primary:this.handlerPrimary,
              title:'删除提示',
              footer:['取消','确认删除'],
              bodyTitle:null,
            },
            row:null,         //当前列信息,
            INDEX_TA:null,      //当前列下标
            ROWEdit:{},
            DiaLog:{
              centerDialogVisible:false,
              name:'查看报账详情'
            },
            list: [],
            ramount:0,              //合计
            loading:true,
            option:{} //配置参数
          }
        },
        methods:{
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
          //查看详情
          handleEnLook(data){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/getprojectmodel',
              data:{
                strid:data.id,
              },
              success(res){
                this.DiaLog.centerDialogVisible = true;
                this.DiaLog.applayId = data.id
                this.DiaLog.IsEeditState = false
                this.handleEditSell(res.data)
              },
              error(err){
                console.log(err)
              }
            });
          },
          //编辑  -2
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
          //获取当前报账详情
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
          //表头样式
          headerClassName({row, rowIndex}) {
            return 'orderTableHeaderStyles'
          },
          //初始化数据
          handlerInit(data,FromData,total,ramount){
            this.dataSet.list = data
            this.loading = false
            this.currentPge = FromData.page;
            this.total = total;
            this.ramount = ramount
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
                sums[index] = this.ramount;
                return;
              }
            })
            return sums
          },
          //编辑
          handleEdit(index,row){
            //转至编辑
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                _that.SHOW_PAGE = 1;
                _that.ISaddBaoZhang.is = true
                _that.ISaddBaoZhang.ROWEdit = row
                _that.ISaddBaoZhang.IsEedIt = true
              }
            })
          },
          //删除
          handleDeletes(index,row){
            this.INDEX_TA = index
            if(row.state == '待提交' || row.state == '退回'){
              this.row = row
              this.tip = {
                primary : this.handlerPrimary,
                dialogVisible : true,
                footer : ['取消','确认删除'],
                title:'删除提示',
                bodyTitle:'是否删除该报账申请?'
              }
            }else{
              this.$warning('订单状态异常!无法删除!')
              return
            }
          },
          //确认删除
          handlerPrimary(){
            this.handlerByIdImg(this.row.ID)
          },
          // 获取主表中所有的图片id
          handlerByIdImg(strid){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/getfilelist',
              data:{strid},
              success(res){
                if(res.data.length == 0){
                  this.tip.dialogVisible = false
                  this.handlerByIdTable(this.row.ID)
                  return
                }
                let filelist = res.data.map(res => {
                  return {
                    id:res.id,
                    key:res.path,
                  }
                });
                this.$DetelImg({
                  file:filelist,
                  callback(res){
                    if(res){
                      this.handlderDetleImg(res.id)
                    }
                  }
                })
                this.handlerByIdTable(this.row.ID)
              },
              error(err){
                console.log(err)
              }
            });
          },
          //删除数据库图片
          handlderDetleImg(id){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/dellprojectfile',
              data:{id},
              success(res){
                this.tip.dialogVisible = false
              },
              error(err){
                console.log(err)
              }
            });
          },
          //删除主表信息
          handlerByIdTable(strid){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/deletemainapply',
              data:{strid},
              success(res){
                this.dataSet.list.splice(this.INDEX_TA,1);
              },
              error(err){
                console.log(err)
              }
            });
          },
          //提交
          handleUptede(index,row){
            this.row = row;
            this.INDEX_TA = index
            this.tip = {
              primary : this.handlerUptede,
              dialogVisible : true,
              footer : ['取消','提交'],
              title:'提交申请',
              bodyTitle:'是否提交当前报账申请?'
            }
          },
          //确认提交
          handlerUptede(){
            let id = this.row.ID
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/updatestate',
              data:{id:id},
              success(res){
                if(res.data.state){
                  this.$tips(res.data.msg)
                }else{
                  this.$warning(res.data.msg)
                }
                this.tip.dialogVisible = false
                this.$ThisParent({
                  variable:'PAGE_INDEX',
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
          }
        },
    }
</script>

<style scoped>
  @import "../../../static/css/orderTableStyle.css";
  .tav-column-item{
    border-top: none !important;
  }
  /deep/ .el-table td{
    border: none !important;
  }
  /deep/ .expanded .el-table__expand-column{
   background: #DDDDDD;
  }
  /deep/ .el-table--border td{
    border-right: 1px solid #DDDDDD;
  }
  /deep/ .el-table__footer td:nth-child(1){
    color: red !important;
    border: none !important;
  }
  /deep/ .el-table__footer td:nth-child(5){
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
    transition: all .5s;
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
    background: #5996F8 !important;
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
  .tav-column /deep/ .el-table__body-wrapper .el-table__expand-column{
    border-right: 1px solid #DDDDDD !important;
  }
  .tav-column /deep/ .el-table__expand-icon--expanded{
    color: #5996F8 !important;
  }
  /deep/ .el-button--default {
    border: none !important;
  }
</style>
