<template>
    <div style="position: relative">
      <noData msg="暂无数据" v-if="tableData.length == 0"></noData>
      <el-table
        :data="tableData"
        show-summary
        :header-row-class-name="headerClassName"
        class="tav-column"
        height="600"
        style="width: 100%"
        v-loading="loading"
        :row-class-name="handlertableRowClassName"
        border
      id="orderTable">
        <el-table-column
          label="序号"
          type="index"
          prop="id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="no"
          label="编号" width="140">
          <template slot-scope="props">
            <tips :popover="{content:props.row.no,msg:props.row.no}"></tips>
          </template>
        </el-table-column>
        <el-table-column
          prop="addtime"
          label="时间" width="130">
          <template slot-scope="props">
            <span>{{ props.row.addtime.substring(0,10) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标题">
          <template slot-scope="props">
            <tips :popover="{content:props.row.strtitle,msg:props.row.strtitle}"></tips>
          </template>
        </el-table-column>
        <el-table-column
          prop="addressnam"
          label="账号">
          <template slot-scope="props">
            <tips :popover="{content:props.row.addressnam,msg:props.row.addressnam}"></tips>
          </template>
        </el-table-column>
        <el-table-column
          prop="strin"
          label="收入" width="80">
        </el-table-column>
        <el-table-column
          prop="otheramout"
          label="手续费" width="80">
        </el-table-column>
        <el-table-column
          prop="strout"
          label="支出"  width="80">
        </el-table-column>
        <el-table-column
          prop="nowamount"
          label="结余" width="80">
        </el-table-column>
        <el-table-column
          label="转存"
          width="80">
          <template slot-scope="props">
            <span>{{ props.row.istemp? '是':'否' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="说明">
          <template slot-scope="props">
            <tips :popover="{content:props.row.strremakr,msg:props.row.strremakr}"></tips>
          </template>
        </el-table-column>
        <el-table-column
          label="图片">
          <template slot-scope="props">
            <span  style="text-decoration: underline;color: #00C70E;cursor: pointer" @click="handlerAddUpImg(props.$index, props.row)"  v-if="props.row.imglist.length  ==  0">上传图片</span>
            <span v-else style="color: #00C70E;cursor: pointer" @click="handleEnFileLook(props.row.imglist)">查看附件</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" width="80">
          <template slot-scope="props">
            <span style="text-decoration: underline;color: #5996F8;cursor: pointer" @click="handleDetails(props.$index, props.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <!--图片预览-->
      <img_viewer :option="option" ref="img_viewer"></img_viewer>
    </div>
</template>

<script>
  import tips from '../tool/PopoverTip'
  import img_viewer from '../img-viewer/Img-viewer'
    export default {
        name: "ChuaNaZhangMuTable",
        components:{tips,img_viewer},
        data(){
          return {
            cosIp:cosIp,
            tableData:[],                   //所有列表数据
            row:{} ,               /// 当前列数据
            loading:true,
            list:[],              //图片预览
            option:{} //配置参数
          }
        },
        methods:{
          //查看附件
          handleEnFileLook(data){
            this.list = data.map(res => {
              return {
                src:this.cosIp + res.path
              }
            });
            this.$nextTick(() => {
              this.option.list = this.list;
              this.$refs.img_viewer.handlerImgshow()
            })
          },
          //数据初始化
          handlerInit(data){
            this.tableData = data
            this.loading = false
          },
          //表头样式
          headerClassName({row, rowIndex}) {
            return 'orderTableHeaderStyles'
          },
          //详情
          handleDetails( index,row ){
            let time = row.addtime.substring(0,10)
            this.$ThisParent({
              variable:'PAGE_INDEX',
              callblack(_that){
                _that.handlerCashierDetile(time,1)
              }
            })
          },
          //上传图片
          handlerAddUpImg(index,row){
            this.row = row
            this.$ThisParent({
              variable:'dialogImg',
              callblack(_that){
                _that.dialogImg.dialogVisible = true
              }
            })
          },
          // 确定上传
          handlerImgUpdete(data,obj){
            this.$UpImgFile({
              path: getkevalue().branchid+'/'+'amouent' + '/'+ this.row.id,
              file:data,
              callback(res){
                this.handlderuloadImg(res)
              },
              callbackall(){
                //清除图片数据
                obj.callback()
                this.$ThisParent({
                  variable:'PAGE_INDEX',
                  callblack(_that){
                    _that.handlderInitAjax()
                  }
                })
              }
            })
          },
          handlderuloadImg(data){
            this.$Axios({
              method:'POST',
              url:'/xlapi/CameraManage/AmountManage/Amount/addprojectfile',
              data:{
                applyid:this.row.id,
                filepath:data.key
              },
              success(res){
                // //调用父级方法查询表格数据
                // this.$ThisParent({
                //   variable:'Addplay',
                //   callblack(_that){
                //     _that.handlerInit(this.DiaLog.applayId)
                //   }
                // })
                if(res.data.state){
                  this.$tips(res.data.msg)
                  this.$ThisParent({
                    variable:'dialogImg',
                    callblack(_that){
                      _that.dialogImg.dialogVisible = false;
                      _that.FILE_ARRY = []
                    }
                  })
                }
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
  /deep/ .el-table__footer td:nth-child(6){
    color: red !important;
  }
  /deep/ .el-table__footer td:nth-child(8){
    color: red !important;
  }
  /deep/ .el-table__footer td:nth-child(9){
    color: red !important;
  }
  /deep/ .el-table__footer td:nth-child(7) div{
    visibility: hidden;
  }

  /deep/ .success-row{
    background: #F2F2F2 !important;
  }

  /deep/ .warning-row{
    background: #FFFFFF !important;
  }
  .tav-column /deep/ .has-gutter th{
    text-align: center !important;
  }
  /deep/ td{
    text-align: center !important;
    font-size: 14px !important;
    color: #4c4c4c !important;
  }
  /deep/ .el-table--border td{
    border-right: 1px solid #DDDDDD;
  }
  /deep/ .el-table td{
    border-bottom: 1px solid #DDDDDD;
  }
</style>
