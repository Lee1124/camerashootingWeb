<template>
  <div>
    <div  style="height: 66px;box-sizing: border-box;padding: 26px;">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><span style="color: #B2B2B2">财务</span></el-breadcrumb-item>
        <el-breadcrumb-item><span @click="handlerbreadcrumb()" style="cursor: pointer;color: #B2B2B2">我的报账申请</span></el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: #4c4c4c">添加报账</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 100%;box-sizing: border-box;padding: 0 20px">
      <div style="width: 100%;background: #fff;height: 235px;box-sizing: border-box;padding:40px;">
        <p style="text-align: left">
          <span  style="display: inline-block;">标题:</span>
          <span style="display: inline-block;width: 300px">
              <el-input v-model="input1" placeholder="请输入标题"></el-input>
            </span>
        </p>
        <p style="text-align: left;margin-top: 20px">
          <span>金额:</span>
          <span style="display: inline-block;width: 300px">
              <el-input readonly v-model="input2" placeholder="0"></el-input>
            </span>
        </p>
        <div style="width:96px;
height:34px;
background:rgba(89,150,248,1);
border-radius:5px;color: #fff;font-size: 14px;text-align: center;line-height: 34px;position: relative;
    left: 110px;
    top: 20px;cursor: pointer" v-if="LookNodeHui" @click="handlerTotal()">
          保存
        </div>
      </div>
    </div>
    <div style="width: 100%;box-sizing: border-box;padding: 0 20px;margin-top: 25px">
       <div style="background: #fff;width: 100%;height: 510px;box-sizing: border-box;padding: 40px 45px;">
         <p style="font-size: 14px;color: #4c4c4c;text-align: left" class="clearfloat">
           <span style="text-align: left;font-weight: bold;font-size: 14px">报账明细</span>
           <span style="width:84px;
height:34px;
display: inline-block;
border:1px solid rgba(89,150,248,1);
border-radius:5px;text-align: center;line-height: 34px;font-size: 14px;color: #5996F8;cursor: pointer" v-if="LookNodeHui"  @click="handlerAddlerData()">添加</span>
         </p>
         <el-table
           :data="tableData"
           border
           style="width: 100%;margin-top: 10px"
           class="tav-column"
           height="400"
           :header-row-class-name="headerClassName"
         >
           <el-table-column
             label="序号"
             type="index"
             width="80">
           </el-table-column>
           <el-table-column
             label="标题"
             prop="name">
           </el-table-column>
           <el-table-column
             label="订单"
             width="250"
             prop="orderremark">
           </el-table-column>
           <el-table-column
             label="支付对象"
              prop="palyename">
           </el-table-column>
           <el-table-column
             label="金额"
             prop="amount">
           </el-table-column>
           <el-table-column
             label="类型"
             prop="typename">
           </el-table-column>
           <el-table-column
             label="附件图片" width="150">
             <template slot-scope="props">
               <img style="max-width: 120px;max-height: 120px"  :datas="cosIp+props.row.filelist[0].fpaht" @click="handlerYuLanImg(props.row.filelist,props.$index)" v-if="props.row.filelist.length > 0" :src="cosIp+props.row.filelist[0].fpaht" alt="">
             </template>
           </el-table-column>
           <el-table-column
             label="说明"
             prop="remark">
           </el-table-column>
           <el-table-column
             label="添加人"
             prop="addusername">
           </el-table-column>
           <el-table-column
             label="操作" v-if="LookNodeHui" >
             <template slot-scope="props">
               <span style="text-decoration: underline;color: #FF9600;cursor: pointer" @click="handleDeletes(props.$index, props.row)">删除</span>
               <span style="text-decoration: underline;color: #1BBF00;cursor: pointer"  @click="handleEdit(props.$index, props.row)">编辑</span>
             </template>
           </el-table-column>
         </el-table>
       </div>
    </div>

    <!--DiaLog-->
    <DiaLog :DiaLog="DiaLog" v-if="DiaLog.centerDialogVisible" ref="DiaLogs"></DiaLog>
    <Addplay :Addplay="Addplay" v-if="Addplay.Visible"></Addplay>
    <tip width="500px" :tip="tip" v-if="tip.dialogVisible">
      <p>确定删除当前明细?</p>
    </tip>

    <img_viewer :option="option" ref="img_viewer"></img_viewer>

  </div>
</template>

<script>
  import DiaLog from '../wodebaozhangshenqing/AddReimbursement';
  import Addplay from '../wodebaozhangshenqing/AddPayOject';
  import tip from '../../tool/DetelTips';
  import img_viewer from '../../img-viewer/Img-viewer'
    export default {
        name: "addbaozhang",
        components:{
          DiaLog,Addplay,tip,img_viewer
        },
        data(){
          return{
            cosIp:cosIp,
            input1:'',
            input2:0,
            tableData:[],
            DiaLog:{
              centerDialogVisible:false,
              IsEeditState:true,
              name:'添加报账'
            },
            Addplay:{
              Visible:false,
              title:'添加支付对象'
            },
            addbaozhangID:'',
            tip:{
              dialogVisible:false,
              primary:this.handlerPrimary,
              title:'删除提示',
              footer:['取消','确认删除']
            },
            row:{},
            Istrate:false,
            TYPY_LIST:[],
            LookNodeHui:false,            //当前页面是否可操作性
            list: [],                     //预览图片图片列表
            option:{} //配置参数
          }
        },
      watch:{
        input1:function ( a, b ) {
          this.input1 = a.replace(/^\s*/g,'')
        }
      },
        methods:{
          //图片预览
          handlerYuLanImg(data,index){
            this.list = data.map(res => {
              return {
                src:this.cosIp + res.fpaht
              }
            });
            this.option.list = this.list
            this.$nextTick(()=>{
              this.$refs.img_viewer.handlerImgshow()
            })
          },
          // tip 确定删除腾讯云图片
          handlerPrimary(){
            this.tip.dialogVisible = false;
            let row = this.row
            let filelist = row.filelist.map(res => {
              return {
                id:res.fid,
                key:res.fpaht,
              }
            })
            this.$DetelImg({
              file:filelist,
              callback(res){
                if(res){
                  this.handlderDetleImg(res.id)
                }
              },
              callbackall(){
                this.handlerDetelByOder(row.id)
              }
            })
            if(filelist.length == 0){
              this.handlerDetelByOder(row.id)
            }
          },
          // 页面保存主信息
          handlerTotal(){
            if(this.input1 == ''){
              this.$warning(' 请输入标题! ')
              return
            }
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/addmaininfo',
              data:{
                applyid:this.DiaLog.applayId,
                title :this.input1,
                acttype:'add'
              },
              success(res){
                if(res.data.state){
                  this.$tips('保存成功!')

                  this.Istrate = true
                  this.$ThisParent({
                    variable:'PAGE_INDEX',
                    callblack(_that){
                      //调用子页面批量通过 (三层)
                      _that.handlderInitAjax()
                    }
                  })
                }else{
                  this.$warning('保存失败!')
                }
              },
              error(err){
                console.log(err)
              }
            });
          },
          // 获取主表id
          handlerInfoById(){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/addminifno',
              success(res){
                if(res.data.state){
                  this.DiaLog.applayId = res.data.ID
                }else{
                  this.$message({
                    message: '获取主表id失败!',
                    type: 'warning'
                  });
                }
              },
              error(err){
                console.log(err)
              }
            });
          },
          //编辑
          handleEdit(index,row){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/getprojectmodel',
              data:{
                strid:row.id,
              },
              success(res){
                this.DiaLog.centerDialogVisible = true;

                this.DiaLog.name = '编辑报账详情'
                this.handleEdits(res.data)

                this.$ThisParent({
                  variable:'SHOW_PAGE',
                  callblack(_that){
                    _that.ISaddBaoZhang.isAdd = false
                  }
                })
              },
              error(err){
                console.log(err)
              }
            });
          },
          //编辑  -2
          handleEdits(data){
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
          //删除
          handleDeletes(index,row){
            this.tip.dialogVisible = true
            this.tip.primary = this.handlerPrimary;
            this.tip.title = '删除提示'
            this.row = row
          },
          //删除当前明细
          handlerDetelByOder(id){
            this.$Axios({
              method:'GET',
              url:'/xlapi/CameraManage/AmountManage/Amount/deleteapplyproject',
              data:{
                strid:id
              },
              success(res){
                this.handlerInit(this.DiaLog.applayId)
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
                console.log(res)
              },
              error(err){
                console.log(err)
              }
            });
          },
          // 获取表格数据
          handlerInit(id){
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/getprojectlist',
              data:{
                applyid:id,
                stae:''
              },
              success(res){
                this.tableData = res.data
                this.input2 = 0
                this.tableData.filter((res,i) => {
                  this.input2 = res.amount + this.input2
                })
              },
              error(err){
                console.log(err)
              }
            });
          },
          //表头样式
          headerClassName({row, rowIndex}) {
            return 'orderTableHeaderStyle'
          },
          //添加报账信息
          handlerAddlerData(){
            if(!this.Istrate && this.input1 == ''){
              this.$warning('请先保存标题信息')
              return
            }
            this.DiaLog.centerDialogVisible = true
            this.DiaLog.name = '添加报账详情'
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                _that.ISaddBaoZhang.isAdd = true
              }
            })
          },
          //返回我的报账申请
          handlerbreadcrumb(){
            // if(!this.Istrate){
            //   this.$warning('请保存标题信息!')
            //   return
            // }
            this.$ThisParent({
              variable:'SHOW_PAGE',
              callblack(_that){
                if(_that.SHOW_PAGE == 1){
                  _that.SHOW_PAGE = 0
                }
              }
            })
          },
          //恢复操作
          handlerLookNodeHuiFU(){
            this.LookNodeHui = true
          },
          //禁止操作
          handlerLookNodeZhiDu(){
            this.LookNodeHui = false
          }
        },
        created(){
          this.$ThisParent({
            variable:'ISaddBaoZhang',
            callblack(_that){
              if(_that.ISaddBaoZhang.is){
                //编辑
                this.DiaLog.applayId = _that.ISaddBaoZhang.ROWEdit.ID
                this.handlerInit(this.DiaLog.applayId)
                this.input1 = _that.ISaddBaoZhang.ROWEdit.Title
                if(_that.ISaddBaoZhang.IsEedIt){
                  this.handlerLookNodeHuiFU()
                }else{
                  this.handlerLookNodeZhiDu()
                }
              }else{
                //新增
                this.handlerInfoById()
                if(_that.ISaddBaoZhang.IsEedIt){
                  this.handlerLookNodeHuiFU()
                }else{
                  this.handlerLookNodeZhiDu()
                }
              }
            }
          })

        }

    }
</script>

<style scoped>
  @import "../../../../static/css/orderTableStyle.css";
  /deep/ .el-table--border td{
    border-right: 1px solid #DDDDDD;
  }
  /deep/ .el-dialog__title{
    color: #9DB3D7;
    font-size: 17px;
  }
  .tav-column /deep/ .has-gutter th{
    text-align: center;
  }
  /deep/ td{
    text-align: center;
    font-size: 14px;
    color: #4c4c4c;
  }
  /deep/ .el-table__expanded-cell{
    padding: 0;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active{
    background: #BB9860;
    color: #fff !important;
  }
  /deep/ .el-pagination.is-background .el-pager li{
    color: #999999;
  }
  /deep/.el-pagination.is-background .btn-next,
  /deep/.el-pagination.is-background .btn-prev{
    background: #EAEAEA;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover{
    color: #BB9860;
  }
  .tav-column /deep/ tbody .el-table__expand-column{
    border-right: 1px solid #EBEEF5;
  }
  .tav-column /deep/ .el-table__expand-icon--expanded{
    color: #5996F8;
  }
</style>
